import { describe, expect, it } from 'vitest';
import { getAppMode, getModeBehavior, gestationalWeeks, isContinuousHormonal } from '../modes';
import { makeProfile } from '@/tests/fixtures';

describe('matrice profil → comportement (annexe F)', () => {
  it('grossesse : prédictions et phases suspendues (§17.11)', () => {
    const p = makeProfile({ conditions: { ...makeProfile().conditions, pregnant: true } });
    expect(getAppMode(p, false)).toBe('pregnancy');
    const b = getModeBehavior(p, false);
    expect(b.periodPrediction).toBe(false);
    expect(b.fertileWindow).toBe(false);
    expect(b.phaseDisplay).toBe(false);
  });

  it('post-partum : suspendu tant qu’aucun cycle post-partum, réactivé ensuite', () => {
    const p = makeProfile({ conditions: { ...makeProfile().conditions, postpartum: true } });
    expect(getModeBehavior(p, false).periodPrediction).toBe(false);
    expect(getModeBehavior(p, true).periodPrediction).toBe(true);
  });

  it('contraception hormonale continue : ovulation/fenêtre masquées (§3.2.4)', () => {
    for (const c of ['implant', 'injection', 'hormonal_iud', 'progestin_pill'] as const) {
      expect(isContinuousHormonal(c)).toBe(true);
      const b = getModeBehavior(makeProfile({ contraception: c }), false);
      expect(b.ovulationPrediction).toBe(false);
      expect(b.phaseDisplay).toBe(false);
    }
  });

  it('pilule combinée : vocabulaire « saignement de privation », pas d’ovulation', () => {
    const b = getModeBehavior(makeProfile({ contraception: 'combined_pill' }), false);
    expect(b.periodPrediction).toBe(true);
    expect(b.withdrawalBleedVocabulary).toBe(true);
    expect(b.ovulationPrediction).toBe(false);
  });

  it('DIU cuivre et barrière : prédictions normales', () => {
    for (const c of ['copper_iud', 'condom', 'none'] as const) {
      const b = getModeBehavior(makeProfile({ contraception: c }), false);
      expect(b.periodPrediction).toBe(true);
      expect(b.ovulationPrediction).toBe(true);
    }
  });

  it('semaines d’aménorrhée', () => {
    expect(gestationalWeeks('2025-01-01', '2025-03-01')).toEqual({ weeks: 8, days: 3 });
    expect(gestationalWeeks('2025-01-01', '2025-01-01')).toEqual({ weeks: 0, days: 0 });
  });
});
