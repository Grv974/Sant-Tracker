import type { AttentionSignal, Cycle, CycleStats, DailyEntry, ISODate, Profile } from '@/types/models';
import { PREDICTION_CONFIG as CFG } from '@/constants/prediction.config';
import { addDays, diffDays } from './dates';
import { flowRank } from './cycle';
import { isContinuousHormonal } from './modes';
import { std } from './stats';

const A = CFG.ANOMALY;

/**
 * Détecteur de signaux d'attention (§4.9) : informatifs, jamais diagnostiques.
 * Chaque signal a un id stable (type + date de détection) pour permettre le masquage ponctuel.
 */
export function detectAnomalies(
  cycles: Cycle[],
  entriesByDate: Record<ISODate, DailyEntry>,
  _stats: CycleStats,
  profile: Profile,
  today: ISODate,
): AttentionSignal[] {
  const signals: AttentionSignal[] = [];
  const closed = cycles.filter((c) => c.isClosed && c.length !== undefined);
  const recent = closed.slice(-6);
  const push = (type: AttentionSignal['type'], severity: AttentionSignal['severity'], anchor: ISODate) =>
    signals.push({ id: `${type}:${anchor}`, type, severity, messageKey: `signals.${type}`, detectedAt: anchor });

  // Cycles courts / longs récurrents
  const shortOnes = recent.filter((c) => (c.length as number) < A.SHORT_CYCLE_DAYS);
  if (shortOnes.length >= A.RECURRENT_COUNT) push('short_cycles', 'attention', (shortOnes.at(-1) as Cycle).startDate);
  const longOnes = recent.filter((c) => (c.length as number) > A.LONG_CYCLE_DAYS);
  if (longOnes.length >= A.RECURRENT_COUNT) push('long_cycles', 'attention', (longOnes.at(-1) as Cycle).startDate);

  // Aménorrhée > 90 j (hors grossesse / contraception continue / ménopause)
  const lastStart = cycles.at(-1)?.startDate;
  const exempt =
    profile.conditions.pregnant ||
    profile.conditions.menopauseConfirmed ||
    isContinuousHormonal(profile.contraception) ||
    profile.conditions.postpartum;
  if (lastStart && !exempt && diffDays(today, lastStart) > A.AMENORRHEA_DAYS) {
    push('amenorrhea', 'attention', today);
  }

  // Saignements très abondants : flooding ≥ 2 jours (fenêtre récente) ou règles > 7 j récurrentes
  const floodingDays = Object.values(entriesByDate).filter(
    (e) => e.flow === 'flooding' && diffDays(today, e.date) <= 60,
  );
  const longPeriods = recent.filter((c) => (c.periodLength ?? 0) > A.LONG_PERIOD_DAYS);
  if (floodingDays.length >= A.FLOODING_DAYS || longPeriods.length >= 2) {
    push('heavy_bleeding', 'attention', floodingDays.at(-1)?.date ?? today);
  }

  // Saignements intermenstruels récurrents : flux ≥ light hors fenêtre menstruelle sur ≥ 2 cycles récents
  let intermenstrualCycles = 0;
  let lastIntermenstrual: ISODate | null = null;
  for (const c of recent) {
    const periodEnd = addDays(c.startDate, (c.periodLength ?? 5) - 1);
    const end = c.endDate as ISODate;
    let found = false;
    for (let d = addDays(periodEnd, 2); d <= end; d = addDays(d, 1)) {
      const e = entriesByDate[d];
      if (e && flowRank(e.flow) >= flowRank('light')) {
        found = true;
        lastIntermenstrual = d;
      }
    }
    if (found) intermenstrualCycles += 1;
  }
  if (intermenstrualCycles >= 2 && lastIntermenstrual) push('intermenstrual_bleeding', 'attention', lastIntermenstrual);

  // Douleur invalidante récurrente (30 derniers jours)
  const impossibleDays = Object.values(entriesByDate).filter(
    (e) => e.pain?.functionalImpact === 'impossible' && diffDays(today, e.date) <= 30,
  );
  if (impossibleDays.length >= 2) push('severe_pain', 'attention', (impossibleDays.at(-1) as DailyEntry).date);

  // Saignement post-ménopausique : avis médical rapide (§4.9)
  if (profile.conditions.menopauseConfirmed) {
    const bleed = Object.values(entriesByDate).find(
      (e) => flowRank(e.flow) >= flowRank('light') && diffDays(today, e.date) <= 90,
    );
    if (bleed) push('postmenopausal_bleeding', 'attention', bleed.date);
  }

  // Variabilité en forte hausse : σ des 3 derniers vs σ des précédents
  if (closed.length >= 6) {
    const lengths = closed.map((c) => c.length as number);
    const older = std(lengths.slice(0, -3));
    const newer = std(lengths.slice(-3));
    if (newer > older * 2 && newer > 5) push('variability_change', 'info', (closed.at(-1) as Cycle).startDate);
  }

  return signals;
}
