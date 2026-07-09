// Fiches-principes statiques (§N.5.4). PAS de recettes complètes générées : ce sont des
// principes + listes d'aliments, sourcés. Ton pédagogique et non injonctif.

import type { PrincipleCard } from './types';

export const PRINCIPLE_CARDS: PrincipleCard[] = [
  {
    id: 'principle-antiinflammatory-plate',
    title: "L'assiette anti-inflammatoire en pratique",
    body:
      "Une assiette à visée anti-inflammatoire s'inspire du modèle méditerranéen : beaucoup de " +
      'végétaux, de bonnes graisses, des protéines de qualité, et peu de produits ultra-transformés.',
    bullets: [
      "La moitié de l'assiette : légumes variés et colorés",
      'Un quart : céréales complètes ou légumineuses',
      'Un quart : protéines (poisson, œufs, tofu, légumineuses, volaille)',
      "Une source de bonnes graisses : huile d'olive, oléagineux, poissons gras",
      "En boisson : eau, thé ; on garde les boissons sucrées pour l'occasionnel",
    ],
    suggestedFoodIds: ['brocoli', 'quinoa', 'lentilles', 'saumon-atlantique', 'huile-olive', 'myrtille'],
    evidenceLevel: 'B',
    sourceRefs: ['predimed-med', 'oms-who-diet'],
  },
  {
    id: 'principle-iron-absorption',
    title: 'Bien absorber le fer végétal',
    body:
      'Le fer des végétaux (fer non héminique) est moins bien absorbé que celui de la viande. ' +
      "Deux leviers simples aident : ajouter de la vitamine C au repas, et éviter de boire thé " +
      'ou café juste pendant le repas riche en fer.',
    bullets: [
      'Fer + vitamine C : lentilles + poivron, épinards + citron, pois chiches + tomate',
      'Thé et café : plutôt à distance des repas riches en fer',
      "En cas de fatigue persistante : parlez-en à un professionnel (le fer ne se supplémente pas à l'aveugle)",
    ],
    suggestedFoodIds: ['lentilles', 'epinards', 'pois-chiches', 'poivron-rouge', 'orange'],
    evidenceLevel: 'B',
    sourceRefs: ['iron-vitc-absorption', 'who-iron'],
  },
  {
    id: 'principle-ultraprocessed',
    title: 'Repérer les aliments ultra-transformés',
    body:
      'Les aliments ultra-transformés (classe NOVA 4) sont associés, quand ils dominent ' +
      "l'alimentation, à un profil plus pro-inflammatoire. Les repérer aide à les garder pour " +
      "l'occasionnel, sans en faire une source de culpabilité.",
    bullets: [
      "Indices : longue liste d'ingrédients, additifs, arômes, aspect très industriel",
      "L'idée n'est pas d'éliminer, mais de rééquilibrer vers des aliments moins transformés",
    ],
    suggestedFoodIds: [],
    evidenceLevel: 'B',
    sourceRefs: ['nova', 'oms-who-diet'],
  },
  {
    id: 'principle-luteal-comfort',
    title: 'Manger en douceur en fin de cycle',
    body:
      'En phase lutéale, certaines personnes se sentent mieux avec des repas réguliers, des ' +
      "glucides complexes et des aliments riches en magnésium et calcium. Rien d'obligatoire : " +
      "il s'agit d'écouter votre ressenti.",
    bullets: [
      'Glucides complexes : avoine, riz complet, légumineuses',
      'Magnésium : amandes, chocolat noir, légumineuses',
      'Calcium : yaourt, boissons végétales enrichies, sardines',
      'Si vous y êtes sensible : modérer sel, sucre, alcool et caféine',
    ],
    suggestedFoodIds: ['flocons-avoine', 'amande', 'yaourt-nature', 'lentilles', 'chocolat-noir'],
    evidenceLevel: 'C',
    sourceRefs: ['acog-pms'],
    uncertaintyNote:
      'Les bénéfices sur le confort prémenstruel varient selon les personnes et reposent sur des données limitées.',
  },
  {
    id: 'principle-hydration',
    title: "S'hydrater au fil de la journée",
    body:
      "L'hydratation soutient le bien-être général tout au long du cycle. L'eau reste la référence ; " +
      "thé et tisanes comptent aussi. Pas besoin de compter à l'obsession — écoutez la soif et la " +
      'couleur des urines comme repères simples.',
    bullets: [
      "Repère indicatif : de l'ordre de ~2 L par jour toutes boissons confondues (variable selon activité, climat)",
      "Un verre d'eau à chaque repas et entre les repas suffit souvent",
    ],
    suggestedFoodIds: ['eau', 'the-vert', 'tisane'],
    evidenceLevel: 'A',
    sourceRefs: ['efsa-drv'],
  },
];
