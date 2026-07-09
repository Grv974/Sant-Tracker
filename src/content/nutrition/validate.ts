// Script de cohérence du contenu nutritionnel (livrable V2, exécuté en CI via Vitest).
// Vérifie : (1) chaque sourceRef existe ; (2) chaque item C/D a une uncertaintyNote ;
// (3) chaque suggestedFoodId existe dans la base d'aliments.
// Le build DOIT échouer si une règle est violée.

import { NUTRITION_ADVICE } from './advice';
import { PHASE_FOCUS, HORMONAL_NARRATIVES } from './phaseFocus';
import { PRINCIPLE_CARDS } from './principles';
import { NUTRITION_SOURCE_IDS } from './sources';
import type { EvidenceLevel } from '@/types/models';

interface Checkable {
  id: string;
  evidenceLevel: EvidenceLevel;
  sourceRefs: string[];
  uncertaintyNote?: string;
  suggestedFoodIds?: string[];
}

export function validateNutritionContent(knownFoodIds: Set<string>): string[] {
  const errors: string[] = [];
  const items: Checkable[] = [
    ...NUTRITION_ADVICE,
    ...PHASE_FOCUS,
    ...HORMONAL_NARRATIVES.map((n) => ({ ...n, id: `narrative-${n.phase}` })),
    ...PRINCIPLE_CARDS,
  ];
  for (const it of items) {
    for (const ref of it.sourceRefs) {
      if (!NUTRITION_SOURCE_IDS.includes(ref)) {
        errors.push(`[${it.id}] source inconnue : ${ref}`);
      }
    }
    if ((it.evidenceLevel === 'C' || it.evidenceLevel === 'D') && !it.uncertaintyNote) {
      errors.push(`[${it.id}] niveau ${it.evidenceLevel} sans uncertaintyNote`);
    }
    for (const fid of it.suggestedFoodIds ?? []) {
      if (!knownFoodIds.has(fid)) {
        errors.push(`[${it.id}] aliment suggéré inconnu : ${fid}`);
      }
    }
  }
  return errors;
}
