import { describe, expect, it } from 'vitest';
import { validateNutritionContent } from '../validate';
import { FOODS, FOOD_IDS } from '../foods.generated';
import { NUTRITION_ADVICE } from '../advice';
import { PHASE_FOCUS } from '../phaseFocus';
import { PRINCIPLE_CARDS } from '../principles';
import { PREDICTION_CONFIG } from '@/constants/prediction.config';

describe('gouvernance du contenu nutritionnel (livrable V2)', () => {
  it('validateNutritionContent ne remonte aucune erreur (sources, C/D, aliments)', () => {
    expect(validateNutritionContent(FOOD_IDS)).toEqual([]);
  });

  it('la base d’aliments est cohérente (ids uniques, scores bornés, valeurs plausibles)', () => {
    const ids = FOODS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(FOODS.length).toBeGreaterThanOrEqual(100);
    for (const f of FOODS) {
      expect(f.inflammationScore, f.id).toBeGreaterThanOrEqual(-5);
      expect(f.inflammationScore, f.id).toBeLessThanOrEqual(5);
      expect(f.ciqualCode, f.id).toBeGreaterThan(0);
      // valeurs Ciqual : jamais négatives quand renseignées
      for (const [k, v] of Object.entries(f.per100g)) {
        if (v !== null) expect(v, `${f.id}.${k}`).toBeGreaterThanOrEqual(0);
      }
    }
    void PREDICTION_CONFIG; // le module nutrition ne modifie pas la config prédiction
  });

  it('toute mention de supplémentation porte professionalReferral (règle éthique)', () => {
    for (const a of NUTRITION_ADVICE) {
      if (/suppl[ée]ment/i.test(a.body)) {
        expect(a.professionalReferral, `${a.id} mentionne une supplémentation`).toBe(true);
      }
    }
  });

  it('vocabulaire d’ajout, jamais de culpabilité (échantillon lexical)', () => {
    const forbidden = [/interdit/i, /coupable/i, /culpabilis/i, /mauvaise? élève/i, /faute/i, /tricher/i];
    for (const item of [...NUTRITION_ADVICE, ...PHASE_FOCUS, ...PRINCIPLE_CARDS]) {
      for (const re of forbidden) {
        expect(re.test(item.body), `${item.id} contient un vocabulaire culpabilisant (${re})`).toBe(false);
      }
    }
  });

  it('les ids d’aliments de l’échantillon du livrable sont tous couverts', () => {
    // ids référencés par le contenu éditorial (échantillon foods.sample.ts du livrable)
    const required = [
      'brocoli', 'epinards', 'chou-kale', 'carotte', 'poivron-rouge', 'tomate', 'betterave', 'persil',
      'myrtille', 'framboise', 'orange', 'pomme', 'banane', 'lentilles', 'pois-chiches', 'quinoa',
      'riz-complet', 'flocons-avoine', 'pain-complet', 'saumon-atlantique', 'sardine', 'maquereau',
      'oeuf', 'yaourt-nature', 'lait', 'boisson-soja-enrichie', 'tofu', 'poulet', 'boeuf-maigre',
      'noix', 'amande', 'noix-cajou', 'huile-olive', 'eau', 'the-vert', 'tisane', 'chocolat-noir',
    ];
    for (const id of required) {
      expect(FOOD_IDS.has(id), `aliment manquant : ${id}`).toBe(true);
    }
  });
});
