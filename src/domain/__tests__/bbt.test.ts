import { describe, expect, it } from 'vitest';
import { confirmOvulations, detectThermalShift, extractBBTSeries, type BBTPoint } from '../bbt';
import { detectCycles } from '../cycle';
import { addDays } from '../dates';
import { makeEntry, makePeriodEntries } from '@/tests/fixtures';
import type { DailyEntry, ISODate } from '@/types/models';

function series(values: [string, number, boolean?][]): BBTPoint[] {
  return values.map(([date, celsius, reliable]) => ({ date, celsius, reliable: reliable !== false }));
}

/** 6 jours de baseline à 36,4 puis 3 jours élevés. */
function shiftedSeries(highs: number[] = [36.65, 36.7, 36.75]): BBTPoint[] {
  const pts: [string, number][] = [];
  for (let i = 0; i < 6; i++) pts.push([addDays('2025-01-10', i), 36.4]);
  highs.forEach((v, i) => pts.push([addDays('2025-01-16', i), v]));
  return series(pts);
}

describe('décalage thermique (§4.6, règle des 3 sur 6)', () => {
  it('détecte 3 jours > +0,2 °C dont un ≥ +0,3 °C ; ovulation la veille', () => {
    const shift = detectThermalShift(shiftedSeries());
    expect(shift).not.toBeNull();
    expect(shift!.ovulationEstimated).toBe('2025-01-15');
    expect(shift!.baseline).toBeCloseTo(36.4, 5);
  });

  it('refuse si aucun jour n’atteint +0,3 °C', () => {
    expect(detectThermalShift(shiftedSeries([36.62, 36.63, 36.64]))).toBeNull();
  });

  it('refuse si un jour retombe sous +0,2 °C', () => {
    expect(detectThermalShift(shiftedSeries([36.7, 36.55, 36.75]))).toBeNull();
  });

  it('exclut les mesures peu fiables (§4.6)', () => {
    const pts = shiftedSeries();
    // la première mesure élevée est marquée non fiable → plus que 2 jours élevés consécutifs
    pts[6]!.reliable = false;
    expect(detectThermalShift(pts)).toBeNull();
  });

  it('série trop courte → null', () => {
    expect(detectThermalShift(series([['2025-01-01', 36.4], ['2025-01-02', 36.8]]))).toBeNull();
  });
});

describe('confirmation d’ovulation (§4.5)', () => {
  it('BBT : marque le cycle avec ovulationConfirmed', () => {
    const entries: Record<ISODate, DailyEntry> = makePeriodEntries(['2025-01-01', '2025-01-29']);
    for (let i = 0; i < 6; i++) {
      const d = addDays('2025-01-08', i);
      entries[d] = makeEntry(d, { bbt: { celsius: 36.4 } });
    }
    [36.68, 36.72, 36.7].forEach((v, i) => {
      const d = addDays('2025-01-14', i);
      entries[d] = makeEntry(d, { bbt: { celsius: v } });
    });
    const cycles = confirmOvulations(detectCycles(entries), entries);
    expect(cycles[0]!.ovulationConfirmed).toBe('2025-01-13');
    expect(cycles[0]!.ovulationConfirmedBy).toBe('bbt');
    expect(cycles[1]!.ovulationConfirmed).toBeUndefined();
  });

  it('LH positif : ovulation marquée le lendemain', () => {
    const entries = makePeriodEntries(['2025-01-01', '2025-01-29']);
    entries['2025-01-14'] = makeEntry('2025-01-14', { ovulationTest: 'positive' });
    const cycles = confirmOvulations(detectCycles(entries), entries);
    expect(cycles[0]!.ovulationConfirmed).toBe('2025-01-15');
    expect(cycles[0]!.ovulationConfirmedBy).toBe('lh');
  });

  it('extractBBTSeries trie et qualifie la fiabilité', () => {
    const entries: Record<ISODate, DailyEntry> = {
      '2025-01-02': makeEntry('2025-01-02', { bbt: { celsius: 36.5, reliable: false } }),
      '2025-01-01': makeEntry('2025-01-01', { bbt: { celsius: 36.4 } }),
    };
    const s = extractBBTSeries(entries);
    expect(s.map((p) => p.date)).toEqual(['2025-01-01', '2025-01-02']);
    expect(s[0]!.reliable).toBe(true);
    expect(s[1]!.reliable).toBe(false);
  });
});
