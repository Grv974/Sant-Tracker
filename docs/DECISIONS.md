# Journal de décisions

Le cahier des charges est la référence. Ce fichier documente les points où une interprétation ou un arbitrage a été nécessaire, conformément à sa consigne (« en cas d'incohérence, proposer la meilleure solution en documentant la décision »).

## D1 — Jour isolé de flux « light » sans marquage explicite

**Contexte.** §4.2 fait de tout jour `flow ≥ light` précédé de ≥ 10 jours sans flux un début de cycle. Mais §4.9 demande de détecter les *saignements intermenstruels* — or un jour isolé de flux léger en milieu de cycle aurait créé un faux cycle, rendant cette détection impossible.

**Décision.** Un jour **isolé** de flux `light`, sans `menstruation.isStart` et sans jour de flux adjacent, n'ouvre pas de cycle ; il alimente le détecteur d'anomalies. Un flux `medium+`, un marquage explicite « mes règles ont commencé », un épisode ≥ 2 jours, ou l'option « compter le spotting comme début » suffisent à ouvrir un cycle. Testé dans `cycle.test.ts` et `anomalies.test.ts`.

## D2 — Réordonnancement par boutons plutôt que glisser-déposer

§3.3.20 et §6.5 mentionnent le glisser-déposer (« PEUT »). Le réordonnancement des widgets et catégories utilise des boutons ▲/▼ : mêmes capacités, accessibilité clavier/lecteur d'écran garantie sans dépendance supplémentaire. Le drag-and-drop peut être ajouté en sus ultérieurement.

## D3 — Notifications : idempotence via localStorage

L'annexe D suggère de stocker les `scheduledNotification` dans IndexedDB. Les échéances étant intégralement **recalculées** à chaque ouverture (elles dérivent des prédictions), seul l'ensemble des ids déjà déclenchés doit persister : il est conservé en localStorage (léger, synchrone, non sensible — de simples ids `type:date`). Le calcul des échéances est pur et testé.

## D4 — Verrouillage par PIN (SHA-256 salé), WebAuthn différé

§15.2 propose PIN « /biométrie via WebAuthn si disponible ». Le PIN local (hash SHA-256 salé) est implémenté ; WebAuthn sans backend nécessite une gestion de credentials locale plus lourde et est laissé pour une itération future. La limite (le PIN ne chiffre pas IndexedDB) est affichée à l'utilisatrice, comme demandé.

## D5 — Vue année (heatmap) non incluse

§7.2 la déclare « optionnelle ». Les vues mois et cycle sont implémentées ; la heatmap annuelle est différée (roadmap V2 du cahier des charges lui-même).

## D6 — e2e Playwright non commité

La stratégie de test (annexe H) demande des e2e Playwright. Le domaine, les données, les migrations, la fusion, le chiffrement, l'ordonnanceur et la machine d'onboarding sont couverts par 111 tests Vitest ; les parcours clés (onboarding→prédiction, saisie autosave, navigation) ont été vérifiés par un script Playwright pendant le développement. L'infrastructure e2e en CI est laissée en itération suivante pour ne pas alourdir le pipeline initial.

## D7 — Rappel « règles en retard »

§8.2 le définit « X jours après la plage prévue sans J1 ». Comme les prédictions sont recalculées en continu, l'arrivée réelle des règles déplace automatiquement l'échéance : la notification n'est émise que si la plage prévue est dépassée sans nouveau J1, ton neutre, sans jamais évoquer une grossesse (§8.3).

## D9 — V2 Nutrition : base d'aliments Ciqual et score inflammatoire

**Valeurs nutritionnelles.** La base (`src/content/nutrition/foods.generated.ts`) est générée par
`scripts/generate-foods.py` depuis la **Table Ciqual 2025 (ANSES, licence ouverte Etalab)** fournie
par le propriétaire du projet. Les valeurs sont reprises telles quelles pour 100 g : « - » (non
renseigné) → `null`, « traces » → `0`, « < seuil » → `null` (on ne stocke jamais une valeur inventée,
conformément à la règle impérative du livrable). 143 aliments courants sont curés (id, alias,
catégorie, groupe NOVA vérifiés à la main) ; le livrable fixe une cible de 400–600 aliments pour la
version finale — le générateur permet d'étendre la liste sans toucher au code applicatif.

**inflammationScore (« règles §N.2.1 »).** La spec détaillée n'étant pas jointe au livrable, les
règles sont définies et documentées ici : score de base par catégorie (légumes verts/baies/légumineuses
−4 … ultra-transformés +4) puis ajustements : sucres > 15 g → +1, fibres ≥ 5 g → −1, oméga-3 ≥ 1 g → −1,
AG saturés > 10 g → +1, sel > 1,5 g → +1, NOVA 4 → +2, borné à [−5, +5]. Les 37 aliments de
l'échantillon du livrable **conservent leur score éditorial d'origine** (override) pour rester
cohérents avec les textes. Inspiration conceptuelle DII sans reproduction de la formule propriétaire.

## D10 — V2 Nutrition : seuils du moteur (bande, tendance, micronutriments)

Le livrable définit les types (`Band`, `AdviceTrigger`) sans fixer les seuils. Retenus, documentés
dans `domain/nutrition.ts` et testés :
- **Bande du jour** : moyenne pondérée par portions des scores ; ≤ −1 « anti », ≥ +1 « pro », sinon
  « neutre » ; « unknown » sans saisie. Présentée comme un repère descriptif, jamais un jugement.
- **Tendance en baisse** (`whenTrendDown`) : moyenne des scores des 7 derniers jours consignés
  supérieure d'au moins 1 point à celle des 7 précédents, avec ≥ 3 jours consignés de chaque côté.
- **Micronutriment possiblement bas** (`whenMicronutrientLow`) : sur ≥ 3 jours consignés des
  7 derniers jours, apport moyen estimé (1 portion ≈ 100 g) < 50 % du repère indicatif ANSES/EFSA.
  Toujours affiché comme repère descriptif, jamais comme diagnostic de carence.

## D11 — V2 Nutrition : accès à la page

La navigation principale reste à 5 destinations (décision imposée V1 §10.1). La page `/nutrition`
est accessible depuis les widgets du dashboard (« Nutrition du jour », « Profil hormonal ») et la
carte alimentation du journal ; la saisie des aliments vit dans le journal, cœur d'usage.

## D8 — Tendance intégrée à L̂

§4.7 demande d'intégrer une pente « significative » à L̂ sans définir le seuil. Retenu : |pente| ≥ 0,8 j/cycle sur ≥ 4 cycles (une variation plus faible relève du bruit face à σ_min = 1 j). Constante ajustable dans `prediction.config.ts`.
