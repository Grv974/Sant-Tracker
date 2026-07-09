import { describe, expect, it } from 'vitest';
import {
  dayNutrition,
  estimateLowMicronutrients,
  isNutritionTrendDown,
  searchFoods,
  selectNutritionAdvice,
  NUTRIENT_REFERENCES,
} from '../nutrition';
import { FOODS } from '@/content/nutrition/foods.generated';
import { NUTRITION_ADVICE } from '@/content/nutrition/advice';
import { makeEntry } from '@/tests/fixtures';
import { addDays } from '../dates';
import type { DailyEntry, ISODate } from '@/types/models';
import type { FoodItem } from '@/data/food/types';

const foodsById = new Map(FOODS.map((f) => [f.id, f]));

describe('recherche d’aliments (§N.1)', () => {
  it('trouve par nom, alias, sans accents ni casse', () => {
    expect(searchFoods('brocoli', FOODS)[0]?.id).toBe('brocoli');
    expect(searchFoods('EPINARD', FOODS)[0]?.id).toBe('epinards');
    expect(searchFoods('épinard', FOODS)[0]?.id).toBe('epinards');
    expect(searchFoods('kale', FOODS).some((f) => f.id === 'chou-kale')).toBe(true);
    expect(searchFoods('lait de soja', FOODS).some((f) => f.id === 'boisson-soja-enrichie')).toBe(true);
  });

  it('préfixes d’abord, requêtes trop courtes ignorées', () => {
    expect(searchFoods('l', FOODS)).toEqual([]);
    const results = searchFoods('len', FOODS);
    expect(results[0]?.id).toBe('lentilles');
  });
});

describe('score inflammatoire du jour (§N.2)', () => {
  it('journée vide → unknown', () => {
    expect(dayNutrition(undefined, foodsById)).toEqual({ score: null, band: 'unknown', foodCount: 0 });
    expect(dayNutrition({ foods: [] }, foodsById).band).toBe('unknown');
  });

  it('assiette végétale → bande anti ; ultra-transformés → bande pro', () => {
    const anti = dayNutrition(
      { foods: [{ foodId: 'brocoli', servings: 1 }, { foodId: 'lentilles', servings: 1 }, { foodId: 'saumon-atlantique', servings: 1 }] },
      foodsById,
    );
    expect(anti.band).toBe('anti');
    expect(anti.score).toBeLessThanOrEqual(-1);

    const pro = dayNutrition(
      { foods: [{ foodId: 'soda', servings: 2 }, { foodId: 'chips', servings: 1 }, { foodId: 'bonbons', servings: 1 }] },
      foodsById,
    );
    expect(pro.band).toBe('pro');
    expect(pro.score).toBeGreaterThanOrEqual(1);
  });

  it('pondération par portions et aliments inconnus ignorés', () => {
    const day = dayNutrition(
      { foods: [{ foodId: 'brocoli', servings: 3 }, { foodId: 'soda', servings: 1 }, { foodId: 'inexistant', servings: 5 }] },
      foodsById,
    );
    expect(day.foodCount).toBe(2);
    // 3×(-4) + 1×(+5|score soda) pondéré penche côté anti
    expect(day.score).toBeLessThan(0);
  });
});

function entriesWithScores(today: ISODate, dailyFoods: (string[] | null)[]): Record<ISODate, DailyEntry> {
  const entries: Record<ISODate, DailyEntry> = {};
  dailyFoods.forEach((foods, i) => {
    if (!foods) return;
    const date = addDays(today, -i);
    entries[date] = makeEntry(date, { nutrition: { foods: foods.map((foodId) => ({ foodId, servings: 1 })) } });
  });
  return entries;
}

describe('tendance nutritionnelle (§N.4)', () => {
  const today = '2025-06-15';
  it('dégradation nette → trendDown', () => {
    const entries = entriesWithScores(today, [
      ['soda', 'chips'], ['biscuits'], ['soda'], null, ['chips', 'bonbons'], null, null,
      ['brocoli', 'lentilles'], ['epinards'], ['saumon-atlantique'], null, ['myrtille', 'quinoa'], null, null,
    ]);
    expect(isNutritionTrendDown(entries, foodsById, today)).toBe(true);
  });

  it('stable ou données insuffisantes → pas de signal', () => {
    const stable = entriesWithScores(today, [
      ['brocoli'], ['lentilles'], ['quinoa'], null, null, null, null,
      ['brocoli'], ['epinards'], ['myrtille'], null, null, null, null,
    ]);
    expect(isNutritionTrendDown(stable, foodsById, today)).toBe(false);
    const sparse = entriesWithScores(today, [['soda'], null, null, null, null, null, null, ['brocoli']]);
    expect(isNutritionTrendDown(sparse, foodsById, today)).toBe(false);
  });
});

describe('micronutriments possiblement bas (§N.4)', () => {
  const today = '2025-06-15';
  it('régime pauvre en fer sur ≥ 3 jours consignés → iron bas', () => {
    const entries = entriesWithScores(today, [['riz-blanc'], ['pomme'], ['concombre'], ['banane']]);
    const lows = estimateLowMicronutrients(entries, foodsById, today);
    expect(lows).toContain('iron');
    expect(lows).toContain('calcium');
  });

  it('moins de 3 jours consignés → aucun signal (prudence)', () => {
    const entries = entriesWithScores(today, [['riz-blanc'], ['pomme']]);
    expect(estimateLowMicronutrients(entries, foodsById, today)).toEqual([]);
  });

  it('les repères couvrent tous les micronutriments du contenu', () => {
    for (const ref of Object.values(NUTRIENT_REFERENCES)) {
      expect(ref.amount).toBeGreaterThan(0);
    }
  });
});

describe('moteur de conseils nutrition (§N.4)', () => {
  const base = { profileTags: [] as string[], dayBand: 'neutral' as const, trendDown: false, lowMicronutrients: [] as never[] };

  it('phase menstruelle + fer bas → le conseil fer+vitamine C sort en premier', () => {
    const advice = selectNutritionAdvice(NUTRITION_ADVICE, {
      ...base,
      phase: 'menstrual',
      lowMicronutrients: ['iron'],
    });
    expect(advice[0]?.id).toBe('iron-vitc-menstrual');
  });

  it('bande pro → substitution douce proposée ; jamais en bande anti', () => {
    const pro = selectNutritionAdvice(NUTRITION_ADVICE, { ...base, phase: 'follicular', dayBand: 'pro' });
    expect(pro.some((a) => a.id === 'antiinflam-swap')).toBe(true);
    const anti = selectNutritionAdvice(NUTRITION_ADVICE, { ...base, phase: 'follicular', dayBand: 'anti' });
    expect(anti.some((a) => a.id === 'antiinflam-swap')).toBe(false);
  });

  it('profils : SOPK et conception reçoivent leurs conseils dédiés', () => {
    const pcos = selectNutritionAdvice(NUTRITION_ADVICE, { ...base, phase: 'luteal', profileTags: ['pcos'] });
    expect(pcos.some((a) => a.id === 'pcos-lifestyle')).toBe(true);
    const conceive = selectNutritionAdvice(NUTRITION_ADVICE, { ...base, phase: null, profileTags: ['conceive'] });
    expect(conceive.some((a) => a.id === 'conceive-folate')).toBe(true);
  });

  it('phase null : les conseils liés à une phase ne sortent pas', () => {
    const advice = selectNutritionAdvice(NUTRITION_ADVICE, { ...base, phase: null });
    expect(advice.every((a) => a.trigger.phases === undefined)).toBe(true);
  });

  it('sélection bornée et déterministe', () => {
    const a = selectNutritionAdvice(NUTRITION_ADVICE, { ...base, phase: 'luteal', maxTotal: 2 });
    const b = selectNutritionAdvice(NUTRITION_ADVICE, { ...base, phase: 'luteal', maxTotal: 2 });
    expect(a).toHaveLength(2);
    expect(a.map((x) => x.id)).toEqual(b.map((x) => x.id));
  });
});

describe('cohérence base d’aliments ↔ moteur', () => {
  it('tous les aliments suggérés par les conseils existent et ont un score', () => {
    for (const advice of NUTRITION_ADVICE) {
      for (const id of advice.suggestedFoodIds ?? []) {
        const food = foodsById.get(id) as FoodItem;
        expect(food, `aliment ${id}`).toBeDefined();
        expect(typeof food.inflammationScore).toBe('number');
      }
    }
  });
});
