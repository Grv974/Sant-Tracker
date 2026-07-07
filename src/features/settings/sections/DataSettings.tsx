import { useEffect, useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import type { ISODate, Snapshot } from '@/types/models';
import { useAppStore } from '@/store/appStore';
import { useI18n } from '@/i18n';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/misc';
import { Sheet } from '@/components/ui/Sheet';
import { useToast } from '@/components/ui/Toast';
import {
  applyMerge,
  backupFileName,
  createBackupFile,
  encryptBackup,
  parseBackup,
  planMerge,
  type ImportPreview,
  type MergePlan,
} from '@/data/backup';
import { createSnapshot, deleteSnapshot, listSnapshots } from '@/data/snapshots';

/** Téléchargement local via l'API File (§12.2) — aucune donnée ne transite par le réseau. */
function download(name: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function DataSettings() {
  const { t, fdate } = useI18n();
  const toast = useToast();
  const store = useAppStore();
  const data = useAppStore((s) => s.data);
  const fileRef = useRef<HTMLInputElement>(null);
  const [passphrase, setPassphrase] = useState('');
  const [showEncrypt, setShowEncrypt] = useState(false);
  const [importState, setImportState] = useState<{ preview: ImportPreview; plan: MergePlan } | null>(null);
  const [mergeMode, setMergeMode] = useState(false);
  const [conflictChoices, setConflictChoices] = useState<Record<ISODate, 'existing' | 'imported'>>({});
  const [profileChoice, setProfileChoice] = useState<'existing' | 'imported'>('existing');
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [eraseOpen, setEraseOpen] = useState(false);

  const refreshSnapshots = () => void listSnapshots().then(setSnapshots);
  useEffect(refreshSnapshots, []);

  if (!data) return null;

  const exportPlain = async () => {
    await store.flushNow();
    download(backupFileName(), JSON.stringify(createBackupFile(data), null, 2));
  };

  const exportEncrypted = async () => {
    if (!passphrase) return;
    await store.flushNow();
    const file = await encryptBackup(data, passphrase);
    download(backupFileName().replace('.json', '.encrypted.json'), JSON.stringify(file, null, 2));
    setPassphrase('');
    setShowEncrypt(false);
  };

  const handleFile = async (file: File) => {
    const text = await file.text();
    let result = await parseBackup(text);
    if (!result.ok && result.error.kind === 'encrypted_needs_passphrase') {
      const pass = window.prompt(t('settings.dataSection.passphrase'));
      if (!pass) return;
      result = await parseBackup(text, pass);
    }
    if (!result.ok) {
      const err = result.error;
      toast(
        t(`settings.dataSection.importErrors.${err.kind}`, {
          v: 'fromVersion' in err ? err.fromVersion : '',
          issues: 'issues' in err ? err.issues.slice(0, 3).map((i) => i.path).join(', ') : '',
        }),
        'warning',
      );
      return;
    }
    const plan = planMerge(data, result.preview.data);
    setConflictChoices({});
    setProfileChoice('existing');
    setMergeMode(false);
    setImportState({ preview: result.preview, plan });
  };

  /** Remplacer : snapshot préalable obligatoire (§12.4, §17.7). */
  const doReplace = async () => {
    if (!importState) return;
    await store.flushNow();
    await createSnapshot(data, 'import');
    await store.replaceAll(importState.preview.data);
    setImportState(null);
    refreshSnapshots();
    toast(t('common.saved'));
  };

  const doMerge = async () => {
    if (!importState) return;
    await store.flushNow();
    await createSnapshot(data, 'merge');
    const merged = applyMerge(data, importState.preview.data, importState.plan, {
      conflictChoices,
      profileAndSettings: profileChoice,
    });
    await store.replaceAll(merged);
    toast(
      t('settings.dataSection.mergeReport', {
        entries: importState.plan.addedEntries,
        symptoms: importState.plan.addedSymptoms,
        events: importState.plan.addedEvents,
      }),
      'info',
    );
    setImportState(null);
    refreshSnapshots();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Export (§12.2) */}
      <Card className="flex flex-col gap-3">
        <CardTitle>{t('settings.dataSection.exportTitle')}</CardTitle>
        <p className="text-xs text-muted">{t('settings.dataSection.exportHint')}</p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void exportPlain()}>
            <Download className="h-4 w-4" aria-hidden /> {t('settings.dataSection.exportPlain')}
          </Button>
          <Button variant="secondary" onClick={() => setShowEncrypt((s) => !s)}>
            {t('settings.dataSection.exportEncrypted')}
          </Button>
        </div>
        {showEncrypt && (
          <form
            className="flex flex-col gap-2 rounded-lg bg-surface-2/60 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void exportEncrypted();
            }}
          >
            <Field
              label={t('settings.dataSection.passphrase')}
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
            />
            <p className="text-xs font-medium text-warning">{t('settings.dataSection.passphraseWarning')}</p>
            <Button type="submit" disabled={passphrase.length < 6}>
              {t('common.export')}
            </Button>
          </form>
        )}
      </Card>

      {/* Import (§12.3) */}
      <Card className="flex flex-col gap-3">
        <CardTitle>{t('settings.dataSection.importTitle')}</CardTitle>
        <p className="text-xs text-muted">{t('settings.dataSection.importHint')}</p>
        <Button variant="secondary" className="self-start" onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4" aria-hidden /> {t('settings.dataSection.importChoose')}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = '';
          }}
        />
      </Card>

      {/* Prévisualisation import + Remplacer/Fusionner (§12.3, §12.6) */}
      {importState && (
        <Sheet open onClose={() => setImportState(null)} title={t('settings.dataSection.importTitle')}>
          <div className="flex flex-col gap-4">
            <p className="text-sm">
              {t('settings.dataSection.importPreview', {
                count: importState.preview.entryCount,
                from: importState.preview.dateRange ? fdate(importState.preview.dateRange.from) : '—',
                to: importState.preview.dateRange ? fdate(importState.preview.dateRange.to) : '—',
              })}
            </p>
            {importState.preview.migratedFrom !== null && (
              <p className="text-xs text-info">{t('settings.dataSection.importMigrated', { v: importState.preview.migratedFrom })}</p>
            )}
            {!mergeMode ? (
              <>
                <p className="rounded-lg bg-warning/10 p-3 text-xs font-medium text-warning">
                  {t('settings.dataSection.importReplaceWarning')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="destructive" onClick={() => void doReplace()}>
                    {t('common.replace')}
                  </Button>
                  <Button variant="secondary" onClick={() => setMergeMode(true)}>
                    {t('common.merge')}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-sm font-semibold">{t('settings.dataSection.mergeTitle')}</h3>
                {importState.plan.conflicts.length > 0 && (
                  <>
                    <p className="text-xs text-muted">
                      {t('settings.dataSection.mergeConflicts', { n: importState.plan.conflicts.length })}
                    </p>
                    <div className="flex max-h-56 flex-col gap-2 overflow-y-auto">
                      {importState.plan.conflicts.map((conflict) => {
                        const choice = conflictChoices[conflict.date] ?? conflict.defaultChoice;
                        return (
                          <div key={conflict.date} className="flex items-center justify-between gap-2 rounded-lg bg-surface-2/60 px-3 py-2 text-sm">
                            <span>{fdate(conflict.date)}</span>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant={choice === 'existing' ? 'primary' : 'secondary'}
                                onClick={() => setConflictChoices({ ...conflictChoices, [conflict.date]: 'existing' })}
                              >
                                {t('settings.dataSection.mergeKeepExisting')}
                              </Button>
                              <Button
                                size="sm"
                                variant={choice === 'imported' ? 'primary' : 'secondary'}
                                onClick={() => setConflictChoices({ ...conflictChoices, [conflict.date]: 'imported' })}
                              >
                                {t('settings.dataSection.mergeKeepImported')}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span>{t('settings.dataSection.mergeProfile')}</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant={profileChoice === 'existing' ? 'primary' : 'secondary'} onClick={() => setProfileChoice('existing')}>
                      {t('settings.dataSection.mergeKeepExisting')}
                    </Button>
                    <Button size="sm" variant={profileChoice === 'imported' ? 'primary' : 'secondary'} onClick={() => setProfileChoice('imported')}>
                      {t('settings.dataSection.mergeKeepImported')}
                    </Button>
                  </div>
                </div>
                <Button onClick={() => void doMerge()}>{t('common.merge')}</Button>
              </>
            )}
          </div>
        </Sheet>
      )}

      {/* Snapshots (§12.4) */}
      <Card className="flex flex-col gap-3">
        <CardTitle>{t('settings.dataSection.snapshotsTitle')}</CardTitle>
        <p className="text-xs text-muted">{t('settings.dataSection.snapshotsHint')}</p>
        <Button
          variant="secondary"
          className="self-start"
          onClick={() =>
            void (async () => {
              await store.flushNow();
              await createSnapshot(data, 'manual');
              refreshSnapshots();
              toast(t('common.saved'));
            })()
          }
        >
          {t('settings.dataSection.snapshotCreate')}
        </Button>
        {snapshots.length > 0 && (
          <ul className="flex flex-col gap-2">
            {snapshots.map((snapshot) => (
              <li key={snapshot.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface-2/60 px-3 py-2 text-sm">
                <span>
                  {new Date(snapshot.createdAt).toLocaleString()}{' '}
                  <span className="text-xs text-muted">({t(`settings.dataSection.snapshotReasons.${snapshot.reason}`)})</span>
                </span>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      void (async () => {
                        if (!window.confirm(t('settings.dataSection.snapshotRestoreConfirm'))) return;
                        await store.flushNow();
                        await createSnapshot(data, 'manual');
                        await store.replaceAll(snapshot.data);
                        refreshSnapshots();
                        toast(t('common.saved'));
                      })()
                    }
                  >
                    {t('common.restore')}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      void (async () => {
                        await deleteSnapshot(snapshot.id);
                        refreshSnapshots();
                      })()
                    }
                  >
                    {t('common.delete')}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Effacement (§12.7) : double confirmation + mot */}
      <Card className="flex flex-col gap-3 border border-period/25">
        <CardTitle className="text-period">{t('settings.dataSection.eraseTitle')}</CardTitle>
        <p className="text-xs text-muted">{t('settings.dataSection.eraseWarning')}</p>
        <Button variant="destructive" className="self-start" onClick={() => setEraseOpen(true)}>
          {t('settings.dataSection.eraseTitle')}
        </Button>
      </Card>
      {eraseOpen && (
        <EraseSheet
          onClose={() => setEraseOpen(false)}
          onConfirm={async (withSnapshot) => {
            await store.flushNow();
            if (withSnapshot) await createSnapshot(data, 'erase');
            await store.eraseAll();
          }}
        />
      )}
    </div>
  );
}

function EraseSheet({ onClose, onConfirm }: { onClose: () => void; onConfirm: (withSnapshot: boolean) => Promise<void> }) {
  const { t } = useI18n();
  const [word, setWord] = useState('');
  const [withSnapshot, setWithSnapshot] = useState(false);
  const confirmWord = t('settings.dataSection.eraseConfirmWord');
  return (
    <Sheet open onClose={onClose} title={t('settings.dataSection.eraseTitle')} position="center">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted">{t('settings.dataSection.eraseWarning')}</p>
        <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={withSnapshot}
            onChange={(e) => setWithSnapshot(e.target.checked)}
            className="h-5 w-5 accent-[rgb(var(--c-primary))]"
          />
          {t('settings.dataSection.eraseSnapshotOffer')}
        </label>
        <Field
          label={t('settings.dataSection.eraseTypeWord', { word: confirmWord })}
          value={word}
          onChange={(e) => setWord(e.target.value)}
          autoComplete="off"
        />
        <Button variant="destructive" disabled={word !== confirmWord} onClick={() => void onConfirm(withSnapshot)}>
          {t('settings.dataSection.eraseButton')}
        </Button>
      </div>
    </Sheet>
  );
}
