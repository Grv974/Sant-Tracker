import { useAppStore } from '@/store/appStore';
import { computeDerivedMemo, type DerivedState } from '@/store/derived';
import { useToday } from './useToday';
import type { AppData } from '@/types/models';

/** Accès aux dérivés (cycles, prédictions, phase…) — mémoïsé, jamais recalculé sans changement. */
export function useDerived(): { data: AppData; derived: DerivedState } | null {
  const data = useAppStore((s) => s.data);
  const today = useToday();
  if (!data) return null;
  return { data, derived: computeDerivedMemo(data, today) };
}
