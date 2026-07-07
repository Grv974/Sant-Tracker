# Déploiement sur GitHub Pages

Le dépôt est prêt à déployer **sans configuration supplémentaire** : le workflow GitHub Actions fait tout.

## 1. Activer GitHub Pages

Dans le dépôt GitHub : **Settings ▸ Pages ▸ Build and deployment ▸ Source = “GitHub Actions”**.

## 2. Pousser sur `main`

Chaque push sur `main` déclenche `.github/workflows/deploy.yml` :

1. `npm ci`
2. `npm run lint` — style + interdiction de requêtes réseau applicatives
3. `npm run typecheck` — TypeScript strict
4. `npm test` — suite Vitest
5. `npm run build` — bundle + PWA
6. Déploiement de `dist/` sur GitHub Pages

L'application est alors servie sur `https://<votre-compte>.github.io/Sant-Tracker/`.

## Comment ça marche

- **Base path** : `vite.config.ts` fixe `base: '/Sant-Tracker/'` ; le manifest PWA (`start_url`, `scope`) et le routeur (basename) en héritent automatiquement. *Si vous renommez le dépôt, changez uniquement la constante `BASE` dans `vite.config.ts`.*
- **Routage profond** : GitHub Pages ne connaît pas les routes SPA ; le build copie `index.html` vers `404.html`, donc `/Sant-Tracker/calendar` recharge l'app qui restaure la route.
- **`.nojekyll`** : généré au build pour empêcher Jekyll de filtrer des assets.
- **Offline** : le service worker précache l'app-shell ; après la première visite, l'application se lance sans réseau.
- **Aucun secret requis** : il n'y a pas de backend.

## Vérification post-déploiement

1. Ouvrir l'URL Pages → l'onboarding s'affiche.
2. Installer la PWA, couper le réseau, relancer : tout fonctionne.
3. Ouvrir un lien profond (ex. `/Sant-Tracker/analytics`) : la page se charge.
4. Lancer un audit Lighthouse : PWA installable, Performance et Accessibilité élevées.
