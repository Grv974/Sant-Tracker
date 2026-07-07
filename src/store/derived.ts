import type {
  AppData,
  AttentionSignal,
  Cycle,
  CycleStats,
  ISODate,
  OvulationPrediction,
  PeriodPrediction,
  PhaseInfo,
  PredictionAccuracy,
} from '@/types/models';
import { detectCycles, cycleStats, findCycleForDate } from '@/domain/cycle';
import { confirmOvulations, detectThermalShiftPerCycle, extractBBTSeries, type ThermalShift } from '@/domain/bbt';
import {
  getPhaseForDate,
  hasRecentPerturbation,
  predictNextPeriod,
  predictOvulation,
  type ConfidenceContext,
} from '@/domain/prediction';
import { detectAnomalies } from '@/domain/anomalies';
import { predictionAccuracy } from '@/domain/accuracy';
import { getModeBehavior, type ModeBehavior } from '@/domain/modes';
import { PREDICTION_CONFIG as CFG } from '@/constants/prediction.config';
import { addDays, diffDays } from '@/domain/dates';

/**
 * Recalcul dérivé mémoïsé (§2.4) : cycles → stats → prédictions → phase → anomalies.
 * Un seul point de calcul, mémoïsé par références (dailyEntries, profile, events) + date du jour.
 */

export interface DerivedState {
  cycles: Cycle[];
  stats: CycleStats;
  currentCycle: Cycle | null;
  prediction: PeriodPrediction | null;
  ovulation: OvulationPrediction | null;
  phase: PhaseInfo | null;
  signals: AttentionSignal[];
  accuracy: PredictionAccuracy | null;
  behavior: ModeBehavior;
  thermalShifts: Map<string, ThermalShift>;
  /** Prévisions projetées sur plusieurs cycles pour le calendrier (§7.6). */
  forecasts: Forecast[];
  hasPostpartumCycle: boolean;
}

export interface Forecast {
  /** 1 = cycle suivant, 2 = celui d'après… (estompage croissant) */
  horizon: number;
  periodStart: ISODate;
  periodEnd: ISODate;
  rangeStart: ISODate;
  rangeEnd: ISODate;
  fertileStart: ISODate | null;
  fertileEnd: ISODate | null;
  ovulation: ISODate | null;
}

export function computeDerived(data: AppData, today: ISODate): DerivedState {
  const { profile, dailyEntries, events, settings } = data;

  const rawCycles = detectCycles(dailyEntries, {
    countSpottingAsStart: profile.countSpottingAsPeriodStart ?? false,
    historicalStarts: profile.historicalPeriodStarts ?? [],
  });
  const cycles = confirmOvulations(rawCycles, dailyEntries);
  const stats = cycleStats(cycles, profile);

  // Reprise post-partum : un cycle démarré après l'accouchement (§3.2.6).
  const hasPostpartumCycle =
    !profile.conditions.postpartum ||
    (profile.deliveryDate !== undefined && cycles.some((c) => c.startDate > (profile.deliveryDate as string)));
  const behavior = getModeBehavior(profile, hasPostpartumCycle);

  const lastCycle = cycles.at(-1) ?? null;
  const currentCycle = findCycleForDate(cycles, today) ?? lastCycle;

  const ctx: ConfidenceContext = {
    profile,
    today,
    recentPerturbation: hasRecentPerturbation(dailyEntries, events, today),
    physiologicalConcordance: cycles.slice(-3).some((c) => c.ovulationConfirmed !== undefined),
  };

  let prediction: PeriodPrediction | null = null;
  let ovulation: OvulationPrediction | null = null;
  const forecasts: Forecast[] = [];

  if (behavior.periodPrediction && lastCycle && settings.showPredictions) {
    prediction = predictNextPeriod(lastCycle.startDate, stats, ctx);
    if (behavior.ovulationPrediction) {
      ovulation = predictOvulation(prediction, stats, ctx);
    }
    // Projection multi-cycles pour le calendrier (§7.6)
    const periodLen = Math.max(1, Math.round(stats.meanPeriod) || profile.typicalPeriodLength || 5);
    let start = prediction.expectedStartDate;
    const lHat = Math.round(prediction.estimatedLength);
    const basePad = Math.max(diffDays(prediction.rangeEnd, prediction.expectedStartDate), 1);
    for (let h = 1; h <= CFG.CALENDAR_FORECAST_CYCLES; h++) {
      // L'incertitude croît avec l'horizon (≈ √h sous hypothèse d'indépendance des cycles).
      const rangePad = Math.round(basePad * Math.sqrt(h));
      const ovu = behavior.ovulationPrediction ? addDays(start, lHat - stats.luteal) : null;
      forecasts.push({
        horizon: h,
        periodStart: start,
        periodEnd: addDays(start, periodLen - 1),
        rangeStart: addDays(start, -rangePad),
        rangeEnd: addDays(start, rangePad),
        fertileStart: ovu ? addDays(ovu, -CFG.FERTILE_BEFORE) : null,
        fertileEnd: ovu ? addDays(ovu, CFG.FERTILE_AFTER) : null,
        ovulation: ovu,
      });
      start = addDays(start, lHat);
    }
  }

  const phase =
    behavior.phaseDisplay && currentCycle
      ? getPhaseForDate(today, cycles, ovulation, stats, ctx)
      : null;

  const allSignals = detectAnomalies(cycles, dailyEntries, stats, profile, today);
  const dismissed = new Set(settings.dismissedSignals ?? []);
  const signals = allSignals.filter((s) => !dismissed.has(s.id));

  return {
    cycles,
    stats,
    currentCycle,
    prediction,
    ovulation,
    phase,
    signals,
    accuracy: predictionAccuracy(cycles, profile),
    behavior,
    thermalShifts: detectThermalShiftPerCycle(cycles, extractBBTSeries(dailyEntries)),
    forecasts,
    hasPostpartumCycle,
  };
}

/* Mémoïsation par références : le recalcul n'a lieu que si les données pertinentes changent (§2.4). */
let memoKey: { entries: unknown; profile: unknown; events: unknown; settings: unknown; today: string } | null = null;
let memoValue: DerivedState | null = null;

export function computeDerivedMemo(data: AppData, today: ISODate): DerivedState {
  if (
    memoValue &&
    memoKey &&
    memoKey.entries === data.dailyEntries &&
    memoKey.profile === data.profile &&
    memoKey.events === data.events &&
    memoKey.settings === data.settings &&
    memoKey.today === today
  ) {
    return memoValue;
  }
  memoValue = computeDerived(data, today);
  memoKey = {
    entries: data.dailyEntries,
    profile: data.profile,
    events: data.events,
    settings: data.settings,
    today,
  };
  return memoValue;
}
