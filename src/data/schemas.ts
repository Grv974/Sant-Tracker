import { z } from 'zod';
import { PREDICTION_CONFIG as CFG } from '@/constants/prediction.config';
import { isValidISODate } from '@/domain/dates';

/** Validation Zod (§11.4) : bornes strictes, rejet explicite — jamais d'échec silencieux. */

const isoDate = z.string().refine(isValidISODate, { message: 'Date invalide (attendu YYYY-MM-DD)' });
const isoDateTime = z.string();
const scale5 = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);

export const flowLevelSchema = z.enum(['none', 'spotting', 'light', 'medium', 'heavy', 'flooding']);

export const contraceptionSchema = z.enum([
  'none',
  'combined_pill',
  'progestin_pill',
  'hormonal_iud',
  'copper_iud',
  'implant',
  'injection',
  'patch',
  'ring',
  'condom',
  'fertility_awareness',
  'other',
]);

export const bbtSchema = z.object({
  celsius: z
    .number()
    .min(CFG.VALIDATION.BBT_MIN, `Température invraisemblable (< ${CFG.VALIDATION.BBT_MIN} °C)`)
    .max(CFG.VALIDATION.BBT_MAX, `Température invraisemblable (> ${CFG.VALIDATION.BBT_MAX} °C)`),
  time: z.string().optional(),
  method: z.enum(['oral', 'vaginal', 'rectal']).optional(),
  reliable: z.boolean().optional(),
});

export const dailyEntrySchema = z.object({
  date: isoDate,
  menstruation: z.object({ isStart: z.boolean().optional(), isEnd: z.boolean().optional() }).optional(),
  flow: flowLevelSchema.optional(),
  pain: z
    .object({
      intensity: z.number().min(0).max(10).optional(),
      locations: z.array(z.string()).optional(),
      types: z.array(z.string()).optional(),
      functionalImpact: z.enum(['none', 'mild', 'limited', 'impossible']).optional(),
    })
    .optional(),
  energy: scale5.optional(),
  mood: z.object({ states: z.array(z.string()).optional(), score: scale5.optional() }).optional(),
  libido: scale5.optional(),
  bbt: bbtSchema.optional(),
  cervicalMucus: z.enum(['dry', 'sticky', 'creamy', 'watery', 'eggwhite']).optional(),
  ovulationTest: z.enum(['negative', 'positive']).optional(),
  activity: z
    .array(
      z.object({
        type: z.string(),
        minutes: z.number().min(0).max(1440).optional(),
        rpe: z.number().min(1).max(10).optional(),
      }),
    )
    .optional(),
  sleep: z
    .object({
      hours: z.number().min(0).max(24).optional(),
      quality: scale5.optional(),
      awakenings: z.number().min(0).max(50).optional(),
    })
    .optional(),
  stress: scale5.optional(),
  hydration: z.number().min(0).max(50).optional(),
  weightKg: z.number().min(20).max(400).optional(),
  pillTaken: z.boolean().optional(),
  nutrition: z
    .object({
      foods: z.array(
        z.object({
          foodId: z.string().min(1),
          servings: z.number().min(0.25).max(20),
        }),
      ),
    })
    .optional(),
  customValues: z
    .record(z.string(), z.union([z.boolean(), z.number(), z.string(), z.array(z.string())]))
    .optional(),
  notes: z.string().max(10_000).optional(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

export const profileSchema = z.object({
  birthYear: z.number().min(1930).max(2100).optional(),
  heightCm: z.number().min(80).max(260).nullable().optional(),
  weightKg: z.number().min(20).max(400).nullable().optional(),
  trackWeight: z.boolean(),
  contraception: contraceptionSchema,
  contraceptionChangedAt: isoDate.optional(),
  primaryGoal: z.enum(['understand', 'predict', 'conceive', 'condition', 'perimenopause', 'postpartum']),
  conditions: z.object({
    pcos: z.boolean(),
    endometriosis: z.boolean(),
    perimenopause: z.boolean(),
    earlyMenopause: z.boolean(),
    menopauseConfirmed: z.boolean().optional(),
    pregnant: z.boolean(),
    postpartum: z.boolean(),
    breastfeeding: z.boolean(),
  }),
  pregnancyStart: isoDate.optional(),
  deliveryDate: isoDate.optional(),
  typicalCycleLength: z.number().min(15).max(90),
  typicalPeriodLength: z.number().min(1).max(15),
  lutealLengthOverride: z.number().min(5).max(25).optional(),
  historicalPeriodStarts: z.array(isoDate).optional(),
  countSpottingAsPeriodStart: z.boolean().optional(),
});

export const customSymptomSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(60),
  inputType: z.enum(['boolean', 'scale', 'multi', 'text']),
  options: z.array(z.string()).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  active: z.boolean(),
  order: z.number(),
});

export const calendarEventSchema = z.object({
  id: z.string().min(1),
  date: isoDate,
  type: z.enum(['medical', 'travel', 'medication', 'custom']),
  title: z.string().min(1).max(120),
  notes: z.string().max(2000).optional(),
  reminder: z.boolean().optional(),
});

export const notificationSettingsSchema = z.object({
  enabled: z.boolean(),
  periodUpcoming: z.object({ on: z.boolean(), daysBefore: z.number().min(0).max(7) }),
  periodToday: z.object({ on: z.boolean() }),
  periodLate: z.object({ on: z.boolean(), daysAfter: z.number().min(1).max(14) }),
  fertileWindow: z.object({ on: z.boolean() }),
  pill: z.object({ on: z.boolean(), time: z.string().optional() }),
  hydration: z.object({ on: z.boolean(), times: z.array(z.string()).optional() }),
  sport: z.object({ on: z.boolean(), days: z.array(z.string()).optional(), time: z.string().optional() }),
  journal: z.object({ on: z.boolean(), time: z.string().optional() }),
  bbt: z.object({ on: z.boolean(), time: z.string().optional() }),
  quietHours: z.object({ start: z.string(), end: z.string() }).optional(),
});

export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  locale: z.enum(['fr', 'en']),
  units: z.object({
    temperature: z.enum(['C', 'F']),
    weight: z.enum(['kg', 'lb']),
    height: z.enum(['cm', 'in']),
  }),
  trackedCategories: z.record(z.string(), z.object({ active: z.boolean(), order: z.number() })),
  dashboardWidgets: z.array(z.object({ id: z.string(), visible: z.boolean(), order: z.number() })),
  notifications: notificationSettingsSchema,
  security: z.object({ appLock: z.boolean(), pinHash: z.string().optional(), pinSalt: z.string().optional() }),
  showPredictions: z.boolean(),
  reducedMotion: z.boolean().optional(),
  customMoodStates: z.array(z.string()).optional(),
  dismissedSignals: z.array(z.string()).optional(),
});

export const appDataSchema = z.object({
  schemaVersion: z.number().int().min(1),
  profile: profileSchema,
  dailyEntries: z.record(isoDate, dailyEntrySchema),
  customSymptoms: z.array(customSymptomSchema),
  events: z.array(calendarEventSchema),
  settings: settingsSchema,
  consent: z.object({
    acceptedDisclaimer: z.boolean(),
    acceptedAt: z.string(),
    disclaimerVersion: z.string(),
  }),
  meta: z.object({ createdAt: isoDateTime, updatedAt: isoDateTime, appVersion: z.string() }),
});

/** En-tête de fichier d'export (§12.2). */
export const backupFileSchema = z.object({
  format: z.literal('lunative-backup'),
  schemaVersion: z.number().int().min(1),
  exportedAt: z.string(),
  data: z.unknown(),
});

/** Export chiffré (§15.2). */
export const encryptedBackupFileSchema = z.object({
  format: z.literal('lunative-backup-encrypted'),
  schemaVersion: z.number().int().min(1),
  exportedAt: z.string(),
  kdf: z.literal('PBKDF2-SHA256'),
  iterations: z.number().int().min(100_000),
  salt: z.string(),
  iv: z.string(),
  ciphertext: z.string(),
});

export type ValidationIssue = { path: string; message: string };

export function validateAppData(data: unknown): { ok: true; data: z.infer<typeof appDataSchema> } | { ok: false; issues: ValidationIssue[] } {
  const result = appDataSchema.safeParse(data);
  if (result.success) return { ok: true, data: result.data };
  return {
    ok: false,
    issues: result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
  };
}
