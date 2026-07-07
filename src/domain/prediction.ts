import type {
  ConfidenceScore,
  Cycle,
  CycleStats,
  DailyEntry,
  ISODate,
  OvulationPrediction,
  PeriodPrediction,
  PhaseInfo,
  Profile,
} from '@/types/models';
import { PREDICTION_CONFIG as CFG } from '@/constants/prediction.config';
import { addDays, diffDays } from './dates';
import { clamp } from './stats';
import { dayOfCycle, findCycleForDate } from './cycle';

/** Perturbations récentes (stress fort, maladie, voyage) sur les 7 derniers jours (§4.8). */
export function hasRecentPerturbation(
  entriesByDate: Record<ISODate, DailyEntry>,
  events: { date: ISODate; type: string }[],
  today: ISODate,
): boolean {
  for (let i = 0; i < 7; i++) {
    const d = addDays(today, -i);
    const e = entriesByDate[d];
    if (e?.stress !== undefined && e.stress >= 4) return true;
  }
  return events.some((ev) => ev.type === 'travel' && Math.abs(diffDays(today, ev.date)) <= 7);
}

function ageFromBirthYear(birthYear: number | undefined, today: ISODate): number | undefined {
  if (birthYear === undefined) return undefined;
  return Number(today.slice(0, 4)) - birthYear;
}

export interface ConfidenceContext {
  profile: Profile;
  today: ISODate;
  recentPerturbation: boolean;
  /** Signes physiologiques concordants (BBT/LH confirmés récemment). */
  physiologicalConcordance?: boolean;
}

/** Score de confiance explicable (§4.8, annexe C.3). */
export function confidenceScore(stats: CycleStats, ctx: ConfidenceContext): ConfidenceScore {
  const factors: ConfidenceScore['factors'] = [];
  const lHat = estimatedLength(stats, ctx.profile);
  const sdEff = Math.max(stats.sd, CFG.SD_MIN);

  const base = clamp(1 - sdEff / Math.max(lHat, 1), 0, 1);
  const dataFactor = clamp(stats.n / CFG.CONFIDENCE.DATA_CYCLES_FULL, 0, 1);

  if (stats.n >= 6) factors.push({ key: 'history_rich', impact: 'up' });
  else if (stats.n < 3) factors.push({ key: 'history_short', impact: 'down' });
  if (stats.regularity === 'regular' && stats.n >= 3) factors.push({ key: 'regular_cycles', impact: 'up' });
  if (stats.regularity !== 'regular') factors.push({ key: 'irregular_cycles', impact: 'down' });

  let penalty = 0;
  const c = ctx.profile.conditions;
  if (c.pcos) {
    penalty += CFG.CONFIDENCE.PENALTY_PCOS;
    factors.push({ key: 'pcos', impact: 'down' });
  }
  if (c.perimenopause || c.earlyMenopause) {
    penalty += CFG.CONFIDENCE.PENALTY_PERIMENOPAUSE;
    factors.push({ key: 'perimenopause', impact: 'down' });
  }
  if (c.postpartum) {
    penalty += CFG.CONFIDENCE.PENALTY_POSTPARTUM;
    factors.push({ key: 'postpartum', impact: 'down' });
  }
  const age = ageFromBirthYear(ctx.profile.birthYear, ctx.today);
  if (age !== undefined && age < 18) {
    penalty += CFG.CONFIDENCE.PENALTY_ADOLESCENCE;
    factors.push({ key: 'adolescence', impact: 'down' });
  }
  if (ctx.recentPerturbation) {
    penalty += CFG.CONFIDENCE.PENALTY_PERTURBATION;
    factors.push({ key: 'perturbation', impact: 'down' });
  }
  if (
    ctx.profile.contraceptionChangedAt &&
    diffDays(ctx.today, ctx.profile.contraceptionChangedAt) <= CFG.ANOMALY.CONTRACEPTION_CHANGE_WINDOW
  ) {
    penalty += CFG.CONFIDENCE.PENALTY_CONTRACEPTION_CHANGE;
    factors.push({ key: 'contraception_change', impact: 'down' });
  }
  penalty = Math.min(penalty, CFG.CONFIDENCE.PENALTY_MAX);

  let score = clamp(CFG.CONFIDENCE.BASE_WEIGHT * base + CFG.CONFIDENCE.DATA_WEIGHT * dataFactor - penalty, 0, 1);
  if (ctx.physiologicalConcordance) {
    score = clamp(score + 0.05, 0, 1);
    factors.push({ key: 'physio_concordant', impact: 'up' });
  }
  // Plafonds par profil (§3.2.7, §3.2.9)
  if (c.pcos) score = Math.min(score, CFG.CONFIDENCE.CAP_PCOS);
  if (c.perimenopause || c.earlyMenopause) score = Math.min(score, CFG.CONFIDENCE.CAP_PERIMENOPAUSE);

  const label = score >= CFG.CONFIDENCE.HIGH_THRESHOLD ? 'high' : score >= CFG.CONFIDENCE.MODERATE_THRESHOLD ? 'moderate' : 'low';
  return { value: score, percent: Math.round(score * 100), label, factors };
}

/** L̂ = w·EWMA + (1−w)·μ, médiane privilégiée en forte irrégularité, tendance intégrée (§4.4, §4.7). */
export function estimatedLength(stats: CycleStats, profile: Profile): number {
  if (stats.n < 2) return profile.typicalCycleLength || 28;
  let lHat =
    stats.regularity === 'irregular' || profile.conditions.pcos
      ? stats.median
      : CFG.EWMA_WEIGHT * stats.ewma + (1 - CFG.EWMA_WEIGHT) * stats.mean;
  // Tendance significative (périménopause) : prolonger la pente d'un cycle (§4.7).
  if (stats.n >= 4 && Math.abs(stats.trendSlope) >= 0.8) lHat += stats.trendSlope;
  return clamp(lHat, CFG.VALIDATION.CYCLE_MIN, CFG.VALIDATION.CYCLE_MAX);
}

/** k d'élargissement de plage selon l'irrégularité (§4.7). */
function irregularityK(stats: CycleStats, profile: Profile): { k: number; kWide: number } {
  const highVariability =
    stats.regularity === 'irregular' || profile.conditions.pcos || profile.conditions.perimenopause;
  if (highVariability) return { k: CFG.K_WIDE, kWide: 2.2 };
  if (stats.regularity === 'moderate') return { k: 1.2, kWide: 1.9 };
  return { k: CFG.K_PROBABLE, kWide: CFG.K_WIDE };
}

export function predictNextPeriod(
  lastCycleStart: ISODate,
  stats: CycleStats,
  ctx: ConfidenceContext,
): PeriodPrediction {
  const lHat = estimatedLength(stats, ctx.profile);
  const sdEff = stats.n >= 2 ? Math.max(stats.sd, CFG.SD_MIN) : 3; // sans historique : incertitude franche
  const { k, kWide } = irregularityK(stats, ctx.profile);
  const expected = addDays(lastCycleStart, Math.round(lHat));
  return {
    expectedStartDate: expected,
    rangeStart: addDays(lastCycleStart, Math.round(lHat - k * sdEff)),
    rangeEnd: addDays(lastCycleStart, Math.round(lHat + k * sdEff)),
    wideRangeStart: addDays(lastCycleStart, Math.round(lHat - kWide * sdEff)),
    wideRangeEnd: addDays(lastCycleStart, Math.round(lHat + kWide * sdEff)),
    daysUntil: diffDays(expected, ctx.today),
    confidence: confidenceScore(stats, ctx),
    estimatedLength: lHat,
    basedOnCycles: stats.n,
  };
}

/** Ovulation par recul lutéal depuis les règles prévues — jamais « J14 » (§4.5). */
export function predictOvulation(
  periodPrediction: PeriodPrediction,
  stats: CycleStats,
  _ctx: ConfidenceContext,
): OvulationPrediction {
  const estimated = addDays(periodPrediction.expectedStartDate, -stats.luteal);
  const base = periodPrediction.confidence;
  const value = clamp(base.value * CFG.CONFIDENCE.OVULATION_FACTOR, 0, 1);
  const label = value >= CFG.CONFIDENCE.HIGH_THRESHOLD ? 'high' : value >= CFG.CONFIDENCE.MODERATE_THRESHOLD ? 'moderate' : 'low';
  return {
    estimatedDate: estimated,
    fertileWindowStart: addDays(estimated, -CFG.FERTILE_BEFORE),
    fertileWindowEnd: addDays(estimated, CFG.FERTILE_AFTER),
    confidence: {
      value,
      percent: Math.round(value * 100),
      label,
      factors: [...base.factors, { key: 'ovulation_uncertain', impact: 'down' }],
    },
  };
}

/** Phase courante estimée (§5.2). */
export function getPhaseForDate(
  date: ISODate,
  cycles: Cycle[],
  ovulation: OvulationPrediction | null,
  stats: CycleStats,
  ctx: ConfidenceContext,
): PhaseInfo | null {
  const cycle = findCycleForDate(cycles, date);
  if (!cycle) return null;
  const day = dayOfCycle(cycle, date);
  if (day < 1) return null;

  const periodLen = cycle.periodLength ?? Math.max(1, Math.round(stats.meanPeriod) || ctx.profile.typicalPeriodLength || 5);
  // Ovulation de référence pour CE cycle : confirmée > recul lutéal sur la fin réelle/prévue.
  let ovulationDate: ISODate | null = cycle.ovulationConfirmed ?? cycle.ovulationEstimated ?? null;
  if (!ovulationDate) {
    if (cycle.isClosed && cycle.endDate) ovulationDate = addDays(cycle.endDate, -(stats.luteal - 1));
    else if (ovulation) ovulationDate = ovulation.estimatedDate;
  }

  const confidence = confidenceScore(stats, ctx);
  let phase: PhaseInfo['phase'];
  if (day <= periodLen) phase = 'menstrual';
  else if (ovulationDate === null) phase = 'follicular';
  else {
    const delta = diffDays(date, ovulationDate);
    if (delta < -1) phase = 'follicular';
    else if (delta <= 1) phase = 'ovulatory';
    else phase = 'luteal';
  }
  return { phase, dayOfCycle: day, confidence };
}
