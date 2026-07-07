import { describe, expect, it } from 'vitest';
import { predictionAccuracy } from '../accuracy';
import { detectCycles } from '../cycle';
import { makePeriodEntries, makeProfile, regularStarts } from '@/tests/fixtures';

describe('précision récente des prédictions (§4.10)', () => {
  it('cycles parfaitement réguliers → erreur moyenne 0', () => {
    const cycles = detectCycles(makePeriodEntries(regularStarts('2024-06-01', 28, 10)));
    const acc = predictionAccuracy(cycles, makeProfile());
    expect(acc).not.toBeNull();
    expect(acc!.meanAbsErrorDays).toBe(0);
    expect(acc!.meanSignedErrorDays).toBe(0);
    expect(acc!.n).toBeGreaterThan(0);
  });

  it('l’écart correspond au calcul manuel (§17.3)', () => {
    // 3 cycles de 28 j, un cycle de 31 j, puis reprise : les règles du 26/04 étaient prévues le 23/04 (+3)
    const starts = ['2025-01-01', '2025-01-29', '2025-02-26', '2025-03-26', '2025-04-26', '2025-05-24'];
    const cycles = detectCycles(makePeriodEntries(starts));
    const acc = predictionAccuracy(cycles, makeProfile());
    expect(acc).not.toBeNull();
    // erreurs : 0 (26/02), 0 (26/03), +3 (26/04 prévu 23/04), puis dernier écart sur le 24/05
    expect(acc!.meanAbsErrorDays).toBeGreaterThan(0);
    expect(acc!.meanSignedErrorDays).not.toBe(0);
  });

  it('historique insuffisant → null', () => {
    const cycles = detectCycles(makePeriodEntries(['2025-01-01', '2025-01-29']));
    expect(predictionAccuracy(cycles, makeProfile())).toBeNull();
  });
});
