import type { AppData, NotificationSettings, Profile, Settings } from '@/types/models';
import { APP_VERSION, DISCLAIMER_VERSION, SCHEMA_VERSION } from '@/constants/app';

/** Catégories de suivi natives (§3.3) et leur activation par défaut. */
export const TRACKING_CATEGORIES = [
  'flow',
  'pain',
  'mood',
  'energy',
  'libido',
  'bbt',
  'cervicalMucus',
  'ovulationTest',
  'activity',
  'sleep',
  'stress',
  'hydration',
  'weight',
  'notes',
] as const;

export type TrackingCategory = (typeof TRACKING_CATEGORIES)[number];

const DEFAULT_ACTIVE: TrackingCategory[] = ['flow', 'pain', 'mood', 'energy', 'notes'];

export const DASHBOARD_WIDGET_IDS = [
  'cycleRing',
  'nextPeriod',
  'currentPhase',
  'fertileWindow',
  'quickLog',
  'recentSymptoms',
  'bbtMini',
  'cycleTrend',
  'attentionSignals',
  'dailyRecommendation',
  'todayReminders',
  'keyStats',
] as const;

export type DashboardWidgetId = (typeof DASHBOARD_WIDGET_IDS)[number];

const DEFAULT_HIDDEN_WIDGETS: DashboardWidgetId[] = ['fertileWindow', 'bbtMini', 'todayReminders'];

export function defaultNotificationSettings(): NotificationSettings {
  return {
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
    quietHours: { start: '22:00', end: '07:00' },
  };
}

export function defaultTrackedCategories(): Settings['trackedCategories'] {
  const out: Settings['trackedCategories'] = {};
  TRACKING_CATEGORIES.forEach((cat, i) => {
    out[cat] = { active: DEFAULT_ACTIVE.includes(cat), order: i };
  });
  return out;
}

export function defaultDashboardWidgets(): Settings['dashboardWidgets'] {
  return DASHBOARD_WIDGET_IDS.map((id, i) => ({
    id,
    visible: !DEFAULT_HIDDEN_WIDGETS.includes(id),
    order: i,
  }));
}

export function defaultSettings(): Settings {
  return {
    theme: 'system',
    locale: 'fr',
    units: { temperature: 'C', weight: 'kg', height: 'cm' },
    trackedCategories: defaultTrackedCategories(),
    dashboardWidgets: defaultDashboardWidgets(),
    notifications: defaultNotificationSettings(),
    security: { appLock: false },
    showPredictions: true,
    customMoodStates: [],
    dismissedSignals: [],
  };
}

export function defaultProfile(): Profile {
  return {
    trackWeight: true,
    contraception: 'none',
    primaryGoal: 'understand',
    conditions: {
      pcos: false,
      endometriosis: false,
      perimenopause: false,
      earlyMenopause: false,
      menopauseConfirmed: false,
      pregnant: false,
      postpartum: false,
      breastfeeding: false,
    },
    typicalCycleLength: 28,
    typicalPeriodLength: 5,
    countSpottingAsPeriodStart: false,
  };
}

export function createEmptyAppData(now: string = new Date().toISOString()): AppData {
  return {
    schemaVersion: SCHEMA_VERSION,
    profile: defaultProfile(),
    dailyEntries: {},
    customSymptoms: [],
    events: [],
    settings: defaultSettings(),
    consent: { acceptedDisclaimer: false, acceptedAt: '', disclaimerVersion: DISCLAIMER_VERSION },
    meta: { createdAt: now, updatedAt: now, appVersion: APP_VERSION },
  };
}

/**
 * Presets de suivi par profil (§3.3.20) : catégories activées en plus du socle.
 */
export const TRACKING_PRESETS: Record<string, TrackingCategory[]> = {
  minimal: ['flow', 'notes'],
  complete: [...TRACKING_CATEGORIES],
  conceive: ['flow', 'pain', 'mood', 'energy', 'bbt', 'cervicalMucus', 'ovulationTest', 'notes'],
  pcos: ['flow', 'pain', 'mood', 'energy', 'weight', 'sleep', 'stress', 'notes'],
  endometriosis: ['flow', 'pain', 'mood', 'energy', 'sleep', 'notes'],
  perimenopause: ['flow', 'mood', 'energy', 'sleep', 'stress', 'notes'],
  postpartum: ['flow', 'mood', 'energy', 'sleep', 'notes'],
};

export function applyTrackingPreset(
  categories: Settings['trackedCategories'],
  preset: keyof typeof TRACKING_PRESETS,
): Settings['trackedCategories'] {
  const active = TRACKING_PRESETS[preset] ?? [];
  const out: Settings['trackedCategories'] = {};
  for (const [key, value] of Object.entries(categories)) {
    out[key] = { ...value, active: active.includes(key as TrackingCategory) };
  }
  return out;
}
