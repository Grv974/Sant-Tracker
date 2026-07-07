import type { Cycle, CycleStats, ISODate, PredictionAccuracy, Profile } from '@/types/models';
import { addDays, diffDays } from './dates';
import { cycleStats } from './cycle';
import { estimatedLength } from './prediction';

/**
 * Auto-évaluation de la précision (§4.10) : pour chaque cycle fermé, rejoue la prédiction
 * qui aurait été faite avec les seuls cycles antérieurs, puis mesure l'écart signé (jours)
 * avec la date réelle. Statistique descriptive, entièrement explicable.
 */
export function predictionAccuracy(
  cycles: Cycle[],
  profile: Profile,
  window = 6,
): PredictionAccuracy | null {
  const closed = cycles.filter((c) => c.isClosed && c.length !== undefined);
  const errors: number[] = [];
  for (let i = 1; i < closed.length; i++) {
    const history = closed.slice(0, i);
    if (history.length < 2) continue; // avant 2 cycles, la prédiction vient de l'onboarding
    const stats: CycleStats = cycleStats(history, profile);
    const lastStart = (history.at(-1) as Cycle).startDate;
    const predicted: ISODate = addDays(lastStart, Math.round(estimatedLength(stats, profile)));
    const actual = (closed[i] as Cycle).startDate;
    errors.push(diffDays(actual, predicted));
  }
  const recent = errors.slice(-window);
  if (recent.length === 0) return null;
  const meanSigned = recent.reduce((a, b) => a + b, 0) / recent.length;
  const meanAbs = recent.reduce((a, b) => a + Math.abs(b), 0) / recent.length;
  return {
    n: recent.length,
    meanAbsErrorDays: Math.round(meanAbs * 10) / 10,
    meanSignedErrorDays: Math.round(meanSigned * 10) / 10,
  };
}
