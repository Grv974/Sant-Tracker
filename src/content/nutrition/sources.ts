// Registre centralisé des sources scientifiques du module nutrition (livrable V2).
// Les URLs pointent vers les portails officiels ; ne jamais inventer une référence ou une valeur.

export interface NutritionSource {
  id: string;
  org: string;
  label: string;
  kind: 'guideline' | 'systematic_review' | 'meta_analysis' | 'food_table' | 'classification' | 'position_paper';
  url?: string;
  note?: string;
}

export const NUTRITION_SOURCES: NutritionSource[] = [
  {
    id: 'anses-ciqual',
    org: 'ANSES',
    label: 'Table de composition nutritionnelle des aliments Ciqual',
    kind: 'food_table',
    url: 'https://ciqual.anses.fr/',
    note: 'Source primaire des valeurs nutritionnelles (licence ouverte Etalab).',
  },
  {
    id: 'usda-fdc',
    org: 'USDA',
    label: 'FoodData Central',
    kind: 'food_table',
    url: 'https://fdc.nal.usda.gov/',
    note: 'Source complémentaire/fallback des valeurs nutritionnelles.',
  },
  {
    id: 'anses-refs',
    org: 'ANSES',
    label: 'Références nutritionnelles pour la population française (macronutriments, minéraux, vitamines)',
    kind: 'guideline',
    url: 'https://www.anses.fr/fr/content/les-references-nutritionnelles-en-vitamines-et-mineraux',
    note: 'Repères indicatifs (fer, calcium, magnésium, folates…), variables selon âge/situation.',
  },
  {
    id: 'efsa-drv',
    org: 'EFSA',
    label: 'Dietary Reference Values (DRV) et repères d’hydratation',
    kind: 'guideline',
    url: 'https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values',
    note: 'Repères européens ; hydratation ~2 L/j pour les femmes (toutes boissons).',
  },
  {
    id: 'oms-who-diet',
    org: 'OMS / WHO',
    label: 'Healthy diet — recommandations générales (sucres libres, sel, graisses)',
    kind: 'guideline',
    url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
  },
  {
    id: 'nova',
    org: 'Monteiro et coll. / OPS-PAHO',
    label: 'Classification NOVA des aliments selon leur degré de transformation',
    kind: 'classification',
    note: 'Marqueur des aliments ultra-transformés (NOVA 4).',
  },
  {
    id: 'dii',
    org: 'Shivappa, Hébert et coll.',
    label: 'Dietary Inflammatory Index (DII®) — concept d’indice inflammatoire alimentaire',
    kind: 'systematic_review',
    note: 'Inspiration conceptuelle uniquement ; la formule propriétaire n’est pas reproduite.',
  },
  {
    id: 'predimed-med',
    org: 'Estruch et coll. (essais sur le régime méditerranéen)',
    label: 'Régime méditerranéen et marqueurs de santé — essais et revues',
    kind: 'meta_analysis',
    note: 'Socle du cadre anti-inflammatoire global (niveau A/B).',
  },
  {
    id: 'cochrane-exercise-dysmenorrhea',
    org: 'Cochrane',
    label: 'Exercise for dysmenorrhoea — revue systématique',
    kind: 'systematic_review',
    url: 'https://www.cochranelibrary.com/',
    note: 'Soutien de l’activité physique pour les douleurs menstruelles (contexte).',
  },
  {
    id: 'cochrane-calcium-pms',
    org: 'Cochrane / essais cliniques',
    label: 'Calcium et symptômes prémenstruels — essais et synthèses',
    kind: 'systematic_review',
    note: 'Le calcium fait partie des interventions les plus étudiées pour l’inconfort prémenstruel (niveau B, hétérogène).',
  },
  {
    id: 'acog-pms',
    org: 'ACOG',
    label: 'Premenstrual syndrome (PMS) — recommandations',
    kind: 'guideline',
    url: 'https://www.acog.org/womens-health',
  },
  {
    id: 'acog-anemia-menstruation',
    org: 'ACOG',
    label: 'Menstruation, saignements abondants et anémie ferriprive',
    kind: 'guideline',
    url: 'https://www.acog.org/womens-health',
    note: 'Contexte fer/menstruations ; supplémentation uniquement sur avis médical.',
  },
  {
    id: 'who-iron',
    org: 'OMS / WHO',
    label: 'Fer, anémie et santé des femmes en âge de procréer',
    kind: 'guideline',
    url: 'https://www.who.int/health-topics/anaemia',
  },
  {
    id: 'folate-ntd',
    org: 'OMS / ACOG / NICE',
    label: 'Folates/acide folique et prévention des anomalies de fermeture du tube neural',
    kind: 'guideline',
    note: 'Supplémentation péri-conceptionnelle sur avis médical (niveau A pour la prévention des ATN).',
  },
  {
    id: 'nice-menopause',
    org: 'NICE',
    label: 'Menopause: diagnosis and management (NG23)',
    kind: 'guideline',
    url: 'https://www.nice.org.uk/guidance/ng23',
  },
  {
    id: 'eshre-pcos',
    org: 'ESHRE / International PCOS guideline',
    label: 'Recommandations internationales sur le SOPK (mode de vie, alimentation)',
    kind: 'guideline',
    url: 'https://www.eshre.eu/Guidelines-and-Legal',
    note: 'Alimentation équilibrée et activité physique ; pas de régime restrictif imposé.',
  },
  {
    id: 'eshre-endometriosis',
    org: 'ESHRE',
    label: 'Endometriosis guideline (prise en charge, mode de vie)',
    kind: 'guideline',
    url: 'https://www.eshre.eu/Guidelines-and-Legal',
    note: 'Données sur l’alimentation dans l’endométriose : émergentes, faible niveau de preuve.',
  },
  {
    id: 'iron-vitc-absorption',
    org: 'Littérature de nutrition (revues)',
    label: 'Vitamine C et absorption du fer non héminique',
    kind: 'systematic_review',
    note: 'Association fer végétal + vitamine C favorise l’absorption (niveau B).',
  },
];

export const NUTRITION_SOURCE_IDS = NUTRITION_SOURCES.map((s) => s.id);

export function getNutritionSource(id: string): NutritionSource | undefined {
  return NUTRITION_SOURCES.find((s) => s.id === id);
}
