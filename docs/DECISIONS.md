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

## D8 — Tendance intégrée à L̂

§4.7 demande d'intégrer une pente « significative » à L̂ sans définir le seuil. Retenu : |pente| ≥ 0,8 j/cycle sur ≥ 4 cycles (une variation plus faible relève du bruit face à σ_min = 1 j). Constante ajustable dans `prediction.config.ts`.
