#!/usr/bin/env python3
"""
Générateur de la base d'aliments Lunative V2 à partir de la table Ciqual 2025 (ANSES).

Usage : python3 scripts/generate-foods.py <chemin-Table_Ciqual.xls>
Sortie : src/content/nutrition/foods.generated.ts

Règles (documentées, cf. docs/DECISIONS.md D9) :
- Valeurs nutritionnelles : reprises TELLES QUELLES de Ciqual (jamais inventées).
  « - » (non renseigné) → null ; « traces » → 0 ; « < x » (inférieur au seuil) → null.
- inflammationScore ∈ [-5, +5] : base par catégorie + ajustements par nutriments
  (sucres > 15 g → +1 ; fibres ≥ 5 g → −1 ; oméga-3 ≥ 1 g → −1 ; AGS > 10 g → +1 ;
  sel > 1,5 g → +1 ; NOVA 4 → +2), borné. Les 37 aliments de l'échantillon du livrable V2
  conservent leur score d'origine (override) pour rester cohérents avec le contenu éditorial.
"""

import sys
import json
import unicodedata

import xlrd

COLS = {
    "code": 6,
    "name": 7,
    "energyKcal": 10,
    "proteins_g": 14,
    "carbs_g": 16,
    "fat_g": 17,
    "sugars_g": 18,
    "fiber_g": 26,
    "satFat_g": 31,
    "ala_g": 44,
    "epa_g": 46,
    "dha_g": 47,
    "salt_g": 49,
    "calcium_mg": 50,
    "iron_mg": 53,
    "magnesium_mg": 55,
    "zinc_mg": 61,
    "vitaminD_ug": 65,
    "vitaminC_mg": 72,
    "vitaminB6_mg": 77,
    "folate_ug": 79,
}

CATEGORY_BASE = {
    "vegetable": -3, "leafy_green": -4, "berry": -4, "fruit": -3, "legume": -4,
    "soy": -3, "wholegrain": -3, "refined_grain": 1, "starchy": 0,
    "fish_fatty": -4, "fish_lean": -2, "seafood": -2,
    "whitemeat": -1, "redmeat": 1, "processed_meat": 4, "egg": -1,
    "dairy": -1, "dairy_fermented": -2, "cheese": 0,
    "nut_seed": -3, "oil_healthy": -4, "oil_other": 1, "butter": 2,
    "beverage_healthy": -1, "beverage_sugary": 4, "alcohol": 3,
    "sweet": 3, "ultraprocessed": 4, "spice_herb": -4, "condiment": 0,
}

# (id, nom Ciqual exact, catégorie, NOVA, aliases, tags, scoreOverride|None)
FOODS = [
    # ── Légumes ──
    ("brocoli", "Brocoli, cru", "vegetable", 1, ["brocolis"], ["fibres", "polyphénols"], -4),
    ("epinards", "Épinard, cru", "leafy_green", 1, ["épinard", "epinard"], ["fer", "folates"], -4),
    ("chou-kale", "Chou kale, cru", "leafy_green", 1, ["kale", "chou frisé kale"], ["calcium", "polyphénols"], -4),
    ("carotte", "Carotte, crue", "vegetable", 1, ["carottes"], ["fibres"], -3),
    ("poivron-rouge", "Poivron rouge, cru", "vegetable", 1, ["poivron"], ["vitamine C"], -3),
    ("tomate", "Tomate ronde, crue", "vegetable", 1, ["tomates"], ["polyphénols"], -3),
    ("betterave", "Betterave rouge, crue", "vegetable", 1, ["betteraves"], ["folates"], -3),
    ("courgette", "Courgette, chair et peau, crue", "vegetable", 1, ["courgettes"], ["fibres"], None),
    ("concombre", "Concombre, chair et peau, cru", "vegetable", 1, ["concombres"], [], None),
    ("haricot-vert", "Haricot vert, cru", "vegetable", 1, ["haricots verts"], ["fibres"], None),
    ("chou-fleur", "Chou-fleur, cru", "vegetable", 1, ["choufleur"], ["fibres"], None),
    ("champignon", "Champignon, tout type, cru", "vegetable", 1, ["champignons"], [], None),
    ("patate-douce", "Patate douce, crue", "starchy", 1, ["patates douces"], ["fibres"], None),
    ("pomme-de-terre", "Pomme de terre, sans peau, crue", "starchy", 1, ["patate"], [], None),
    ("avocat", "Avocat, chair sans peau, sans noyau, cru", "fruit", 1, ["avocats"], ["bonnes graisses", "fibres"], None),
    ("laitue", "Laitue, crue", "leafy_green", 1, ["salade verte"], [], None),
    ("mache", "Mâche, crue", "leafy_green", 1, ["mâche"], ["folates"], None),
    ("roquette", "Roquette, crue", "leafy_green", 1, [], ["folates"], None),
    ("oignon", "Oignon, cru", "vegetable", 1, ["oignons"], ["polyphénols"], None),
    ("ail", "Ail, cru", "spice_herb", 1, [], [], None),
    ("potiron", "Potiron, cru", "vegetable", 1, ["courge"], [], None),
    ("petits-pois", "Petits pois, crus", "vegetable", 1, ["petit pois"], ["fibres", "protéines"], None),
    ("artichaut", "Artichaut, cru", "vegetable", 1, ["artichauts"], ["fibres"], None),
    ("poireau", "Poireau, cru", "vegetable", 1, ["poireaux"], ["fibres"], None),
    ("celeri", "Céleri branche, cru", "vegetable", 1, ["céleri"], [], None),
    ("persil", "Persil, frais", "spice_herb", 1, [], ["vitamine C", "fer"], -4),
    ("basilic", "Basilic, frais", "spice_herb", 1, [], [], None),
    ("curcuma", "Curcuma, poudre", "spice_herb", 2, [], ["polyphénols"], None),
    ("gingembre", "Gingembre, racine fraîche", "spice_herb", 1, [], [], None),
    # ── Fruits & baies ──
    ("myrtille", "Myrtille, crue", "berry", 1, ["myrtilles", "bleuet"], ["polyphénols"], -4),
    ("framboise", "Framboise, crue", "berry", 1, ["framboises"], ["polyphénols", "fibres"], -4),
    ("fraise", "Fraise, crue", "berry", 1, ["fraises"], ["vitamine C"], None),
    ("cassis", "Cassis, cru", "berry", 1, [], ["vitamine C", "polyphénols"], None),
    ("orange", "Orange, chair sans peau, sans pépins, crue", "fruit", 1, ["oranges"], ["vitamine C"], -3),
    ("clementine", "Clémentine ou mandarine, chair sans peau, sans pépins, crue", "fruit", 1, ["mandarine"], ["vitamine C"], None),
    ("citron", "Citron, chair sans peau, sans pépins, cru", "fruit", 1, ["citrons"], ["vitamine C"], None),
    ("pamplemousse", "Pomelo (dit Pamplemousse), chair sans peau, sans pépins, cru", "fruit", 1, ["pomelo"], ["vitamine C"], None),
    ("pomme", "Pomme, chair et peau, crue", "fruit", 1, ["pommes"], ["fibres"], -3),
    ("poire", "Poire, chair et peau, crue", "fruit", 1, ["poires"], ["fibres"], None),
    ("banane", "Banane, chair sans peau, crue", "fruit", 1, ["bananes"], ["magnésium"], -2),
    ("kiwi", "Kiwi, chair sans peau, avec pépins, cru", "fruit", 1, ["kiwis"], ["vitamine C"], None),
    ("raisin", "Raisin noir, cru", "fruit", 1, ["raisins"], ["polyphénols"], None),
    ("peche", "Pêche, chair et peau, sans noyau, crue", "fruit", 1, ["pêche"], [], None),
    ("abricot", "Abricot, dénoyauté, cru", "fruit", 1, ["abricots"], [], None),
    ("mangue", "Mangue, chair sans peau, sans noyau, crue", "fruit", 1, ["mangues"], [], None),
    ("ananas", "Ananas, chair sans peau, cru", "fruit", 1, [], [], None),
    ("grenade", "Grenade, chair sans peau, avec pépins, crue", "fruit", 1, [], ["polyphénols"], None),
    ("datte", "Datte, chair et peau, sans noyau, sèche", "fruit", 1, ["dattes"], ["fibres"], None),
    ("pruneau", "Pruneau, sans noyau, sec", "fruit", 1, ["pruneaux"], ["fibres"], None),
    # ── Légumineuses & soja ──
    ("lentilles", "Lentille verte, bouillie/cuite à l'eau", "legume", 1, ["lentille"], ["fer", "fibres", "protéines"], -4),
    ("lentilles-corail", "Lentille corail, bouillie/cuite à l'eau", "legume", 1, ["lentille corail"], ["fer", "protéines"], None),
    ("pois-chiches", "Pois chiche, bouilli/cuit à l'eau", "legume", 1, ["pois chiche"], ["fer", "fibres", "folates"], -4),
    ("haricots-rouges", "Haricot rouge, bouilli/cuit à l'eau", "legume", 1, ["haricot rouge"], ["fer", "fibres"], None),
    ("haricots-blancs", "Haricot blanc, bouilli/cuit à l'eau", "legume", 1, ["haricot blanc"], ["fibres", "calcium"], None),
    ("feves", "Fève, bouillie/cuite à l'eau", "legume", 1, ["fève"], ["folates"], None),
    ("tofu", "Tofu nature, préemballé", "soy", 3, [], ["protéines", "fer", "calcium"], -3),
    # ── Céréales ──
    ("quinoa", "Quinoa, bouilli/cuit à l'eau, sans sel ajouté", "wholegrain", 1, [], ["magnésium", "protéines"], -3),
    ("riz-complet", "Riz complet, cuit, sans sel ajouté", "wholegrain", 1, ["riz brun"], ["fibres"], -2),
    ("riz-blanc", "Riz blanc, cuit, sans sel ajouté", "refined_grain", 1, ["riz"], [], None),
    ("flocons-avoine", "Flocons d'avoine", "wholegrain", 1, ["avoine", "porridge"], ["fibres", "magnésium"], -3),
    ("pain-complet", "Pain complet ou intégral (à la farine T150)", "wholegrain", 3, [], ["fibres"], -1),
    ("pain-blanc", "Pain blanc (par ex. : baguette, boule…)", "refined_grain", 3, ["baguette"], [], None),
    ("pates-completes", "Pâtes sèches, au blé complet, cuites, sans sel ajouté", "wholegrain", 1, ["pâtes complètes"], ["fibres"], None),
    ("pates", "Pâtes sèches, standard, cuites, sans sel ajouté", "refined_grain", 1, ["pâtes"], [], None),
    ("boulgour", "Boulgour de blé, cuit, sans sel ajouté", "wholegrain", 1, ["boulghour"], ["fibres"], None),
    ("sarrasin", "Sarrasin complet, cru", "wholegrain", 1, ["kasha"], ["magnésium"], None),
    ("muesli", "Muesli non enrichi en vitamines et minéraux (aliment moyen)", "wholegrain", 3, [], ["fibres"], None),
    # ── Poissons & fruits de mer ──
    ("saumon-atlantique", "Saumon, élevage, cru", "fish_fatty", 1, ["saumon"], ["oméga-3", "vitamine D"], -4),
    ("sardine", "Sardine, crue", "fish_fatty", 1, ["sardines"], ["oméga-3", "calcium"], -4),
    ("sardine-conserve", "Sardine, à l'huile d'olive, appertisée, égouttée", "fish_fatty", 3, ["sardines en boîte"], ["oméga-3", "calcium"], None),
    ("maquereau", "Maquereau, cru", "fish_fatty", 1, ["maquereaux"], ["oméga-3"], -4),
    ("truite", "Truite saumonée, crue", "fish_fatty", 1, ["truites"], ["oméga-3", "vitamine D"], None),
    ("hareng", "Hareng, cru", "fish_fatty", 1, ["harengs"], ["oméga-3", "vitamine D"], None),
    ("thon-conserve", "Thon, au naturel, appertisé, égoutté", "fish_lean", 3, ["thon en boîte", "thon"], ["protéines"], None),
    ("cabillaud", "Cabillaud, cru", "fish_lean", 1, ["morue fraîche"], ["protéines"], None),
    ("crevette", "Crevette, cuite", "seafood", 1, ["crevettes"], ["protéines"], None),
    ("moule", "Moule, bouillie/cuite à l'eau", "seafood", 1, ["moules"], ["fer", "zinc"], None),
    ("huitre", "Huître, sans précision, crue", "seafood", 1, ["huîtres"], ["zinc", "fer"], None),
    # ── Viandes & œufs ──
    ("oeuf", "Oeuf cru", "egg", 1, ["oeufs", "œuf", "œufs"], ["protéines"], -1),
    ("poulet", "Poulet, filet sans peau cru", "whitemeat", 1, ["blanc de poulet", "escalope de poulet"], ["protéines"], -1),
    ("dinde", "Dinde, escalope crue", "whitemeat", 1, ["escalope de dinde"], ["protéines"], None),
    ("boeuf-maigre", "Boeuf, steak haché 5% MG cru", "redmeat", 1, ["boeuf", "steak"], ["fer héminique"], 1),
    ("porc-filet", "Porc, filet mignon cru", "redmeat", 1, ["filet mignon"], ["protéines"], None),
    ("agneau", "Agneau, gigot cru", "redmeat", 1, ["gigot"], ["fer héminique", "zinc"], None),
    ("foie-veau", "Foie, veau, cru", "redmeat", 1, ["foie"], ["fer héminique", "vitamine B12"], None),
    ("jambon-blanc", "Jambon cuit, supérieur", "processed_meat", 4, ["jambon"], [], None),
    ("saucisson", "Saucisson sec pur porc", "processed_meat", 4, [], [], None),
    ("lardons", "Lardon nature, cru", "processed_meat", 4, [], [], None),
    # ── Laitiers & alternatives ──
    ("yaourt-nature", "Yaourt ou lait fermenté, nature", "dairy_fermented", 1, ["yaourt"], ["calcium", "fermenté"], -2),
    ("yaourt-grec", "Yaourt à la grecque nature", "dairy_fermented", 1, ["yaourt grec"], ["protéines", "calcium"], None),
    ("fromage-blanc", "Fromage blanc, nature, 2-3% MG", "dairy_fermented", 1, [], ["protéines", "calcium"], None),
    ("lait", "Lait demi-écrémé, UHT", "dairy", 1, ["lait demi-écrémé"], ["calcium"], -1),
    ("boisson-soja-enrichie", "Boisson au soja, nature, enrichie en calcium, préemballée", "beverage_healthy", 3, ["lait de soja"], ["calcium", "protéines"], -2),
    ("boisson-amande", "Boisson à l'amande, nature, sans sucres ajoutés, non enrichie, préemballée", "beverage_healthy", 4, ["lait d'amande"], [], None),
    ("comte", "Comté", "cheese", 1, ["comté"], ["calcium"], None),
    ("feta", "Feta, au lait de brebis 70% minimum et lait de chèvre 30% maximum", "cheese", 1, [], ["calcium"], None),
    ("mozzarella", "Mozzarella au lait de vache", "cheese", 1, [], ["calcium"], None),
    ("chevre", "Fromage de chèvre bûche", "cheese", 1, ["fromage de chèvre"], ["calcium"], None),
    ("kefir", "Kéfir de lait", "dairy_fermented", 1, ["kéfir"], ["fermenté"], None),
    # ── Oléagineux, graines & huiles ──
    ("noix", "Noix, cerneau, séchée", "nut_seed", 1, ["cerneaux de noix"], ["oméga-3", "polyphénols"], -4),
    ("amande", "Amande, émondée, sans sel ajouté", "nut_seed", 1, ["amandes"], ["magnésium", "calcium"], -3),
    ("noix-cajou", "Noix de cajou, grillée, sans sel ajouté", "nut_seed", 1, ["cajou"], ["magnésium"], -3),
    ("noisette", "Noisette, sans sel ajouté", "nut_seed", 1, ["noisettes"], ["magnésium"], None),
    ("graines-lin", "Lin, graine", "nut_seed", 1, ["lin"], ["oméga-3", "fibres"], None),
    ("graines-chia", "Chia, graine, séchée", "nut_seed", 1, ["chia"], ["oméga-3", "fibres", "calcium"], None),
    ("graines-courge", "Courge, graine, séchée", "nut_seed", 1, [], ["magnésium", "fer", "zinc"], None),
    ("graines-tournesol", "Tournesol, graine", "nut_seed", 1, ["tournesol"], ["magnésium"], None),
    ("sesame", "Sésame, graine", "nut_seed", 1, ["sésame"], ["calcium", "fer"], None),
    ("huile-olive", "Huile d'olive vierge extra", "oil_healthy", 2, ["huile olive"], ["polyphénols"], -4),
    ("huile-colza", "Huile de colza", "oil_healthy", 2, ["huile de canola"], ["oméga-3"], None),
    ("huile-tournesol", "Huile de tournesol", "oil_other", 2, [], [], None),
    ("beurre", "Beurre à 80% MG minimum, doux", "butter", 2, [], [], None),
    # ── Boissons ──
    ("eau", "Eau du robinet", "beverage_healthy", 1, ["eau plate"], [], 0),
    ("the-vert", "Thé infusé, sans sucres ajoutés", "beverage_healthy", 1, ["thé", "thé vert"], ["polyphénols"], -3),
    ("tisane", "Tisane infusée ou infusion, sans sucres ajoutés", "beverage_healthy", 1, ["infusion"], [], -1),
    ("cafe", "Café expresso, non instantané, sans sucres ajoutés, prêt à boire", "beverage_healthy", 1, ["café noir"], [], None),
    ("jus-orange", "Jus d'orange, pur jus", "beverage_sugary", 3, ["jus de fruits"], ["vitamine C"], None),
    ("soda", "Cola, sucré", "beverage_sugary", 4, ["cola"], [], None),
    ("biere", "Bière brune", "alcohol", 3, ["bière"], [], None),
    ("vin-rouge", "Vin rouge", "alcohol", 2, ["vin"], [], None),
    # ── Sucrés & ultra-transformés ──
    ("chocolat-noir", "Chocolat noir 70 % de cacao environ, de dégustation, tablette", "sweet", 3, ["chocolat"], ["magnésium", "polyphénols"], -1),
    ("chocolat-lait", "Chocolat au lait, tablette", "sweet", 4, [], [], None),
    ("croissant", "Croissant ordinaire, artisanal", "sweet", 3, ["viennoiserie"], [], None),
    ("biscuits", "Biscuit sec, sans précision", "ultraprocessed", 4, ["gâteaux secs"], [], None),
    ("bonbons", "Bonbon gélifié", "ultraprocessed", 4, ["confiseries"], [], None),
    ("glace", "Glace ou crème glacée, en bac", "ultraprocessed", 4, ["crème glacée"], [], None),
    ("chips", "Chips de pommes de terre nature ou aromatisées", "ultraprocessed", 4, [], [], None),
    ("pizza", "Pizza jambon fromage, préemballée", "ultraprocessed", 4, [], [], None),
    ("nuggets", "Nuggets ou croquette panée de poulet, préemballé", "ultraprocessed", 4, [], [], None),
    ("hamburger", "Hamburger, de restauration rapide", "ultraprocessed", 4, ["burger"], [], None),
    ("frites", "Frites de pommes de terre, surgelées, cuites en friteuse", "ultraprocessed", 3, ["pommes frites"], [], None),
    ("ketchup", "Ketchup, préemballé", "condiment", 4, [], [], None),
    ("confiture", "Confiture de fraise (extra ou classique)", "sweet", 3, [], [], None),
    ("miel", "Miel", "sweet", 1, [], [], None),
    ("pain-mie-industriel", "Pain de mie blanc, préemballé", "ultraprocessed", 4, ["pain de mie"], [], None),
    # ── Divers ──
    ("olives", "Olive verte, en saumure, égouttée", "vegetable", 3, ["olive"], ["bonnes graisses"], None),
    ("houmous", "Houmous, préemballé", "legume", 4, ["hummus"], ["fibres"], None),
    ("soupe-legumes", "Soupe aux légumes variés, préemballée à réchauffer", "vegetable", 4, ["soupe"], ["fibres"], None),
    ("mais", "Maïs doux, appertisé, égoutté", "vegetable", 3, ["maïs doux"], ["fibres"], None),
    ("germe-ble", "Germe de blé", "wholegrain", 1, ["germes de blé"], ["magnésium", "folates", "zinc"], None),
    ("levure-biere", "Levure de bière en paillettes", "condiment", 2, ["levure maltée"], ["folates", "vitamine B6"], None),
    ("algue-nori", "Nori (Porphyra sp., Pyropia), séchée ou déshydratée", "vegetable", 1, ["nori"], ["fer"], None),
    ("cornichon", "Cornichon, au vinaigre", "condiment", 3, ["cornichons"], [], None),
]


def norm(s: str) -> str:
    return unicodedata.normalize("NFD", s.lower().strip()).encode("ascii", "ignore").decode()


def parse_value(raw) -> float | None:
    if raw is None:
        return None
    s = str(raw).strip()
    if s in ("", "-"):
        return None
    if s.lower() == "traces":
        return 0.0
    if s.startswith("<"):
        return None  # « inférieur au seuil » : on ne stocke pas de valeur inventée
    try:
        return float(s.replace(",", "."))
    except ValueError:
        return None


def compute_score(category: str, nova: int, values: dict) -> int:
    score = CATEGORY_BASE[category]
    omega3 = sum(v for v in (values["ala_g"], values["epa_g"], values["dha_g"]) if v is not None)
    if (values["sugars_g"] or 0) > 15:
        score += 1
    if (values["fiber_g"] or 0) >= 5:
        score -= 1
    if omega3 >= 1:
        score -= 1
    if (values["satFat_g"] or 0) > 10:
        score += 1
    if (values["salt_g"] or 0) > 1.5:
        score += 1
    if nova == 4:
        score += 2
    return max(-5, min(5, score))


def main():
    xls_path = sys.argv[1]
    wb = xlrd.open_workbook(xls_path)
    sh = wb.sheet_by_index(0)
    by_name = {}
    for r in range(1, sh.nrows):
        by_name[norm(str(sh.cell_value(r, COLS["name"])))] = r

    errors, items = [], []
    for food_id, ciqual_name, category, nova, aliases, tags, override in FOODS:
        row = by_name.get(norm(ciqual_name))
        if row is None:
            candidates = [n for n in by_name if norm(ciqual_name) in n][:3]
            errors.append(f"{food_id}: nom Ciqual introuvable « {ciqual_name} » (proches: {candidates})")
            continue
        values = {key: parse_value(sh.cell_value(row, col)) for key, col in COLS.items() if key not in ("code", "name")}
        omega3_parts = [values.pop("ala_g"), values.pop("epa_g"), values.pop("dha_g")]
        omega3 = round(sum(v for v in omega3_parts if v is not None), 3) if any(v is not None for v in omega3_parts) else None
        raw = {**values, "omega3_g": omega3}
        score = override if override is not None else compute_score(category, nova, {**values, "ala_g": omega3_parts[0], "epa_g": omega3_parts[1], "dha_g": omega3_parts[2]})
        items.append({
            "id": food_id,
            "name": str(sh.cell_value(row, COLS["name"])),
            "aliases": aliases,
            "category": category,
            "ciqualCode": int(sh.cell_value(row, COLS["code"])),
            "novaGroup": nova,
            "inflammationScore": score,
            "tags": tags,
            "per100g": raw,
        })

    if errors:
        print("ERREURS :", file=sys.stderr)
        for e in errors:
            print(" -", e, file=sys.stderr)
        sys.exit(1)

    seen = set()
    for it in items:
        assert it["id"] not in seen, f"id dupliqué : {it['id']}"
        seen.add(it["id"])

    lines = [
        "// GÉNÉRÉ — ne pas éditer à la main. `python3 scripts/generate-foods.py <Table_Ciqual.xls>`",
        "// Valeurs nutritionnelles : Table Ciqual 2025 © ANSES (licence ouverte Etalab),",
        "// reprises telles quelles pour 100 g (« - »/« < seuil » → null, « traces » → 0).",
        "// inflammationScore : règles documentées dans docs/DECISIONS.md (D9).",
        "import type { FoodItem } from '@/data/food/types';",
        "",
        "export const FOODS: FoodItem[] = " + json.dumps(items, ensure_ascii=False, indent=2) + " as FoodItem[];",
        "",
        "export const FOOD_IDS = new Set(FOODS.map((f) => f.id));",
        "",
        "export function getFood(id: string): FoodItem | undefined {",
        "  return FOODS.find((f) => f.id === id);",
        "}",
        "",
    ]
    out = "src/content/nutrition/foods.generated.ts"
    with open(out, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"{len(items)} aliments écrits dans {out}")


if __name__ == "__main__":
    main()
