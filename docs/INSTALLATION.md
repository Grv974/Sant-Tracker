# Guide d'installation

## Prérequis

- **Node.js ≥ 20** (22 recommandé)
- **npm ≥ 10**

## Installation locale

```bash
git clone https://github.com/Grv974/Sant-Tracker.git
cd Sant-Tracker
npm ci
npm run dev
```

L'application est servie sur `http://localhost:5173/Sant-Tracker/` (le chemin de base reproduit celui de GitHub Pages).

## Build de production

```bash
npm run build      # typecheck + bundle dans dist/
npm run preview    # sert dist/ sur http://localhost:4173/Sant-Tracker/
```

Le build génère automatiquement :

- `dist/404.html` (copie d'`index.html`) pour le routage profond sur GitHub Pages ;
- `dist/.nojekyll` pour désactiver Jekyll ;
- `dist/sw.js` + manifest PWA (precache complet de l'app-shell).

## Installer l'application (PWA)

1. Ouvrez l'URL de l'application dans un navigateur compatible (Chrome, Edge, Safari, Firefox).
2. Utilisez « Installer l'application » (invite in-app ou menu du navigateur).
3. Une fois installée, **Lunative fonctionne entièrement hors ligne** : toutes les fonctionnalités sont locales.

## Vérifications qualité

```bash
npm run lint        # ESLint (incl. interdiction de fetch/XHR — local-first)
npm run typecheck   # TypeScript strict
npm test            # suite Vitest (domaine + données + contenus)
```

## Dépannage

- **Page blanche après mise à jour** : le service worker propose une bannière « Mettre à jour » ; sinon rechargez profondément (Ctrl/Cmd+Shift+R). Les données IndexedDB ne sont jamais affectées par une mise à jour.
- **Notifications silencieuses** : vérifiez la permission du navigateur et la plage de silence dans Réglages ▸ Notifications. Les notifications web étant limitées en arrière-plan, des bannières in-app servent de filet à chaque ouverture.
- **Restaurer sur un nouvel appareil** : écran d'accueil de l'onboarding → « J'ai déjà une sauvegarde » → sélectionnez votre export JSON.
