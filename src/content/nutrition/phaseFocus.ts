// Focus nutritionnels par phase — source de vérité de l'analyse par phase (§N.3.1).
// Ton : bienveillant, descriptif, jamais injonctif. Chaque item C/D porte une uncertaintyNote.

import type { PhaseFocusItem, HormonalPhaseNarrative } from './types';

export const PHASE_FOCUS: PhaseFocusItem[] = [
  // ─────────────── PHASE MENSTRUELLE ───────────────
  {
    id: 'focus-menstrual-iron',
    phase: 'menstrual',
    nutrient: 'iron',
    title: 'Le fer pendant les règles',
    body:
      "Les règles s'accompagnent de pertes de sang, et donc de fer. Pendant cette phase, " +
      'vous pouvez privilégier des aliments qui en apportent : légumineuses, légumes verts, ' +
      "et, si vous en consommez, viandes et abats. Associer une source de vitamine C au même " +
      "repas aide votre corps à mieux absorber le fer d'origine végétale.",
    suggestedFoodIds: ['lentilles', 'pois-chiches', 'epinards', 'tofu', 'boeuf-maigre', 'poivron-rouge', 'orange', 'persil'],
    evidenceLevel: 'B',
    sourceRefs: ['acog-anemia-menstruation', 'who-iron', 'iron-vitc-absorption'],
  },
  {
    id: 'focus-menstrual-hydration',
    phase: 'menstrual',
    nutrient: 'general',
    title: 'Rester bien hydratée',
    body:
      "Une bonne hydratation soutient le confort général pendant les règles. L'eau reste la " +
      'meilleure option ; les tisanes comptent aussi.',
    suggestedFoodIds: ['eau', 'the-vert', 'tisane'],
    evidenceLevel: 'A',
    sourceRefs: ['efsa-drv'],
  },
  {
    id: 'focus-menstrual-antiinflam',
    phase: 'menstrual',
    nutrient: 'omega3',
    title: 'Une trame anti-inflammatoire pour le confort',
    body:
      'Certaines personnes trouvent du confort en privilégiant des aliments à visée ' +
      'anti-inflammatoire pendant les règles : poissons gras riches en oméga-3, légumes ' +
      "colorés, fruits, huile d'olive. Les effets ressentis varient d'une personne à l'autre.",
    suggestedFoodIds: ['saumon-atlantique', 'sardine', 'maquereau', 'noix', 'huile-olive', 'myrtille', 'brocoli'],
    evidenceLevel: 'C',
    sourceRefs: ['predimed-med', 'dii'],
    uncertaintyNote:
      "Les données sur le confort menstruel via l'alimentation sont limitées et variables selon les personnes. À considérer comme une piste, pas une garantie.",
  },
  // ─────────────── PHASE FOLLICULAIRE ───────────────
  {
    id: 'focus-follicular-variety',
    phase: 'follicular',
    nutrient: 'general',
    title: 'Variété et couleurs dans l’assiette',
    body:
      "Après les règles, l'énergie remonte souvent. C'est un bon moment pour une alimentation " +
      'variée et colorée : légumes, fruits, légumineuses et céréales complètes couvrent un large ' +
      'éventail de nutriments et de fibres.',
    suggestedFoodIds: ['brocoli', 'carotte', 'quinoa', 'lentilles', 'pomme', 'betterave', 'chou-kale'],
    evidenceLevel: 'A',
    sourceRefs: ['predimed-med', 'oms-who-diet'],
  },
  {
    id: 'focus-follicular-protein',
    phase: 'follicular',
    nutrient: 'general',
    title: 'Des protéines suffisantes',
    body:
      'Si vous êtes active ou reprenez le sport en début de cycle, veiller à un apport suffisant ' +
      'en protéines (légumineuses, œufs, poisson, tofu, volaille) accompagne bien cette période.',
    suggestedFoodIds: ['oeuf', 'tofu', 'poulet', 'lentilles', 'yaourt-nature', 'pois-chiches'],
    evidenceLevel: 'B',
    sourceRefs: ['anses-refs'],
  },
  {
    id: 'focus-follicular-polyphenols',
    phase: 'follicular',
    nutrient: 'general',
    title: 'Fibres et polyphénols',
    body:
      "Baies, légumes verts, thé et huile d'olive apportent fibres et polyphénols, au cœur d'une " +
      'alimentation de type méditerranéen.',
    suggestedFoodIds: ['myrtille', 'framboise', 'epinards', 'the-vert', 'huile-olive'],
    evidenceLevel: 'B',
    sourceRefs: ['predimed-med'],
  },
  // ─────────────── PHASE OVULATOIRE ───────────────
  {
    id: 'focus-ovulatory-antioxidants',
    phase: 'ovulatory',
    nutrient: 'general',
    title: 'Antioxydants et hydratation',
    body:
      "Autour de l'ovulation, gardez le cap d'une alimentation variée et bien hydratée : légumes " +
      "colorés, baies, fruits à coque et huile d'olive s'inscrivent dans ce cadre.",
    suggestedFoodIds: ['myrtille', 'poivron-rouge', 'amande', 'huile-olive', 'tomate', 'eau'],
    evidenceLevel: 'B',
    sourceRefs: ['predimed-med', 'oms-who-diet'],
  },
  {
    id: 'focus-ovulatory-general',
    phase: 'ovulatory',
    nutrient: 'general',
    title: 'Un cadre général, sans spécificité stricte',
    body:
      "Les besoins nutritionnels ne changent pas radicalement à l'ovulation. Les principes " +
      "généraux d'une alimentation équilibrée suffisent ; inutile de viser une nutrition « spéciale ».",
    suggestedFoodIds: [],
    evidenceLevel: 'C',
    sourceRefs: ['dii'],
    uncertaintyNote:
      "L'idée d'adapter finement l'alimentation à chaque phase repose sur des données limitées. Le socle solide reste une alimentation équilibrée sur l'ensemble du cycle.",
  },
  // ─────────────── PHASE LUTÉALE ───────────────
  {
    id: 'focus-luteal-calcium',
    phase: 'luteal',
    nutrient: 'calcium',
    title: 'Le calcium et l’inconfort prémenstruel',
    body:
      "Le calcium fait partie des pistes les plus étudiées pour l'inconfort prémenstruel. On le " +
      'trouve dans les produits laitiers, les boissons végétales enrichies, les sardines et ' +
      'certains légumes verts.',
    suggestedFoodIds: ['yaourt-nature', 'lait', 'boisson-soja-enrichie', 'sardine', 'chou-kale', 'amande'],
    evidenceLevel: 'B',
    sourceRefs: ['cochrane-calcium-pms', 'acog-pms'],
  },
  {
    id: 'focus-luteal-magnesium',
    phase: 'luteal',
    nutrient: 'magnesium',
    title: 'Un peu de magnésium en fin de cycle',
    body:
      "Certaines personnes apprécient d'augmenter les aliments riches en magnésium en phase " +
      'lutéale : oléagineux, légumineuses, céréales complètes, chocolat noir. Les effets ' +
      'ressentis sont variables.',
    suggestedFoodIds: ['amande', 'noix-cajou', 'chocolat-noir', 'lentilles', 'quinoa', 'banane'],
    evidenceLevel: 'C',
    sourceRefs: ['acog-pms'],
    uncertaintyNote:
      'Le bénéfice du magnésium sur les symptômes prémenstruels est plausible mais peu établi. À tester pour vous, sans en attendre un effet garanti.',
  },
  {
    id: 'focus-luteal-complexcarbs',
    phase: 'luteal',
    nutrient: 'general',
    title: 'Des glucides complexes pour la stabilité',
    body:
      'Privilégier des glucides complexes (céréales complètes, légumineuses) plutôt que des ' +
      "sucres rapides peut aider à une énergie plus stable en fin de cycle.",
    suggestedFoodIds: ['quinoa', 'riz-complet', 'flocons-avoine', 'lentilles', 'pain-complet'],
    evidenceLevel: 'C',
    sourceRefs: ['acog-pms', 'oms-who-diet'],
    uncertaintyNote:
      'Piste raisonnable sur le plan physiologique, mais les preuves spécifiques au SPM restent limitées.',
  },
  {
    id: 'focus-luteal-limit',
    phase: 'luteal',
    nutrient: 'general',
    title: 'Modérer sel, sucre, alcool et caféine si vous y êtes sensible',
    body:
      'Si vous ressentez des inconforts prémenstruels (rétention, tensions, sommeil perturbé), ' +
      "réduire le sel, les sucres ajoutés, l'alcool et la caféine en fin de cycle peut aider. " +
      'Écoutez votre propre ressenti.',
    suggestedFoodIds: [],
    evidenceLevel: 'C',
    sourceRefs: ['acog-pms', 'oms-who-diet'],
    uncertaintyNote:
      'Recommandation individuelle : utile pour certaines personnes, sans effet universel démontré.',
  },
];

// Récits hormonaux de phase (dashboard « profil hormonal », §S.2).
export const HORMONAL_NARRATIVES: HormonalPhaseNarrative[] = [
  {
    phase: 'menstrual',
    estrogen: 'low',
    progesterone: 'low',
    summary:
      'Pendant les règles, les œstrogènes et la progestérone sont à leur plus bas. Il est ' +
      "fréquent de se sentir avec moins d'énergie ; c'est une phase où le repos et la douceur " +
      'ont toute leur place.',
    evidenceLevel: 'B',
    sourceRefs: ['acog-pms'],
  },
  {
    phase: 'follicular',
    estrogen: 'rising',
    progesterone: 'low',
    summary:
      'En phase folliculaire, les œstrogènes remontent progressivement. Beaucoup de personnes ' +
      "ressentent un regain d'énergie et d'entrain, mais cela varie d'une personne à l'autre.",
    evidenceLevel: 'B',
    sourceRefs: ['acog-pms'],
    uncertaintyNote:
      'Les ressentis liés aux variations hormonales sont individuels et ne se produisent pas de la même façon pour tout le monde.',
  },
  {
    phase: 'ovulatory',
    estrogen: 'peak',
    progesterone: 'low',
    lhFsh: 'surge',
    summary:
      "Autour de l'ovulation, les œstrogènes atteignent un pic et un pic de LH déclenche " +
      "l'ovulation. L'énergie est souvent à son maximum.",
    evidenceLevel: 'B',
    sourceRefs: ['acog-pms'],
    uncertaintyNote:
      "Le moment exact de l'ovulation est estimé ; les ressentis varient selon les personnes.",
  },
  {
    phase: 'luteal',
    estrogen: 'falling',
    progesterone: 'high',
    summary:
      'En phase lutéale, la progestérone domine puis, en fin de phase, œstrogènes et ' +
      'progestérone chutent avant les règles. Certaines personnes ressentent alors des ' +
      "inconforts prémenstruels ; d'autres non.",
    evidenceLevel: 'B',
    sourceRefs: ['acog-pms'],
    uncertaintyNote:
      "L'intensité et la présence de symptômes prémenstruels varient beaucoup d'une personne à l'autre.",
  },
];

export function getHormonalNarrative(phase: HormonalPhaseNarrative['phase']): HormonalPhaseNarrative {
  return HORMONAL_NARRATIVES.find((n) => n.phase === phase) as HormonalPhaseNarrative;
}
