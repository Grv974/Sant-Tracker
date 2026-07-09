/** Modèles de données persistés (§11.2). Dates civiles locales en YYYY-MM-DD, jamais de timestamp UTC pour les jours. */

import type { NutritionLog } from '@/data/food/types';

export type ISODate = string; // "2025-05-14"
export type ISODateTime = string; // "2025-05-14T07:12:00.000Z"
export type UUID = string;

export type FlowLevel = 'none' | 'spotting' | 'light' | 'medium' | 'heavy' | 'flooding';

export type ContraceptionType =
  | 'none'
  | 'combined_pill'
  | 'progestin_pill'
  | 'hormonal_iud'
  | 'copper_iud'
  | 'implant'
  | 'injection'
  | 'patch'
  | 'ring'
  | 'condom'
  | 'fertility_awareness'
  | 'other';

export type PrimaryGoal =
  | 'understand'
  | 'predict'
  | 'conceive'
  | 'condition'
  | 'perimenopause'
  | 'postpartum';

export type Scale5 = 1 | 2 | 3 | 4 | 5;
export type FunctionalImpact = 'none' | 'mild' | 'limited' | 'impossible';
export type MucusType = 'dry' | 'sticky' | 'creamy' | 'watery' | 'eggwhite';
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface Profile {
  birthYear?: number;
  heightCm?: number | null;
  weightKg?: number | null;
  trackWeight: boolean;
  contraception: ContraceptionType;
  /** Date du dernier changement de contraception : pénalise temporairement la confiance (§4.8). */
  contraceptionChangedAt?: ISODate;
  primaryGoal: PrimaryGoal;
  conditions: {
    pcos: boolean;
    endometriosis: boolean;
    perimenopause: boolean;
    earlyMenopause: boolean;
    /** Ménopause confirmée : tout saignement déclenche un signal d'attention rapide (§4.9). */
    menopauseConfirmed?: boolean;
    pregnant: boolean;
    postpartum: boolean;
    breastfeeding: boolean;
  };
  pregnancyStart?: ISODate;
  deliveryDate?: ISODate;
  typicalCycleLength: number;
  typicalPeriodLength: number;
  lutealLengthOverride?: number;
  historicalPeriodStarts?: ISODate[];
  /** Le spotting seul compte-t-il comme début de règles ? (§4.2, réglage utilisateur) */
  countSpottingAsPeriodStart?: boolean;
}

export interface PainData {
  intensity?: number; // 0–10
  locations?: string[];
  types?: string[];
  functionalImpact?: FunctionalImpact;
}

export interface DailyEntry {
  date: ISODate;
  menstruation?: { isStart?: boolean; isEnd?: boolean };
  flow?: FlowLevel;
  pain?: PainData;
  energy?: Scale5;
  mood?: { states?: string[]; score?: Scale5 };
  libido?: Scale5;
  bbt?: { celsius: number; time?: string; method?: 'oral' | 'vaginal' | 'rectal'; reliable?: boolean };
  cervicalMucus?: MucusType;
  ovulationTest?: 'negative' | 'positive';
  activity?: { type: string; minutes?: number; rpe?: number }[];
  sleep?: { hours?: number; quality?: Scale5; awakenings?: number };
  stress?: Scale5;
  hydration?: number;
  weightKg?: number;
  /** Jour de plaquette / prise de pilule (suivi optionnel, §3.2.4). */
  pillTaken?: boolean;
  /** Journal alimentaire du jour (module Nutrition V2, §N). */
  nutrition?: NutritionLog;
  customValues?: Record<string, boolean | number | string | string[]>;
  notes?: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface CustomSymptom {
  id: UUID;
  name: string;
  inputType: 'boolean' | 'scale' | 'multi' | 'text';
  options?: string[];
  icon?: string;
  color?: string;
  active: boolean;
  order: number;
}

export interface CalendarEvent {
  id: UUID;
  date: ISODate;
  type: 'medical' | 'travel' | 'medication' | 'custom';
  title: string;
  notes?: string;
  reminder?: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  periodUpcoming: { on: boolean; daysBefore: number };
  periodToday: { on: boolean };
  periodLate: { on: boolean; daysAfter: number };
  fertileWindow: { on: boolean };
  pill: { on: boolean; time?: string };
  hydration: { on: boolean; times?: string[] };
  sport: { on: boolean; days?: string[]; time?: string };
  journal: { on: boolean; time?: string };
  bbt: { on: boolean; time?: string };
  quietHours?: { start: string; end: string };
}

export interface DashboardWidgetSetting {
  id: string;
  visible: boolean;
  order: number;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  locale: 'fr' | 'en';
  units: { temperature: 'C' | 'F'; weight: 'kg' | 'lb'; height: 'cm' | 'in' };
  trackedCategories: Record<string, { active: boolean; order: number }>;
  dashboardWidgets: DashboardWidgetSetting[];
  notifications: NotificationSettings;
  security: { appLock: boolean; pinHash?: string; pinSalt?: string };
  showPredictions: boolean;
  reducedMotion?: boolean;
  /** États d'humeur personnalisés créés depuis le MoodPicker (annexe A.3). */
  customMoodStates?: string[];
  /** Signaux d'attention masqués ponctuellement (id de signal, §4.9). */
  dismissedSignals?: string[];
}

export interface ConsentRecord {
  acceptedDisclaimer: boolean;
  acceptedAt: ISODateTime;
  disclaimerVersion: string;
}

export interface AppData {
  schemaVersion: number;
  profile: Profile;
  dailyEntries: Record<ISODate, DailyEntry>;
  customSymptoms: CustomSymptom[];
  events: CalendarEvent[];
  settings: Settings;
  consent: ConsentRecord;
  meta: { createdAt: ISODateTime; updatedAt: ISODateTime; appVersion: string };
}

/* ---------- Modèles dérivés (jamais persistés, §11.3) ---------- */

export interface Cycle {
  id: string;
  startDate: ISODate;
  endDate?: ISODate;
  length?: number;
  periodLength?: number;
  isClosed: boolean;
  ovulationEstimated?: ISODate;
  /** Confirmée rétrospectivement par BBT ou test LH (§4.5/4.6). */
  ovulationConfirmed?: ISODate;
  ovulationConfirmedBy?: 'bbt' | 'lh';
}

export type ConfidenceLabel = 'low' | 'moderate' | 'high';

export interface ConfidenceScore {
  value: number; // 0..1
  percent: number;
  label: ConfidenceLabel;
  /** Facteurs explicables affichés dans la fiche de prédiction (§4.8). */
  factors: { key: string; impact: 'up' | 'down' }[];
}

export interface PeriodPrediction {
  expectedStartDate: ISODate;
  rangeStart: ISODate;
  rangeEnd: ISODate;
  wideRangeStart: ISODate;
  wideRangeEnd: ISODate;
  daysUntil: number;
  confidence: ConfidenceScore;
  /** Longueur estimée L̂ utilisée (explicabilité). */
  estimatedLength: number;
  basedOnCycles: number;
}

export interface OvulationPrediction {
  estimatedDate: ISODate;
  fertileWindowStart: ISODate;
  fertileWindowEnd: ISODate;
  confidence: ConfidenceScore;
}

export interface CycleStats {
  n: number;
  mean: number;
  median: number;
  sd: number;
  p10: number;
  p90: number;
  ewma: number;
  meanPeriod: number;
  luteal: number;
  /** Pente (j/cycle) de la régression linéaire sur les longueurs récentes (§4.7). */
  trendSlope: number;
  regularity: 'regular' | 'moderate' | 'irregular';
}

export type SignalType =
  | 'short_cycles'
  | 'long_cycles'
  | 'amenorrhea'
  | 'heavy_bleeding'
  | 'intermenstrual_bleeding'
  | 'severe_pain'
  | 'postmenopausal_bleeding'
  | 'variability_change';

export interface AttentionSignal {
  id: string;
  type: SignalType;
  severity: 'info' | 'attention';
  /** Clé i18n du message — le contenu est sourcé côté M16. */
  messageKey: string;
  detectedAt: ISODate;
}

export type EvidenceLevel = 'A' | 'B' | 'C' | 'D';

export interface Recommendation {
  id: string;
  phase: CyclePhase | 'any';
  category:
    | 'activity'
    | 'nutrition'
    | 'micronutrients'
    | 'hydration'
    | 'sleep'
    | 'stress'
    | 'productivity'
    | 'sexuality'
    | 'wellbeing'
    | 'fertility';
  profileTags: string[];
  title: Record<'fr' | 'en', string>;
  body: Record<'fr' | 'en', string>;
  evidenceLevel: EvidenceLevel;
  sourceRefs: string[];
  contraindicationTags: string[];
}

export interface PhaseInfo {
  phase: CyclePhase;
  dayOfCycle: number;
  confidence: ConfidenceScore;
}

export interface PredictionAccuracy {
  n: number;
  meanAbsErrorDays: number;
  meanSignedErrorDays: number;
}

export interface ScheduledNotification {
  id: string; // déterministe : type + date (idempotence, annexe D)
  type: string;
  fireAt: ISODateTime;
  title: string;
  body: string;
}

export interface Snapshot {
  id: string;
  createdAt: ISODateTime;
  reason: 'manual' | 'import' | 'erase' | 'migration' | 'merge';
  data: AppData;
}
