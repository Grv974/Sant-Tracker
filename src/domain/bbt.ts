import type { Cycle, DailyEntry, ISODate } from '@/types/models';
import { PREDICTION_CONFIG as CFG } from '@/constants/prediction.config';
import { addDays, compareISODates } from './dates';
import { mean } from './stats';

export interface BBTPoint {
  date: ISODate;
  celsius: number;
  reliable: boolean;
}

export interface ThermalShift {
  /** Ovulation probable = veille du premier jour élevé (§4.6). */
  ovulationEstimated: ISODate;
  shiftStart: ISODate;
  baseline: number;
}

export function extractBBTSeries(entriesByDate: Record<ISODate, DailyEntry>): BBTPoint[] {
  return Object.values(entriesByDate)
    .filter((e) => e.bbt !== undefined)
    .map((e) => ({ date: e.date, celsius: e.bbt!.celsius, reliable: e.bbt!.reliable !== false }))
    .sort((a, b) => compareISODates(a.date, b.date));
}

/**
 * Détection rétrospective du décalage thermique — « règle des 3 sur 6 » (§4.6, annexe C.4) :
 * baseline = moyenne des 6 dernières BBT fiables ; 3 jours consécutifs > baseline + 0,2 °C,
 * dont au moins un ≥ baseline + 0,3 °C. Jamais une prédiction anticipée.
 */
export function detectThermalShift(series: BBTPoint[]): ThermalShift | null {
  const reliable = series.filter((p) => p.reliable);
  for (let i = CFG.BBT_BASELINE_DAYS; i <= reliable.length - CFG.BBT_SHIFT_DAYS; i++) {
    const baselineWindow = reliable.slice(i - CFG.BBT_BASELINE_DAYS, i);
    const baseline = mean(baselineWindow.map((p) => p.celsius));
    const triplet = reliable.slice(i, i + CFG.BBT_SHIFT_DAYS);
    const allAbove = triplet.every((p) => p.celsius > baseline + CFG.BBT_SHIFT_DELTA);
    const oneStrong = triplet.some((p) => p.celsius >= baseline + CFG.BBT_SHIFT_STRONG);
    if (allAbove && oneStrong) {
      const first = triplet[0] as BBTPoint;
      return {
        ovulationEstimated: addDays(first.date, -1),
        shiftStart: first.date,
        baseline,
      };
    }
  }
  return null;
}

/** Décalage thermique par cycle (marqueurs de courbe/calendrier). */
export function detectThermalShiftPerCycle(
  cycles: Cycle[],
  series: BBTPoint[],
): Map<string, ThermalShift> {
  const result = new Map<string, ThermalShift>();
  for (const cycle of cycles) {
    const end = cycle.endDate ?? '9999-12-31';
    const inCycle = series.filter((p) => p.date >= cycle.startDate && p.date <= end);
    const shift = detectThermalShift(inCycle);
    if (shift) result.set(cycle.id, shift);
  }
  return result;
}

/**
 * Ovulations confirmées rétrospectivement (BBT prioritaire, sinon test LH positif + 1 jour, §4.5).
 * Retourne une copie enrichie des cycles.
 */
export function confirmOvulations(
  cycles: Cycle[],
  entriesByDate: Record<ISODate, DailyEntry>,
): Cycle[] {
  const series = extractBBTSeries(entriesByDate);
  const shifts = detectThermalShiftPerCycle(cycles, series);
  const lhPositives = Object.values(entriesByDate)
    .filter((e) => e.ovulationTest === 'positive')
    .map((e) => e.date)
    .sort(compareISODates);

  return cycles.map((cycle) => {
    const shift = shifts.get(cycle.id);
    if (shift) return { ...cycle, ovulationConfirmed: shift.ovulationEstimated, ovulationConfirmedBy: 'bbt' as const };
    const end = cycle.endDate ?? '9999-12-31';
    const lh = lhPositives.find((d) => d >= cycle.startDate && d <= end);
    // LH+ → ovulation probable dans les 24–36 h (§4.5) : on marque le lendemain.
    if (lh) return { ...cycle, ovulationConfirmed: addDays(lh, 1), ovulationConfirmedBy: 'lh' as const };
    return cycle;
  });
}
