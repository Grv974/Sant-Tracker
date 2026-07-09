/**
 * Types de la base d'aliments (spec V2 §N.1.2).
 * Valeurs pour 100 g, issues de la table Ciqual 2025 (ANSES) — jamais inventées :
 * null = donnée non renseignée dans Ciqual.
 */

export type FoodCategory =
  | 'vegetable'
  | 'leafy_green'
  | 'berry'
  | 'fruit'
  | 'legume'
  | 'soy'
  | 'wholegrain'
  | 'refined_grain'
  | 'starchy'
  | 'fish_fatty'
  | 'fish_lean'
  | 'seafood'
  | 'whitemeat'
  | 'redmeat'
  | 'processed_meat'
  | 'egg'
  | 'dairy'
  | 'dairy_fermented'
  | 'cheese'
  | 'nut_seed'
  | 'oil_healthy'
  | 'oil_other'
  | 'butter'
  | 'beverage_healthy'
  | 'beverage_sugary'
  | 'alcohol'
  | 'sweet'
  | 'ultraprocessed'
  | 'spice_herb'
  | 'condiment';

export interface FoodNutrients {
  energyKcal: number | null;
  proteins_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  sugars_g: number | null;
  fiber_g: number | null;
  satFat_g: number | null;
  salt_g: number | null;
  calcium_mg: number | null;
  iron_mg: number | null;
  magnesium_mg: number | null;
  zinc_mg: number | null;
  vitaminD_ug: number | null;
  vitaminC_mg: number | null;
  vitaminB6_mg: number | null;
  folate_ug: number | null;
  /** Somme ALA + EPA + DHA (g/100 g). */
  omega3_g: number | null;
}

export interface FoodItem {
  id: string;
  /** Nom Ciqual d'origine (affichage : displayName si présent, sinon name). */
  name: string;
  aliases: string[];
  category: FoodCategory;
  ciqualCode?: number;
  novaGroup?: 1 | 2 | 3 | 4;
  /** Score inflammatoire −5 (anti) … +5 (pro), règles documentées (DECISIONS D9). */
  inflammationScore: number;
  tags: string[];
  per100g: FoodNutrients;
  evidenceNote?: string;
}

/** Entrée de journal alimentaire d'une journée (stockée dans DailyEntry.nutrition). */
export interface LoggedFood {
  foodId: string;
  /** Portions consommées (1 = portion usuelle ~100 g équivalent). */
  servings: number;
}

export interface NutritionLog {
  foods: LoggedFood[];
}
