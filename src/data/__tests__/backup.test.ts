import { describe, expect, it } from 'vitest';
import {
  applyMerge,
  backupFileName,
  createBackupFile,
  decryptBackup,
  encryptBackup,
  parseBackup,
  planMerge,
} from '../backup';
import { makeAppData, makeEntry } from '@/tests/fixtures';

describe('export / import JSON (§12.2, §12.3)', () => {
  it('aller-retour export → import', async () => {
    const data = makeAppData({
      dailyEntries: {
        '2025-05-01': makeEntry('2025-05-01', { flow: 'medium' }),
        '2025-05-02': makeEntry('2025-05-02', { flow: 'light' }),
      },
    });
    const file = createBackupFile(data);
    const result = await parseBackup(JSON.stringify(file));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.preview.entryCount).toBe(2);
      expect(result.preview.dateRange).toEqual({ from: '2025-05-01', to: '2025-05-02' });
      expect(result.preview.migratedFrom).toBeNull();
      expect(result.preview.data.dailyEntries['2025-05-01']?.flow).toBe('medium');
    }
  });

  it('rejette JSON invalide et mauvais format', async () => {
    expect((await parseBackup('{pas du json')).ok).toBe(false);
    const bad = await parseBackup(JSON.stringify({ format: 'autre-app', data: {} }));
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.error.kind).toBe('invalid_format');
  });

  it('rejette des données hors bornes avec messages clairs (§11.4)', async () => {
    const data = makeAppData({
      dailyEntries: { '2025-05-01': makeEntry('2025-05-01', { bbt: { celsius: 43 } }) },
    });
    const result = await parseBackup(JSON.stringify(createBackupFile(data)));
    expect(result.ok).toBe(false);
    if (!result.ok && result.error.kind === 'validation_failed') {
      expect(result.error.issues.length).toBeGreaterThan(0);
      expect(result.error.issues[0]!.path).toContain('2025-05-01');
    }
  });

  it('le nom de fichier suit lunative-backup-YYYYMMDD-HHmm.json', () => {
    expect(backupFileName(new Date(2025, 4, 14, 7, 5))).toBe('lunative-backup-20250514-0705.json');
  });
});

describe('fusion avec conflits (§12.6)', () => {
  const base = () =>
    makeAppData({
      dailyEntries: {
        '2025-05-01': makeEntry('2025-05-01', { flow: 'medium', updatedAt: '2025-05-01T10:00:00.000Z' }),
      },
      customSymptoms: [
        { id: 's1', name: 'Acné', inputType: 'boolean', active: true, order: 0 },
      ],
    });

  it('détecte les conflits par date, le plus récent gagne par défaut', () => {
    const current = base();
    const imported = makeAppData({
      dailyEntries: {
        '2025-05-01': makeEntry('2025-05-01', { flow: 'heavy', updatedAt: '2025-05-02T10:00:00.000Z' }),
        '2025-05-03': makeEntry('2025-05-03', { flow: 'light' }),
      },
      customSymptoms: [
        { id: 's1', name: 'Acné', inputType: 'boolean', active: true, order: 0 },
        { id: 's2', name: 'Migraine', inputType: 'scale', active: true, order: 1 },
      ],
    });
    const plan = planMerge(current, imported);
    expect(plan.conflicts).toHaveLength(1);
    expect(plan.conflicts[0]!.defaultChoice).toBe('imported');
    expect(plan.addedEntries).toBe(1);
    expect(plan.addedSymptoms).toBe(1); // s1 dédupliqué par id

    const merged = applyMerge(current, imported, plan, { conflictChoices: {}, profileAndSettings: 'existing' });
    expect(merged.dailyEntries['2025-05-01']?.flow).toBe('heavy');
    expect(merged.dailyEntries['2025-05-03']?.flow).toBe('light');
    expect(merged.customSymptoms.map((s) => s.id)).toEqual(['s1', 's2']);
  });

  it('laisse l’utilisatrice trancher au cas par cas (§17.7)', () => {
    const current = base();
    const imported = makeAppData({
      dailyEntries: {
        '2025-05-01': makeEntry('2025-05-01', { flow: 'heavy', updatedAt: '2025-05-02T10:00:00.000Z' }),
      },
    });
    const plan = planMerge(current, imported);
    const merged = applyMerge(current, imported, plan, {
      conflictChoices: { '2025-05-01': 'existing' },
      profileAndSettings: 'existing',
    });
    expect(merged.dailyEntries['2025-05-01']?.flow).toBe('medium');
  });

  it('profil/réglages : adoption explicite de l’importé', () => {
    const current = base();
    const imported = makeAppData();
    imported.profile.typicalCycleLength = 31;
    const plan = planMerge(current, imported);
    const merged = applyMerge(current, imported, plan, { conflictChoices: {}, profileAndSettings: 'imported' });
    expect(merged.profile.typicalCycleLength).toBe(31);
  });
});

describe('export chiffré (§15.2)', () => {
  it('chiffre puis déchiffre avec la bonne phrase de passe', async () => {
    const data = makeAppData({ dailyEntries: { '2025-05-01': makeEntry('2025-05-01', { flow: 'medium' }) } });
    const encrypted = await encryptBackup(data, 'ma phrase secrète');
    expect(encrypted.format).toBe('lunative-backup-encrypted');
    expect(encrypted.ciphertext).not.toContain('medium');

    const result = await parseBackup(JSON.stringify(encrypted), 'ma phrase secrète');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.preview.data.dailyEntries['2025-05-01']?.flow).toBe('medium');
  });

  it('refuse une mauvaise phrase de passe', async () => {
    const encrypted = await encryptBackup(makeAppData(), 'bonne phrase');
    const result = await parseBackup(JSON.stringify(encrypted), 'mauvaise phrase');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe('wrong_passphrase');
    await expect(decryptBackup(encrypted, 'mauvaise phrase')).rejects.toThrow();
  });

  it('signale qu’une phrase est requise', async () => {
    const encrypted = await encryptBackup(makeAppData(), 'phrase');
    const result = await parseBackup(JSON.stringify(encrypted));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe('encrypted_needs_passphrase');
  });
});
