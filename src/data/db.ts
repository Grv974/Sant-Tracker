import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { AppData, Snapshot } from '@/types/models';

/**
 * Accès IndexedDB (§12.1, [DÉCISION IMPOSÉE]) via idb.
 * Deux stores : l'agrégat racine unique AppData et les snapshots internes.
 */

interface LunativeDB extends DBSchema {
  appdata: { key: string; value: AppData };
  snapshots: { key: string; value: Snapshot; indexes: { 'by-date': string } };
}

const DB_NAME = 'lunative';
const DB_VERSION = 1;
const ROOT_KEY = 'root';

let dbPromise: Promise<IDBPDatabase<LunativeDB>> | null = null;

function getDB(): Promise<IDBPDatabase<LunativeDB>> {
  if (!dbPromise) {
    dbPromise = openDB<LunativeDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('appdata')) db.createObjectStore('appdata');
        if (!db.objectStoreNames.contains('snapshots')) {
          const store = db.createObjectStore('snapshots', { keyPath: 'id' });
          store.createIndex('by-date', 'createdAt');
        }
      },
    });
  }
  return dbPromise;
}

export async function loadAppData(): Promise<AppData | undefined> {
  const db = await getDB();
  return db.get('appdata', ROOT_KEY);
}

export async function saveAppData(data: AppData): Promise<void> {
  const db = await getDB();
  await db.put('appdata', data, ROOT_KEY);
}

export async function listSnapshots(): Promise<Snapshot[]> {
  const db = await getDB();
  const all = await db.getAll('snapshots');
  // Les ids encodent horodatage + séquence : tri lexicographique = ordre de création.
  return all.sort((a, b) => (a.id < b.id ? 1 : -1)); // plus récent d'abord
}

export async function putSnapshot(snapshot: Snapshot): Promise<void> {
  const db = await getDB();
  await db.put('snapshots', snapshot);
}

export async function deleteSnapshot(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('snapshots', id);
}

/** Purge complète (§12.7) : appdata + snapshots. */
export async function eraseDatabase(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['appdata', 'snapshots'], 'readwrite');
  await Promise.all([tx.objectStore('appdata').clear(), tx.objectStore('snapshots').clear(), tx.done]);
}
