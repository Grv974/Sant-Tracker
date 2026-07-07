import { describe, expect, it } from 'vitest';
import { cycleStats, detectCycles } from '../cycle';
import {
  confidenceScore,
  estimatedLength,
  getPhaseForDate,
  hasRecentPerturbation,
  predictNextPeriod,
  predictOvulation,
  type ConfidenceContext,
} from '../prediction';
import { makeEntry, makePeriodEntries, makeProfile, regularStarts } from '@/tests/fixtures';
import { addDays, diffDays } from '../dates';

function ctx(overrides: Partial<ConfidenceContext> = {}): ConfidenceContext {
  return { profile: makeProfile(), today: '2025-06-01', recentPerturbation: false, ...overrides };
}

function regularSetup(cycleCount = 7, length = 28) {
  const entries = makePeriodEntries(regularStarts('2025-01-01', length, cycleCount));
  const cycles = detectCycles(entries);
  return { entries, cycles, stats: cycleStats(cycles), lastStart: cycles.at(-1)!.startDate };
}

describe('prédiction des règles (§4.4)', () => {
  it('prédit dernierJ1 + L̂ avec une plage, jamais une date sèche', () => {
    const { stats, lastStart } = regularSetup();
    const p = predictNextPeriod(lastStart, stats, ctx());
    expect(p.expectedStartDate).toBe(addDays(lastStart, 28));
    expect(p.rangeStart < p.expectedStartDate).toBe(true);
    expect(p.rangeEnd > p.expectedStartDate).toBe(true);
    expect(p.wideRangeStart <= p.rangeStart).toBe(true);
    expect(p.wideRangeEnd >= p.rangeEnd).toBe(true);
    expect(p.confidence.percent).toBeGreaterThan(0);
  });

  it('< 2 cycles : utilise la valeur d’onboarding (§4.4)', () => {
    const entries = makePeriodEntries(['2025-05-01']);
    const cycles = detectCycles(entries);
    const stats = cycleStats(cycles);
    const profile = makeProfile({ typicalCycleLength: 31 });
    const p = predictNextPeriod('2025-05-01', stats, ctx({ profile, today: '2025-05-10' }));
    expect(p.expectedStartDate).toBe('2025-06-01');
    expect(p.basedOnCycles).toBe(0);
  });

  it('≥ 2 cycles réels : s’appuie sur les données réelles (§17.3)', () => {
    const entries = makePeriodEntries(['2025-01-01', '2025-01-31', '2025-03-02']); // cycles de 30 j
    const stats = cycleStats(detectCycles(entries));
    const profile = makeProfile({ typicalCycleLength: 24 });
    const p = predictNextPeriod('2025-03-02', stats, ctx({ profile, today: '2025-03-10' }));
    expect(p.expectedStartDate).toBe(addDays('2025-03-02', 30));
  });

  it('σ plus élevé → plage plus large et score plus bas (§17.3)', () => {
    const regular = regularSetup();
    const irregularStarts = ['2025-01-01', '2025-01-25', '2025-03-05', '2025-04-01', '2025-05-14'];
    const irregularCycles = detectCycles(makePeriodEntries(irregularStarts));
    const irregularStats = cycleStats(irregularCycles);

    const pReg = predictNextPeriod(regular.lastStart, regular.stats, ctx());
    const pIrr = predictNextPeriod('2025-05-14', irregularStats, ctx());
    const widthReg = diffDays(pReg.rangeEnd, pReg.rangeStart);
    const widthIrr = diffDays(pIrr.rangeEnd, pIrr.rangeStart);
    expect(widthIrr).toBeGreaterThan(widthReg);
    expect(pIrr.confidence.value).toBeLessThan(pReg.confidence.value);
  });

  it('daysUntil est calculé depuis today', () => {
    const { stats, lastStart } = regularSetup(3);
    const today = addDays(lastStart, 10);
    const p = predictNextPeriod(lastStart, stats, ctx({ today }));
    expect(p.daysUntil).toBe(18);
  });

  it('tendance décroissante intégrée à L̂ (périménopause, §4.7)', () => {
    const stats = {
      ...cycleStats([]),
      n: 6,
      mean: 26,
      median: 26,
      sd: 1.5,
      ewma: 24.5,
      trendSlope: -1.2,
      regularity: 'regular' as const,
    };
    const lHat = estimatedLength(stats, makeProfile());
    expect(lHat).toBeLessThan(0.6 * 24.5 + 0.4 * 26); // la pente tire vers le bas
  });
});

describe('score de confiance (§4.8)', () => {
  it('aucune prédiction sans score ; facteurs explicables', () => {
    const { stats } = regularSetup();
    const s = confidenceScore(stats, ctx());
    expect(s.label).toBe('high');
    expect(s.percent).toBe(Math.round(s.value * 100));
    expect(s.factors.length).toBeGreaterThan(0);
  });

  it('historique court → confiance réduite', () => {
    const short = cycleStats(detectCycles(makePeriodEntries(['2025-01-01', '2025-01-29'])));
    const long = regularSetup(10).stats;
    const sShort = confidenceScore(short, ctx());
    const sLong = confidenceScore(long, ctx());
    expect(sShort.value).toBeLessThan(sLong.value);
    expect(sShort.factors.some((f) => f.key === 'history_short')).toBe(true);
  });

  it('SOPK plafonne le score (§3.2.7) ; périménopause plafonne plus fort (§3.2.9)', () => {
    const { stats } = regularSetup(10);
    const pcos = makeProfile({ conditions: { ...makeProfile().conditions, pcos: true } });
    const peri = makeProfile({ conditions: { ...makeProfile().conditions, perimenopause: true } });
    expect(confidenceScore(stats, ctx({ profile: pcos })).value).toBeLessThanOrEqual(0.6);
    expect(confidenceScore(stats, ctx({ profile: peri })).value).toBeLessThanOrEqual(0.5);
  });

  it('perturbation récente et changement de contraception pénalisent', () => {
    const { stats } = regularSetup(8);
    const base = confidenceScore(stats, ctx()).value;
    expect(confidenceScore(stats, ctx({ recentPerturbation: true })).value).toBeLessThan(base);
    const changed = makeProfile({ contraceptionChangedAt: '2025-05-20' });
    expect(confidenceScore(stats, ctx({ profile: changed })).value).toBeLessThan(base);
  });

  it('hasRecentPerturbation détecte stress fort et voyage', () => {
    const entries = { '2025-05-30': makeEntry('2025-05-30', { stress: 5 as const }) };
    expect(hasRecentPerturbation(entries, [], '2025-06-01')).toBe(true);
    expect(hasRecentPerturbation({}, [{ date: '2025-05-29', type: 'travel' }], '2025-06-01')).toBe(true);
    expect(hasRecentPerturbation({}, [], '2025-06-01')).toBe(false);
  });
});

describe('ovulation & fenêtre fertile (§4.5)', () => {
  it('recul lutéal, fenêtre de 6 jours, confiance plus basse que les règles', () => {
    const { stats, lastStart } = regularSetup();
    const p = predictNextPeriod(lastStart, stats, ctx());
    const o = predictOvulation(p, stats, ctx());
    expect(o.estimatedDate).toBe(addDays(p.expectedStartDate, -14));
    expect(o.fertileWindowStart).toBe(addDays(o.estimatedDate, -5));
    expect(o.fertileWindowEnd).toBe(addDays(o.estimatedDate, 1));
    expect(o.confidence.value).toBeLessThan(p.confidence.value);
    expect(o.confidence.factors.some((f) => f.key === 'ovulation_uncertain')).toBe(true);
  });
});

describe('phase courante (§5.2)', () => {
  it('menstruelle puis folliculaire, ovulatoire ±1, lutéale', () => {
    const { cycles, stats, lastStart } = regularSetup();
    const today = addDays(lastStart, 2);
    const c = ctx({ today });
    const p = predictNextPeriod(lastStart, stats, c);
    const o = predictOvulation(p, stats, c);
    expect(getPhaseForDate(addDays(lastStart, 1), cycles, o, stats, c)?.phase).toBe('menstrual');
    expect(getPhaseForDate(addDays(lastStart, 7), cycles, o, stats, c)?.phase).toBe('follicular');
    expect(getPhaseForDate(o.estimatedDate, cycles, o, stats, c)?.phase).toBe('ovulatory');
    expect(getPhaseForDate(addDays(o.estimatedDate, 3), cycles, o, stats, c)?.phase).toBe('luteal');
    expect(getPhaseForDate(addDays(lastStart, 3), cycles, o, stats, c)?.dayOfCycle).toBe(4);
  });

  it('cycle fermé : ovulation par recul sur la fin réelle', () => {
    const { cycles, stats } = regularSetup(3);
    const c = ctx({ today: '2025-02-10' });
    // cycle 1 : 2025-01-01 → 2025-01-28, ovulation ≈ 28-13 = J15
    const info = getPhaseForDate('2025-01-25', cycles, null, stats, c);
    expect(info?.phase).toBe('luteal');
  });

  it('hors de tout cycle → null', () => {
    const { cycles, stats } = regularSetup(3);
    expect(getPhaseForDate('2024-01-01', cycles, null, stats, ctx())).toBeNull();
  });
});
