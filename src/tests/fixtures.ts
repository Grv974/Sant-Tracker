import type { AppData, DailyEntry, FlowLevel, ISODate, Profile, Settings } from '@/types/models';
import { addDays } from '@/domain/dates';
import { SCHEMA_VERSION, APP_VERSION, DISCLAIMER_VERSION } from '@/constants/app';

export function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    trackWeight: true,
    contraception: 'none',
    primaryGoal: 'understand',
    conditions: {
      pcos: false,
      endometriosis: false,
      perimenopause: false,
      earlyMenopause: false,
      pregnant: false,
      postpartum: false,
      breastfeeding: false,
    },
    typicalCycleLength: 28,
    typicalPeriodLength: 5,
    ...overrides,
  };
}

export function makeEntry(date: ISODate, overrides: Partial<DailyEntry> = {}): DailyEntry {
  return {
    date,
    createdAt: '2025-01-01T08:00:00.000Z',
    updatedAt: '2025-01-01T08:00:00.000Z',
    ...overrides,
  };
}

/** Génère des entrées de règles : `periodLength` jours de flux à partir de chaque début. */
export function makePeriodEntries(
  starts: ISODate[],
  periodLength = 5,
  flow: FlowLevel = 'medium',
): Record<ISODate, DailyEntry> {
  const entries: Record<ISODate, DailyEntry> = {};
  for (const start of starts) {
    for (let i = 0; i < periodLength; i++) {
      const date = addDays(start, i);
      entries[date] = makeEntry(date, { flow, menstruation: i === 0 ? { isStart: true } : undefined });
    }
  }
  return entries;
}

/** Débuts de cycle réguliers : `count` cycles de `length` jours depuis `first`. */
export function regularStarts(first: ISODate, length: number, count: number): ISODate[] {
  return Array.from({ length: count }, (_, i) => addDays(first, i * length));
}

export function makeSettings(overrides: Partial<Settings> = {}): Settings {
  return {
    theme: 'system',
    locale: 'fr',
    units: { temperature: 'C', weight: 'kg', height: 'cm' },
    trackedCategories: {},
    dashboardWidgets: [],
    notifications: {
      enabled: false,
      periodUpcoming: { on: true, daysBefore: 2 },
      periodToday: { on: true },
      periodLate: { on: false, daysAfter: 3 },
      fertileWindow: { on: false },
      pill: { on: false },
      hydration: { on: false },
      sport: { on: false },
      journal: { on: false },
      bbt: { on: false },
    },
    security: { appLock: false },
    showPredictions: true,
    ...overrides,
  };
}

export function makeAppData(overrides: Partial<AppData> = {}): AppData {
  return {
    schemaVersion: SCHEMA_VERSION,
    profile: makeProfile(),
    dailyEntries: {},
    customSymptoms: [],
    events: [],
    settings: makeSettings(),
    consent: { acceptedDisclaimer: true, acceptedAt: '2025-01-01T08:00:00.000Z', disclaimerVersion: DISCLAIMER_VERSION },
    meta: { createdAt: '2025-01-01T08:00:00.000Z', updatedAt: '2025-01-01T08:00:00.000Z', appVersion: APP_VERSION },
    ...overrides,
  };
}
