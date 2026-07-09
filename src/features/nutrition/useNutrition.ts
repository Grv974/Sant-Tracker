import { useMemo } from 'react';
import { useDerived } from '@/hooks/useDerived';
import { useToday } from '@/hooks/useToday';
import { FOODS } from '@/content/nutrition/foods.generated';
import { NUTRITION_ADVICE } from '@/content/nutrition/advice';
import {
  dayNutrition,
  estimateLowMicronutrients,
  isNutritionTrendDown,
  selectNutritionAdvice,
  type DayNutrition,
} from '@/domain/nutrition';
import { profileTags } from '@/domain/recommendations';
import type { NutritionAdvice, Micronutrient } from '@/content/nutrition/types';
import type { FoodItem } from '@/data/food/types';

export const foodsById = new Map<string, FoodItem>(FOODS.map((f) => [f.id, f]));

export interface NutritionState {
  today: string;
  dayNutrition: DayNutrition;
  advice: NutritionAdvice[];
  lowMicronutrients: Micronutrient[];
  trendDown: boolean;
}

/** Contexte nutrition du jour : score, conseils sélectionnés, micronutriments possiblement bas. */
export function useNutrition(maxAdvice = 3): NutritionState | null {
  const state = useDerived();
  const today = useToday();
  const data = state?.data ?? null;
  const derived = state?.derived ?? null;

  return useMemo(() => {
    if (!data || !derived) return null;
    const entry = data.dailyEntries[today];
    const day = dayNutrition(entry?.nutrition, foodsById);
    const lows = estimateLowMicronutrients(data.dailyEntries, foodsById, today);
    const trendDown = isNutritionTrendDown(data.dailyEntries, foodsById, today);
    const advice = selectNutritionAdvice(NUTRITION_ADVICE, {
      phase: derived.phase?.phase ?? null,
      profileTags: profileTags(data.profile).filter((t) => t !== 'all'),
      dayBand: day.band,
      trendDown,
      lowMicronutrients: lows,
      maxTotal: maxAdvice,
    });
    return { today, dayNutrition: day, advice, lowMicronutrients: lows, trendDown };
  }, [data, derived, today, maxAdvice]);
}
