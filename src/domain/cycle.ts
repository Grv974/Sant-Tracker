import type { Cycle, CycleStats, DailyEntry, FlowLevel, ISODate, Profile } from '@/types/models';
import { PREDICTION_CONFIG as CFG } from '@/constants/prediction.config';
import { addDays, compareISODates, diffDays } from './dates';
import { clamp, ewma, linearTrendSlope, mean, median, percentile, std } from './stats';

const FLOW_RANK: Record<FlowLevel, number> = {
  none: 0,
  spotting: 1,
  light: 2,
  medium: 3,
  heavy: 4,
  flooding: 5,
};

export function flowRank(flow: FlowLevel | undefined): number {
  return flow ? FLOW_RANK[flow] : 0;
}

function isPeriodFlow(entry: DailyEntry | undefined, countSpotting: boolean): boolean {
  const min = countSpotting ? FLOW_RANK.spotting : FLOW_RANK.light;
  return flowRank(entry?.flow) >= min;
}

/**
 * Segmentation des cycles (§4.2) : un jour ouvre un cycle s'il porte un flux ≥ light
 * (ou ≥ spotting selon réglage) et qu'il est précédé d'au moins GAP_MIN jours sans flux de règles.
 * Les débuts historiques déclarés à l'onboarding (§3.2.11) sont fusionnés comme jours de règles virtuels.
 */
export function detectCycles(
  entriesByDate: Record<ISODate, DailyEntry>,
  options?: { countSpottingAsStart?: boolean; historicalStarts?: ISODate[] },
): Cycle[] {
  const countSpotting = options?.countSpottingAsStart ?? false;
  const flowDates = new Set<ISODate>();
  for (const [date, entry] of Object.entries(entriesByDate)) {
    if (isPeriodFlow(entry, countSpotting)) flowDates.add(date);
  }
  for (const d of options?.historicalStarts ?? []) flowDates.add(d);

  const sorted = [...flowDates].sort(compareISODates);

  /**
   * Un jour isolé de flux « light » sans marquage explicite « règles ont commencé »
   * n'ouvre pas de cycle : c'est très probablement un saignement intermenstruel,
   * qui doit alimenter le détecteur d'anomalies plutôt que scinder les cycles.
   * (Décision documentée — complète §4.2 sans la contredire : medium+ ou isStart suffisent.)
   */
  const qualifiesAsStart = (date: ISODate): boolean => {
    const entry = entriesByDate[date];
    if (!entry) return true; // début historique déclaré (§3.2.11)
    if (entry.menstruation?.isStart) return true;
    if (flowRank(entry.flow) >= FLOW_RANK.medium) return true;
    // opt-in explicite : tout flux (même spotting) compte comme début (§4.2)
    if (countSpotting && flowRank(entry.flow) >= FLOW_RANK.spotting) return true;
    return (
      isPeriodFlow(entriesByDate[addDays(date, 1)], countSpotting) ||
      isPeriodFlow(entriesByDate[addDays(date, -1)], countSpotting)
    );
  };

  const starts: ISODate[] = [];
  let lastFlowDate: ISODate | null = null;
  for (const date of sorted) {
    if ((lastFlowDate === null || diffDays(date, lastFlowDate) >= CFG.GAP_MIN) && qualifiesAsStart(date)) {
      starts.push(date);
    }
    lastFlowDate = date;
  }

  return starts.map((start, i) => {
    const nextStart = starts[i + 1];
    const isClosed = nextStart !== undefined;
    const length = isClosed ? diffDays(nextStart, start) : undefined;
    return {
      id: `cycle-${start}`,
      startDate: start,
      endDate: isClosed ? addDays(nextStart, -1) : undefined,
      length,
      periodLength: countLeadingFlowDays(entriesByDate, start, countSpotting),
      isClosed,
    };
  });
}

/** Durée des règles = série initiale de jours consécutifs avec flux (§3.3.3, §4.2). */
function countLeadingFlowDays(
  entriesByDate: Record<ISODate, DailyEntry>,
  start: ISODate,
  countSpotting: boolean,
): number | undefined {
  if (!isPeriodFlow(entriesByDate[start], countSpotting)) return undefined; // début historique sans saisie
  let count = 0;
  let date = start;
  for (;;) {
    const entry = entriesByDate[date];
    if (!isPeriodFlow(entry, countSpotting)) break;
    count += 1;
    if (entry?.menstruation?.isEnd) break; // fin marquée explicitement (§3.3.3)
    date = addDays(date, 1);
  }
  return count;
}

/** Longueurs lutéales observées via ovulations confirmées (BBT/LH), pour estimer LUT (§4.3). */
export function observedLutealLengths(cycles: Cycle[]): number[] {
  const out: number[] = [];
  for (const c of cycles) {
    if (c.isClosed && c.ovulationConfirmed && c.endDate) {
      const luteal = diffDays(c.endDate, c.ovulationConfirmed) + 1;
      if (luteal >= 5 && luteal <= 25) out.push(luteal);
    }
  }
  return out;
}

export function estimateLuteal(cycles: Cycle[], override?: number): number {
  if (override !== undefined) return clamp(override, CFG.LUTEAL_MIN, CFG.LUTEAL_MAX);
  const observed = observedLutealLengths(cycles);
  const value = observed.length > 0 ? mean(observed) : CFG.LUTEAL_DEFAULT;
  return clamp(Math.round(value), CFG.LUTEAL_MIN, CFG.LUTEAL_MAX);
}

/** Statistiques de cycle sur fenêtre glissante (§4.3), filtrées des longueurs invalides (§11.4). */
export function cycleStats(cycles: Cycle[], profile?: Pick<Profile, 'lutealLengthOverride'>): CycleStats {
  const closed = cycles
    .filter((c) => c.isClosed && c.length !== undefined)
    .filter((c) => (c.length as number) >= CFG.VALIDATION.CYCLE_MIN && (c.length as number) <= CFG.VALIDATION.CYCLE_MAX)
    .slice(-CFG.N_MAX);
  const lengths = closed.map((c) => c.length as number);
  const periods = closed.map((c) => c.periodLength).filter((p): p is number => p !== undefined);
  const sd = Math.max(std(lengths), lengths.length >= 2 ? CFG.SD_MIN : 0);
  const regularity: CycleStats['regularity'] =
    sd <= CFG.IRREGULAR_SD_MODERATE ? 'regular' : sd <= CFG.IRREGULAR_SD_HIGH ? 'moderate' : 'irregular';
  return {
    n: lengths.length,
    mean: mean(lengths),
    median: median(lengths),
    sd,
    p10: percentile(lengths, 10),
    p90: percentile(lengths, 90),
    ewma: ewma(lengths, CFG.EWMA_ALPHA),
    meanPeriod: periods.length > 0 ? mean(periods) : 0,
    luteal: estimateLuteal(cycles, profile?.lutealLengthOverride),
    trendSlope: linearTrendSlope(lengths),
    regularity,
  };
}

/** Jour de cycle (1-indexé) d'une date dans un cycle donné. */
export function dayOfCycle(cycle: Cycle, date: ISODate): number {
  return diffDays(date, cycle.startDate) + 1;
}

/** Cycle contenant une date (le dernier cycle ouvert absorbe le futur proche). */
export function findCycleForDate(cycles: Cycle[], date: ISODate): Cycle | undefined {
  for (let i = cycles.length - 1; i >= 0; i--) {
    const c = cycles[i] as Cycle;
    if (date >= c.startDate && (c.endDate === undefined || date <= c.endDate)) return c;
  }
  return undefined;
}
