/**
 * Machine d'états de l'onboarding (annexe B) : réducteur typé, testable sans UI.
 * SKIP est interdit sur O2 ; NEXT y est gardé par le consentement.
 */

export type OnboardingState = 'O1' | 'O2' | 'O3' | 'O4' | 'O5' | 'O6' | 'O7' | 'completed';

export type OnboardingEvent =
  | { type: 'NEXT' }
  | { type: 'SKIP' }
  | { type: 'BACK' }
  | { type: 'IMPORT_SUCCESS' };

const ORDER: OnboardingState[] = ['O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7', 'completed'];

export interface OnboardingContext {
  consent: boolean;
}

export function onboardingReducer(
  state: OnboardingState,
  event: OnboardingEvent,
  ctx: OnboardingContext,
): OnboardingState {
  const index = ORDER.indexOf(state);
  switch (event.type) {
    case 'NEXT':
      if (state === 'O2' && !ctx.consent) return state; // garde (annexe B)
      return ORDER[Math.min(index + 1, ORDER.length - 1)] as OnboardingState;
    case 'SKIP':
      if (state === 'O2') return state; // interdit
      return ORDER[Math.min(index + 1, ORDER.length - 1)] as OnboardingState;
    case 'BACK':
      return ORDER[Math.max(index - 1, 0)] as OnboardingState;
    case 'IMPORT_SUCCESS':
      return state === 'O1' ? 'completed' : state;
  }
}

export function stepNumber(state: OnboardingState): number {
  return Math.min(ORDER.indexOf(state) + 1, 7);
}
