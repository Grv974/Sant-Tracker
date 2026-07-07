import type { Profile } from '@/types/models';

/**
 * Matrice profil → comportement (annexe F). Détermine ce qui est affiché/calculé
 * selon contraception, grossesse, post-partum, périménopause…
 */

export type AppMode = 'standard' | 'pregnancy' | 'postpartum' | 'continuous_contraception';

/** Contraceptions hormonales continues supprimant généralement le cycle ovulatoire (§3.2.4). */
const CONTINUOUS_HORMONAL: Profile['contraception'][] = [
  'implant',
  'injection',
  'hormonal_iud',
  'progestin_pill',
];

export function isContinuousHormonal(contraception: Profile['contraception']): boolean {
  return CONTINUOUS_HORMONAL.includes(contraception);
}

/** Pilule combinée : saignements de privation, vocabulaire adapté (§3.2.4). */
export function isWithdrawalBleedContraception(c: Profile['contraception']): boolean {
  return c === 'combined_pill' || c === 'patch' || c === 'ring';
}

export function getAppMode(profile: Profile, hasPostpartumCycle: boolean): AppMode {
  if (profile.conditions.pregnant) return 'pregnancy';
  if (profile.conditions.postpartum && !hasPostpartumCycle) return 'postpartum';
  if (isContinuousHormonal(profile.contraception)) return 'continuous_contraception';
  return 'standard';
}

export interface ModeBehavior {
  periodPrediction: boolean;
  ovulationPrediction: boolean;
  phaseDisplay: boolean;
  fertileWindow: boolean;
  /** Vocabulaire « saignement de privation » plutôt que « règles » (§3.2.4). */
  withdrawalBleedVocabulary: boolean;
}

export function getModeBehavior(profile: Profile, hasPostpartumCycle: boolean): ModeBehavior {
  const mode = getAppMode(profile, hasPostpartumCycle);
  const withdrawal = isWithdrawalBleedContraception(profile.contraception);
  if (mode === 'pregnancy' || mode === 'postpartum') {
    return {
      periodPrediction: false,
      ovulationPrediction: false,
      phaseDisplay: false,
      fertileWindow: false,
      withdrawalBleedVocabulary: false,
    };
  }
  if (mode === 'continuous_contraception') {
    return {
      periodPrediction: false,
      ovulationPrediction: false,
      phaseDisplay: false,
      fertileWindow: false,
      withdrawalBleedVocabulary: false,
    };
  }
  return {
    periodPrediction: true,
    ovulationPrediction: !withdrawal,
    phaseDisplay: true,
    fertileWindow: !withdrawal,
    withdrawalBleedVocabulary: withdrawal,
  };
}

/** Semaines d'aménorrhée (mode grossesse, §3.2.5) — indicatif uniquement. */
export function gestationalWeeks(pregnancyStart: string, today: string): { weeks: number; days: number } {
  const diff = Math.max(0, Math.floor((Date.parse(today) - Date.parse(pregnancyStart)) / 86_400_000));
  return { weeks: Math.floor(diff / 7), days: diff % 7 };
}
