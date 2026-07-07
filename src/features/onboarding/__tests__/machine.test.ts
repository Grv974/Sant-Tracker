import { describe, expect, it } from 'vitest';
import { onboardingReducer, type OnboardingState } from '../machine';

describe('machine d’onboarding (annexe B)', () => {
  it('NEXT parcourt O1 → completed', () => {
    let s: OnboardingState = 'O1';
    const ctx = { consent: true };
    const seq: OnboardingState[] = [];
    for (let i = 0; i < 7; i++) {
      s = onboardingReducer(s, { type: 'NEXT' }, ctx);
      seq.push(s);
    }
    expect(seq).toEqual(['O2', 'O3', 'O4', 'O5', 'O6', 'O7', 'completed']);
  });

  it('NEXT refusé sur O2 sans consentement (§17.1)', () => {
    expect(onboardingReducer('O2', { type: 'NEXT' }, { consent: false })).toBe('O2');
    expect(onboardingReducer('O2', { type: 'NEXT' }, { consent: true })).toBe('O3');
  });

  it('SKIP impossible sur O2, possible ailleurs (§17.1, §17.J)', () => {
    expect(onboardingReducer('O2', { type: 'SKIP' }, { consent: false })).toBe('O2');
    expect(onboardingReducer('O3', { type: 'SKIP' }, { consent: true })).toBe('O4');
    expect(onboardingReducer('O1', { type: 'SKIP' }, { consent: false })).toBe('O2');
  });

  it('BACK remonte sans sortir de O1', () => {
    expect(onboardingReducer('O3', { type: 'BACK' }, { consent: true })).toBe('O2');
    expect(onboardingReducer('O1', { type: 'BACK' }, { consent: false })).toBe('O1');
  });

  it('IMPORT depuis O1 saute à completed (§17.J)', () => {
    expect(onboardingReducer('O1', { type: 'IMPORT_SUCCESS' }, { consent: false })).toBe('completed');
    expect(onboardingReducer('O3', { type: 'IMPORT_SUCCESS' }, { consent: true })).toBe('O3');
  });
});
