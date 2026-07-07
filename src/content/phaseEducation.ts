import type { CyclePhase } from '@/types/models';

/**
 * Pédagogie de phase (M16, §1.1 objectif 3, annexe E) : contenus courts, sourcés,
 * non anxiogènes, expliquant les variations hormonales et leurs effets possibles.
 */

export interface PhaseEducation {
  phase: CyclePhase;
  title: Record<'fr' | 'en', string>;
  body: Record<'fr' | 'en', string>;
  hormones: Record<'fr' | 'en', string>;
  sourceRefs: string[];
}

export const PHASE_EDUCATION: PhaseEducation[] = [
  {
    phase: 'menstrual',
    title: { fr: 'Phase menstruelle', en: 'Menstrual phase' },
    body: {
      fr: 'Les règles marquent le premier jour du cycle : l’endomètre (la muqueuse utérine) se détache faute d’implantation. Les saignements durent le plus souvent de 2 à 7 jours. Fatigue et crampes sont fréquentes chez certaines personnes — jamais une règle universelle.',
      en: 'Your period marks day one of the cycle: the endometrium (uterine lining) sheds in the absence of implantation. Bleeding usually lasts 2 to 7 days. Fatigue and cramps are common for some people — never a universal rule.',
    },
    hormones: {
      fr: 'Œstrogènes et progestérone sont à leur plus bas, ce qui déclenche les saignements. La FSH commence à recruter les follicules du cycle suivant.',
      en: 'Oestrogen and progesterone are at their lowest, which triggers bleeding. FSH starts recruiting follicles for the next cycle.',
    },
    sourceRefs: ['acog', 'who'],
  },
  {
    phase: 'follicular',
    title: { fr: 'Phase folliculaire', en: 'Follicular phase' },
    body: {
      fr: 'Des règles à l’ovulation, l’ovaire fait mûrir un follicule dominant. Sa durée varie beaucoup d’un cycle à l’autre — c’est elle qui explique l’essentiel des variations de longueur de cycle. Beaucoup décrivent une énergie et une humeur en hausse, avec une grande variabilité individuelle.',
      en: 'From your period to ovulation, the ovary matures a dominant follicle. Its length varies a lot between cycles — it accounts for most cycle-length variation. Many describe rising energy and mood, with wide individual variability.',
    },
    hormones: {
      fr: 'Les œstrogènes montent progressivement, épaississant l’endomètre. La FSH soutient la croissance folliculaire.',
      en: 'Oestrogen rises steadily, thickening the endometrium. FSH supports follicle growth.',
    },
    sourceRefs: ['acog', 'eshre'],
  },
  {
    phase: 'ovulatory',
    title: { fr: 'Phase ovulatoire', en: 'Ovulatory phase' },
    body: {
      fr: 'Un pic de LH déclenche la libération de l’ovocyte, environ 24 à 36 h plus tard. L’ovocyte vit 12 à 24 h ; les spermatozoïdes jusqu’à 5 jours — d’où une fenêtre fertile d’environ 6 jours. La date exacte d’ovulation ne peut pas être prédite avec certitude, seulement estimée.',
      en: 'An LH surge triggers egg release about 24–36 h later. The egg lives 12–24 h; sperm up to 5 days — hence a fertile window of about 6 days. The exact ovulation day cannot be predicted with certainty, only estimated.',
    },
    hormones: {
      fr: 'Pic d’œstrogènes puis pic de LH. La glaire cervicale devient souvent filante et transparente (type « blanc d’œuf »).',
      en: 'Oestrogen peaks, then LH surges. Cervical mucus often becomes stretchy and clear (“egg-white” type).',
    },
    sourceRefs: ['eshre', 'nice'],
  },
  {
    phase: 'luteal',
    title: { fr: 'Phase lutéale', en: 'Luteal phase' },
    body: {
      fr: 'Après l’ovulation, le follicule devient corps jaune et sécrète de la progestérone. Cette phase est relativement stable (11 à 16 jours le plus souvent). Certaines personnes ressentent des symptômes prémenstruels (sensibilité, ballonnements, humeur) — la littérature sur le SPM est nuancée et la variabilité interindividuelle est grande.',
      en: 'After ovulation, the follicle becomes the corpus luteum and secretes progesterone. This phase is relatively stable (usually 11–16 days). Some people feel premenstrual symptoms (sensitivity, bloating, mood) — PMS research is nuanced and individual variability is wide.',
    },
    hormones: {
      fr: 'La progestérone domine (légère hausse de température basale). Sans grossesse, œstrogènes et progestérone chutent, déclenchant les règles.',
      en: 'Progesterone dominates (slight rise in basal temperature). Without pregnancy, oestrogen and progesterone fall, triggering your period.',
    },
    sourceRefs: ['acog', 'eshre'],
  },
];

export function getPhaseEducation(phase: CyclePhase): PhaseEducation {
  return PHASE_EDUCATION.find((p) => p.phase === phase) as PhaseEducation;
}
