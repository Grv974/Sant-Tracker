import { beforeEach, describe, expect, it } from 'vitest';
import { eraseDatabase, loadAppData, saveAppData } from '../db';
import { createSnapshot, listSnapshots } from '../snapshots';
import { makeAppData, makeEntry } from '@/tests/fixtures';
import { MAX_SNAPSHOTS } from '@/constants/app';

describe('persistance IndexedDB (§12.1)', () => {
  beforeEach(async () => {
    await eraseDatabase();
  });

  it('sauvegarde et recharge l’agrégat racine', async () => {
    expect(await loadAppData()).toBeUndefined();
    const data = makeAppData({ dailyEntries: { '2025-05-01': makeEntry('2025-05-01', { flow: 'medium' }) } });
    await saveAppData(data);
    const loaded = await loadAppData();
    expect(loaded?.dailyEntries['2025-05-01']?.flow).toBe('medium');
  });

  it('snapshots : rotation FIFO à MAX_SNAPSHOTS (§12.4)', async () => {
    const data = makeAppData();
    for (let i = 0; i < MAX_SNAPSHOTS + 2; i++) {
      data.profile.typicalCycleLength = 20 + i;
      await createSnapshot(data, 'manual');
    }
    const snapshots = await listSnapshots();
    expect(snapshots).toHaveLength(MAX_SNAPSHOTS);
    // les plus récents sont conservés (28 = 20+6 en tête)
    expect(snapshots[0]!.data.profile.typicalCycleLength).toBe(20 + MAX_SNAPSHOTS + 1);
  });

  it('le snapshot permet de revenir à l’état antérieur exact (§17.J)', async () => {
    const original = makeAppData({ dailyEntries: { '2025-05-01': makeEntry('2025-05-01', { flow: 'heavy' }) } });
    await saveAppData(original);
    const snap = await createSnapshot(original, 'import');

    // import-remplacement destructif
    await saveAppData(makeAppData());
    expect(Object.keys((await loadAppData())!.dailyEntries)).toHaveLength(0);

    // restauration
    await saveAppData(snap.data);
    const restored = await loadAppData();
    expect(restored).toEqual(original);
  });

  it('effacement complet (§12.7)', async () => {
    await saveAppData(makeAppData());
    await createSnapshot(makeAppData(), 'erase');
    await eraseDatabase();
    expect(await loadAppData()).toBeUndefined();
    expect(await listSnapshots()).toHaveLength(0);
  });
});
