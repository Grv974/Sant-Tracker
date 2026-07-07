import type { AppData, Snapshot } from '@/types/models';
import { MAX_SNAPSHOTS } from '@/constants/app';
import { deleteSnapshot, listSnapshots, putSnapshot } from './db';

/**
 * Snapshots internes (§12.4) : jusqu'à MAX_SNAPSHOTS instantanés horodatés,
 * rotation FIFO, créés avant toute opération risquée et manuellement.
 * L'id encode horodatage + séquence monotone : l'ordre FIFO reste déterministe
 * même pour deux snapshots créés dans la même milliseconde.
 */
let sequence = 0;

export async function createSnapshot(data: AppData, reason: Snapshot['reason']): Promise<Snapshot> {
  const snapshot: Snapshot = {
    id: `snap-${String(Date.now()).padStart(15, '0')}-${String(sequence++).padStart(6, '0')}`,
    createdAt: new Date().toISOString(),
    reason,
    data: structuredClone(data),
  };
  await putSnapshot(snapshot);
  const all = await listSnapshots();
  for (const old of all.slice(MAX_SNAPSHOTS)) {
    await deleteSnapshot(old.id);
  }
  return snapshot;
}

export { listSnapshots, deleteSnapshot };
