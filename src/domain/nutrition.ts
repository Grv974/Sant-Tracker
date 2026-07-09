import type { CyclePhase, DailyEntry, ISODate } from '@/types/models';
import type { FoodItem, NutritionLog } from '@/data/food/types';
import type { Band, Micronutrient, NutritionAdvice } from '@/content/nutrition/types';
import { addDays } from './dates';
import { mean } from './stats';

/**
 * Domaine nutrition (spec V2 §N.2–N.4) — pur et déterministe.
 * Le score du jour est une moyenne pondérée des scores inflammatoires des aliments
 * consignés (−5 anti … +5 pro). Bandes : ≤ −1 « anti », ≥ +1 « pro », sinon « neutre ».
 * Ce sont des repères descriptifs, jamais des jugements.
 */

export const BAND_THRESHOLDS = { anti: -1, pro: 1 } as const;

/** Repères quotidiens indicatifs (ANSES/EFSA, femmes adultes) — comparaison descriptive uniquement. */
export const NUTRIENT_REFERENCES: Record<Micronutrient, { amount: number; unit: string; per100gKey: keyof FoodItem['per100g'] }> = {
  iron: { amount: 16, unit: 'mg', per100gKey: 'iron_mg' },
  calcium: { amount: 950, unit: 'mg', per100gKey: 'calcium_mg' },
  magnesium: { amount: 360, unit: 'mg', per100gKey: 'magnesium_mg' },
  vitaminB6: { amount: 1.6, unit: 'mg', per100gKey: 'vitaminB6_mg' },
  vitaminD: { amount: 15, unit: 'µg', per100gKey: 'vitaminD_ug' },
  folate: { amount: 330, unit: 'µg', per100gKey: 'folate_ug' },
  omega3: { amount: 2, unit: 'g', per100gKey: 'omega3_g' },
  vitaminC: { amount: 110, unit: 'mg', per100gKey: 'vitaminC_mg' },
  zinc: { amount: 11, unit: 'mg', per100gKey: 'zinc_mg' },
};

/* ---------- Recherche d'aliments (saisie journal) ---------- */

function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/** Recherche accent- et casse-insensible sur nom + alias, préfixes d'abord. */
export function searchFoods(query: string, foods: FoodItem[], limit = 8): FoodItem[] {
  const q = fold(query.trim());
  if (q.length < 2) return [];
  const scored: { food: FoodItem; rank: number }[] = [];
  for (const food of foods) {
    const candidates = [food.name, food.id.replace(/-/g, ' '), ...food.aliases].map(fold);
    let rank = Infinity;
    for (const c of candidates) {
      if (c.startsWith(q)) rank = Math.min(rank, 0);
      else if (c.split(/[\s,'-]+/).some((w) => w.startsWith(q))) rank = Math.min(rank, 1);
      else if (c.includes(q)) rank = Math.min(rank, 2);
    }
    if (rank !== Infinity) scored.push({ food, rank });
  }
  return scored
    .sort((a, b) => a.rank - b.rank || a.food.name.length - b.food.name.length)
    .slice(0, limit)
    .map((s) => s.food);
}

/* ---------- Score inflammatoire du jour (§N.2) ---------- */

export interface DayNutrition {
  /** Moyenne pondérée des scores des aliments, null si rien de consigné. */
  score: number | null;
  band: Band;
  foodCount: number;
}

export function dayNutrition(log: NutritionLog | undefined, foodsById: Map<string, FoodItem>): DayNutrition {
  const logged = (log?.foods ?? []).filter((f) => foodsById.has(f.foodId));
  if (logged.length === 0) return { score: null, band: 'unknown', foodCount: 0 };
  let weighted = 0;
  let totalServings = 0;
  for (const f of logged) {
    const servings = Math.max(f.servings, 0.25);
    weighted += (foodsById.get(f.foodId) as FoodItem).inflammationScore * servings;
    totalServings += servings;
  }
  const score = weighted / totalServings;
  const band: Band = score <= BAND_THRESHOLDS.anti ? 'anti' : score >= BAND_THRESHOLDS.pro ? 'pro' : 'neutral';
  return { score: Math.round(score * 100) / 100, band, foodCount: logged.length };
}

/* ---------- Tendance (§N.4, déclencheur whenTrendDown) ---------- */

/**
 * Tendance « en baisse » = qualité qui se dégrade : moyenne des scores des 7 derniers
 * jours consignés supérieure d'au moins 1 point à celle des 7 jours précédents
 * (≥ 3 jours consignés de chaque côté pour éviter les faux signaux).
 */
export function isNutritionTrendDown(
  entriesByDate: Record<ISODate, DailyEntry>,
  foodsById: Map<string, FoodItem>,
  today: ISODate,
): boolean {
  const scores = (from: number, to: number): number[] => {
    const out: number[] = [];
    for (let i = from; i < to; i++) {
      const entry = entriesByDate[addDays(today, -i)];
      const day = dayNutrition(entry?.nutrition, foodsById);
      if (day.score !== null) out.push(day.score);
    }
    return out;
  };
  const recent = scores(0, 7);
  const previous = scores(7, 14);
  if (recent.length < 3 || previous.length < 3) return false;
  return mean(recent) - mean(previous) >= 1;
}

/* ---------- Micronutriments possiblement bas (§N.4, whenMicronutrientLow) ---------- */

/**
 * Estimation descriptive : sur les jours consignés des 7 derniers jours (≥ 3 requis),
 * un micronutriment est « possiblement bas » si l'apport moyen estimé (1 portion ≈ 100 g)
 * est sous 50 % du repère indicatif. Jamais présenté comme un diagnostic de carence.
 */
export function estimateLowMicronutrients(
  entriesByDate: Record<ISODate, DailyEntry>,
  foodsById: Map<string, FoodItem>,
  today: ISODate,
): Micronutrient[] {
  const dailyTotals: Partial<Record<Micronutrient, number[]>> = {};
  let loggedDays = 0;
  for (let i = 0; i < 7; i++) {
    const entry = entriesByDate[addDays(today, -i)];
    const foods = (entry?.nutrition?.foods ?? []).filter((f) => foodsById.has(f.foodId));
    if (foods.length === 0) continue;
    loggedDays += 1;
    for (const nutrient of Object.keys(NUTRIENT_REFERENCES) as Micronutrient[]) {
      const key = NUTRIENT_REFERENCES[nutrient].per100gKey;
      let total = 0;
      for (const f of foods) {
        const value = (foodsById.get(f.foodId) as FoodItem).per100g[key];
        if (value !== null) total += value * Math.max(f.servings, 0.25);
      }
      (dailyTotals[nutrient] ??= []).push(total);
    }
  }
  if (loggedDays < 3) return [];
  const lows: Micronutrient[] = [];
  for (const nutrient of Object.keys(NUTRIENT_REFERENCES) as Micronutrient[]) {
    const totals = dailyTotals[nutrient] ?? [];
    if (totals.length >= 3 && mean(totals) < NUTRIENT_REFERENCES[nutrient].amount * 0.5) {
      lows.push(nutrient);
    }
  }
  return lows;
}

/* ---------- Moteur de conseils (§N.4) ---------- */

export interface NutritionAdviceContext {
  phase: CyclePhase | null;
  profileTags: string[];
  dayBand: Band;
  trendDown: boolean;
  lowMicronutrients: Micronutrient[];
  /** Nombre maximal de conseils affichés (défaut 3). */
  maxTotal?: number;
}

const EVIDENCE_ORDER = { A: 0, B: 1, C: 2, D: 3 } as const;

function triggerMatches(advice: NutritionAdvice, ctx: NutritionAdviceContext): boolean {
  const t = advice.trigger;
  if (t.phases && (ctx.phase === null || !t.phases.includes(ctx.phase))) return false;
  if (t.profileTags && !t.profileTags.some((tag) => ctx.profileTags.includes(tag))) return false;
  if (t.whenMicronutrientLow && !ctx.lowMicronutrients.includes(t.whenMicronutrientLow)) return false;
  if (t.whenDayBand && ctx.dayBand !== t.whenDayBand) return false;
  if (t.whenTrendDown && !ctx.trendDown) return false;
  return true;
}

/**
 * Sélection déterministe : filtre par déclencheurs, priorise les conseils les plus
 * spécifiques (micronutriment bas > bande du jour/tendance > profil > phase seule)
 * puis le niveau de preuve. Aucune génération de contenu (§N.4).
 */
export function selectNutritionAdvice(catalog: NutritionAdvice[], ctx: NutritionAdviceContext): NutritionAdvice[] {
  const specificity = (a: NutritionAdvice): number => {
    const t = a.trigger;
    if (t.whenMicronutrientLow) return 0;
    if (t.whenDayBand || t.whenTrendDown) return 1;
    if (t.profileTags) return 2;
    return 3;
  };
  return catalog
    .filter((a) => triggerMatches(a, ctx))
    .sort((a, b) => specificity(a) - specificity(b) || EVIDENCE_ORDER[a.evidenceLevel] - EVIDENCE_ORDER[b.evidenceLevel])
    .slice(0, ctx.maxTotal ?? 3);
}
