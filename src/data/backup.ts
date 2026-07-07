import type { AppData, DailyEntry, ISODate } from '@/types/models';
import { BACKUP_FORMAT, SCHEMA_VERSION } from '@/constants/app';
import { backupFileSchema, encryptedBackupFileSchema, validateAppData, type ValidationIssue } from './schemas';
import { migrateAppData, MigrationError } from './migrations';

/** Export / import JSON (§12.2, §12.3), fusion avec conflits (§12.6), export chiffré (§15.2). */

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  schemaVersion: number;
  exportedAt: string;
  data: AppData;
}

export function createBackupFile(data: AppData): BackupFile {
  return {
    format: BACKUP_FORMAT,
    schemaVersion: data.schemaVersion,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export function backupFileName(now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `lunative-backup-${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}-${p(now.getHours())}${p(now.getMinutes())}.json`;
}

export type ImportError =
  | { kind: 'invalid_json' }
  | { kind: 'invalid_format' }
  | { kind: 'migration_failed'; fromVersion: number }
  | { kind: 'validation_failed'; issues: ValidationIssue[] }
  | { kind: 'wrong_passphrase' }
  | { kind: 'encrypted_needs_passphrase' };

export interface ImportPreview {
  data: AppData;
  entryCount: number;
  dateRange: { from: ISODate; to: ISODate } | null;
  migratedFrom: number | null;
}

export type ImportResult = { ok: true; preview: ImportPreview } | { ok: false; error: ImportError };

/** Parse + migre + valide un fichier de sauvegarde (§12.3). Ne modifie rien : produit une prévisualisation. */
export async function parseBackup(text: string, passphrase?: string): Promise<ImportResult> {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, error: { kind: 'invalid_json' } };
  }

  const encrypted = encryptedBackupFileSchema.safeParse(json);
  if (encrypted.success) {
    if (!passphrase) return { ok: false, error: { kind: 'encrypted_needs_passphrase' } };
    try {
      const plaintext = await decryptBackup(encrypted.data, passphrase);
      return parseBackup(plaintext);
    } catch {
      return { ok: false, error: { kind: 'wrong_passphrase' } };
    }
  }

  const parsed = backupFileSchema.safeParse(json);
  if (!parsed.success) return { ok: false, error: { kind: 'invalid_format' } };

  let migrated: AppData;
  let migratedFrom: number | null = null;
  try {
    const result = migrateAppData(parsed.data.data);
    migrated = result.data;
    if (result.applied.length > 0) migratedFrom = result.applied[0] as number;
  } catch (e) {
    return {
      ok: false,
      error: { kind: 'migration_failed', fromVersion: e instanceof MigrationError ? e.fromVersion : -1 },
    };
  }

  const validation = validateAppData(migrated);
  if (!validation.ok) return { ok: false, error: { kind: 'validation_failed', issues: validation.issues } };

  const dates = Object.keys(validation.data.dailyEntries).sort();
  return {
    ok: true,
    preview: {
      data: validation.data as AppData,
      entryCount: dates.length,
      dateRange: dates.length > 0 ? { from: dates[0] as ISODate, to: dates.at(-1) as ISODate } : null,
      migratedFrom,
    },
  };
}

/* ---------- Fusion (§12.6) ---------- */

export interface MergeConflict {
  date: ISODate;
  existing: DailyEntry;
  imported: DailyEntry;
  /** Choix par défaut : le plus récent (updatedAt). */
  defaultChoice: 'existing' | 'imported';
}

export interface MergePlan {
  conflicts: MergeConflict[];
  addedEntries: number;
  addedSymptoms: number;
  addedEvents: number;
}

/** Analyse une fusion : collisions par date, ajouts dédupliqués par id. */
export function planMerge(current: AppData, imported: AppData): MergePlan {
  const conflicts: MergeConflict[] = [];
  let addedEntries = 0;
  for (const [date, entry] of Object.entries(imported.dailyEntries)) {
    const existing = current.dailyEntries[date];
    if (existing === undefined) {
      addedEntries += 1;
    } else if (JSON.stringify(existing) !== JSON.stringify(entry)) {
      conflicts.push({
        date,
        existing,
        imported: entry,
        defaultChoice: entry.updatedAt > existing.updatedAt ? 'imported' : 'existing',
      });
    }
  }
  const symptomIds = new Set(current.customSymptoms.map((s) => s.id));
  const eventIds = new Set(current.events.map((e) => e.id));
  return {
    conflicts,
    addedEntries,
    addedSymptoms: imported.customSymptoms.filter((s) => !symptomIds.has(s.id)).length,
    addedEvents: imported.events.filter((e) => !eventIds.has(e.id)).length,
  };
}

export interface MergeDecisions {
  /** Résolution par date de conflit ; absente → defaultChoice. */
  conflictChoices: Record<ISODate, 'existing' | 'imported'>;
  /** Conserver le profil/réglages actuels ou adopter les importés (§12.6). */
  profileAndSettings: 'existing' | 'imported';
}

export function applyMerge(
  current: AppData,
  imported: AppData,
  plan: MergePlan,
  decisions: MergeDecisions,
): AppData {
  const dailyEntries = { ...current.dailyEntries };
  for (const [date, entry] of Object.entries(imported.dailyEntries)) {
    if (dailyEntries[date] === undefined) {
      dailyEntries[date] = entry;
    }
  }
  for (const conflict of plan.conflicts) {
    const choice = decisions.conflictChoices[conflict.date] ?? conflict.defaultChoice;
    dailyEntries[conflict.date] = choice === 'imported' ? conflict.imported : conflict.existing;
  }

  const symptomIds = new Set(current.customSymptoms.map((s) => s.id));
  const eventIds = new Set(current.events.map((e) => e.id));
  const takeImportedMeta = decisions.profileAndSettings === 'imported';

  return {
    ...current,
    profile: takeImportedMeta ? imported.profile : current.profile,
    settings: takeImportedMeta ? imported.settings : current.settings,
    dailyEntries,
    customSymptoms: [...current.customSymptoms, ...imported.customSymptoms.filter((s) => !symptomIds.has(s.id))],
    events: [...current.events, ...imported.events.filter((e) => !eventIds.has(e.id))],
    meta: { ...current.meta, updatedAt: new Date().toISOString() },
  };
}

/* ---------- Export chiffré (§15.2) : AES-GCM, clé dérivée par PBKDF2-SHA256 ---------- */

const PBKDF2_ITERATIONS = 310_000;

function toBase64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function fromBase64(s: string): Uint8Array {
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

async function deriveKey(passphrase: string, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, [
    'deriveKey',
  ]);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export interface EncryptedBackupFile {
  format: 'lunative-backup-encrypted';
  schemaVersion: number;
  exportedAt: string;
  kdf: 'PBKDF2-SHA256';
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
}

export async function encryptBackup(data: AppData, passphrase: string): Promise<EncryptedBackupFile> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt, PBKDF2_ITERATIONS);
  const plaintext = new TextEncoder().encode(JSON.stringify(createBackupFile(data)));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, plaintext as BufferSource);
  return {
    format: 'lunative-backup-encrypted',
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    kdf: 'PBKDF2-SHA256',
    iterations: PBKDF2_ITERATIONS,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(ciphertext),
  };
}

export async function decryptBackup(file: EncryptedBackupFile, passphrase: string): Promise<string> {
  const key = await deriveKey(passphrase, fromBase64(file.salt), file.iterations);
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(file.iv) as BufferSource },
    key,
    fromBase64(file.ciphertext) as BufferSource,
  );
  return new TextDecoder().decode(plaintext);
}
