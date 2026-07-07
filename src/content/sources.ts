/**
 * Sources institutionnelles (§18.1) — référencées par les contenus M16 via sourceRefs.
 * Règle de gouvernance (annexe E) : aucun contenu de santé sans source.
 * Les URLs pointent vers les portails officiels des institutions (stables dans le temps).
 */

export interface ScientificSource {
  id: string;
  label: string;
  org: string;
  url: string;
}

export const SOURCES: ScientificSource[] = [
  {
    id: 'acog',
    label: 'American College of Obstetricians and Gynecologists — Women’s Health',
    org: 'ACOG',
    url: 'https://www.acog.org/womens-health',
  },
  {
    id: 'figo',
    label: 'FIGO — Classification PALM-COEIN des saignements utérins anormaux',
    org: 'FIGO',
    url: 'https://www.figo.org/',
  },
  {
    id: 'who',
    label: 'Organisation mondiale de la Santé — Santé sexuelle et reproductive',
    org: 'OMS / WHO',
    url: 'https://www.who.int/health-topics/sexual-and-reproductive-health-and-rights',
  },
  {
    id: 'nice',
    label: 'NICE — Guidelines (ménopause, saignements abondants, endométriose, fertilité)',
    org: 'NICE (UK)',
    url: 'https://www.nice.org.uk/guidance',
  },
  {
    id: 'eshre',
    label: 'ESHRE — Guidelines (SOPK, endométriose, fertilité)',
    org: 'ESHRE',
    url: 'https://www.eshre.eu/Guidelines-and-Legal',
  },
  {
    id: 'cochrane',
    label: 'Cochrane — Revues systématiques (dysménorrhée, SPM, exercice)',
    org: 'Cochrane',
    url: 'https://www.cochranelibrary.com/',
  },
  {
    id: 'has',
    label: 'Haute Autorité de Santé — Recommandations (contraception, endométriose)',
    org: 'HAS (France)',
    url: 'https://www.has-sante.fr/',
  },
  {
    id: 'cngof',
    label: 'CNGOF — Recommandations pour la pratique clinique',
    org: 'CNGOF (France)',
    url: 'https://cngof.fr/',
  },
  {
    id: 'efsa',
    label: 'EFSA — Valeurs nutritionnelles de référence (dont hydratation)',
    org: 'EFSA',
    url: 'https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values',
  },
  {
    id: 'anses',
    label: 'ANSES — Repères alimentaires et nutritionnels',
    org: 'ANSES (France)',
    url: 'https://www.anses.fr/',
  },
];

export const SOURCE_IDS = SOURCES.map((s) => s.id);

export function getSource(id: string): ScientificSource | undefined {
  return SOURCES.find((s) => s.id === id);
}
