import { describe, expect, it } from 'vitest';
import { cycleStats, detectCycles, dayOfCycle, estimateLuteal, findCycleForDate, flowRank } from '../cycle';
import { makeEntry, makePeriodEntries, regularStarts } from '@/tests/fixtures';
import type { Cycle } from '@/types/models';

describe('détection des cycles (§4.2)', () => {
  it('segmente des cycles réguliers de 28 jours', () => {
    const entries = makePeriodEntries(regularStarts('2025-01-01', 28, 4));
    const cycles = detectCycles(entries);
    expect(cycles).toHaveLength(4);
    expect(cycles.slice(0, 3).every((c) => c.isClosed && c.length === 28)).toBe(true);
    const last = cycles.at(-1)!;
    expect(last.isClosed).toBe(false);
    expect(last.length).toBeUndefined();
    expect(cycles[0]!.endDate).toBe('2025-01-28');
    expect(cycles[0]!.periodLength).toBe(5);
  });

  it('le spotting seul ne compte pas comme début (§3.3.4)', () => {
    const entries = makePeriodEntries(['2025-01-01'], 5);
    const spot = makeEntry('2025-01-20', { flow: 'spotting' as const });
    entries['2025-01-20'] = spot;
    expect(detectCycles(entries)).toHaveLength(1);
    // sauf si le réglage l'autorise
    expect(detectCycles(entries, { countSpottingAsStart: true })).toHaveLength(2);
  });

  it('GAP_MIN évite de scinder un épisode menstruel troué', () => {
    const entries = makePeriodEntries(['2025-01-01'], 3);
    // jour creux puis reprise du flux à J5 : même épisode
    entries['2025-01-05'] = makeEntry('2025-01-05', { flow: 'medium' });
    expect(detectCycles(entries)).toHaveLength(1);
    // reprise ≥ GAP_MIN jours après le dernier flux : nouveau cycle
    entries['2025-01-16'] = makeEntry('2025-01-16', { flow: 'medium' });
    expect(detectCycles(entries)).toHaveLength(2);
  });

  it('les données manquantes n’invalident pas la détection', () => {
    // seuls deux jours de flux saisis, à 30 jours d'écart
    const entries = {
      ...makePeriodEntries(['2025-01-01'], 1),
      ...makePeriodEntries(['2025-01-31'], 1),
    };
    const cycles = detectCycles(entries);
    expect(cycles).toHaveLength(2);
    expect(cycles[0]!.length).toBe(30);
  });

  it('fusionne les débuts historiques déclarés (§3.2.11)', () => {
    const entries = makePeriodEntries(['2025-03-01'], 5);
    const cycles = detectCycles(entries, { historicalStarts: ['2025-01-05', '2025-02-02'] });
    expect(cycles).toHaveLength(3);
    expect(cycles[0]!.length).toBe(28);
    expect(cycles[0]!.periodLength).toBeUndefined(); // pas de saisie réelle
  });

  it('respecte la fin marquée explicitement (§3.3.3)', () => {
    const entries = makePeriodEntries(['2025-01-01'], 6);
    entries['2025-01-04'] = makeEntry('2025-01-04', { flow: 'light', menstruation: { isEnd: true } });
    const cycles = detectCycles(entries);
    expect(cycles[0]!.periodLength).toBe(4);
  });

  it('flowRank ordonne les intensités', () => {
    expect(flowRank('none')).toBeLessThan(flowRank('spotting'));
    expect(flowRank('spotting')).toBeLessThan(flowRank('light'));
    expect(flowRank('heavy')).toBeLessThan(flowRank('flooding'));
    expect(flowRank(undefined)).toBe(0);
  });
});

describe('statistiques de cycle (§4.3)', () => {
  it('calcule μ, médiane, σ, EWMA, percentiles', () => {
    const entries = makePeriodEntries(regularStarts('2025-01-01', 28, 7));
    const stats = cycleStats(detectCycles(entries));
    expect(stats.n).toBe(6);
    expect(stats.mean).toBe(28);
    expect(stats.median).toBe(28);
    expect(stats.sd).toBe(1); // σ_min = 1 : jamais 0 (§4.4)
    expect(stats.ewma).toBe(28);
    expect(stats.meanPeriod).toBe(5);
    expect(stats.regularity).toBe('regular');
  });

  it('classe l’irrégularité selon σ (§4.7)', () => {
    const starts = ['2025-01-01', '2025-01-29', '2025-03-10', '2025-04-02', '2025-05-20'];
    const stats = cycleStats(detectCycles(makePeriodEntries(starts)));
    expect(stats.sd).toBeGreaterThan(7);
    expect(stats.regularity).toBe('irregular');
  });

  it('exclut les longueurs hors bornes de validation (§11.4)', () => {
    // un « cycle » de 200 jours (aménorrhée) ne doit pas polluer les stats
    const starts = ['2024-06-01', '2025-01-01', '2025-01-29', '2025-02-26'];
    const stats = cycleStats(detectCycles(makePeriodEntries(starts)));
    expect(stats.n).toBe(2);
    expect(stats.mean).toBe(28);
  });

  it('estimateLuteal : défaut 14, borné 11–16, override respecté', () => {
    expect(estimateLuteal([])).toBe(14);
    expect(estimateLuteal([], 9)).toBe(11);
    expect(estimateLuteal([], 20)).toBe(16);
    const cycles: Cycle[] = [
      {
        id: 'c1',
        startDate: '2025-01-01',
        endDate: '2025-01-28',
        length: 28,
        isClosed: true,
        ovulationConfirmed: '2025-01-16',
      },
    ];
    expect(estimateLuteal(cycles)).toBe(13); // 28 - 16 + 1
  });

  it('dayOfCycle et findCycleForDate', () => {
    const cycles = detectCycles(makePeriodEntries(regularStarts('2025-01-01', 28, 2)));
    const c1 = cycles[0]!;
    expect(dayOfCycle(c1, '2025-01-01')).toBe(1);
    expect(dayOfCycle(c1, '2025-01-15')).toBe(15);
    expect(findCycleForDate(cycles, '2025-01-20')?.id).toBe(c1.id);
    expect(findCycleForDate(cycles, '2025-02-05')?.id).toBe(cycles[1]!.id);
    expect(findCycleForDate(cycles, '2024-12-31')).toBeUndefined();
  });
});
