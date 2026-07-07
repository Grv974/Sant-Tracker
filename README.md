# 🌙 Lunative — Suivi de cycle menstruel local-first

> **Comprenez votre cycle. Vos données restent sur votre appareil.**

Lunative est une application de suivi du cycle menstruel **100 % locale, privée et rigoureuse** : une PWA installable, entièrement fonctionnelle hors ligne, sans backend, sans compte, sans télémétrie. Toutes les données de santé vivent dans le navigateur (IndexedDB) et n'en sortent jamais.

## ✨ Fonctionnalités

- **Journal quotidien sans friction** : flux (6 niveaux), douleurs structurées (intensité 0–10, zones, types, impact fonctionnel), humeur, énergie, libido, température basale, glaire cervicale, tests LH, activité, sommeil, stress, hydratation, poids, symptômes personnalisés, notes — tout optionnel, autosauvegardé.
- **Prédictions honnêtes** : règles, ovulation et fenêtre fertile prédites par des statistiques robustes (EWMA + moyenne, médiane en irrégularité, plages k·σ) — toujours affichées avec **plage + score de confiance explicable**, jamais une date sèche.
- **Détection physiologique rétrospective** : décalage thermique BBT (règle des 3 sur 6), tests LH — confirmations a posteriori, jamais des promesses.
- **Signaux d'attention** non anxiogènes (cycles courts/longs récurrents, aménorrhée, saignements abondants ou intermenstruels, douleur invalidante, saignement post-ménopausique) — informatifs, jamais diagnostiques.
- **Recommandations par phase** avec **niveau de preuve A/B/C/D** et sources institutionnelles (ACOG, OMS, NICE, ESHRE, Cochrane, HAS/CNGOF, EFSA/ANSES).
- **Profils adaptés** : SOPK, endométriose, périménopause, post-partum/allaitement, grossesse, désir de grossesse, contraception (12 types, comportements adaptés).
- **Dashboard modulaire** : 12 widgets masquables et réordonnables (anneau de cycle, prédiction, phase, BBT, tendances, stats…).
- **Calendrier** : vue mois (réel vs prévu distingués par hachures, prévisions estompées avec l'horizon) et vue cycle linéaire ; événements personnels ; appui long = marquer les règles ; balayage = changer de mois.
- **Analyses** : longueur de cycle avec bande p10–p90, courbe BBT + marqueur d'ovulation, symptômes par phase, précision récente des prédictions, poids.
- **Notifications locales** configurables (règles imminentes/du jour/en retard, fenêtre fertile, pilule, journal, BBT, hydratation, sport) avec plage de silence et bannières in-app en filet.
- **Sauvegarde robuste** : autosave (debounce 300 ms), export/import JSON, **export chiffré** (AES-GCM + PBKDF2), fusion avec résolution de conflits, 5 snapshots internes avec rotation, migrations de schéma versionnées, effacement à double confirmation.
- **Verrouillage optionnel** par code PIN.
- **fr / en**, thème clair/sombre, unités °C/°F · kg/lb · cm/in, accessibilité WCAG 2.2 AA (clavier, ARIA, contrastes, `prefers-reduced-motion`, cibles ≥ 44 px, double codage couleur+forme).

## ⚕️ Limites importantes

Lunative **n'est pas un dispositif médical**, n'établit aucun diagnostic et **n'est pas une méthode de contraception**. Les prédictions sont des estimations statistiques qui peuvent être fausses. En présence de signes d'alerte, consultez un professionnel de santé.

## 🛠 Stack

React 18 · TypeScript strict · Vite · Tailwind CSS · Framer Motion · Recharts · date-fns · Zod · Zustand · idb (IndexedDB) · vite-plugin-pwa (Workbox) · Vitest.

## 🚀 Démarrage rapide

```bash
npm ci
npm run dev        # http://localhost:5173/Sant-Tracker/
```

| Commande            | Effet                                  |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Serveur de développement               |
| `npm run build`     | Typecheck + build production (`dist/`) |
| `npm run preview`   | Prévisualisation du build              |
| `npm test`          | Tests unitaires (domaine, données)     |
| `npm run lint`      | ESLint (interdit `fetch`/XHR)          |
| `npm run typecheck` | TypeScript strict                      |

Voir aussi : [Guide d'installation](docs/INSTALLATION.md) · [Déploiement GitHub Pages](docs/DEPLOY_GITHUB_PAGES.md) · [Architecture](docs/ARCHITECTURE.md) · [Décisions](docs/DECISIONS.md).

## 🔒 Confidentialité par conception

- Aucune requête réseau applicative : une règle ESLint interdit `fetch`/`XMLHttpRequest` dans tout le code.
- CSP stricte (`connect-src 'self'`), polices auto-hébergées (@fontsource), aucun CDN, aucune analytics.
- Le service worker ne fait que précacher les assets de l'app-shell (offline-first).
- Export/effacement des données à tout moment ; l'export chiffré utilise WebCrypto localement.

## 🧪 Tests

Le cœur algorithmique (`src/domain/`) est pur et couvert par des tests exhaustifs : détection de cycles, statistiques, prédiction et score de confiance, décalage thermique, anomalies, précision, unités, moteur de recommandations, machine d'onboarding, migrations, sauvegarde/fusion/chiffrement, ordonnanceur de notifications.

```bash
npm test
npm run test:coverage
```

## 📄 Licence

[MIT](LICENSE).
