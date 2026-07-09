// Types du contenu nutritionnel statique (livrable V2, cohérent avec la spec §N).
// Le contenu est DONNÉE (versionnée, sourcée), jamais généré dynamiquement.

import type { CyclePhase, EvidenceLevel } from '@/types/models';

export type ProfileTag = 'pcos' | 'endometriosis' | 'conceive' | 'perimenopause' | 'postpartum';

export type Micronutrient =
  | 'iron'
  | 'calcium'
  | 'magnesium'
  | 'vitaminB6'
  | 'vitaminD'
  | 'folate'
  | 'omega3'
  | 'vitaminC'
  | 'zinc';

/** Bande inflammatoire d'une journée. */
export type Band = 'anti' | 'neutral' | 'pro' | 'unknown';

/** Focus nutritionnel d'une phase (table normative §N.3.1). */
export interface PhaseFocusItem {
  id: string;
  phase: CyclePhase;
  nutrient: Micronutrient | 'general';
  title: string;
  body: string;
  suggestedFoodIds: string[];
  evidenceLevel: EvidenceLevel;
  sourceRefs: string[];
  /** OBLIGATOIRE si evidenceLevel est C ou D (vérifié par validateNutritionContent). */
  uncertaintyNote?: string;
}

/** Déclencheurs d'un conseil (moteur de règles §N.4). */
export interface AdviceTrigger {
  phases?: CyclePhase[];
  profileTags?: ProfileTag[];
  whenMicronutrientLow?: Micronutrient;
  /** 'pro' → proposer une amélioration douce. */
  whenDayBand?: Band;
  whenTrendDown?: boolean;
  maxPerDay?: number;
}

export interface NutritionAdvice {
  id: string;
  title: string;
  body: string;
  category: 'food_swap' | 'add_food' | 'hydration' | 'timing' | 'general' | 'micronutrient';
  evidenceLevel: EvidenceLevel;
  sourceRefs: string[];
  suggestedFoodIds?: string[];
  trigger: AdviceTrigger;
  uncertaintyNote?: string;
  /** true → afficher « demandez conseil à un professionnel ». */
  professionalReferral?: boolean;
}

/** Récit hormonal de phase (dashboard « profil hormonal », §S.2). */
export interface HormonalPhaseNarrative {
  phase: CyclePhase;
  estrogen: 'rising' | 'peak' | 'falling' | 'low';
  progesterone: 'low' | 'rising' | 'high' | 'falling';
  lhFsh?: 'baseline' | 'surge';
  summary: string;
  evidenceLevel: EvidenceLevel;
  sourceRefs: string[];
  uncertaintyNote?: string;
}

/** Fiche-principe statique (pas une recette complète, §N.5.4). */
export interface PrincipleCard {
  id: string;
  title: string;
  body: string;
  bullets?: string[];
  suggestedFoodIds: string[];
  evidenceLevel: EvidenceLevel;
  sourceRefs: string[];
  uncertaintyNote?: string;
}
