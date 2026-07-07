import { create } from 'zustand';
import type {
  AppData,
  CalendarEvent,
  CustomSymptom,
  DailyEntry,
  ISODate,
  Profile,
  Settings,
} from '@/types/models';
import { loadAppData, saveAppData, eraseDatabase } from '@/data/db';
import { createEmptyAppData } from '@/data/defaults';
import { migrateAppData } from '@/data/migrations';
import { createSnapshot } from '@/data/snapshots';
import { validateAppData } from '@/data/schemas';
import { SCHEMA_VERSION, LS_ONBOARDED_KEY } from '@/constants/app';
import { todayISO } from '@/domain/dates';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface AppStore {
  data: AppData | null;
  hydrated: boolean;
  saveState: SaveState;
  /** Erreur de migration au boot, le cas échéant (l'app continue sur l'ancien état restauré). */
  bootError: string | null;

  hydrate: () => Promise<void>;
  /** Mutation générique : applique un patch immuable à AppData puis autosave (debounce 300 ms). */
  mutate: (fn: (data: AppData) => AppData) => void;
  updateEntry: (date: ISODate, patch: Partial<DailyEntry>) => void;
  clearEntryField: (date: ISODate, field: keyof DailyEntry) => void;
  markPeriodStart: (date: ISODate) => void;
  undoPeriodStart: (date: ISODate) => void;
  markPeriodEnd: (date: ISODate) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  addCustomSymptom: (symptom: CustomSymptom) => void;
  updateCustomSymptom: (id: string, patch: Partial<CustomSymptom>) => void;
  removeCustomSymptom: (id: string) => void;
  addEvent: (event: CalendarEvent) => void;
  removeEvent: (id: string) => void;
  dismissSignal: (id: string) => void;
  completeOnboarding: (profile: Partial<Profile>, consentAt: string, disclaimerVersion: string) => void;
  replaceAll: (data: AppData) => Promise<void>;
  eraseAll: () => Promise<void>;
  flushNow: () => Promise<void>;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let pendingData: AppData | null = null;

/** Auto-save débattue ~300 ms (§12.1) ; flushNow force l'écriture (avant opération risquée). */
function scheduleSave(get: () => AppStore, set: (partial: Partial<AppStore>) => void) {
  const data = get().data;
  if (!data) return;
  pendingData = data;
  set({ saveState: 'saving' });
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    void flush(set);
  }, 300);
}

async function flush(set: (partial: Partial<AppStore>) => void): Promise<void> {
  if (!pendingData) return;
  const toSave = pendingData;
  pendingData = null;
  try {
    await saveAppData(toSave);
    set({ saveState: 'saved' });
  } catch (e) {
    console.error('Échec de sauvegarde IndexedDB', e);
    set({ saveState: 'error' });
  }
}

function touched(data: AppData): AppData {
  return { ...data, meta: { ...data.meta, updatedAt: new Date().toISOString() } };
}

function entryDefaults(date: ISODate): DailyEntry {
  const now = new Date().toISOString();
  return { date, createdAt: now, updatedAt: now };
}

export const useAppStore = create<AppStore>((set, get) => ({
  data: null,
  hydrated: false,
  saveState: 'idle',
  bootError: null,

  hydrate: async () => {
    try {
      const stored = await loadAppData();
      if (!stored) {
        set({ data: createEmptyAppData(), hydrated: true });
        return;
      }
      if ((stored.schemaVersion ?? 1) < SCHEMA_VERSION) {
        // Migration au boot : snapshot préalable, restauration en cas d'échec (§12.5).
        await createSnapshot(stored, 'migration');
        try {
          const { data } = migrateAppData(stored);
          const validation = validateAppData(data);
          if (!validation.ok) throw new Error(validation.issues.map((i) => `${i.path}: ${i.message}`).join('; '));
          await saveAppData(data);
          set({ data, hydrated: true });
        } catch (e) {
          set({ data: stored, hydrated: true, bootError: e instanceof Error ? e.message : String(e) });
        }
        return;
      }
      set({ data: stored, hydrated: true });
    } catch (e) {
      console.error('Échec de chargement IndexedDB', e);
      set({ data: createEmptyAppData(), hydrated: true, bootError: e instanceof Error ? e.message : String(e) });
    }
  },

  mutate: (fn) => {
    const data = get().data;
    if (!data) return;
    set({ data: touched(fn(data)) });
    scheduleSave(get, set);
  },

  updateEntry: (date, patch) => {
    get().mutate((data) => {
      const existing = data.dailyEntries[date] ?? entryDefaults(date);
      const entry: DailyEntry = { ...existing, ...patch, date, updatedAt: new Date().toISOString() };
      return { ...data, dailyEntries: { ...data.dailyEntries, [date]: entry } };
    });
  },

  clearEntryField: (date, field) => {
    get().mutate((data) => {
      const existing = data.dailyEntries[date];
      if (!existing) return data;
      const entry = { ...existing, updatedAt: new Date().toISOString() };
      delete (entry as Record<string, unknown>)[field];
      return { ...data, dailyEntries: { ...data.dailyEntries, [date]: entry } };
    });
  },

  /** CU-01 : marque J1 ; la clôture du cycle précédent découle du recalcul dérivé. */
  markPeriodStart: (date) => {
    get().updateEntry(date, { menstruation: { isStart: true }, flow: 'medium' });
  },

  /** « Ce n'était pas mes règles » (§3.3.2). */
  undoPeriodStart: (date) => {
    get().mutate((data) => {
      const existing = data.dailyEntries[date];
      if (!existing) return data;
      const entry = { ...existing, updatedAt: new Date().toISOString() };
      delete (entry as Record<string, unknown>).menstruation;
      delete (entry as Record<string, unknown>).flow;
      return { ...data, dailyEntries: { ...data.dailyEntries, [date]: entry } };
    });
  },

  markPeriodEnd: (date) => {
    get().updateEntry(date, { menstruation: { isEnd: true } });
  },

  updateProfile: (patch) => {
    get().mutate((data) => {
      const contraceptionChanged =
        patch.contraception !== undefined && patch.contraception !== data.profile.contraception;
      return {
        ...data,
        profile: {
          ...data.profile,
          ...patch,
          ...(contraceptionChanged ? { contraceptionChangedAt: todayISO() } : {}),
        },
      };
    });
  },

  updateSettings: (patch) => {
    get().mutate((data) => ({ ...data, settings: { ...data.settings, ...patch } }));
  },

  addCustomSymptom: (symptom) => {
    get().mutate((data) => ({ ...data, customSymptoms: [...data.customSymptoms, symptom] }));
  },

  updateCustomSymptom: (id, patch) => {
    get().mutate((data) => ({
      ...data,
      customSymptoms: data.customSymptoms.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  },

  removeCustomSymptom: (id) => {
    get().mutate((data) => ({ ...data, customSymptoms: data.customSymptoms.filter((s) => s.id !== id) }));
  },

  addEvent: (event) => {
    get().mutate((data) => ({ ...data, events: [...data.events, event] }));
  },

  removeEvent: (id) => {
    get().mutate((data) => ({ ...data, events: data.events.filter((e) => e.id !== id) }));
  },

  dismissSignal: (id) => {
    get().mutate((data) => ({
      ...data,
      settings: {
        ...data.settings,
        dismissedSignals: [...(data.settings.dismissedSignals ?? []), id],
      },
    }));
  },

  completeOnboarding: (profile, consentAt, disclaimerVersion) => {
    get().mutate((data) => ({
      ...data,
      profile: { ...data.profile, ...profile },
      consent: { acceptedDisclaimer: true, acceptedAt: consentAt, disclaimerVersion },
    }));
    try {
      localStorage.setItem(LS_ONBOARDED_KEY, '1');
    } catch {
      /* stockage indisponible : le consentement IDB fait foi */
    }
  },

  replaceAll: async (data) => {
    if (saveTimer) clearTimeout(saveTimer);
    pendingData = null;
    set({ data: touched(data), saveState: 'saving' });
    await saveAppData(get().data as AppData);
    set({ saveState: 'saved' });
  },

  eraseAll: async () => {
    if (saveTimer) clearTimeout(saveTimer);
    pendingData = null;
    await eraseDatabase();
    try {
      localStorage.removeItem(LS_ONBOARDED_KEY);
    } catch {
      /* ignore */
    }
    set({ data: createEmptyAppData(), saveState: 'idle' });
  },

  flushNow: async () => {
    if (saveTimer) clearTimeout(saveTimer);
    await flush(set);
  },
}));
