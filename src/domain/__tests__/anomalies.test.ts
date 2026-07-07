import { describe, expect, it } from 'vitest';
import { detectAnomalies } from '../anomalies';
import { cycleStats, detectCycles } from '../cycle';
import { makeEntry, makePeriodEntries, makeProfile, regularStarts } from '@/tests/fixtures';
import { addDays } from '../dates';
import type { ISODate, DailyEntry } from '@/types/models';

function run(
  entries: Record<ISODate, DailyEntry>,
  today: ISODate,
  profile = makeProfile(),
) {
  const cycles = detectCycles(entries);
  return detectAnomalies(cycles, entries, cycleStats(cycles), profile, today);
}

describe('détecteur de signaux d’attention (§4.9)', () => {
  it('3 cycles > 45 j → signal cycles longs (§17.4)', () => {
    const entries = makePeriodEntries(regularStarts('2025-01-01', 50, 4));
    const signals = run(entries, '2025-06-10');
    expect(signals.some((s) => s.type === 'long_cycles')).toBe(true);
  });

  it('3 cycles < 21 j → signal cycles courts', () => {
    const entries = makePeriodEntries(regularStarts('2025-01-01', 18, 4), 3);
    expect(run(entries, '2025-03-01').some((s) => s.type === 'short_cycles')).toBe(true);
  });

  it('aménorrhée > 90 j hors exemptions (§17.4)', () => {
    const entries = makePeriodEntries(['2025-01-01']);
    expect(run(entries, '2025-04-15').some((s) => s.type === 'amenorrhea')).toBe(true);
    // pas de signal en grossesse
    const pregnant = makeProfile({ conditions: { ...makeProfile().conditions, pregnant: true } });
    expect(run(entries, '2025-04-15', pregnant).some((s) => s.type === 'amenorrhea')).toBe(false);
    // ni sous contraception hormonale continue
    const implant = makeProfile({ contraception: 'implant' });
    expect(run(entries, '2025-04-15', implant).some((s) => s.type === 'amenorrhea')).toBe(false);
    // ni à 89 jours
    expect(run(entries, '2025-03-30').some((s) => s.type === 'amenorrhea')).toBe(false);
  });

  it('flooding ≥ 2 jours → saignements abondants (§3.3.4)', () => {
    const entries = makePeriodEntries(['2025-05-01'], 5, 'flooding');
    expect(run(entries, '2025-05-10').some((s) => s.type === 'heavy_bleeding')).toBe(true);
  });

  it('règles > 7 j récurrentes → saignements abondants', () => {
    const entries = makePeriodEntries(regularStarts('2025-01-01', 28, 4), 9);
    expect(run(entries, '2025-04-20').some((s) => s.type === 'heavy_bleeding')).toBe(true);
  });

  it('saignements intermenstruels récurrents', () => {
    const entries = makePeriodEntries(regularStarts('2025-01-01', 28, 4));
    // flux en milieu de cycle sur 2 cycles
    entries['2025-01-15'] = makeEntry('2025-01-15', { flow: 'light' });
    entries['2025-02-12'] = makeEntry('2025-02-12', { flow: 'light' });
    expect(run(entries, '2025-04-01').some((s) => s.type === 'intermenstrual_bleeding')).toBe(true);
  });

  it('douleur invalidante récurrente', () => {
    const entries = makePeriodEntries(['2025-05-01']);
    entries['2025-05-03'] = makeEntry('2025-05-03', { pain: { functionalImpact: 'impossible' } });
    entries['2025-05-10'] = makeEntry('2025-05-10', { pain: { functionalImpact: 'impossible' } });
    expect(run(entries, '2025-05-15').some((s) => s.type === 'severe_pain')).toBe(true);
  });

  it('saignement post-ménopausique → signal rapide (§17.11)', () => {
    const profile = makeProfile({
      conditions: { ...makeProfile().conditions, menopauseConfirmed: true },
    });
    const entries = makePeriodEntries(['2025-05-01'], 2);
    expect(run(entries, '2025-05-05', profile).some((s) => s.type === 'postmenopausal_bleeding')).toBe(true);
  });

  it('variabilité en forte hausse', () => {
    const starts = [
      '2025-01-01',
      addDays('2025-01-01', 28),
      addDays('2025-01-01', 56),
      addDays('2025-01-01', 84),
      // puis chaos
      addDays('2025-01-01', 104),
      addDays('2025-01-01', 149),
      addDays('2025-01-01', 170),
    ];
    const entries = makePeriodEntries(starts);
    expect(run(entries, '2025-07-15').some((s) => s.type === 'variability_change')).toBe(true);
  });

  it('les signaux ont des ids stables (masquage ponctuel, §17.4)', () => {
    const entries = makePeriodEntries(regularStarts('2025-01-01', 50, 4));
    const a = run(entries, '2025-06-10');
    const b = run(entries, '2025-06-10');
    expect(a.map((s) => s.id)).toEqual(b.map((s) => s.id));
  });

  it('aucun signal sur un profil régulier sain', () => {
    const entries = makePeriodEntries(regularStarts('2025-01-01', 28, 5));
    expect(run(entries, addDays('2025-01-01', 5 * 28 - 10))).toEqual([]);
  });
});
