# Compléter la traduction FR/EN

## Constat

- **Home `/`** : déjà traduite (toutes les sections `Premium*` utilisent `useTranslation`). Si le contenu reste en FR au clic du toggle, c'est un bug d'affichage à diagnostiquer (cache `localStorage` `mariable_lang`, namespace mal chargé, ou clé manquante ponctuelle).
- **`/prix` (Prix.tsx, 337 lignes)** : aucun appel à `useTranslation`. Tout le texte est hardcodé en FR.
- **`/professionnelsmariable` (ProfessionnelsMariable.tsx, 327 lignes)** : idem, aucun i18n.

## Plan

### 1. Audit rapide de la home (`/`)
- Vérifier en preview que le toggle EN bascule bien le texte des sections Hero, Process, Marketplace, Tools, Coordination, Testimonials, FinalCTA.
- Si une section reste en FR : compléter les clés manquantes dans `home.json` (FR + EN).
- Vérifier que `LanguageToggle` persiste bien dans `localStorage` (`mariable_lang`).

### 2. Page `/prix`
- Créer 2 fichiers : `src/i18n/locales/fr/pricing.json` et `src/i18n/locales/en/pricing.json`.
- Enregistrer le namespace `pricing` dans `src/i18n/index.ts`.
- Refactoriser `src/pages/Prix.tsx` pour utiliser `useTranslation('pricing')` sur tous les textes (titre, sous-titre, plans Free/Premium, features, CTA, FAQ, etc.).
- Garder le SEO dynamique (titre/description) via `useTranslation`.

### 3. Page `/professionnelsmariable`
- Créer 2 fichiers : `src/i18n/locales/fr/professionals.json` et `src/i18n/locales/en/professionals.json`.
- Enregistrer le namespace `professionals` dans `src/i18n/index.ts`.
- Refactoriser `src/pages/ProfessionnelsMariable.tsx` pour utiliser `useTranslation('professionals')` sur tous les textes (hero, bénéfices, témoignages pros, formulaire d'inscription, FAQ, CTA).
- Préserver l'intégralité de la logique business (formulaires, soumission, validation) — uniquement remplacement des strings.

### 4. Validation
- Tester le toggle FR/EN sur les 3 pages (`/`, `/prix`, `/professionnelsmariable`).
- Vérifier qu'aucun texte ne reste en FR quand EN est sélectionné, et inversement.
- Vérifier que les meta SEO (`title`, `description`) basculent aussi.

## Hors périmètre

- Dashboard et ses modules (Phase 3 future).
- Blog, pages régionales, pages légales (restent FR uniquement comme convenu).
- Pages prestataires individuelles, mini-sites mariage.

## Détails techniques

- Génération des traductions EN par l'IA (qualité standard, à relire si besoin).
- Conservation stricte des clés métier, classes Tailwind, et de la structure DOM (zéro impact visuel hors texte).
- Aucune modification de logique métier, formulaires, ou appels Supabase.