# Correction du toggle FR/EN sur la home (rien ne se traduit)

## Diagnostic

Tout l'infra i18n est en place (resources bundlées en synchrone, hook `useTranslation('home')` utilisé partout dans `src/components/home/*`, JSON valides). Le toggle appelle bien `i18n.changeLanguage`. Pourtant les sections ne basculent pas.

Causes probables, par ordre de probabilité :

1. **Incompatibilité de versions** : `i18next@^26.0.8` + `react-i18next@^17.0.6` sont récents et la v17 de react-i18next exige des peer deps précises. Si la résolution est cassée, `useTranslation` peut retourner `t = key => key` silencieusement (texte brut FR/EN absent → fallback affichant la clé ou un cache figé).
2. **`bindI18n: 'languageChanged loaded'`** combiné à `useSuspense: false` peut, dans certaines versions, ne pas re-render les composants qui ont capturé un `t` au premier rendu si le store n'a pas signalé `added`.
3. **Cache `localStorage`** : si une ancienne valeur (`fr-FR` etc.) reste, le détecteur peut figer la langue sur `fr` même après clic EN. Notre sanitization au boot ne s'exécute qu'au démarrage.

Note : la preview m'a renvoyé HTTP 412 donc je n'ai pas pu reproduire en live, le diagnostic est basé sur la lecture du code et des versions.

## Plan de correction (étapes minimales, RÈGLE #1 simplicité)

### Étape 1 — Aligner les versions sur un combo stable
- Downgrader vers `i18next@^23.15.0` + `react-i18next@^15.0.0` + `i18next-browser-languagedetector@^8.0.0`. Combo largement testé avec React 18.
- Une seule commande `bun add` ; pas de changement de code requis.

### Étape 2 — Simplifier la config i18n
Dans `src/i18n/index.ts` :
- Retirer `bindI18n: 'languageChanged loaded'` et `bindI18nStore: 'added removed'` (valeurs par défaut suffisantes).
- Garder `useSuspense: false`, `load: 'languageOnly'`, `nonExplicitSupportedLngs: true`.
- Ajouter un appel `i18n.changeLanguage(i18n.language)` post-init pour garantir la cohérence du store (utile si le détecteur retourne `fr-FR` non normalisé).

### Étape 3 — Forcer la persistance + reload propre dans le toggle
Dans `src/components/LanguageToggle.tsx`, après `i18n.changeLanguage(lng)` :
- Écrire explicitement `localStorage.setItem('mariable_lang', lng)` (ne pas dépendre du caching automatique).
- Optionnel : écrire `document.documentElement.lang = lng` immédiatement.

### Étape 4 — Vérification live
- Ouvrir la preview, vider `localStorage` (`mariable_lang`), recharger.
- Cliquer EN → vérifier que le hero et toutes les sections home basculent (titre, sous-titre, étapes, CTAs, footer).
- Cliquer FR → vérifier le retour.
- Inspecter `window.i18n` (en dev) pour confirmer `language === 'en'` et que `home` est dans les ressources chargées.

### Étape 5 (si étapes 1-4 ne corrigent pas)
- Ajouter un log temporaire dans le toggle (`console.log(i18n.language, i18n.store.data)`) pour identifier où la chaîne se rompt.
- Vérifier qu'il n'y a pas un second `i18n.init` quelque part (ex. import dupliqué).

## Hors périmètre
- Pas de modification des fichiers de traductions (déjà OK).
- Pas de touche au dashboard / PDFs / emails (Phase B/C ultérieure une fois le toggle confirmé fonctionnel).
