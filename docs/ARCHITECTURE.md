# Architecture

Lunative est une SPA local-first organisée en couches strictes (les couches hautes dépendent des basses, jamais l'inverse) :

```
Présentation   src/features/ (écrans) · src/components/ (Design System)
     ▼
État & UI      src/store/ (Zustand + dérivés mémoïsés) · src/hooks/ · src/i18n/
     ▼
Domaine PUR    src/domain/  ← aucune dépendance React / DOM / IndexedDB
     ▼
Données        src/data/ (idb, Zod, migrations, backup, snapshots)
     ▼
Plateforme     IndexedDB · Service Worker · Notifications API · WebCrypto
```

## Répertoires

| Répertoire          | Rôle |
| ------------------- | ---- |
| `src/domain/`       | Algorithmes purs et testés : `cycle.ts` (segmentation, stats), `prediction.ts` (L̂, plages, confiance, phases), `bbt.ts` (décalage thermique 3/6, confirmations LH), `anomalies.ts` (signaux), `accuracy.ts` (auto-évaluation), `recommendations.ts` (sélection), `modes.ts` (matrice profil→comportement), `dates.ts` (dates civiles), `units.ts`, `stats.ts` |
| `src/data/`         | `db.ts` (IndexedDB via idb), `schemas.ts` (validation Zod), `migrations.ts` (registre versionné), `backup.ts` (export/import/fusion/chiffrement), `snapshots.ts` (rotation FIFO), `defaults.ts` |
| `src/store/`        | `appStore.ts` (Zustand, autosave debounce 300 ms), `derived.ts` (recalcul en cascade mémoïsé : cycles → stats → prédictions → phase → anomalies → prévisions calendrier) |
| `src/content/`      | M16 : recommandations sourcées (fr/en, niveaux A–D), pédagogie de phase, sources institutionnelles |
| `src/notifications/`| Ordonnanceur pur (échéances 72 h, quiet hours, ids idempotents) + runtime navigateur |
| `src/features/`     | Écrans : onboarding (machine d'états), dashboard (widgets), journal, calendrier (mois + cycle), analyses, réglages (9 sections), verrouillage |
| `src/components/`   | Design System : primitives UI accessibles + composants de saisie spécialisés (FlowSelector, PainInput, MoodPicker, BBTInput…) |
| `src/i18n/`         | Dictionnaires fr/en + provider `t()` |

## Flux de données

Toute mutation passe par `appStore.mutate()` → nouvel `AppData` immuable → autosave IndexedDB (debounce) → les sélecteurs dérivés (`computeDerivedMemo`) recalculent uniquement si `dailyEntries` / `profile` / `events` / `settings` / la date du jour changent. Les dérivés (cycles, prédictions, signaux) ne sont **jamais persistés** (§11.3) : la source de vérité unique est `dailyEntries + profile`.

## Décisions clés

Voir [DECISIONS.md](DECISIONS.md). Les constantes d'algorithmes sont centralisées dans `src/constants/prediction.config.ts`.
