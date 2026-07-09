// GÉNÉRÉ — ne pas éditer à la main. `python3 scripts/generate-foods.py <Table_Ciqual.xls>`
// Valeurs nutritionnelles : Table Ciqual 2025 © ANSES (licence ouverte Etalab),
// reprises telles quelles pour 100 g (« - »/« < seuil » → null, « traces » → 0).
// inflammationScore : règles documentées dans docs/DECISIONS.md (D9).
import type { FoodItem } from '@/data/food/types';

export const FOODS: FoodItem[] = [
  {
    "id": "brocoli",
    "name": "Brocoli, cru",
    "aliases": [
      "brocolis"
    ],
    "category": "vegetable",
    "ciqualCode": 20057,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "fibres",
      "polyphénols"
    ],
    "per100g": {
      "energyKcal": 31.9,
      "proteins_g": 2.9,
      "carbs_g": 2.15,
      "fat_g": 0.36,
      "sugars_g": 1.7,
      "fiber_g": 2.6,
      "satFat_g": 0.047,
      "salt_g": 0.075,
      "calcium_mg": 47.5,
      "iron_mg": 0.81,
      "magnesium_mg": 23.0,
      "zinc_mg": 0.41,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 91.2,
      "vitaminB6_mg": 0.17,
      "folate_ug": null,
      "omega3_g": 0.0
    }
  },
  {
    "id": "epinards",
    "name": "Épinard, cru",
    "aliases": [
      "épinard",
      "epinard"
    ],
    "category": "leafy_green",
    "ciqualCode": 20059,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "fer",
      "folates"
    ],
    "per100g": {
      "energyKcal": 33.3,
      "proteins_g": 2.68,
      "carbs_g": 3.06,
      "fat_g": 0.39,
      "sugars_g": 0.46,
      "fiber_g": 2.6,
      "satFat_g": 0.063,
      "salt_g": 0.2,
      "calcium_mg": 99.0,
      "iron_mg": 2.71,
      "magnesium_mg": 79.0,
      "zinc_mg": 0.53,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 28.1,
      "vitaminB6_mg": 0.2,
      "folate_ug": null,
      "omega3_g": 0.14
    }
  },
  {
    "id": "chou-kale",
    "name": "Chou kale, cru",
    "aliases": [
      "kale",
      "chou frisé kale"
    ],
    "category": "leafy_green",
    "ciqualCode": 20346,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "calcium",
      "polyphénols"
    ],
    "per100g": {
      "energyKcal": 34.6,
      "proteins_g": 2.92,
      "carbs_g": 0.32,
      "fat_g": 1.49,
      "sugars_g": 0.32,
      "fiber_g": 4.1,
      "satFat_g": 0.18,
      "salt_g": 0.13,
      "calcium_mg": 254.0,
      "iron_mg": 1.6,
      "magnesium_mg": 33.0,
      "zinc_mg": 0.39,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 93.4,
      "vitaminB6_mg": 0.15,
      "folate_ug": null,
      "omega3_g": 0.0
    }
  },
  {
    "id": "carotte",
    "name": "Carotte, crue",
    "aliases": [
      "carottes"
    ],
    "category": "vegetable",
    "ciqualCode": 20009,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 30.2,
      "proteins_g": 0.78,
      "carbs_g": 5.16,
      "fat_g": null,
      "sugars_g": 4.85,
      "fiber_g": 2.9,
      "satFat_g": null,
      "salt_g": 0.12,
      "calcium_mg": 36.2,
      "iron_mg": null,
      "magnesium_mg": 13.6,
      "zinc_mg": null,
      "vitaminD_ug": null,
      "vitaminC_mg": 3.73,
      "vitaminB6_mg": 0.14,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "poivron-rouge",
    "name": "Poivron rouge, cru",
    "aliases": [
      "poivron"
    ],
    "category": "vegetable",
    "ciqualCode": 20087,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "vitamine C"
    ],
    "per100g": {
      "energyKcal": 33.6,
      "proteins_g": 1.06,
      "carbs_g": 5.98,
      "fat_g": null,
      "sugars_g": 4.8,
      "fiber_g": 3.2,
      "satFat_g": null,
      "salt_g": null,
      "calcium_mg": 4.8,
      "iron_mg": 0.21,
      "magnesium_mg": 8.2,
      "zinc_mg": 0.14,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 121.0,
      "vitaminB6_mg": 0.31,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "tomate",
    "name": "Tomate ronde, crue",
    "aliases": [
      "tomates"
    ],
    "category": "vegetable",
    "ciqualCode": 20276,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "polyphénols"
    ],
    "per100g": {
      "energyKcal": 17.5,
      "proteins_g": 0.5,
      "carbs_g": 3.42,
      "fat_g": null,
      "sugars_g": 3.0,
      "fiber_g": 1.0,
      "satFat_g": null,
      "salt_g": null,
      "calcium_mg": 6.8,
      "iron_mg": 0.17,
      "magnesium_mg": 7.0,
      "zinc_mg": 0.08,
      "vitaminD_ug": null,
      "vitaminC_mg": 19.9,
      "vitaminB6_mg": 0.07,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "betterave",
    "name": "Betterave rouge, crue",
    "aliases": [
      "betteraves"
    ],
    "category": "vegetable",
    "ciqualCode": 20091,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "folates"
    ],
    "per100g": {
      "energyKcal": 40.2,
      "proteins_g": 1.61,
      "carbs_g": 6.34,
      "fat_g": 0.17,
      "sugars_g": 6.34,
      "fiber_g": 2.8,
      "satFat_g": 0.027,
      "salt_g": 0.2,
      "calcium_mg": 16.0,
      "iron_mg": 0.8,
      "magnesium_mg": 23.0,
      "zinc_mg": 0.35,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 4.9,
      "vitaminB6_mg": 0.067,
      "folate_ug": null,
      "omega3_g": 0.01
    }
  },
  {
    "id": "courgette",
    "name": "Courgette, chair et peau, crue",
    "aliases": [
      "courgettes"
    ],
    "category": "vegetable",
    "ciqualCode": 20020,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 16.7,
      "proteins_g": 1.21,
      "carbs_g": 1.75,
      "fat_g": 0.32,
      "sugars_g": 1.74,
      "fiber_g": 1.0,
      "satFat_g": 0.084,
      "salt_g": 0.02,
      "calcium_mg": 16.0,
      "iron_mg": 0.37,
      "magnesium_mg": 18.0,
      "zinc_mg": 0.32,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 17.9,
      "vitaminB6_mg": 0.16,
      "folate_ug": null,
      "omega3_g": 0.061
    }
  },
  {
    "id": "concombre",
    "name": "Concombre, chair et peau, cru",
    "aliases": [
      "concombres"
    ],
    "category": "vegetable",
    "ciqualCode": 20019,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [],
    "per100g": {
      "energyKcal": 16.8,
      "proteins_g": 0.65,
      "carbs_g": 2.87,
      "fat_g": 0.11,
      "sugars_g": 1.67,
      "fiber_g": 0.5,
      "satFat_g": 0.037,
      "salt_g": 0.012,
      "calcium_mg": 19.2,
      "iron_mg": 0.13,
      "magnesium_mg": 13.6,
      "zinc_mg": 0.095,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 2.8,
      "vitaminB6_mg": 0.04,
      "folate_ug": null,
      "omega3_g": 0.015
    }
  },
  {
    "id": "haricot-vert",
    "name": "Haricot vert, cru",
    "aliases": [
      "haricots verts"
    ],
    "category": "vegetable",
    "ciqualCode": 20061,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 31.9,
      "proteins_g": 1.83,
      "carbs_g": 4.14,
      "fat_g": 0.22,
      "sugars_g": 3.26,
      "fiber_g": 2.7,
      "satFat_g": 0.05,
      "salt_g": 0.015,
      "calcium_mg": 37.0,
      "iron_mg": 1.03,
      "magnesium_mg": 25.0,
      "zinc_mg": 0.24,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 12.2,
      "vitaminB6_mg": 0.14,
      "folate_ug": null,
      "omega3_g": 0.06
    }
  },
  {
    "id": "chou-fleur",
    "name": "Chou-fleur, cru",
    "aliases": [
      "choufleur"
    ],
    "category": "vegetable",
    "ciqualCode": 20016,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 24.9,
      "proteins_g": 1.81,
      "carbs_g": 2.13,
      "fat_g": 0.7,
      "sugars_g": 1.7,
      "fiber_g": 2.2,
      "satFat_g": 0.24,
      "salt_g": 0.015,
      "calcium_mg": 23.0,
      "iron_mg": 0.27,
      "magnesium_mg": 9.8,
      "zinc_mg": 0.22,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 48.2,
      "vitaminB6_mg": 0.22,
      "folate_ug": null,
      "omega3_g": 0.17
    }
  },
  {
    "id": "champignon",
    "name": "Champignon, tout type, cru",
    "aliases": [
      "champignons"
    ],
    "category": "vegetable",
    "ciqualCode": 20010,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [],
    "per100g": {
      "energyKcal": 24.3,
      "proteins_g": 2.42,
      "carbs_g": 2.25,
      "fat_g": 0.34,
      "sugars_g": 1.74,
      "fiber_g": 1.63,
      "satFat_g": 0.05,
      "salt_g": 0.012,
      "calcium_mg": 7.78,
      "iron_mg": 0.5,
      "magnesium_mg": 10.9,
      "zinc_mg": 0.65,
      "vitaminD_ug": 0.2,
      "vitaminC_mg": 2.1,
      "vitaminB6_mg": 0.1,
      "folate_ug": null,
      "omega3_g": 0.13
    }
  },
  {
    "id": "patate-douce",
    "name": "Patate douce, crue",
    "aliases": [
      "patates douces"
    ],
    "category": "starchy",
    "ciqualCode": 4101,
    "novaGroup": 1,
    "inflammationScore": 0,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 81.2,
      "proteins_g": 1.57,
      "carbs_g": 17.1,
      "fat_g": 0.05,
      "sugars_g": 4.18,
      "fiber_g": 3.0,
      "satFat_g": 0.018,
      "salt_g": 0.14,
      "calcium_mg": 30.0,
      "iron_mg": 0.61,
      "magnesium_mg": 25.0,
      "zinc_mg": 0.3,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 2.4,
      "vitaminB6_mg": 0.21,
      "folate_ug": null,
      "omega3_g": 0.001
    }
  },
  {
    "id": "pomme-de-terre",
    "name": "Pomme de terre, sans peau, crue",
    "aliases": [
      "patate"
    ],
    "category": "starchy",
    "ciqualCode": 4008,
    "novaGroup": 1,
    "inflammationScore": 0,
    "tags": [],
    "per100g": {
      "energyKcal": 80.0,
      "proteins_g": 2.02,
      "carbs_g": 16.2,
      "fat_g": 0.09,
      "sugars_g": 0.78,
      "fiber_g": 2.2,
      "satFat_g": 0.026,
      "salt_g": null,
      "calcium_mg": 14.3,
      "iron_mg": 0.78,
      "magnesium_mg": 22.0,
      "zinc_mg": 0.35,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 19.7,
      "vitaminB6_mg": 0.3,
      "folate_ug": null,
      "omega3_g": 0.018
    }
  },
  {
    "id": "avocat",
    "name": "Avocat, chair sans peau, sans noyau, cru",
    "aliases": [
      "avocats"
    ],
    "category": "fruit",
    "ciqualCode": 13004,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "bonnes graisses",
      "fibres"
    ],
    "per100g": {
      "energyKcal": 203.0,
      "proteins_g": 1.56,
      "carbs_g": 0.0,
      "fat_g": 20.6,
      "sugars_g": 0.4,
      "fiber_g": 3.6,
      "satFat_g": 4.51,
      "salt_g": 0.015,
      "calcium_mg": 9.4,
      "iron_mg": 0.34,
      "magnesium_mg": 21.0,
      "zinc_mg": 0.43,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.17,
      "folate_ug": null,
      "omega3_g": 0.15
    }
  },
  {
    "id": "laitue",
    "name": "Laitue, crue",
    "aliases": [
      "salade verte"
    ],
    "category": "leafy_green",
    "ciqualCode": 20031,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [],
    "per100g": {
      "energyKcal": 14.7,
      "proteins_g": 1.35,
      "carbs_g": 1.22,
      "fat_g": 0.2,
      "sugars_g": 0.73,
      "fiber_g": 1.1,
      "satFat_g": 0.022,
      "salt_g": 0.021,
      "calcium_mg": 64.6,
      "iron_mg": 1.1,
      "magnesium_mg": 14.9,
      "zinc_mg": 0.2,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 5.53,
      "vitaminB6_mg": 0.091,
      "folate_ug": null,
      "omega3_g": 0.064
    }
  },
  {
    "id": "mache",
    "name": "Mâche, crue",
    "aliases": [
      "mâche"
    ],
    "category": "leafy_green",
    "ciqualCode": 20099,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "folates"
    ],
    "per100g": {
      "energyKcal": 15.0,
      "proteins_g": 2.0,
      "carbs_g": 0.5,
      "fat_g": null,
      "sugars_g": 0.0,
      "fiber_g": 2.3,
      "satFat_g": null,
      "salt_g": null,
      "calcium_mg": 41.0,
      "iron_mg": 0.4,
      "magnesium_mg": 19.0,
      "zinc_mg": 0.14,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 2.38,
      "vitaminB6_mg": 0.096,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "roquette",
    "name": "Roquette, crue",
    "aliases": [],
    "category": "leafy_green",
    "ciqualCode": 20217,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "folates"
    ],
    "per100g": {
      "energyKcal": 27.9,
      "proteins_g": 2.58,
      "carbs_g": 2.1,
      "fat_g": 0.66,
      "sugars_g": 2.05,
      "fiber_g": 1.6,
      "satFat_g": 0.086,
      "salt_g": 0.068,
      "calcium_mg": 160.0,
      "iron_mg": 1.46,
      "magnesium_mg": 47.0,
      "zinc_mg": 0.47,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 15.0,
      "vitaminB6_mg": 0.073,
      "folate_ug": null,
      "omega3_g": 0.0
    }
  },
  {
    "id": "oignon",
    "name": "Oignon, cru",
    "aliases": [
      "oignons"
    ],
    "category": "vegetable",
    "ciqualCode": 20034,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "polyphénols"
    ],
    "per100g": {
      "energyKcal": 39.0,
      "proteins_g": 1.1,
      "carbs_g": 6.25,
      "fat_g": 0.62,
      "sugars_g": 4.8,
      "fiber_g": 1.7,
      "satFat_g": 0.2,
      "salt_g": 0.098,
      "calcium_mg": 25.0,
      "iron_mg": 0.00019,
      "magnesium_mg": 9.0,
      "zinc_mg": 0.23,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 3.9,
      "vitaminB6_mg": 0.1,
      "folate_ug": null,
      "omega3_g": 0.001
    }
  },
  {
    "id": "ail",
    "name": "Ail, cru",
    "aliases": [],
    "category": "spice_herb",
    "ciqualCode": 11000,
    "novaGroup": 1,
    "inflammationScore": -5,
    "tags": [],
    "per100g": {
      "energyKcal": 109.0,
      "proteins_g": 5.31,
      "carbs_g": 18.6,
      "fat_g": null,
      "sugars_g": 1.2,
      "fiber_g": 5.8,
      "satFat_g": null,
      "salt_g": 0.023,
      "calcium_mg": 11.0,
      "iron_mg": 0.63,
      "magnesium_mg": 20.0,
      "zinc_mg": 0.75,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 1.1,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "potiron",
    "name": "Potiron, cru",
    "aliases": [
      "courge"
    ],
    "category": "vegetable",
    "ciqualCode": 20044,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [],
    "per100g": {
      "energyKcal": 20.1,
      "proteins_g": 1.05,
      "carbs_g": 3.5,
      "fat_g": 0.1,
      "sugars_g": 1.93,
      "fiber_g": 0.5,
      "satFat_g": 0.051,
      "salt_g": 0.0025,
      "calcium_mg": 20.5,
      "iron_mg": 0.85,
      "magnesium_mg": 12.0,
      "zinc_mg": 0.24,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 10.7,
      "vitaminB6_mg": 0.041,
      "folate_ug": null,
      "omega3_g": 0.0
    }
  },
  {
    "id": "petits-pois",
    "name": "Petits pois, crus",
    "aliases": [
      "petit pois"
    ],
    "category": "vegetable",
    "ciqualCode": 20072,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "fibres",
      "protéines"
    ],
    "per100g": {
      "energyKcal": 81.2,
      "proteins_g": 5.42,
      "carbs_g": 11.4,
      "fat_g": 0.4,
      "sugars_g": 5.67,
      "fiber_g": 5.1,
      "satFat_g": 0.071,
      "salt_g": 0.013,
      "calcium_mg": 25.0,
      "iron_mg": 1.47,
      "magnesium_mg": 33.0,
      "zinc_mg": 1.24,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 40.0,
      "vitaminB6_mg": 0.17,
      "folate_ug": null,
      "omega3_g": 0.031
    }
  },
  {
    "id": "artichaut",
    "name": "Artichaut, cru",
    "aliases": [
      "artichauts"
    ],
    "category": "vegetable",
    "ciqualCode": 20052,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 45.4,
      "proteins_g": 3.27,
      "carbs_g": 4.84,
      "fat_g": 0.15,
      "sugars_g": 0.99,
      "fiber_g": 5.4,
      "satFat_g": 0.036,
      "salt_g": 0.24,
      "calcium_mg": 44.0,
      "iron_mg": 1.28,
      "magnesium_mg": 60.0,
      "zinc_mg": 0.49,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 11.7,
      "vitaminB6_mg": 0.12,
      "folate_ug": null,
      "omega3_g": 0.0
    }
  },
  {
    "id": "poireau",
    "name": "Poireau, cru",
    "aliases": [
      "poireaux"
    ],
    "category": "vegetable",
    "ciqualCode": 20039,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 30.4,
      "proteins_g": 1.5,
      "carbs_g": 4.55,
      "fat_g": 0.3,
      "sugars_g": 3.9,
      "fiber_g": 1.8,
      "satFat_g": 0.04,
      "salt_g": 0.05,
      "calcium_mg": 59.0,
      "iron_mg": 2.1,
      "magnesium_mg": 28.0,
      "zinc_mg": 0.12,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 12.0,
      "vitaminB6_mg": 0.23,
      "folate_ug": null,
      "omega3_g": 0.035
    }
  },
  {
    "id": "celeri",
    "name": "Céleri branche, cru",
    "aliases": [
      "céleri"
    ],
    "category": "vegetable",
    "ciqualCode": 20023,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [],
    "per100g": {
      "energyKcal": 15.4,
      "proteins_g": 0.63,
      "carbs_g": 2.41,
      "fat_g": null,
      "sugars_g": 1.3,
      "fiber_g": 2.2,
      "satFat_g": null,
      "salt_g": 0.2,
      "calcium_mg": 46.0,
      "iron_mg": 0.06,
      "magnesium_mg": 11.0,
      "zinc_mg": 0.09,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 5.51,
      "vitaminB6_mg": 0.052,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "persil",
    "name": "Persil, frais",
    "aliases": [],
    "category": "spice_herb",
    "ciqualCode": 11014,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "vitamine C",
      "fer"
    ],
    "per100g": {
      "energyKcal": 42.5,
      "proteins_g": 2.97,
      "carbs_g": 4.1,
      "fat_g": 0.63,
      "sugars_g": 0.85,
      "fiber_g": 4.3,
      "satFat_g": 0.1,
      "salt_g": 0.59,
      "calcium_mg": 138.0,
      "iron_mg": 6.2,
      "magnesium_mg": 50.0,
      "zinc_mg": 1.07,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 133.0,
      "vitaminB6_mg": 0.09,
      "folate_ug": null,
      "omega3_g": 0.076
    }
  },
  {
    "id": "basilic",
    "name": "Basilic, frais",
    "aliases": [],
    "category": "spice_herb",
    "ciqualCode": 11033,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [],
    "per100g": {
      "energyKcal": 35.2,
      "proteins_g": 3.15,
      "carbs_g": 3.4,
      "fat_g": 0.64,
      "sugars_g": 0.3,
      "fiber_g": 1.6,
      "satFat_g": 0.041,
      "salt_g": 0.01,
      "calcium_mg": 177.0,
      "iron_mg": 3.17,
      "magnesium_mg": 64.0,
      "zinc_mg": 0.81,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 18.0,
      "vitaminB6_mg": 0.16,
      "folate_ug": null,
      "omega3_g": 0.0
    }
  },
  {
    "id": "curcuma",
    "name": "Curcuma, poudre",
    "aliases": [],
    "category": "spice_herb",
    "ciqualCode": 11089,
    "novaGroup": 2,
    "inflammationScore": -5,
    "tags": [
      "polyphénols"
    ],
    "per100g": {
      "energyKcal": 291.0,
      "proteins_g": 9.68,
      "carbs_g": 44.4,
      "fat_g": 3.25,
      "sugars_g": 3.21,
      "fiber_g": 22.7,
      "satFat_g": 1.84,
      "salt_g": 0.068,
      "calcium_mg": 168.0,
      "iron_mg": 55.0,
      "magnesium_mg": 208.0,
      "zinc_mg": 4.5,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 0.7,
      "vitaminB6_mg": 0.11,
      "folate_ug": null,
      "omega3_g": 0.003
    }
  },
  {
    "id": "gingembre",
    "name": "Gingembre, racine fraîche",
    "aliases": [],
    "category": "spice_herb",
    "ciqualCode": 11074,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [],
    "per100g": {
      "energyKcal": 33.3,
      "proteins_g": 1.1,
      "carbs_g": 3.4,
      "fat_g": 1.1,
      "sugars_g": 1.0,
      "fiber_g": 2.7,
      "satFat_g": 0.09,
      "salt_g": 0.016,
      "calcium_mg": 11.0,
      "iron_mg": 0.4,
      "magnesium_mg": 26.0,
      "zinc_mg": 0.24,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.1,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "myrtille",
    "name": "Myrtille, crue",
    "aliases": [
      "myrtilles",
      "bleuet"
    ],
    "category": "berry",
    "ciqualCode": 13028,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "polyphénols"
    ],
    "per100g": {
      "energyKcal": 57.7,
      "proteins_g": 0.87,
      "carbs_g": 10.6,
      "fat_g": 0.33,
      "sugars_g": 9.96,
      "fiber_g": 2.4,
      "satFat_g": 0.028,
      "salt_g": 0.0025,
      "calcium_mg": 6.0,
      "iron_mg": 0.28,
      "magnesium_mg": 6.0,
      "zinc_mg": 0.16,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 9.7,
      "vitaminB6_mg": 0.052,
      "folate_ug": null,
      "omega3_g": 0.0
    }
  },
  {
    "id": "framboise",
    "name": "Framboise, crue",
    "aliases": [
      "framboises"
    ],
    "category": "berry",
    "ciqualCode": 13015,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "polyphénols",
      "fibres"
    ],
    "per100g": {
      "energyKcal": 47.9,
      "proteins_g": 1.19,
      "carbs_g": 5.83,
      "fat_g": 0.8,
      "sugars_g": 5.4,
      "fiber_g": 4.3,
      "satFat_g": 0.13,
      "salt_g": null,
      "calcium_mg": 16.0,
      "iron_mg": 0.4,
      "magnesium_mg": 20.0,
      "zinc_mg": 0.24,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 18.7,
      "vitaminB6_mg": 0.032,
      "folate_ug": null,
      "omega3_g": 0.16
    }
  },
  {
    "id": "fraise",
    "name": "Fraise, crue",
    "aliases": [
      "fraises"
    ],
    "category": "berry",
    "ciqualCode": 13014,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "vitamine C"
    ],
    "per100g": {
      "energyKcal": 35.1,
      "proteins_g": 0.63,
      "carbs_g": 6.03,
      "fat_g": null,
      "sugars_g": 5.6,
      "fiber_g": 3.8,
      "satFat_g": null,
      "salt_g": null,
      "calcium_mg": 18.0,
      "iron_mg": 0.19,
      "magnesium_mg": 12.0,
      "zinc_mg": 0.11,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 54.0,
      "vitaminB6_mg": 0.04,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "cassis",
    "name": "Cassis, cru",
    "aliases": [],
    "category": "berry",
    "ciqualCode": 13007,
    "novaGroup": 1,
    "inflammationScore": -5,
    "tags": [
      "vitamine C",
      "polyphénols"
    ],
    "per100g": {
      "energyKcal": 70.2,
      "proteins_g": 1.4,
      "carbs_g": 9.68,
      "fat_g": 0.41,
      "sugars_g": 9.68,
      "fiber_g": 7.13,
      "satFat_g": 0.034,
      "salt_g": 0.005,
      "calcium_mg": 55.0,
      "iron_mg": 1.54,
      "magnesium_mg": 24.0,
      "zinc_mg": 0.27,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 181.0,
      "vitaminB6_mg": 0.066,
      "folate_ug": null,
      "omega3_g": 0.06
    }
  },
  {
    "id": "orange",
    "name": "Orange, chair sans peau, sans pépins, crue",
    "aliases": [
      "oranges"
    ],
    "category": "fruit",
    "ciqualCode": 13034,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "vitamine C"
    ],
    "per100g": {
      "energyKcal": 42.0,
      "proteins_g": 0.75,
      "carbs_g": 8.03,
      "fat_g": null,
      "sugars_g": 7.6,
      "fiber_g": 2.7,
      "satFat_g": null,
      "salt_g": null,
      "calcium_mg": 66.0,
      "iron_mg": 0.57,
      "magnesium_mg": 15.0,
      "zinc_mg": 0.25,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 47.5,
      "vitaminB6_mg": null,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "clementine",
    "name": "Clémentine ou mandarine, chair sans peau, sans pépins, crue",
    "aliases": [
      "mandarine"
    ],
    "category": "fruit",
    "ciqualCode": 13024,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "vitamine C"
    ],
    "per100g": {
      "energyKcal": 45.5,
      "proteins_g": 0.81,
      "carbs_g": 9.17,
      "fat_g": null,
      "sugars_g": 8.6,
      "fiber_g": 1.7,
      "satFat_g": null,
      "salt_g": null,
      "calcium_mg": 23.0,
      "iron_mg": 0.09,
      "magnesium_mg": 9.3,
      "zinc_mg": 0.1,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 49.2,
      "vitaminB6_mg": 0.079,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "citron",
    "name": "Citron, chair sans peau, sans pépins, cru",
    "aliases": [
      "citrons"
    ],
    "category": "fruit",
    "ciqualCode": 13009,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "vitamine C"
    ],
    "per100g": {
      "energyKcal": 24.3,
      "proteins_g": 0.25,
      "carbs_g": 1.56,
      "fat_g": null,
      "sugars_g": 0.8,
      "fiber_g": null,
      "satFat_g": null,
      "salt_g": null,
      "calcium_mg": 11.0,
      "iron_mg": 0.15,
      "magnesium_mg": 7.9,
      "zinc_mg": 0.33,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 45.0,
      "vitaminB6_mg": 0.023,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "pamplemousse",
    "name": "Pomelo (dit Pamplemousse), chair sans peau, sans pépins, cru",
    "aliases": [
      "pomelo"
    ],
    "category": "fruit",
    "ciqualCode": 13040,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "vitamine C"
    ],
    "per100g": {
      "energyKcal": 33.5,
      "proteins_g": 0.84,
      "carbs_g": 5.92,
      "fat_g": null,
      "sugars_g": 5.87,
      "fiber_g": 1.1,
      "satFat_g": null,
      "salt_g": null,
      "calcium_mg": 23.0,
      "iron_mg": null,
      "magnesium_mg": 9.97,
      "zinc_mg": null,
      "vitaminD_ug": null,
      "vitaminC_mg": 36.4,
      "vitaminB6_mg": 0.06,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "pomme",
    "name": "Pomme, chair et peau, crue",
    "aliases": [
      "pommes"
    ],
    "category": "fruit",
    "ciqualCode": 13039,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 54.0,
      "proteins_g": 0.25,
      "carbs_g": 11.6,
      "fat_g": 0.25,
      "sugars_g": 10.6,
      "fiber_g": 1.4,
      "satFat_g": 0.052,
      "salt_g": 0.0037,
      "calcium_mg": 5.34,
      "iron_mg": 0.099,
      "magnesium_mg": 6.47,
      "zinc_mg": 0.031,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 4.6,
      "vitaminB6_mg": 0.044,
      "folate_ug": null,
      "omega3_g": 0.005
    }
  },
  {
    "id": "poire",
    "name": "Poire, chair et peau, crue",
    "aliases": [
      "poires"
    ],
    "category": "fruit",
    "ciqualCode": 13037,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 56.6,
      "proteins_g": 0.36,
      "carbs_g": 12.3,
      "fat_g": 0.27,
      "sugars_g": 9.75,
      "fiber_g": 2.9,
      "satFat_g": 0.067,
      "salt_g": 0.0045,
      "calcium_mg": 6.46,
      "iron_mg": 0.072,
      "magnesium_mg": 8.23,
      "zinc_mg": 0.097,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 4.3,
      "vitaminB6_mg": 0.029,
      "folate_ug": null,
      "omega3_g": 0.012
    }
  },
  {
    "id": "banane",
    "name": "Banane, chair sans peau, crue",
    "aliases": [
      "bananes"
    ],
    "category": "fruit",
    "ciqualCode": 13005,
    "novaGroup": 1,
    "inflammationScore": -2,
    "tags": [
      "magnésium"
    ],
    "per100g": {
      "energyKcal": 87.6,
      "proteins_g": 1.06,
      "carbs_g": 19.7,
      "fat_g": null,
      "sugars_g": 15.6,
      "fiber_g": 2.7,
      "satFat_g": null,
      "salt_g": null,
      "calcium_mg": 5.1,
      "iron_mg": 0.2,
      "magnesium_mg": 28.0,
      "zinc_mg": 0.14,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 7.16,
      "vitaminB6_mg": 0.18,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "kiwi",
    "name": "Kiwi, chair sans peau, avec pépins, cru",
    "aliases": [
      "kiwis"
    ],
    "category": "fruit",
    "ciqualCode": 13021,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "vitamine C"
    ],
    "per100g": {
      "energyKcal": 60.9,
      "proteins_g": 0.88,
      "carbs_g": 11.0,
      "fat_g": 0.6,
      "sugars_g": 8.9,
      "fiber_g": 2.4,
      "satFat_g": 0.13,
      "salt_g": null,
      "calcium_mg": 29.0,
      "iron_mg": 0.16,
      "magnesium_mg": 12.0,
      "zinc_mg": 0.12,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 81.9,
      "vitaminB6_mg": 0.036,
      "folate_ug": null,
      "omega3_g": 0.18
    }
  },
  {
    "id": "raisin",
    "name": "Raisin noir, cru",
    "aliases": [
      "raisins"
    ],
    "category": "fruit",
    "ciqualCode": 13045,
    "novaGroup": 1,
    "inflammationScore": -2,
    "tags": [
      "polyphénols"
    ],
    "per100g": {
      "energyKcal": 69.5,
      "proteins_g": 0.57,
      "carbs_g": 15.6,
      "fat_g": 0.25,
      "sugars_g": 15.3,
      "fiber_g": 1.43,
      "satFat_g": 0.08,
      "salt_g": null,
      "calcium_mg": 8.98,
      "iron_mg": 0.3,
      "magnesium_mg": 6.78,
      "zinc_mg": 0.038,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 8.4,
      "vitaminB6_mg": 0.07,
      "folate_ug": null,
      "omega3_g": 0.017
    }
  },
  {
    "id": "peche",
    "name": "Pêche, chair et peau, sans noyau, crue",
    "aliases": [
      "pêche"
    ],
    "category": "fruit",
    "ciqualCode": 13043,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [],
    "per100g": {
      "energyKcal": 37.9,
      "proteins_g": 0.91,
      "carbs_g": 7.55,
      "fat_g": 0.25,
      "sugars_g": 6.83,
      "fiber_g": 1.5,
      "satFat_g": 0.019,
      "salt_g": null,
      "calcium_mg": 7.32,
      "iron_mg": 0.15,
      "magnesium_mg": 11.2,
      "zinc_mg": 0.12,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 6.6,
      "vitaminB6_mg": 0.025,
      "folate_ug": null,
      "omega3_g": 0.002
    }
  },
  {
    "id": "abricot",
    "name": "Abricot, dénoyauté, cru",
    "aliases": [
      "abricots"
    ],
    "category": "fruit",
    "ciqualCode": 13000,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [],
    "per100g": {
      "energyKcal": 44.1,
      "proteins_g": 0.81,
      "carbs_g": 9.01,
      "fat_g": null,
      "sugars_g": 6.7,
      "fiber_g": 1.7,
      "satFat_g": null,
      "salt_g": null,
      "calcium_mg": 15.0,
      "iron_mg": 0.19,
      "magnesium_mg": 8.4,
      "zinc_mg": 0.09,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 2.55,
      "vitaminB6_mg": 0.054,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "mangue",
    "name": "Mangue, chair sans peau, sans noyau, crue",
    "aliases": [
      "mangues"
    ],
    "category": "fruit",
    "ciqualCode": 13025,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [],
    "per100g": {
      "energyKcal": 71.1,
      "proteins_g": 0.63,
      "carbs_g": 14.3,
      "fat_g": null,
      "sugars_g": 12.9,
      "fiber_g": 1.6,
      "satFat_g": null,
      "salt_g": null,
      "calcium_mg": 12.0,
      "iron_mg": 0.09,
      "magnesium_mg": 11.0,
      "zinc_mg": 0.11,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 25.0,
      "vitaminB6_mg": 0.1,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "ananas",
    "name": "Ananas, chair sans peau, cru",
    "aliases": [],
    "category": "fruit",
    "ciqualCode": 13002,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [],
    "per100g": {
      "energyKcal": 51.6,
      "proteins_g": 0.25,
      "carbs_g": 11.7,
      "fat_g": null,
      "sugars_g": 10.5,
      "fiber_g": 1.2,
      "satFat_g": null,
      "salt_g": null,
      "calcium_mg": 8.0,
      "iron_mg": 0.17,
      "magnesium_mg": 15.0,
      "zinc_mg": 0.08,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 46.1,
      "vitaminB6_mg": 0.052,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "grenade",
    "name": "Grenade, chair sans peau, avec pépins, crue",
    "aliases": [],
    "category": "fruit",
    "ciqualCode": 13018,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "polyphénols"
    ],
    "per100g": {
      "energyKcal": 81.0,
      "proteins_g": 1.44,
      "carbs_g": 14.3,
      "fat_g": 1.2,
      "sugars_g": 13.3,
      "fiber_g": 2.3,
      "satFat_g": 0.07,
      "salt_g": null,
      "calcium_mg": 9.5,
      "iron_mg": 0.17,
      "magnesium_mg": 12.0,
      "zinc_mg": 0.22,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 9.02,
      "vitaminB6_mg": 0.032,
      "folate_ug": null,
      "omega3_g": 0.0
    }
  },
  {
    "id": "datte",
    "name": "Datte, chair et peau, sans noyau, sèche",
    "aliases": [
      "dattes"
    ],
    "category": "fruit",
    "ciqualCode": 13011,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 287.0,
      "proteins_g": 1.81,
      "carbs_g": 64.7,
      "fat_g": 0.25,
      "sugars_g": 64.7,
      "fiber_g": 7.3,
      "satFat_g": 0.075,
      "salt_g": 0.098,
      "calcium_mg": 44.9,
      "iron_mg": 0.9,
      "magnesium_mg": 47.3,
      "zinc_mg": 0.23,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.25,
      "folate_ug": null,
      "omega3_g": 0.007
    }
  },
  {
    "id": "pruneau",
    "name": "Pruneau, sans noyau, sec",
    "aliases": [
      "pruneaux"
    ],
    "category": "fruit",
    "ciqualCode": 13042,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 229.0,
      "proteins_g": 1.63,
      "carbs_g": 55.4,
      "fat_g": 0.4,
      "sugars_g": 38.1,
      "fiber_g": 5.1,
      "satFat_g": 0.16,
      "salt_g": null,
      "calcium_mg": 50.0,
      "iron_mg": 0.38,
      "magnesium_mg": 30.0,
      "zinc_mg": 0.28,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.25,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "lentilles",
    "name": "Lentille verte, bouillie/cuite à l'eau",
    "aliases": [
      "lentille"
    ],
    "category": "legume",
    "ciqualCode": 20587,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "fer",
      "fibres",
      "protéines"
    ],
    "per100g": {
      "energyKcal": 125.0,
      "proteins_g": 10.1,
      "carbs_g": 16.2,
      "fat_g": 0.58,
      "sugars_g": 0.2,
      "fiber_g": 8.45,
      "satFat_g": 0.093,
      "salt_g": 0.015,
      "calcium_mg": 39.5,
      "iron_mg": 2.45,
      "magnesium_mg": 34.0,
      "zinc_mg": 1.25,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.11,
      "folate_ug": null,
      "omega3_g": 0.032
    }
  },
  {
    "id": "lentilles-corail",
    "name": "Lentille corail, bouillie/cuite à l'eau",
    "aliases": [
      "lentille corail"
    ],
    "category": "legume",
    "ciqualCode": 20589,
    "novaGroup": 1,
    "inflammationScore": -5,
    "tags": [
      "fer",
      "protéines"
    ],
    "per100g": {
      "energyKcal": 123.0,
      "proteins_g": 10.6,
      "carbs_g": 15.0,
      "fat_g": 0.5,
      "sugars_g": 0.26,
      "fiber_g": 8.2,
      "satFat_g": 0.09,
      "salt_g": null,
      "calcium_mg": 21.0,
      "iron_mg": 2.2,
      "magnesium_mg": 25.0,
      "zinc_mg": 1.3,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.082,
      "folate_ug": null,
      "omega3_g": 0.06
    }
  },
  {
    "id": "pois-chiches",
    "name": "Pois chiche, bouilli/cuit à l'eau",
    "aliases": [
      "pois chiche"
    ],
    "category": "legume",
    "ciqualCode": 20507,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "fer",
      "fibres",
      "folates"
    ],
    "per100g": {
      "energyKcal": 148.0,
      "proteins_g": 8.31,
      "carbs_g": 17.7,
      "fat_g": 3.0,
      "sugars_g": 0.3,
      "fiber_g": 8.2,
      "satFat_g": 0.46,
      "salt_g": 0.027,
      "calcium_mg": 72.0,
      "iron_mg": 1.3,
      "magnesium_mg": 44.0,
      "zinc_mg": 1.1,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.09,
      "folate_ug": null,
      "omega3_g": 0.08
    }
  },
  {
    "id": "haricots-rouges",
    "name": "Haricot rouge, bouilli/cuit à l'eau",
    "aliases": [
      "haricot rouge"
    ],
    "category": "legume",
    "ciqualCode": 20503,
    "novaGroup": 1,
    "inflammationScore": -5,
    "tags": [
      "fer",
      "fibres"
    ],
    "per100g": {
      "energyKcal": 116.0,
      "proteins_g": 9.63,
      "carbs_g": 12.3,
      "fat_g": 0.6,
      "sugars_g": 0.5,
      "fiber_g": 11.6,
      "satFat_g": 0.19,
      "salt_g": 0.021,
      "calcium_mg": 55.0,
      "iron_mg": 2.3,
      "magnesium_mg": 39.0,
      "zinc_mg": 0.94,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.067,
      "folate_ug": null,
      "omega3_g": 0.13
    }
  },
  {
    "id": "haricots-blancs",
    "name": "Haricot blanc, bouilli/cuit à l'eau",
    "aliases": [
      "haricot blanc"
    ],
    "category": "legume",
    "ciqualCode": 20502,
    "novaGroup": 1,
    "inflammationScore": -5,
    "tags": [
      "fibres",
      "calcium"
    ],
    "per100g": {
      "energyKcal": 112.0,
      "proteins_g": 6.75,
      "carbs_g": 12.0,
      "fat_g": 1.1,
      "sugars_g": 0.3,
      "fiber_g": 13.8,
      "satFat_g": 0.25,
      "salt_g": 0.023,
      "calcium_mg": 120.0,
      "iron_mg": 1.7,
      "magnesium_mg": 33.0,
      "zinc_mg": 0.67,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.039,
      "folate_ug": null,
      "omega3_g": 0.37
    }
  },
  {
    "id": "feves",
    "name": "Fève, bouillie/cuite à l'eau",
    "aliases": [
      "fève"
    ],
    "category": "legume",
    "ciqualCode": 20500,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "folates"
    ],
    "per100g": {
      "energyKcal": 83.3,
      "proteins_g": 8.06,
      "carbs_g": 9.35,
      "fat_g": 0.8,
      "sugars_g": 0.4,
      "fiber_g": 3.1,
      "satFat_g": 0.16,
      "salt_g": 0.025,
      "calcium_mg": 37.0,
      "iron_mg": 1.5,
      "magnesium_mg": 37.0,
      "zinc_mg": 1.0,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.037,
      "folate_ug": null,
      "omega3_g": 0.04
    }
  },
  {
    "id": "tofu",
    "name": "Tofu nature, préemballé",
    "aliases": [],
    "category": "soy",
    "ciqualCode": 20904,
    "novaGroup": 3,
    "inflammationScore": -3,
    "tags": [
      "protéines",
      "fer",
      "calcium"
    ],
    "per100g": {
      "energyKcal": 147.0,
      "proteins_g": 13.4,
      "carbs_g": 2.87,
      "fat_g": 8.5,
      "sugars_g": 0.57,
      "fiber_g": null,
      "satFat_g": 1.35,
      "salt_g": 0.025,
      "calcium_mg": 100.0,
      "iron_mg": 2.4,
      "magnesium_mg": 100.0,
      "zinc_mg": 1.3,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.028,
      "folate_ug": 25.1,
      "omega3_g": 0.55
    }
  },
  {
    "id": "quinoa",
    "name": "Quinoa, bouilli/cuit à l'eau, sans sel ajouté",
    "aliases": [],
    "category": "wholegrain",
    "ciqualCode": 9341,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "magnésium",
      "protéines"
    ],
    "per100g": {
      "energyKcal": 149.0,
      "proteins_g": 4.66,
      "carbs_g": 27.9,
      "fat_g": 1.1,
      "sugars_g": 0.87,
      "fiber_g": 3.8,
      "satFat_g": 0.14,
      "salt_g": 0.015,
      "calcium_mg": 23.0,
      "iron_mg": 1.6,
      "magnesium_mg": 71.0,
      "zinc_mg": 1.2,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.089,
      "folate_ug": null,
      "omega3_g": 0.07
    }
  },
  {
    "id": "riz-complet",
    "name": "Riz complet, cuit, sans sel ajouté",
    "aliases": [
      "riz brun"
    ],
    "category": "wholegrain",
    "ciqualCode": 9103,
    "novaGroup": 1,
    "inflammationScore": -2,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 187.0,
      "proteins_g": 3.87,
      "carbs_g": 37.6,
      "fat_g": 1.8,
      "sugars_g": 0.13,
      "fiber_g": 2.1,
      "satFat_g": 0.43,
      "salt_g": 0.035,
      "calcium_mg": 28.6,
      "iron_mg": 0.44,
      "magnesium_mg": 57.8,
      "zinc_mg": 0.9,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": null,
      "vitaminB6_mg": null,
      "folate_ug": null,
      "omega3_g": 0.023
    }
  },
  {
    "id": "riz-blanc",
    "name": "Riz blanc, cuit, sans sel ajouté",
    "aliases": [
      "riz"
    ],
    "category": "refined_grain",
    "ciqualCode": 9104,
    "novaGroup": 1,
    "inflammationScore": 1,
    "tags": [],
    "per100g": {
      "energyKcal": 155.0,
      "proteins_g": 3.15,
      "carbs_g": 33.2,
      "fat_g": 0.7,
      "sugars_g": 0.0,
      "fiber_g": 1.4,
      "satFat_g": 0.17,
      "salt_g": 0.045,
      "calcium_mg": 6.3,
      "iron_mg": null,
      "magnesium_mg": 9.03,
      "zinc_mg": null,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": null,
      "vitaminB6_mg": null,
      "folate_ug": null,
      "omega3_g": 0.006
    }
  },
  {
    "id": "flocons-avoine",
    "name": "Flocons d'avoine",
    "aliases": [
      "avoine",
      "porridge"
    ],
    "category": "wholegrain",
    "ciqualCode": 32140,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "fibres",
      "magnésium"
    ],
    "per100g": {
      "energyKcal": 369.0,
      "proteins_g": 10.6,
      "carbs_g": 57.7,
      "fat_g": 7.82,
      "sugars_g": 1.04,
      "fiber_g": 11.2,
      "satFat_g": 1.37,
      "salt_g": 0.011,
      "calcium_mg": 52.0,
      "iron_mg": 3.8,
      "magnesium_mg": 101.0,
      "zinc_mg": 2.6,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.1,
      "folate_ug": null,
      "omega3_g": 0.065
    }
  },
  {
    "id": "pain-complet",
    "name": "Pain complet ou intégral (à la farine T150)",
    "aliases": [],
    "category": "wholegrain",
    "ciqualCode": 7110,
    "novaGroup": 3,
    "inflammationScore": -1,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 234.0,
      "proteins_g": 8.66,
      "carbs_g": 41.2,
      "fat_g": 1.7,
      "sugars_g": 2.41,
      "fiber_g": 7.3,
      "satFat_g": 0.56,
      "salt_g": 1.17,
      "calcium_mg": 83.2,
      "iron_mg": 2.0,
      "magnesium_mg": 54.2,
      "zinc_mg": 1.2,
      "vitaminD_ug": 0.86,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.12,
      "folate_ug": null,
      "omega3_g": 0.052
    }
  },
  {
    "id": "pain-blanc",
    "name": "Pain blanc (par ex. : baguette, boule…)",
    "aliases": [
      "baguette"
    ],
    "category": "refined_grain",
    "ciqualCode": 7001,
    "novaGroup": 3,
    "inflammationScore": 1,
    "tags": [],
    "per100g": {
      "energyKcal": 287.0,
      "proteins_g": 8.27,
      "carbs_g": 58.3,
      "fat_g": 1.4,
      "sugars_g": 2.3,
      "fiber_g": 2.7,
      "satFat_g": 0.45,
      "salt_g": 1.25,
      "calcium_mg": 22.0,
      "iron_mg": 1.2,
      "magnesium_mg": 23.0,
      "zinc_mg": 0.73,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": null,
      "folate_ug": null,
      "omega3_g": 0.04
    }
  },
  {
    "id": "pates-completes",
    "name": "Pâtes sèches, au blé complet, cuites, sans sel ajouté",
    "aliases": [
      "pâtes complètes"
    ],
    "category": "wholegrain",
    "ciqualCode": 9871,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 179.0,
      "proteins_g": 7.35,
      "carbs_g": 31.3,
      "fat_g": 1.4,
      "sugars_g": 0.94,
      "fiber_g": 5.1,
      "satFat_g": 0.27,
      "salt_g": 0.055,
      "calcium_mg": 25.1,
      "iron_mg": 1.5,
      "magnesium_mg": 45.8,
      "zinc_mg": 1.4,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.04,
      "folate_ug": 4.3,
      "omega3_g": 0.054
    }
  },
  {
    "id": "pates",
    "name": "Pâtes sèches, standard, cuites, sans sel ajouté",
    "aliases": [
      "pâtes"
    ],
    "category": "refined_grain",
    "ciqualCode": 9811,
    "novaGroup": 1,
    "inflammationScore": 1,
    "tags": [],
    "per100g": {
      "energyKcal": 167.0,
      "proteins_g": 6.1,
      "carbs_g": 31.4,
      "fat_g": 1.1,
      "sugars_g": 0.87,
      "fiber_g": 2.2,
      "satFat_g": 0.2,
      "salt_g": 0.048,
      "calcium_mg": 18.0,
      "iron_mg": 0.68,
      "magnesium_mg": 21.9,
      "zinc_mg": 0.51,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": null,
      "vitaminB6_mg": null,
      "folate_ug": 5.2,
      "omega3_g": 0.028
    }
  },
  {
    "id": "boulgour",
    "name": "Boulgour de blé, cuit, sans sel ajouté",
    "aliases": [
      "boulghour"
    ],
    "category": "wholegrain",
    "ciqualCode": 9691,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 131.0,
      "proteins_g": 4.31,
      "carbs_g": 24.1,
      "fat_g": 1.0,
      "sugars_g": 0.0,
      "fiber_g": 3.7,
      "satFat_g": 0.16,
      "salt_g": 0.033,
      "calcium_mg": 30.9,
      "iron_mg": 0.67,
      "magnesium_mg": 28.5,
      "zinc_mg": 0.82,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": null,
      "vitaminB6_mg": null,
      "folate_ug": null,
      "omega3_g": 0.028
    }
  },
  {
    "id": "sarrasin",
    "name": "Sarrasin complet, cru",
    "aliases": [
      "kasha"
    ],
    "category": "wholegrain",
    "ciqualCode": 9380,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "magnésium"
    ],
    "per100g": {
      "energyKcal": 362.0,
      "proteins_g": 13.3,
      "carbs_g": 67.5,
      "fat_g": 3.4,
      "sugars_g": null,
      "fiber_g": 4.0,
      "satFat_g": 0.74,
      "salt_g": 0.0025,
      "calcium_mg": 18.0,
      "iron_mg": 2.2,
      "magnesium_mg": 231.0,
      "zinc_mg": 2.4,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.21,
      "folate_ug": null,
      "omega3_g": 0.078
    }
  },
  {
    "id": "muesli",
    "name": "Muesli non enrichi en vitamines et minéraux (aliment moyen)",
    "aliases": [],
    "category": "wholegrain",
    "ciqualCode": 32141,
    "novaGroup": 3,
    "inflammationScore": -3,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 409.0,
      "proteins_g": 9.63,
      "carbs_g": 61.8,
      "fat_g": 11.6,
      "sugars_g": 17.2,
      "fiber_g": 8.36,
      "satFat_g": 3.3,
      "salt_g": 0.093,
      "calcium_mg": 41.3,
      "iron_mg": 3.04,
      "magnesium_mg": 88.6,
      "zinc_mg": 1.95,
      "vitaminD_ug": null,
      "vitaminC_mg": 3.49,
      "vitaminB6_mg": 0.14,
      "folate_ug": null,
      "omega3_g": 0.14
    }
  },
  {
    "id": "saumon-atlantique",
    "name": "Saumon, élevage, cru",
    "aliases": [
      "saumon"
    ],
    "category": "fish_fatty",
    "ciqualCode": 26036,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "oméga-3",
      "vitamine D"
    ],
    "per100g": {
      "energyKcal": 193.0,
      "proteins_g": 20.5,
      "carbs_g": 0.0,
      "fat_g": 12.4,
      "sugars_g": 0.0,
      "fiber_g": null,
      "satFat_g": 2.15,
      "salt_g": 0.16,
      "calcium_mg": 5.84,
      "iron_mg": 0.48,
      "magnesium_mg": 27.4,
      "zinc_mg": 0.36,
      "vitaminD_ug": 4.92,
      "vitaminC_mg": 1.8,
      "vitaminB6_mg": 0.58,
      "folate_ug": 20.8,
      "omega3_g": 1.82
    }
  },
  {
    "id": "sardine",
    "name": "Sardine, crue",
    "aliases": [
      "sardines"
    ],
    "category": "fish_fatty",
    "ciqualCode": 26065,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "oméga-3",
      "calcium"
    ],
    "per100g": {
      "energyKcal": 160.0,
      "proteins_g": 19.5,
      "carbs_g": 0.0,
      "fat_g": 9.17,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 2.66,
      "salt_g": 0.22,
      "calcium_mg": 57.5,
      "iron_mg": 1.67,
      "magnesium_mg": 36.0,
      "zinc_mg": 1.5,
      "vitaminD_ug": 14.0,
      "vitaminC_mg": 2.5,
      "vitaminB6_mg": 0.47,
      "folate_ug": 3.18,
      "omega3_g": 3.48
    }
  },
  {
    "id": "sardine-conserve",
    "name": "Sardine, à l'huile d'olive, appertisée, égouttée",
    "aliases": [
      "sardines en boîte"
    ],
    "category": "fish_fatty",
    "ciqualCode": 26040,
    "novaGroup": 3,
    "inflammationScore": -5,
    "tags": [
      "oméga-3",
      "calcium"
    ],
    "per100g": {
      "energyKcal": 224.0,
      "proteins_g": 23.3,
      "carbs_g": 0.11,
      "fat_g": 14.5,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 3.07,
      "salt_g": 0.79,
      "calcium_mg": 432.0,
      "iron_mg": 2.5,
      "magnesium_mg": 44.0,
      "zinc_mg": 1.8,
      "vitaminD_ug": 10.3,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.22,
      "folate_ug": null,
      "omega3_g": 1.861
    }
  },
  {
    "id": "maquereau",
    "name": "Maquereau, cru",
    "aliases": [
      "maquereaux"
    ],
    "category": "fish_fatty",
    "ciqualCode": 26051,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "oméga-3"
    ],
    "per100g": {
      "energyKcal": 198.0,
      "proteins_g": 18.1,
      "carbs_g": 0.93,
      "fat_g": 13.5,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 3.22,
      "salt_g": 0.16,
      "calcium_mg": 4.92,
      "iron_mg": 0.48,
      "magnesium_mg": 28.4,
      "zinc_mg": 0.6,
      "vitaminD_ug": 6.44,
      "vitaminC_mg": 0.2,
      "vitaminB6_mg": 0.53,
      "folate_ug": 8.16,
      "omega3_g": 2.59
    }
  },
  {
    "id": "truite",
    "name": "Truite saumonée, crue",
    "aliases": [
      "truites"
    ],
    "category": "fish_fatty",
    "ciqualCode": 27021,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "oméga-3",
      "vitamine D"
    ],
    "per100g": {
      "energyKcal": 143.0,
      "proteins_g": 19.2,
      "carbs_g": 0.0,
      "fat_g": 7.4,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 1.2,
      "salt_g": 0.2,
      "calcium_mg": 46.7,
      "iron_mg": 0.52,
      "magnesium_mg": 30.5,
      "zinc_mg": 0.61,
      "vitaminD_ug": 18.7,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": null,
      "folate_ug": 22.0,
      "omega3_g": null
    }
  },
  {
    "id": "hareng",
    "name": "Hareng, cru",
    "aliases": [
      "harengs"
    ],
    "category": "fish_fatty",
    "ciqualCode": 26011,
    "novaGroup": 1,
    "inflammationScore": -5,
    "tags": [
      "oméga-3",
      "vitamine D"
    ],
    "per100g": {
      "energyKcal": 176.0,
      "proteins_g": 17.7,
      "carbs_g": 0.0,
      "fat_g": 11.7,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 2.82,
      "salt_g": 0.22,
      "calcium_mg": 61.6,
      "iron_mg": 1.21,
      "magnesium_mg": 27.0,
      "zinc_mg": 0.79,
      "vitaminD_ug": 10.7,
      "vitaminC_mg": 0.75,
      "vitaminB6_mg": 0.38,
      "folate_ug": 9.4,
      "omega3_g": 1.9
    }
  },
  {
    "id": "thon-conserve",
    "name": "Thon, au naturel, appertisé, égoutté",
    "aliases": [
      "thon en boîte",
      "thon"
    ],
    "category": "fish_lean",
    "ciqualCode": 26039,
    "novaGroup": 3,
    "inflammationScore": -3,
    "tags": [
      "protéines"
    ],
    "per100g": {
      "energyKcal": 143.0,
      "proteins_g": 26.8,
      "carbs_g": 0.0,
      "fat_g": 3.94,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 1.01,
      "salt_g": 0.74,
      "calcium_mg": 6.26,
      "iron_mg": 0.76,
      "magnesium_mg": 24.0,
      "zinc_mg": 0.45,
      "vitaminD_ug": 5.08,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.44,
      "folate_ug": 16.3,
      "omega3_g": 1.082
    }
  },
  {
    "id": "cabillaud",
    "name": "Cabillaud, cru",
    "aliases": [
      "morue fraîche"
    ],
    "category": "fish_lean",
    "ciqualCode": 26043,
    "novaGroup": 1,
    "inflammationScore": -2,
    "tags": [
      "protéines"
    ],
    "per100g": {
      "energyKcal": 77.4,
      "proteins_g": 18.1,
      "carbs_g": 0.0,
      "fat_g": 0.57,
      "sugars_g": 0.0,
      "fiber_g": null,
      "satFat_g": 0.1,
      "salt_g": 0.23,
      "calcium_mg": 4.43,
      "iron_mg": 0.49,
      "magnesium_mg": 25.6,
      "zinc_mg": 0.39,
      "vitaminD_ug": null,
      "vitaminC_mg": 1.0,
      "vitaminB6_mg": 0.16,
      "folate_ug": 21.2,
      "omega3_g": 0.181
    }
  },
  {
    "id": "crevette",
    "name": "Crevette, cuite",
    "aliases": [
      "crevettes"
    ],
    "category": "seafood",
    "ciqualCode": 10007,
    "novaGroup": 1,
    "inflammationScore": -1,
    "tags": [
      "protéines"
    ],
    "per100g": {
      "energyKcal": 91.3,
      "proteins_g": 20.5,
      "carbs_g": 0.2,
      "fat_g": 0.79,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 0.25,
      "salt_g": 1.61,
      "calcium_mg": 177.0,
      "iron_mg": 2.24,
      "magnesium_mg": 50.0,
      "zinc_mg": 0.97,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.15,
      "folate_ug": 14.6,
      "omega3_g": 0.121
    }
  },
  {
    "id": "moule",
    "name": "Moule, bouillie/cuite à l'eau",
    "aliases": [
      "moules"
    ],
    "category": "seafood",
    "ciqualCode": 10013,
    "novaGroup": 1,
    "inflammationScore": -2,
    "tags": [
      "fer",
      "zinc"
    ],
    "per100g": {
      "energyKcal": 108.0,
      "proteins_g": 17.2,
      "carbs_g": 5.12,
      "fat_g": 2.09,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 0.37,
      "salt_g": 0.8,
      "calcium_mg": 59.4,
      "iron_mg": 3.99,
      "magnesium_mg": 66.6,
      "zinc_mg": 2.85,
      "vitaminD_ug": null,
      "vitaminC_mg": 5.87,
      "vitaminB6_mg": 0.044,
      "folate_ug": 48.0,
      "omega3_g": 0.523
    }
  },
  {
    "id": "huitre",
    "name": "Huître, sans précision, crue",
    "aliases": [
      "huîtres"
    ],
    "category": "seafood",
    "ciqualCode": 10011,
    "novaGroup": 1,
    "inflammationScore": -2,
    "tags": [
      "zinc",
      "fer"
    ],
    "per100g": {
      "energyKcal": 67.2,
      "proteins_g": 8.64,
      "carbs_g": 3.86,
      "fat_g": 1.91,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 0.34,
      "salt_g": 1.45,
      "calcium_mg": 92.7,
      "iron_mg": 2.18,
      "magnesium_mg": 90.2,
      "zinc_mg": 22.5,
      "vitaminD_ug": null,
      "vitaminC_mg": 5.13,
      "vitaminB6_mg": 0.095,
      "folate_ug": 12.5,
      "omega3_g": 0.233
    }
  },
  {
    "id": "oeuf",
    "name": "Oeuf cru",
    "aliases": [
      "oeufs",
      "œuf",
      "œufs"
    ],
    "category": "egg",
    "ciqualCode": 22000,
    "novaGroup": 1,
    "inflammationScore": -1,
    "tags": [
      "protéines"
    ],
    "per100g": {
      "energyKcal": 140.0,
      "proteins_g": 12.8,
      "carbs_g": 0.06,
      "fat_g": 9.83,
      "sugars_g": 0.06,
      "fiber_g": 0.0,
      "satFat_g": 2.64,
      "salt_g": 0.31,
      "calcium_mg": 76.8,
      "iron_mg": 1.75,
      "magnesium_mg": 11.0,
      "zinc_mg": 1.01,
      "vitaminD_ug": 2.0,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.17,
      "folate_ug": 47.0,
      "omega3_g": 0.111
    }
  },
  {
    "id": "poulet",
    "name": "Poulet, filet sans peau cru",
    "aliases": [
      "blanc de poulet",
      "escalope de poulet"
    ],
    "category": "whitemeat",
    "ciqualCode": 36017,
    "novaGroup": 1,
    "inflammationScore": -1,
    "tags": [
      "protéines"
    ],
    "per100g": {
      "energyKcal": 110.0,
      "proteins_g": 23.4,
      "carbs_g": 0.0,
      "fat_g": 1.5,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 0.44,
      "salt_g": 0.11,
      "calcium_mg": 3.3,
      "iron_mg": 0.33,
      "magnesium_mg": 32.0,
      "zinc_mg": 0.52,
      "vitaminD_ug": null,
      "vitaminC_mg": 4.89,
      "vitaminB6_mg": 0.41,
      "folate_ug": 14.6,
      "omega3_g": 0.02
    }
  },
  {
    "id": "dinde",
    "name": "Dinde, escalope crue",
    "aliases": [
      "escalope de dinde"
    ],
    "category": "whitemeat",
    "ciqualCode": 36304,
    "novaGroup": 1,
    "inflammationScore": -1,
    "tags": [
      "protéines"
    ],
    "per100g": {
      "energyKcal": 108.0,
      "proteins_g": 23.7,
      "carbs_g": 0.0,
      "fat_g": 1.48,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 0.29,
      "salt_g": 0.28,
      "calcium_mg": 11.0,
      "iron_mg": 0.73,
      "magnesium_mg": 28.0,
      "zinc_mg": 1.28,
      "vitaminD_ug": 0.1,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.81,
      "folate_ug": 7.0,
      "omega3_g": 0.011
    }
  },
  {
    "id": "boeuf-maigre",
    "name": "Boeuf, steak haché 5% MG cru",
    "aliases": [
      "boeuf",
      "steak"
    ],
    "category": "redmeat",
    "ciqualCode": 6250,
    "novaGroup": 1,
    "inflammationScore": 1,
    "tags": [
      "fer héminique"
    ],
    "per100g": {
      "energyKcal": 130.0,
      "proteins_g": 21.9,
      "carbs_g": 0.3,
      "fat_g": 4.59,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 1.64,
      "salt_g": 0.097,
      "calcium_mg": 9.0,
      "iron_mg": 2.65,
      "magnesium_mg": 22.0,
      "zinc_mg": 4.54,
      "vitaminD_ug": 0.1,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.34,
      "folate_ug": 5.0,
      "omega3_g": 0.024
    }
  },
  {
    "id": "porc-filet",
    "name": "Porc, filet mignon cru",
    "aliases": [
      "filet mignon"
    ],
    "category": "redmeat",
    "ciqualCode": 28204,
    "novaGroup": 1,
    "inflammationScore": 1,
    "tags": [
      "protéines"
    ],
    "per100g": {
      "energyKcal": 123.0,
      "proteins_g": 21.2,
      "carbs_g": 0.4,
      "fat_g": 4.09,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 1.69,
      "salt_g": 0.11,
      "calcium_mg": 8.99,
      "iron_mg": 0.82,
      "magnesium_mg": 27.6,
      "zinc_mg": 1.68,
      "vitaminD_ug": 0.3,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.5,
      "folate_ug": 0.0,
      "omega3_g": 0.02
    }
  },
  {
    "id": "agneau",
    "name": "Agneau, gigot cru",
    "aliases": [
      "gigot"
    ],
    "category": "redmeat",
    "ciqualCode": 21502,
    "novaGroup": 1,
    "inflammationScore": 1,
    "tags": [
      "fer héminique",
      "zinc"
    ],
    "per100g": {
      "energyKcal": 128.0,
      "proteins_g": 20.0,
      "carbs_g": 0.48,
      "fat_g": 5.13,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 1.97,
      "salt_g": 0.12,
      "calcium_mg": 10.0,
      "iron_mg": 1.51,
      "magnesium_mg": 22.0,
      "zinc_mg": 3.0,
      "vitaminD_ug": 0.4,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.26,
      "folate_ug": 18.0,
      "omega3_g": 0.108
    }
  },
  {
    "id": "foie-veau",
    "name": "Foie, veau, cru",
    "aliases": [
      "foie"
    ],
    "category": "redmeat",
    "ciqualCode": 40106,
    "novaGroup": 1,
    "inflammationScore": 1,
    "tags": [
      "fer héminique",
      "vitamine B12"
    ],
    "per100g": {
      "energyKcal": 120.0,
      "proteins_g": 15.5,
      "carbs_g": 5.64,
      "fat_g": 3.4,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 1.31,
      "salt_g": 0.16,
      "calcium_mg": 4.9,
      "iron_mg": 4.6,
      "magnesium_mg": 18.0,
      "zinc_mg": 5.3,
      "vitaminD_ug": 0.62,
      "vitaminC_mg": 9.75,
      "vitaminB6_mg": 0.5,
      "folate_ug": 1180.0,
      "omega3_g": 0.13
    }
  },
  {
    "id": "jambon-blanc",
    "name": "Jambon cuit, supérieur",
    "aliases": [
      "jambon"
    ],
    "category": "processed_meat",
    "ciqualCode": 28900,
    "novaGroup": 4,
    "inflammationScore": 5,
    "tags": [],
    "per100g": {
      "energyKcal": 113.0,
      "proteins_g": 21.0,
      "carbs_g": 0.76,
      "fat_g": 2.83,
      "sugars_g": 0.69,
      "fiber_g": null,
      "satFat_g": 1.1,
      "salt_g": 1.87,
      "calcium_mg": null,
      "iron_mg": 0.54,
      "magnesium_mg": 22.5,
      "zinc_mg": 2.0,
      "vitaminD_ug": null,
      "vitaminC_mg": 18.1,
      "vitaminB6_mg": 0.3,
      "folate_ug": 16.0,
      "omega3_g": 0.086
    }
  },
  {
    "id": "saucisson",
    "name": "Saucisson sec pur porc",
    "aliases": [],
    "category": "processed_meat",
    "ciqualCode": 30301,
    "novaGroup": 4,
    "inflammationScore": 5,
    "tags": [],
    "per100g": {
      "energyKcal": 417.0,
      "proteins_g": 28.7,
      "carbs_g": 1.79,
      "fat_g": 32.3,
      "sugars_g": 1.4,
      "fiber_g": 0.0,
      "satFat_g": 12.2,
      "salt_g": 4.46,
      "calcium_mg": 15.8,
      "iron_mg": 1.68,
      "magnesium_mg": 26.7,
      "zinc_mg": 3.6,
      "vitaminD_ug": 0.55,
      "vitaminC_mg": 5.0,
      "vitaminB6_mg": 0.43,
      "folate_ug": 1.35,
      "omega3_g": 0.27
    }
  },
  {
    "id": "lardons",
    "name": "Lardon nature, cru",
    "aliases": [],
    "category": "processed_meat",
    "ciqualCode": 28501,
    "novaGroup": 4,
    "inflammationScore": 5,
    "tags": [],
    "per100g": {
      "energyKcal": 269.0,
      "proteins_g": 16.6,
      "carbs_g": 1.01,
      "fat_g": 22.1,
      "sugars_g": 0.78,
      "fiber_g": 0.38,
      "satFat_g": 7.91,
      "salt_g": 2.72,
      "calcium_mg": null,
      "iron_mg": 0.42,
      "magnesium_mg": 15.6,
      "zinc_mg": 1.67,
      "vitaminD_ug": 0.75,
      "vitaminC_mg": 0.8,
      "vitaminB6_mg": 0.21,
      "folate_ug": null,
      "omega3_g": 0.184
    }
  },
  {
    "id": "yaourt-nature",
    "name": "Yaourt ou lait fermenté, nature",
    "aliases": [
      "yaourt"
    ],
    "category": "dairy_fermented",
    "ciqualCode": 19593,
    "novaGroup": 1,
    "inflammationScore": -2,
    "tags": [
      "calcium",
      "fermenté"
    ],
    "per100g": {
      "energyKcal": 50.1,
      "proteins_g": 3.83,
      "carbs_g": 4.26,
      "fat_g": 1.68,
      "sugars_g": 4.0,
      "fiber_g": 0.0,
      "satFat_g": 1.08,
      "salt_g": 0.1,
      "calcium_mg": 137.0,
      "iron_mg": null,
      "magnesium_mg": 12.4,
      "zinc_mg": 0.52,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.05,
      "folate_ug": null,
      "omega3_g": 0.011
    }
  },
  {
    "id": "yaourt-grec",
    "name": "Yaourt à la grecque nature",
    "aliases": [
      "yaourt grec"
    ],
    "category": "dairy_fermented",
    "ciqualCode": 19860,
    "novaGroup": 1,
    "inflammationScore": -2,
    "tags": [
      "protéines",
      "calcium"
    ],
    "per100g": {
      "energyKcal": 103.0,
      "proteins_g": 3.02,
      "carbs_g": 3.73,
      "fat_g": 8.16,
      "sugars_g": 3.11,
      "fiber_g": 0.071,
      "satFat_g": 5.26,
      "salt_g": 0.08,
      "calcium_mg": 116.0,
      "iron_mg": null,
      "magnesium_mg": 10.1,
      "zinc_mg": null,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.03,
      "folate_ug": null,
      "omega3_g": 0.025
    }
  },
  {
    "id": "fromage-blanc",
    "name": "Fromage blanc, nature, 2-3% MG",
    "aliases": [],
    "category": "dairy_fermented",
    "ciqualCode": 19646,
    "novaGroup": 1,
    "inflammationScore": -2,
    "tags": [
      "protéines",
      "calcium"
    ],
    "per100g": {
      "energyKcal": 75.7,
      "proteins_g": 7.28,
      "carbs_g": 3.86,
      "fat_g": 3.23,
      "sugars_g": 3.86,
      "fiber_g": 0.019,
      "satFat_g": 2.07,
      "salt_g": 0.088,
      "calcium_mg": 131.0,
      "iron_mg": null,
      "magnesium_mg": 11.9,
      "zinc_mg": 0.54,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.04,
      "folate_ug": null,
      "omega3_g": 0.011
    }
  },
  {
    "id": "lait",
    "name": "Lait demi-écrémé, UHT",
    "aliases": [
      "lait demi-écrémé"
    ],
    "category": "dairy",
    "ciqualCode": 19041,
    "novaGroup": 1,
    "inflammationScore": -1,
    "tags": [
      "calcium"
    ],
    "per100g": {
      "energyKcal": 47.7,
      "proteins_g": 3.48,
      "carbs_g": 5.0,
      "fat_g": 1.56,
      "sugars_g": 4.96,
      "fiber_g": 0.0,
      "satFat_g": 0.97,
      "salt_g": 0.088,
      "calcium_mg": 121.0,
      "iron_mg": null,
      "magnesium_mg": 10.7,
      "zinc_mg": 0.41,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.03,
      "folate_ug": null,
      "omega3_g": 0.007
    }
  },
  {
    "id": "boisson-soja-enrichie",
    "name": "Boisson au soja, nature, enrichie en calcium, préemballée",
    "aliases": [
      "lait de soja"
    ],
    "category": "beverage_healthy",
    "ciqualCode": 18901,
    "novaGroup": 3,
    "inflammationScore": -2,
    "tags": [
      "calcium",
      "protéines"
    ],
    "per100g": {
      "energyKcal": 44.2,
      "proteins_g": 3.42,
      "carbs_g": 2.18,
      "fat_g": 2.05,
      "sugars_g": 2.18,
      "fiber_g": 1.0,
      "satFat_g": 0.26,
      "salt_g": 0.097,
      "calcium_mg": 98.0,
      "iron_mg": 0.45,
      "magnesium_mg": 13.0,
      "zinc_mg": 0.24,
      "vitaminD_ug": 1.16,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.022,
      "folate_ug": 22.3,
      "omega3_g": 0.12
    }
  },
  {
    "id": "boisson-amande",
    "name": "Boisson à l'amande, nature, sans sucres ajoutés, non enrichie, préemballée",
    "aliases": [
      "lait d'amande"
    ],
    "category": "beverage_healthy",
    "ciqualCode": 18107,
    "novaGroup": 4,
    "inflammationScore": 1,
    "tags": [],
    "per100g": {
      "energyKcal": 35.8,
      "proteins_g": 1.06,
      "carbs_g": 0.68,
      "fat_g": 3.2,
      "sugars_g": 0.0,
      "fiber_g": null,
      "satFat_g": 0.31,
      "salt_g": 0.051,
      "calcium_mg": 12.0,
      "iron_mg": 0.1,
      "magnesium_mg": 8.3,
      "zinc_mg": 0.11,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": null,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "comte",
    "name": "Comté",
    "aliases": [
      "comté"
    ],
    "category": "cheese",
    "ciqualCode": 12110,
    "novaGroup": 1,
    "inflammationScore": 1,
    "tags": [
      "calcium"
    ],
    "per100g": {
      "energyKcal": 413.0,
      "proteins_g": 27.8,
      "carbs_g": 0.0,
      "fat_g": 33.8,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 21.7,
      "salt_g": 0.84,
      "calcium_mg": 907.0,
      "iron_mg": 0.49,
      "magnesium_mg": 43.7,
      "zinc_mg": 3.84,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": null,
      "folate_ug": 5.0,
      "omega3_g": 0.235
    }
  },
  {
    "id": "feta",
    "name": "Feta, au lait de brebis 70% minimum et lait de chèvre 30% maximum",
    "aliases": [],
    "category": "cheese",
    "ciqualCode": 12066,
    "novaGroup": 1,
    "inflammationScore": 2,
    "tags": [
      "calcium"
    ],
    "per100g": {
      "energyKcal": 284.0,
      "proteins_g": 15.1,
      "carbs_g": 0.45,
      "fat_g": 24.3,
      "sugars_g": 0.0,
      "fiber_g": 0.2,
      "satFat_g": 16.8,
      "salt_g": 2.27,
      "calcium_mg": 220.0,
      "iron_mg": 0.08,
      "magnesium_mg": 12.0,
      "zinc_mg": 1.2,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": null,
      "folate_ug": 18.9,
      "omega3_g": 0.17
    }
  },
  {
    "id": "mozzarella",
    "name": "Mozzarella au lait de vache",
    "aliases": [],
    "category": "cheese",
    "ciqualCode": 19590,
    "novaGroup": 1,
    "inflammationScore": 1,
    "tags": [
      "calcium"
    ],
    "per100g": {
      "energyKcal": 227.0,
      "proteins_g": 16.5,
      "carbs_g": 0.7,
      "fat_g": 17.7,
      "sugars_g": 0.7,
      "fiber_g": 0.0,
      "satFat_g": 11.7,
      "salt_g": 0.6,
      "calcium_mg": 598.0,
      "iron_mg": 0.44,
      "magnesium_mg": 20.0,
      "zinc_mg": 2.92,
      "vitaminD_ug": 0.4,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.037,
      "folate_ug": 7.0,
      "omega3_g": 0.06
    }
  },
  {
    "id": "chevre",
    "name": "Fromage de chèvre bûche",
    "aliases": [
      "fromage de chèvre"
    ],
    "category": "cheese",
    "ciqualCode": 12812,
    "novaGroup": 1,
    "inflammationScore": 2,
    "tags": [
      "calcium"
    ],
    "per100g": {
      "energyKcal": 285.0,
      "proteins_g": 18.8,
      "carbs_g": 0.0,
      "fat_g": 23.3,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 16.2,
      "salt_g": 1.58,
      "calcium_mg": 190.0,
      "iron_mg": 0.22,
      "magnesium_mg": 12.7,
      "zinc_mg": 0.61,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.16,
      "folate_ug": 76.4,
      "omega3_g": 0.1
    }
  },
  {
    "id": "kefir",
    "name": "Kéfir de lait",
    "aliases": [
      "kéfir"
    ],
    "category": "dairy_fermented",
    "ciqualCode": 19865,
    "novaGroup": 1,
    "inflammationScore": -2,
    "tags": [
      "fermenté"
    ],
    "per100g": {
      "energyKcal": 61.1,
      "proteins_g": 3.19,
      "carbs_g": 4.5,
      "fat_g": 3.4,
      "sugars_g": 3.42,
      "fiber_g": 0.0,
      "satFat_g": 2.33,
      "salt_g": 0.12,
      "calcium_mg": 127.0,
      "iron_mg": 0.05,
      "magnesium_mg": 12.7,
      "zinc_mg": 0.44,
      "vitaminD_ug": 0.1,
      "vitaminC_mg": 0.3,
      "vitaminB6_mg": 0.038,
      "folate_ug": 21.0,
      "omega3_g": 0.027
    }
  },
  {
    "id": "noix",
    "name": "Noix, cerneau, séchée",
    "aliases": [
      "cerneaux de noix"
    ],
    "category": "nut_seed",
    "ciqualCode": 15005,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "oméga-3",
      "polyphénols"
    ],
    "per100g": {
      "energyKcal": 709.0,
      "proteins_g": 13.3,
      "carbs_g": 6.88,
      "fat_g": 67.3,
      "sugars_g": 3.0,
      "fiber_g": 6.7,
      "satFat_g": 6.45,
      "salt_g": null,
      "calcium_mg": 75.0,
      "iron_mg": 2.2,
      "magnesium_mg": 140.0,
      "zinc_mg": 2.7,
      "vitaminD_ug": null,
      "vitaminC_mg": 0.77,
      "vitaminB6_mg": 0.19,
      "folate_ug": null,
      "omega3_g": 7.5
    }
  },
  {
    "id": "amande",
    "name": "Amande, émondée, sans sel ajouté",
    "aliases": [
      "amandes"
    ],
    "category": "nut_seed",
    "ciqualCode": 15041,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "magnésium",
      "calcium"
    ],
    "per100g": {
      "energyKcal": 631.0,
      "proteins_g": 21.4,
      "carbs_g": 8.76,
      "fat_g": 52.5,
      "sugars_g": 4.63,
      "fiber_g": 9.9,
      "satFat_g": 3.95,
      "salt_g": 0.048,
      "calcium_mg": 236.0,
      "iron_mg": 3.28,
      "magnesium_mg": 268.0,
      "zinc_mg": 2.97,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.12,
      "folate_ug": null,
      "omega3_g": 0.0
    }
  },
  {
    "id": "noix-cajou",
    "name": "Noix de cajou, grillée, sans sel ajouté",
    "aliases": [
      "cajou"
    ],
    "category": "nut_seed",
    "ciqualCode": 15054,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "magnésium"
    ],
    "per100g": {
      "energyKcal": 618.0,
      "proteins_g": 17.4,
      "carbs_g": 21.3,
      "fat_g": 48.1,
      "sugars_g": 6.64,
      "fiber_g": 8.4,
      "satFat_g": 8.24,
      "salt_g": 0.015,
      "calcium_mg": 39.0,
      "iron_mg": 5.4,
      "magnesium_mg": 260.0,
      "zinc_mg": 5.0,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.11,
      "folate_ug": null,
      "omega3_g": 0.102
    }
  },
  {
    "id": "noisette",
    "name": "Noisette, sans sel ajouté",
    "aliases": [
      "noisettes"
    ],
    "category": "nut_seed",
    "ciqualCode": 15004,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "magnésium"
    ],
    "per100g": {
      "energyKcal": 632.0,
      "proteins_g": 14.4,
      "carbs_g": 7.16,
      "fat_g": 56.9,
      "sugars_g": 4.9,
      "fiber_g": 11.6,
      "satFat_g": 4.75,
      "salt_g": null,
      "calcium_mg": 120.0,
      "iron_mg": 3.0,
      "magnesium_mg": 160.0,
      "zinc_mg": 2.3,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.21,
      "folate_ug": null,
      "omega3_g": 0.05
    }
  },
  {
    "id": "graines-lin",
    "name": "Lin, graine",
    "aliases": [
      "lin"
    ],
    "category": "nut_seed",
    "ciqualCode": 15034,
    "novaGroup": 1,
    "inflammationScore": -5,
    "tags": [
      "oméga-3",
      "fibres"
    ],
    "per100g": {
      "energyKcal": 528.0,
      "proteins_g": 19.0,
      "carbs_g": 6.49,
      "fat_g": 40.3,
      "sugars_g": 1.64,
      "fiber_g": 24.4,
      "satFat_g": 4.26,
      "salt_g": 0.1,
      "calcium_mg": 223.0,
      "iron_mg": 6.0,
      "magnesium_mg": 336.0,
      "zinc_mg": 6.1,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.31,
      "folate_ug": null,
      "omega3_g": 19.6
    }
  },
  {
    "id": "graines-chia",
    "name": "Chia, graine, séchée",
    "aliases": [
      "chia"
    ],
    "category": "nut_seed",
    "ciqualCode": 15047,
    "novaGroup": 1,
    "inflammationScore": -5,
    "tags": [
      "oméga-3",
      "fibres",
      "calcium"
    ],
    "per100g": {
      "energyKcal": 454.0,
      "proteins_g": 16.5,
      "carbs_g": 7.72,
      "fat_g": 30.7,
      "sugars_g": null,
      "fiber_g": 34.4,
      "satFat_g": 3.33,
      "salt_g": 0.04,
      "calcium_mg": 631.0,
      "iron_mg": 7.72,
      "magnesium_mg": 335.0,
      "zinc_mg": 4.58,
      "vitaminD_ug": null,
      "vitaminC_mg": 1.6,
      "vitaminB6_mg": null,
      "folate_ug": null,
      "omega3_g": 17.8
    }
  },
  {
    "id": "graines-courge",
    "name": "Courge, graine, séchée",
    "aliases": [],
    "category": "nut_seed",
    "ciqualCode": 15064,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "magnésium",
      "fer",
      "zinc"
    ],
    "per100g": {
      "energyKcal": 618.0,
      "proteins_g": 29.5,
      "carbs_g": 5.39,
      "fat_g": 49.1,
      "sugars_g": 1.4,
      "fiber_g": 6.0,
      "satFat_g": 8.66,
      "salt_g": 0.018,
      "calcium_mg": 46.0,
      "iron_mg": 8.82,
      "magnesium_mg": 592.0,
      "zinc_mg": 7.81,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 1.9,
      "vitaminB6_mg": 0.14,
      "folate_ug": null,
      "omega3_g": 0.12
    }
  },
  {
    "id": "graines-tournesol",
    "name": "Tournesol, graine",
    "aliases": [
      "tournesol"
    ],
    "category": "nut_seed",
    "ciqualCode": 15011,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "magnésium"
    ],
    "per100g": {
      "energyKcal": 653.0,
      "proteins_g": 21.3,
      "carbs_g": 10.1,
      "fat_g": 55.5,
      "sugars_g": 2.62,
      "fiber_g": 6.4,
      "satFat_g": 6.23,
      "salt_g": 0.023,
      "calcium_mg": 78.0,
      "iron_mg": 4.9,
      "magnesium_mg": 364.0,
      "zinc_mg": 3.8,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 1.4,
      "vitaminB6_mg": 1.24,
      "folate_ug": null,
      "omega3_g": 0.16
    }
  },
  {
    "id": "sesame",
    "name": "Sésame, graine",
    "aliases": [
      "sésame"
    ],
    "category": "nut_seed",
    "ciqualCode": 15010,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "calcium",
      "fer"
    ],
    "per100g": {
      "energyKcal": 606.0,
      "proteins_g": 17.7,
      "carbs_g": 12.8,
      "fat_g": 49.7,
      "sugars_g": 0.3,
      "fiber_g": 11.8,
      "satFat_g": 6.96,
      "salt_g": null,
      "calcium_mg": 962.0,
      "iron_mg": 14.6,
      "magnesium_mg": 324.0,
      "zinc_mg": 5.74,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.79,
      "folate_ug": null,
      "omega3_g": 0.26
    }
  },
  {
    "id": "huile-olive",
    "name": "Huile d'olive vierge extra",
    "aliases": [
      "huile olive"
    ],
    "category": "oil_healthy",
    "ciqualCode": 17270,
    "novaGroup": 2,
    "inflammationScore": -4,
    "tags": [
      "polyphénols"
    ],
    "per100g": {
      "energyKcal": 899.0,
      "proteins_g": 0.25,
      "carbs_g": 0.0,
      "fat_g": 99.9,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 15.2,
      "salt_g": null,
      "calcium_mg": null,
      "iron_mg": null,
      "magnesium_mg": null,
      "zinc_mg": null,
      "vitaminD_ug": null,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.0,
      "folate_ug": null,
      "omega3_g": 0.65
    }
  },
  {
    "id": "huile-colza",
    "name": "Huile de colza",
    "aliases": [
      "huile de canola"
    ],
    "category": "oil_healthy",
    "ciqualCode": 17130,
    "novaGroup": 2,
    "inflammationScore": -5,
    "tags": [
      "oméga-3"
    ],
    "per100g": {
      "energyKcal": 900.0,
      "proteins_g": 0.0,
      "carbs_g": 0.0,
      "fat_g": 100.0,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 7.26,
      "salt_g": null,
      "calcium_mg": null,
      "iron_mg": 0.023,
      "magnesium_mg": null,
      "zinc_mg": 0.026,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.0,
      "folate_ug": null,
      "omega3_g": 7.83
    }
  },
  {
    "id": "huile-tournesol",
    "name": "Huile de tournesol",
    "aliases": [],
    "category": "oil_other",
    "ciqualCode": 17440,
    "novaGroup": 2,
    "inflammationScore": 2,
    "tags": [],
    "per100g": {
      "energyKcal": 900.0,
      "proteins_g": 0.25,
      "carbs_g": 0.0,
      "fat_g": 100.0,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 11.1,
      "salt_g": 0.025,
      "calcium_mg": null,
      "iron_mg": null,
      "magnesium_mg": null,
      "zinc_mg": null,
      "vitaminD_ug": null,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.0,
      "folate_ug": null,
      "omega3_g": 0.05
    }
  },
  {
    "id": "beurre",
    "name": "Beurre à 80% MG minimum, doux",
    "aliases": [],
    "category": "butter",
    "ciqualCode": 16400,
    "novaGroup": 2,
    "inflammationScore": 3,
    "tags": [],
    "per100g": {
      "energyKcal": 753.0,
      "proteins_g": 0.64,
      "carbs_g": 0.71,
      "fat_g": 83.0,
      "sugars_g": 0.71,
      "fiber_g": 0.0,
      "satFat_g": 60.0,
      "salt_g": 0.035,
      "calcium_mg": 19.8,
      "iron_mg": null,
      "magnesium_mg": 2.63,
      "zinc_mg": null,
      "vitaminD_ug": null,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": null,
      "folate_ug": null,
      "omega3_g": 0.35
    }
  },
  {
    "id": "eau",
    "name": "Eau du robinet",
    "aliases": [
      "eau plate"
    ],
    "category": "beverage_healthy",
    "ciqualCode": 18066,
    "novaGroup": 1,
    "inflammationScore": 0,
    "tags": [],
    "per100g": {
      "energyKcal": 0.0,
      "proteins_g": 0.0,
      "carbs_g": 0.0,
      "fat_g": 0.0,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 0.0,
      "salt_g": 0.0076,
      "calcium_mg": 7.13,
      "iron_mg": 0.03,
      "magnesium_mg": 0.99,
      "zinc_mg": 0.011,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.0,
      "folate_ug": null,
      "omega3_g": 0.0
    }
  },
  {
    "id": "the-vert",
    "name": "Thé infusé, sans sucres ajoutés",
    "aliases": [
      "thé",
      "thé vert"
    ],
    "category": "beverage_healthy",
    "ciqualCode": 18020,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "polyphénols"
    ],
    "per100g": {
      "energyKcal": 0.4,
      "proteins_g": 0.1,
      "carbs_g": 0.0,
      "fat_g": 0.0,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 0.0,
      "salt_g": 0.0041,
      "calcium_mg": 1.1,
      "iron_mg": 0.015,
      "magnesium_mg": 2.0,
      "zinc_mg": 0.025,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.0,
      "folate_ug": 3.25,
      "omega3_g": 0.0
    }
  },
  {
    "id": "tisane",
    "name": "Tisane infusée ou infusion, sans sucres ajoutés",
    "aliases": [
      "infusion"
    ],
    "category": "beverage_healthy",
    "ciqualCode": 18022,
    "novaGroup": 1,
    "inflammationScore": -1,
    "tags": [],
    "per100g": {
      "energyKcal": 0.8,
      "proteins_g": 0.0,
      "carbs_g": 0.2,
      "fat_g": 0.0,
      "sugars_g": 0.0,
      "fiber_g": 0.0,
      "satFat_g": 0.0,
      "salt_g": 0.0025,
      "calcium_mg": 2.0,
      "iron_mg": 0.08,
      "magnesium_mg": 1.0,
      "zinc_mg": 0.04,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.0,
      "folate_ug": 1.0,
      "omega3_g": 0.0
    }
  },
  {
    "id": "cafe",
    "name": "Café expresso, non instantané, sans sucres ajoutés, prêt à boire",
    "aliases": [
      "café noir"
    ],
    "category": "beverage_healthy",
    "ciqualCode": 18071,
    "novaGroup": 1,
    "inflammationScore": -1,
    "tags": [],
    "per100g": {
      "energyKcal": 6.54,
      "proteins_g": 0.25,
      "carbs_g": 1.16,
      "fat_g": 0.2,
      "sugars_g": 0.0,
      "fiber_g": null,
      "satFat_g": 0.092,
      "salt_g": 0.0071,
      "calcium_mg": 3.5,
      "iron_mg": null,
      "magnesium_mg": 7.9,
      "zinc_mg": null,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.74,
      "folate_ug": null,
      "omega3_g": 0.0
    }
  },
  {
    "id": "jus-orange",
    "name": "Jus d'orange, pur jus",
    "aliases": [
      "jus de fruits"
    ],
    "category": "beverage_sugary",
    "ciqualCode": 2070,
    "novaGroup": 3,
    "inflammationScore": 4,
    "tags": [
      "vitamine C"
    ],
    "per100g": {
      "energyKcal": 45.4,
      "proteins_g": 0.61,
      "carbs_g": 9.61,
      "fat_g": 0.11,
      "sugars_g": 9.61,
      "fiber_g": 0.28,
      "satFat_g": 0.053,
      "salt_g": 0.012,
      "calcium_mg": 0.41,
      "iron_mg": 0.068,
      "magnesium_mg": 10.0,
      "zinc_mg": 0.045,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 37.0,
      "vitaminB6_mg": 0.1,
      "folate_ug": 30.0,
      "omega3_g": 0.0
    }
  },
  {
    "id": "soda",
    "name": "Cola, sucré",
    "aliases": [
      "cola"
    ],
    "category": "beverage_sugary",
    "ciqualCode": 18018,
    "novaGroup": 4,
    "inflammationScore": 5,
    "tags": [],
    "per100g": {
      "energyKcal": 40.1,
      "proteins_g": 2.6e-05,
      "carbs_g": 10.0,
      "fat_g": 2.3e-05,
      "sugars_g": 10.0,
      "fiber_g": 5.7e-05,
      "satFat_g": 1.9e-05,
      "salt_g": 0.0071,
      "calcium_mg": 1.92,
      "iron_mg": 0.11,
      "magnesium_mg": 2.44,
      "zinc_mg": null,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.0,
      "folate_ug": 0.0,
      "omega3_g": 0.0
    }
  },
  {
    "id": "biere",
    "name": "Bière brune",
    "aliases": [
      "bière"
    ],
    "category": "alcohol",
    "ciqualCode": 5000,
    "novaGroup": 3,
    "inflammationScore": 3,
    "tags": [],
    "per100g": {
      "energyKcal": 40.5,
      "proteins_g": 0.43,
      "carbs_g": 4.1,
      "fat_g": 0.0,
      "sugars_g": 4.1,
      "fiber_g": 0.0,
      "satFat_g": 0.0,
      "salt_g": 0.029,
      "calcium_mg": 6.91,
      "iron_mg": 0.02,
      "magnesium_mg": 9.55,
      "zinc_mg": 0.17,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.03,
      "folate_ug": 8.5,
      "omega3_g": 0.0
    }
  },
  {
    "id": "vin-rouge",
    "name": "Vin rouge",
    "aliases": [
      "vin"
    ],
    "category": "alcohol",
    "ciqualCode": 5214,
    "novaGroup": 2,
    "inflammationScore": 3,
    "tags": [],
    "per100g": {
      "energyKcal": 75.7,
      "proteins_g": 0.16,
      "carbs_g": 0.0,
      "fat_g": null,
      "sugars_g": 0.0,
      "fiber_g": null,
      "satFat_g": 0.0,
      "salt_g": null,
      "calcium_mg": 6.31,
      "iron_mg": 0.36,
      "magnesium_mg": 10.5,
      "zinc_mg": null,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.05,
      "folate_ug": null,
      "omega3_g": 0.0
    }
  },
  {
    "id": "chocolat-noir",
    "name": "Chocolat noir 70 % de cacao environ, de dégustation, tablette",
    "aliases": [
      "chocolat"
    ],
    "category": "sweet",
    "ciqualCode": 31074,
    "novaGroup": 3,
    "inflammationScore": -1,
    "tags": [
      "magnésium",
      "polyphénols"
    ],
    "per100g": {
      "energyKcal": 591.0,
      "proteins_g": 10.4,
      "carbs_g": 26.9,
      "fat_g": 46.3,
      "sugars_g": 17.9,
      "fiber_g": 12.8,
      "satFat_g": 28.7,
      "salt_g": 0.02,
      "calcium_mg": 62.0,
      "iron_mg": 11.0,
      "magnesium_mg": 200.0,
      "zinc_mg": 3.0,
      "vitaminD_ug": 2.16,
      "vitaminC_mg": null,
      "vitaminB6_mg": null,
      "folate_ug": 52.0,
      "omega3_g": 0.13
    }
  },
  {
    "id": "chocolat-lait",
    "name": "Chocolat au lait, tablette",
    "aliases": [],
    "category": "sweet",
    "ciqualCode": 31004,
    "novaGroup": 4,
    "inflammationScore": 5,
    "tags": [],
    "per100g": {
      "energyKcal": 550.0,
      "proteins_g": 7.5,
      "carbs_g": 58.9,
      "fat_g": 30.8,
      "sugars_g": 56.3,
      "fiber_g": 2.9,
      "satFat_g": 18.7,
      "salt_g": 0.2,
      "calcium_mg": 220.0,
      "iron_mg": 3.6,
      "magnesium_mg": 59.0,
      "zinc_mg": 1.1,
      "vitaminD_ug": 1.5,
      "vitaminC_mg": 1.58,
      "vitaminB6_mg": 0.066,
      "folate_ug": 18.7,
      "omega3_g": 0.08
    }
  },
  {
    "id": "croissant",
    "name": "Croissant ordinaire, artisanal",
    "aliases": [
      "viennoiserie"
    ],
    "category": "sweet",
    "ciqualCode": 7615,
    "novaGroup": 3,
    "inflammationScore": 4,
    "tags": [],
    "per100g": {
      "energyKcal": 412.0,
      "proteins_g": 6.33,
      "carbs_g": 47.6,
      "fat_g": 21.1,
      "sugars_g": 7.88,
      "fiber_g": 1.8,
      "satFat_g": 11.6,
      "salt_g": 1.31,
      "calcium_mg": 21.0,
      "iron_mg": 0.85,
      "magnesium_mg": 17.0,
      "zinc_mg": 0.63,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.046,
      "folate_ug": 32.8,
      "omega3_g": 0.12
    }
  },
  {
    "id": "biscuits",
    "name": "Biscuit sec, sans précision",
    "aliases": [
      "gâteaux secs"
    ],
    "category": "ultraprocessed",
    "ciqualCode": 24000,
    "novaGroup": 4,
    "inflammationScore": 5,
    "tags": [],
    "per100g": {
      "energyKcal": 433.0,
      "proteins_g": 7.83,
      "carbs_g": 67.8,
      "fat_g": 13.8,
      "sugars_g": 25.0,
      "fiber_g": 3.0,
      "satFat_g": 3.46,
      "salt_g": 1.02,
      "calcium_mg": 10.0,
      "iron_mg": 0.4,
      "magnesium_mg": 14.0,
      "zinc_mg": 0.6,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 0.0,
      "vitaminB6_mg": 0.022,
      "folate_ug": 14.0,
      "omega3_g": 0.33
    }
  },
  {
    "id": "bonbons",
    "name": "Bonbon gélifié",
    "aliases": [
      "confiseries"
    ],
    "category": "ultraprocessed",
    "ciqualCode": 31060,
    "novaGroup": 4,
    "inflammationScore": 5,
    "tags": [],
    "per100g": {
      "energyKcal": 339.0,
      "proteins_g": 4.88,
      "carbs_g": 76.9,
      "fat_g": 0.53,
      "sugars_g": 58.4,
      "fiber_g": 1.5,
      "satFat_g": 0.25,
      "salt_g": 0.02,
      "calcium_mg": null,
      "iron_mg": null,
      "magnesium_mg": 1.08,
      "zinc_mg": null,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": null,
      "vitaminB6_mg": null,
      "folate_ug": null,
      "omega3_g": 0.002
    }
  },
  {
    "id": "glace",
    "name": "Glace ou crème glacée, en bac",
    "aliases": [
      "crème glacée"
    ],
    "category": "ultraprocessed",
    "ciqualCode": 39515,
    "novaGroup": 4,
    "inflammationScore": 5,
    "tags": [],
    "per100g": {
      "energyKcal": 191.0,
      "proteins_g": 2.55,
      "carbs_g": 26.1,
      "fat_g": 8.4,
      "sugars_g": 21.9,
      "fiber_g": null,
      "satFat_g": 5.44,
      "salt_g": 0.12,
      "calcium_mg": 74.0,
      "iron_mg": 0.14,
      "magnesium_mg": 14.3,
      "zinc_mg": 0.35,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.046,
      "folate_ug": 10.0,
      "omega3_g": 0.03
    }
  },
  {
    "id": "chips",
    "name": "Chips de pommes de terre nature ou aromatisées",
    "aliases": [],
    "category": "ultraprocessed",
    "ciqualCode": 4004,
    "novaGroup": 4,
    "inflammationScore": 5,
    "tags": [],
    "per100g": {
      "energyKcal": 532.0,
      "proteins_g": 6.0,
      "carbs_g": 51.0,
      "fat_g": 32.7,
      "sugars_g": 1.49,
      "fiber_g": 4.7,
      "satFat_g": 2.92,
      "salt_g": 1.35,
      "calcium_mg": 27.0,
      "iron_mg": 1.2,
      "magnesium_mg": 66.0,
      "zinc_mg": 0.82,
      "vitaminD_ug": null,
      "vitaminC_mg": 8.26,
      "vitaminB6_mg": 0.44,
      "folate_ug": 31.6,
      "omega3_g": 0.04
    }
  },
  {
    "id": "pizza",
    "name": "Pizza jambon fromage, préemballée",
    "aliases": [],
    "category": "ultraprocessed",
    "ciqualCode": 25435,
    "novaGroup": 4,
    "inflammationScore": 5,
    "tags": [],
    "per100g": {
      "energyKcal": 228.0,
      "proteins_g": 10.7,
      "carbs_g": 26.2,
      "fat_g": 8.49,
      "sugars_g": 3.7,
      "fiber_g": 1.95,
      "satFat_g": 3.93,
      "salt_g": 1.33,
      "calcium_mg": 174.0,
      "iron_mg": 0.7,
      "magnesium_mg": 24.4,
      "zinc_mg": 1.4,
      "vitaminD_ug": null,
      "vitaminC_mg": 1.45,
      "vitaminB6_mg": 0.2,
      "folate_ug": 17.0,
      "omega3_g": 0.101
    }
  },
  {
    "id": "nuggets",
    "name": "Nuggets ou croquette panée de poulet, préemballé",
    "aliases": [],
    "category": "ultraprocessed",
    "ciqualCode": 36027,
    "novaGroup": 4,
    "inflammationScore": 5,
    "tags": [],
    "per100g": {
      "energyKcal": 250.0,
      "proteins_g": 15.6,
      "carbs_g": 19.4,
      "fat_g": 11.6,
      "sugars_g": 1.3,
      "fiber_g": 2.4,
      "satFat_g": 2.68,
      "salt_g": 1.37,
      "calcium_mg": 25.0,
      "iron_mg": 1.0,
      "magnesium_mg": 25.0,
      "zinc_mg": 0.67,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.098,
      "folate_ug": 10.9,
      "omega3_g": 0.21
    }
  },
  {
    "id": "hamburger",
    "name": "Hamburger, de restauration rapide",
    "aliases": [
      "burger"
    ],
    "category": "ultraprocessed",
    "ciqualCode": 25413,
    "novaGroup": 4,
    "inflammationScore": 5,
    "tags": [],
    "per100g": {
      "energyKcal": 251.0,
      "proteins_g": 13.3,
      "carbs_g": 29.5,
      "fat_g": 8.44,
      "sugars_g": 5.95,
      "fiber_g": 1.8,
      "satFat_g": 2.82,
      "salt_g": 1.23,
      "calcium_mg": 64.0,
      "iron_mg": 1.23,
      "magnesium_mg": 29.7,
      "zinc_mg": 2.26,
      "vitaminD_ug": 0.1,
      "vitaminC_mg": 0.3,
      "vitaminB6_mg": 0.11,
      "folate_ug": 17.0,
      "omega3_g": 0.024
    }
  },
  {
    "id": "frites",
    "name": "Frites de pommes de terre, surgelées, cuites en friteuse",
    "aliases": [
      "pommes frites"
    ],
    "category": "ultraprocessed",
    "ciqualCode": 4032,
    "novaGroup": 3,
    "inflammationScore": 4,
    "tags": [],
    "per100g": {
      "energyKcal": 258.0,
      "proteins_g": 3.28,
      "carbs_g": 32.7,
      "fat_g": 11.9,
      "sugars_g": 0.61,
      "fiber_g": 3.9,
      "satFat_g": 2.86,
      "salt_g": 0.073,
      "calcium_mg": 23.8,
      "iron_mg": 0.9,
      "magnesium_mg": 23.3,
      "zinc_mg": 0.36,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 19.0,
      "vitaminB6_mg": 0.37,
      "folate_ug": 32.3,
      "omega3_g": 0.056
    }
  },
  {
    "id": "ketchup",
    "name": "Ketchup, préemballé",
    "aliases": [],
    "category": "condiment",
    "ciqualCode": 11008,
    "novaGroup": 4,
    "inflammationScore": 4,
    "tags": [],
    "per100g": {
      "energyKcal": 108.0,
      "proteins_g": 1.23,
      "carbs_g": 23.7,
      "fat_g": 0.16,
      "sugars_g": 21.1,
      "fiber_g": 1.77,
      "satFat_g": 0.035,
      "salt_g": 2.35,
      "calcium_mg": 21.4,
      "iron_mg": 0.77,
      "magnesium_mg": 21.2,
      "zinc_mg": 0.12,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 10.2,
      "vitaminB6_mg": 0.11,
      "folate_ug": 6.67,
      "omega3_g": 0.009
    }
  },
  {
    "id": "confiture",
    "name": "Confiture de fraise (extra ou classique)",
    "aliases": [],
    "category": "sweet",
    "ciqualCode": 31024,
    "novaGroup": 3,
    "inflammationScore": 4,
    "tags": [],
    "per100g": {
      "energyKcal": 248.0,
      "proteins_g": 0.25,
      "carbs_g": 60.5,
      "fat_g": 0.5,
      "sugars_g": 60.1,
      "fiber_g": 0.7,
      "satFat_g": 0.11,
      "salt_g": 0.018,
      "calcium_mg": 9.0,
      "iron_mg": 0.17,
      "magnesium_mg": 5.7,
      "zinc_mg": null,
      "vitaminD_ug": null,
      "vitaminC_mg": 11.4,
      "vitaminB6_mg": null,
      "folate_ug": null,
      "omega3_g": 0.05
    }
  },
  {
    "id": "miel",
    "name": "Miel",
    "aliases": [],
    "category": "sweet",
    "ciqualCode": 31008,
    "novaGroup": 1,
    "inflammationScore": 4,
    "tags": [],
    "per100g": {
      "energyKcal": 331.0,
      "proteins_g": 0.65,
      "carbs_g": 82.1,
      "fat_g": 0.0,
      "sugars_g": 81.1,
      "fiber_g": 0.0,
      "satFat_g": 0.0,
      "salt_g": 0.01,
      "calcium_mg": 7.93,
      "iron_mg": 0.18,
      "magnesium_mg": 4.26,
      "zinc_mg": 0.098,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 0.5,
      "vitaminB6_mg": 0.024,
      "folate_ug": null,
      "omega3_g": 0.0
    }
  },
  {
    "id": "pain-mie-industriel",
    "name": "Pain de mie blanc, préemballé",
    "aliases": [
      "pain de mie"
    ],
    "category": "ultraprocessed",
    "ciqualCode": 7200,
    "novaGroup": 4,
    "inflammationScore": 5,
    "tags": [],
    "per100g": {
      "energyKcal": 279.0,
      "proteins_g": 7.06,
      "carbs_g": 50.4,
      "fat_g": 4.37,
      "sugars_g": 6.14,
      "fiber_g": 2.83,
      "satFat_g": 0.54,
      "salt_g": 1.07,
      "calcium_mg": 88.0,
      "iron_mg": 0.7,
      "magnesium_mg": 17.0,
      "zinc_mg": 0.47,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.03,
      "folate_ug": 13.3,
      "omega3_g": 0.21
    }
  },
  {
    "id": "olives",
    "name": "Olive verte, en saumure, égouttée",
    "aliases": [
      "olive"
    ],
    "category": "vegetable",
    "ciqualCode": 13033,
    "novaGroup": 3,
    "inflammationScore": -2,
    "tags": [
      "bonnes graisses"
    ],
    "per100g": {
      "energyKcal": 164.0,
      "proteins_g": 1.13,
      "carbs_g": 0.61,
      "fat_g": 16.6,
      "sugars_g": 0.0,
      "fiber_g": 3.6,
      "satFat_g": 2.25,
      "salt_g": 2.94,
      "calcium_mg": 77.8,
      "iron_mg": 0.3,
      "magnesium_mg": 14.6,
      "zinc_mg": null,
      "vitaminD_ug": null,
      "vitaminC_mg": 2.29,
      "vitaminB6_mg": null,
      "folate_ug": null,
      "omega3_g": 0.17
    }
  },
  {
    "id": "houmous",
    "name": "Houmous, préemballé",
    "aliases": [
      "hummus"
    ],
    "category": "legume",
    "ciqualCode": 25621,
    "novaGroup": 4,
    "inflammationScore": -3,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 258.0,
      "proteins_g": 8.06,
      "carbs_g": 9.0,
      "fat_g": 19.9,
      "sugars_g": 1.66,
      "fiber_g": 5.18,
      "satFat_g": 2.02,
      "salt_g": 1.08,
      "calcium_mg": null,
      "iron_mg": null,
      "magnesium_mg": null,
      "zinc_mg": null,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": null,
      "folate_ug": null,
      "omega3_g": null
    }
  },
  {
    "id": "soupe-legumes",
    "name": "Soupe aux légumes variés, préemballée à réchauffer",
    "aliases": [
      "soupe"
    ],
    "category": "vegetable",
    "ciqualCode": 25903,
    "novaGroup": 4,
    "inflammationScore": -1,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 36.8,
      "proteins_g": 0.84,
      "carbs_g": 4.5,
      "fat_g": 1.45,
      "sugars_g": 1.63,
      "fiber_g": 1.23,
      "satFat_g": 0.58,
      "salt_g": 0.63,
      "calcium_mg": 14.0,
      "iron_mg": 0.14,
      "magnesium_mg": 5.3,
      "zinc_mg": 0.11,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 5.75,
      "vitaminB6_mg": 0.16,
      "folate_ug": 39.8,
      "omega3_g": 0.007
    }
  },
  {
    "id": "mais",
    "name": "Maïs doux, appertisé, égoutté",
    "aliases": [
      "maïs doux"
    ],
    "category": "vegetable",
    "ciqualCode": 20066,
    "novaGroup": 3,
    "inflammationScore": -3,
    "tags": [
      "fibres"
    ],
    "per100g": {
      "energyKcal": 105.0,
      "proteins_g": 2.66,
      "carbs_g": 18.3,
      "fat_g": 1.68,
      "sugars_g": 2.37,
      "fiber_g": 3.1,
      "satFat_g": 0.26,
      "salt_g": 0.59,
      "calcium_mg": 3.51,
      "iron_mg": 0.35,
      "magnesium_mg": 26.9,
      "zinc_mg": 0.39,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": 2.1,
      "vitaminB6_mg": 0.065,
      "folate_ug": null,
      "omega3_g": 0.015
    }
  },
  {
    "id": "germe-ble",
    "name": "Germe de blé",
    "aliases": [
      "germes de blé"
    ],
    "category": "wholegrain",
    "ciqualCode": 9660,
    "novaGroup": 1,
    "inflammationScore": -4,
    "tags": [
      "magnésium",
      "folates",
      "zinc"
    ],
    "per100g": {
      "energyKcal": 375.0,
      "proteins_g": 27.2,
      "carbs_g": 35.1,
      "fat_g": 9.5,
      "sugars_g": 10.0,
      "fiber_g": 16.3,
      "satFat_g": 1.83,
      "salt_g": 0.018,
      "calcium_mg": 54.0,
      "iron_mg": 8.9,
      "magnesium_mg": 250.0,
      "zinc_mg": 14.0,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.83,
      "folate_ug": 143.0,
      "omega3_g": 0.64
    }
  },
  {
    "id": "levure-biere",
    "name": "Levure de bière en paillettes",
    "aliases": [
      "levure maltée"
    ],
    "category": "condiment",
    "ciqualCode": 11009,
    "novaGroup": 2,
    "inflammationScore": -1,
    "tags": [
      "folates",
      "vitamine B6"
    ],
    "per100g": {
      "energyKcal": 334.0,
      "proteins_g": 40.4,
      "carbs_g": 21.8,
      "fat_g": 4.5,
      "sugars_g": 2.5,
      "fiber_g": 22.5,
      "satFat_g": 0.7,
      "salt_g": 0.35,
      "calcium_mg": 130.0,
      "iron_mg": 4.1,
      "magnesium_mg": 150.0,
      "zinc_mg": 8.4,
      "vitaminD_ug": null,
      "vitaminC_mg": null,
      "vitaminB6_mg": 0.88,
      "folate_ug": 697.0,
      "omega3_g": 0.001
    }
  },
  {
    "id": "algue-nori",
    "name": "Nori (Porphyra sp., Pyropia), séchée ou déshydratée",
    "aliases": [
      "nori"
    ],
    "category": "vegetable",
    "ciqualCode": 20987,
    "novaGroup": 1,
    "inflammationScore": -3,
    "tags": [
      "fer"
    ],
    "per100g": {
      "energyKcal": 257.0,
      "proteins_g": 30.2,
      "carbs_g": 11.7,
      "fat_g": 1.77,
      "sugars_g": 0.0,
      "fiber_g": 36.8,
      "satFat_g": 0.46,
      "salt_g": 4.75,
      "calcium_mg": 440.0,
      "iron_mg": 36.4,
      "magnesium_mg": 480.0,
      "zinc_mg": 4.35,
      "vitaminD_ug": 0.56,
      "vitaminC_mg": 63.9,
      "vitaminB6_mg": 0.53,
      "folate_ug": 31.8,
      "omega3_g": null
    }
  },
  {
    "id": "cornichon",
    "name": "Cornichon, au vinaigre",
    "aliases": [
      "cornichons"
    ],
    "category": "condiment",
    "ciqualCode": 11004,
    "novaGroup": 3,
    "inflammationScore": 1,
    "tags": [],
    "per100g": {
      "energyKcal": 16.0,
      "proteins_g": 1.06,
      "carbs_g": 0.78,
      "fat_g": null,
      "sugars_g": 0.6,
      "fiber_g": 1.5,
      "satFat_g": null,
      "salt_g": 1.72,
      "calcium_mg": 65.0,
      "iron_mg": 0.25,
      "magnesium_mg": 23.0,
      "zinc_mg": 0.13,
      "vitaminD_ug": 0.0,
      "vitaminC_mg": null,
      "vitaminB6_mg": null,
      "folate_ug": 11.5,
      "omega3_g": null
    }
  }
] as FoodItem[];

export const FOOD_IDS = new Set(FOODS.map((f) => f.id));

export function getFood(id: string): FoodItem | undefined {
  return FOODS.find((f) => f.id === id);
}
