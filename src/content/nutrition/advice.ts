// Base de conseils du moteur de règles (§N.4). Sélection déterministe, aucune génération.
// Règles éthiques : ton bienveillant, vocabulaire d'AJOUT (pas de privation/culpabilité),
// toute supplémentation renvoie à un professionnel, chaque item C/D porte une uncertaintyNote.

import type { NutritionAdvice } from './types';

export const NUTRITION_ADVICE: NutritionAdvice[] = [
  // ── Phase menstruelle ────────────────────────────────────────────────
  {
    id: 'iron-vitc-menstrual',
    title: 'Associez fer et vitamine C',
    body:
      'En cette phase, une astuce simple : ajoutez une source de vitamine C (poivron, agrumes, ' +
      "persil) à un plat riche en fer végétal (lentilles, épinards). Cela aide votre corps à " +
      'mieux absorber le fer.',
    category: 'add_food',
    evidenceLevel: 'B',
    sourceRefs: ['iron-vitc-absorption', 'who-iron'],
    suggestedFoodIds: ['lentilles', 'epinards', 'poivron-rouge', 'orange', 'persil'],
    trigger: { phases: ['menstrual'], whenMicronutrientLow: 'iron', maxPerDay: 1 },
  },
  {
    id: 'iron-general-menstrual',
    title: 'Pensez au fer aujourd’hui',
    body:
      'Les règles consomment du fer. Un repas incluant légumineuses, légumes verts, ou — si vous ' +
      'en mangez — viande ou abats, aide à le reconstituer.',
    category: 'micronutrient',
    evidenceLevel: 'B',
    sourceRefs: ['acog-anemia-menstruation', 'who-iron'],
    suggestedFoodIds: ['lentilles', 'pois-chiches', 'boeuf-maigre', 'epinards', 'tofu'],
    trigger: { phases: ['menstrual'], maxPerDay: 1 },
    professionalReferral: true, // toute idée de supplémentation en fer passe par un avis médical
  },
  {
    id: 'hydration-menstrual',
    title: 'Un verre d’eau, tout simplement',
    body: "Rester hydratée soutient le confort général. L'eau et les tisanes sont vos meilleures alliées.",
    category: 'hydration',
    evidenceLevel: 'A',
    sourceRefs: ['efsa-drv'],
    suggestedFoodIds: ['eau', 'tisane'],
    trigger: { phases: ['menstrual', 'follicular', 'ovulatory', 'luteal'], maxPerDay: 1 },
  },
  // ── Phase folliculaire ───────────────────────────────────────────────
  {
    id: 'variety-follicular',
    title: 'Jouez la variété',
    body:
      "L'énergie remonte souvent après les règles : profitez-en pour varier les couleurs dans " +
      "l'assiette — légumes, fruits, légumineuses, céréales complètes.",
    category: 'add_food',
    evidenceLevel: 'A',
    sourceRefs: ['predimed-med', 'oms-who-diet'],
    suggestedFoodIds: ['brocoli', 'betterave', 'quinoa', 'myrtille', 'lentilles'],
    trigger: { phases: ['follicular'], maxPerDay: 1 },
  },
  {
    id: 'protein-follicular',
    title: 'Des protéines pour accompagner le mouvement',
    body:
      'Si vous êtes active en ce moment, pensez à une source de protéines à chaque repas ' +
      '(œufs, tofu, légumineuses, poisson, volaille).',
    category: 'add_food',
    evidenceLevel: 'B',
    sourceRefs: ['anses-refs'],
    suggestedFoodIds: ['oeuf', 'tofu', 'poulet', 'pois-chiches', 'yaourt-nature'],
    trigger: { phases: ['follicular', 'ovulatory'], maxPerDay: 1 },
  },
  // ── Phase lutéale ────────────────────────────────────────────────────
  {
    id: 'calcium-pms',
    title: 'Le calcium, une piste pour l’inconfort prémenstruel',
    body:
      'En fin de cycle, les aliments riches en calcium (produits laitiers, boissons végétales ' +
      'enrichies, sardines) font partie des pistes les plus étudiées pour le confort prémenstruel.',
    category: 'micronutrient',
    evidenceLevel: 'B',
    sourceRefs: ['cochrane-calcium-pms', 'acog-pms'],
    suggestedFoodIds: ['yaourt-nature', 'boisson-soja-enrichie', 'sardine', 'chou-kale'],
    trigger: { phases: ['luteal'], maxPerDay: 1 },
  },
  {
    id: 'magnesium-luteal',
    title: 'Un peu de magnésium en fin de cycle',
    body:
      'Oléagineux, légumineuses, céréales complètes et chocolat noir apportent du magnésium. ' +
      "Certaines personnes s'y sentent bien en phase lutéale.",
    category: 'add_food',
    evidenceLevel: 'C',
    sourceRefs: ['acog-pms'],
    suggestedFoodIds: ['amande', 'chocolat-noir', 'lentilles', 'quinoa'],
    trigger: { phases: ['luteal'], maxPerDay: 1 },
    uncertaintyNote:
      "L'effet du magnésium sur les symptômes prémenstruels est plausible mais peu démontré. À tester pour vous.",
  },
  {
    id: 'complexcarbs-luteal',
    title: 'Misez sur les glucides complexes',
    body:
      'Remplacer une partie des sucres rapides par des glucides complexes (céréales complètes, ' +
      'légumineuses) peut soutenir une énergie plus stable en fin de cycle.',
    category: 'food_swap',
    evidenceLevel: 'C',
    sourceRefs: ['acog-pms', 'oms-who-diet'],
    suggestedFoodIds: ['flocons-avoine', 'riz-complet', 'lentilles', 'pain-complet'],
    trigger: { phases: ['luteal'], maxPerDay: 1 },
    uncertaintyNote: 'Piste raisonnable, mais les preuves spécifiques au syndrome prémenstruel restent limitées.',
  },
  // ── Déclenchés par le score du jour (toutes phases) ──────────────────
  {
    id: 'antiinflam-swap',
    title: 'Une petite substitution qui fait du bien',
    body:
      "Aujourd'hui, votre assiette penche du côté pro-inflammatoire — rien de grave. Pour " +
      'rééquilibrer en douceur, vous pourriez, par exemple, remplacer une boisson sucrée par de ' +
      "l'eau ou du thé, ou ajouter une portion de légumes au prochain repas.",
    category: 'food_swap',
    evidenceLevel: 'B',
    sourceRefs: ['predimed-med', 'oms-who-diet'],
    suggestedFoodIds: ['eau', 'the-vert', 'brocoli', 'myrtille'],
    trigger: { whenDayBand: 'pro', maxPerDay: 1 },
  },
  {
    id: 'addveggies-general',
    title: 'Une couleur de plus dans l’assiette',
    body:
      "Ajouter une portion de légumes ou de fruits au prochain repas est l'un des gestes les plus " +
      'simples et les mieux soutenus pour une alimentation anti-inflammatoire.',
    category: 'add_food',
    evidenceLevel: 'A',
    sourceRefs: ['predimed-med', 'oms-who-diet'],
    suggestedFoodIds: ['brocoli', 'carotte', 'poivron-rouge', 'myrtille', 'epinards'],
    trigger: { whenTrendDown: true, maxPerDay: 1 },
  },
  // ── Personnalisation par profil ──────────────────────────────────────
  {
    id: 'pcos-lifestyle',
    title: 'SOPK : régularité et cadre méditerranéen',
    body:
      "Dans le cadre d'un SOPK, une alimentation de type méditerranéen (légumes, légumineuses, " +
      "poissons, huile d'olive) associée à une activité physique régulière est généralement " +
      "bénéfique. L'idée est d'ajouter de bonnes choses, pas de se restreindre.",
    category: 'general',
    evidenceLevel: 'B',
    sourceRefs: ['eshre-pcos', 'predimed-med'],
    suggestedFoodIds: ['lentilles', 'brocoli', 'saumon-atlantique', 'huile-olive', 'quinoa'],
    trigger: { profileTags: ['pcos'], maxPerDay: 1 },
    professionalReferral: true,
  },
  {
    id: 'endometriosis-antiinflam',
    title: 'Endométriose : un cadre anti-inflammatoire, en complément du suivi',
    body:
      "Certaines personnes concernées par l'endométriose explorent une alimentation à visée " +
      'anti-inflammatoire. Les données restent préliminaires ; considérez-la comme un complément ' +
      'à votre suivi spécialisé, pas un traitement.',
    category: 'general',
    evidenceLevel: 'C',
    sourceRefs: ['eshre-endometriosis'],
    suggestedFoodIds: ['saumon-atlantique', 'brocoli', 'myrtille', 'huile-olive', 'noix'],
    trigger: { profileTags: ['endometriosis'], maxPerDay: 1 },
    uncertaintyNote:
      "Les preuves sur l'alimentation dans l'endométriose sont émergentes et de faible niveau. Ne remplace pas une prise en charge médicale.",
    professionalReferral: true,
  },
  {
    id: 'conceive-folate',
    title: 'En vue d’une grossesse : les folates',
    body:
      'Si vous envisagez une grossesse, les folates jouent un rôle reconnu dans la prévention de ' +
      'certaines malformations. On en trouve dans les légumes verts, les légumineuses et les ' +
      'agrumes. Une supplémentation péri-conceptionnelle est recommandée, mais elle se décide ' +
      'avec un professionnel de santé.',
    category: 'micronutrient',
    evidenceLevel: 'A',
    sourceRefs: ['folate-ntd'],
    suggestedFoodIds: ['epinards', 'lentilles', 'pois-chiches', 'orange', 'brocoli'],
    trigger: { profileTags: ['conceive'], maxPerDay: 1 },
    professionalReferral: true,
  },
  {
    id: 'perimenopause-bonehealth',
    title: 'Périménopause : calcium, vitamine D et cadre équilibré',
    body:
      'Pendant la périménopause, veiller aux apports en calcium et vitamine D soutient la santé ' +
      "osseuse, dans le cadre d'une alimentation équilibrée. Les besoins précis et une éventuelle " +
      'supplémentation se discutent avec un professionnel.',
    category: 'micronutrient',
    evidenceLevel: 'B',
    sourceRefs: ['nice-menopause', 'anses-refs'],
    suggestedFoodIds: ['yaourt-nature', 'sardine', 'boisson-soja-enrichie', 'oeuf', 'chou-kale'],
    trigger: { profileTags: ['perimenopause'], maxPerDay: 1 },
    professionalReferral: true,
  },
  {
    id: 'postpartum-gentle',
    title: 'Post-partum : douceur et régularité',
    body:
      "Après une naissance, l'essentiel est de manger à votre faim, régulièrement, et de rester " +
      "hydratée — particulièrement en cas d'allaitement. Ce n'est pas le moment des restrictions.",
    category: 'general',
    evidenceLevel: 'B',
    sourceRefs: ['anses-refs', 'efsa-drv'],
    suggestedFoodIds: ['flocons-avoine', 'yaourt-nature', 'lentilles', 'eau', 'oeuf'],
    trigger: { profileTags: ['postpartum'], maxPerDay: 1 },
    professionalReferral: true,
  },
];
