## Plan de correction ciblé

Le problème ne vient pas du toggle : `/prix` et `/professionnelsmariable` utilisent déjà `useTranslation(...)` dans leurs composants. La route `/`, elle, affiche `src/pages/Mariable.tsx` et plusieurs sections avec du texte encore écrit en dur, donc rien ne peut basculer en anglais.

### 1. Internationaliser la vraie home `/`
- Ajouter `useTranslation('home')` dans `src/pages/Mariable.tsx`.
- Remplacer les textes en dur de :
  - hero,
  - témoignages,
  - FAQ,
  - CTA final,
  - SEO title/description/keywords.
- Réutiliser les clés `home` quand elles existent et ajouter seulement les clés manquantes.

### 2. Internationaliser les sections home encore en dur
- Appliquer la même logique que `/prix` et `/professionnelsmariable` dans :
  - `src/components/home/VenuesSection.tsx`,
  - `src/components/home/PremiumToolsCoordinationSection.tsx`,
  - `src/components/home/BlogSection.tsx`.
- Remplacer titres, sous-titres, boutons, filtres, mockup téléphone et modal par `t('...')`.

### 3. Compléter les fichiers de traduction
- Étendre :
  - `src/i18n/locales/fr/home.json`,
  - `src/i18n/locales/en/home.json`.
- Garder la structure existante et ajouter des clés métier explicites, sans modifier les pages `/prix` et `/professionnelsmariable` qui fonctionnent déjà.

### 4. Vérification
- Contrôler que toutes les clés utilisées existent en FR et EN.
- Vérifier que le toggle EN modifie bien les textes visibles de `/` sans changer la logique des autres pages.