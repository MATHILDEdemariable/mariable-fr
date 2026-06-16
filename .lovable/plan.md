
## Objectif

Faire fonctionner le toggle FR/EN sur 4 pages dashboard. Le toggle est déjà installé dans le PremiumHeader, react-i18next est configuré, et des namespaces `budget`/`checklist`/`dashboard`/`seating` existent déjà partiellement. Cette tâche complète les traductions manquantes.

## Périmètre

### 1. /dashboard (page d'accueil)
Composants à traduire (chrome complet) :
- `src/components/dashboard/ProjectSummary.tsx` — modal "Détail des tarifs", textes système
- `src/components/dashboard/gaming/HeroStats.tsx` — "Bienvenue", "Félicitations", "Mariage passé", "invités prévus", "Modifiez le nombre", "organisation complétée", badge Premium, date FR
- `src/components/dashboard/gaming/QuickActions.tsx` — "Guide de démarrage", "Découvrez le concept", "Guide vidéo", "Tutoriel en vidéo", "Suivez-nous sur Instagram", "Suivre"
- `src/components/dashboard/gaming/QuestCards.tsx` — titres et CTA cartes
- `src/components/dashboard/gaming/ToolsGrid.tsx` — labels des outils
- `src/components/dashboard/gaming/AchievementBadges.tsx` — noms et descriptions des badges

→ Étendre `src/i18n/locales/{fr,en}/dashboard.json`

### 2. /dashboard/checklist-mariage
- `src/pages/dashboard/ChecklistMariagePage.tsx` — titre page, tabs ("En 10 étapes", "Checklist manuelle", "Suggestions")
- `src/components/dashboard/Checklist10Steps.tsx` (ou similaire) — "Checklist en 10 étapes essentielles", "Votre progression", "Les 10 étapes clés de l'organisation", "Cochez les étapes au fur et à mesure", **les 10 étapes** (titres + descriptions)
- Composant "Checklist manuelle" — colonnes, boutons d'ajout, catégories

→ Étendre `src/i18n/locales/{fr,en}/checklist.json`

### 3. /dashboard/budget
- `src/pages/dashboard/BudgetPage.tsx` — déjà câblé (`useTranslation('budget')`), compléter les clés manquantes
- `src/components/dashboard/DetailedBudget.tsx` (~915 lignes) — "Wedding Budget"/"Budget de mariage", "Budget Détaillé", boutons "Importer", "Enregistrer", "PDF", "CSV", colonnes ("Catégorie/Élément", "Budget Estimé", "Coût Réel", "Acompte Versé", "Reste à Payer", "Commentaire", "Actions"), catégories par défaut, placeholders, toasts
- `src/components/dashboard/BudgetCalculator.tsx` (~846 lignes) — labels formulaire (région, saison, invités, style…), résultats, recommandations
- Onglet "Calculator" / "Details"

→ Étendre `src/i18n/locales/{fr,en}/budget.json`

### 4. /dashboard/ceremonie (laïque + catholique)
- `src/pages/dashboard/CeremoniePage.tsx` (~1224 lignes) — traduction **intégrale du contenu éditorial** :
  - Onglets Laïque / Catholique
  - Section Laïque : fondamentaux, déroulement (10 étapes), types d'officiants, rituels symboliques, conseils musique, plan B météo, checklist PDF
  - Section Catholique : étapes de préparation, déroulement liturgique, lectures, musiques, traditions, checklist PDF
  - Boutons de téléchargement PDF, modals premium
  - Génération PDF (titres jsPDF)

→ Créer `src/i18n/locales/{fr,en}/ceremonie.json` (nouveau namespace, contenu volumineux)

## Approche technique

**Pattern uniforme par composant** :
1. Importer `useTranslation` avec le namespace approprié
2. Remplacer chaque chaîne FR par `t('clé')`
3. Mettre les chaînes FR existantes dans `fr/<ns>.json`, traduire en anglais idiomatique dans `en/<ns>.json`
4. Pour les listes (étapes, badges, catégories) : structurer en tableaux d'objets dans le JSON et lire avec `t('clé', { returnObjects: true })`
5. Enregistrer le namespace `ceremonie` dans `src/i18n/index.ts`

**Date du dashboard** ("mardi 16 juin 2026") : utiliser `date-fns` avec locale dynamique (`fr` ou `enUS`) selon `i18n.language`.

**Ce qui ne change PAS** :
- Contenus DB (catégories budget personnalisées par user, commentaires, items checklist manuelle, etc.) — restent dans leur langue d'origine, conformément à la règle existante
- Logique métier, requêtes, RLS, calculs

## Estimation volume

- ~300-400 clés de traduction au total
- ~150 clés rien que pour CeremoniePage (volume éditorial)
- ~60-80 clés pour DetailedBudget + BudgetCalculator
- ~40 clés pour la checklist 10 étapes
- ~30 clés pour le dashboard d'accueil

Travail conséquent mais sans risque sur la logique : remplacement de littéraux par `t()` uniquement.

## Validation

1. Build sans erreur
2. Toggle EN sur /dashboard → tous les textes chrome passent en anglais, date affichée en EN
3. Idem sur /dashboard/checklist-mariage, /dashboard/budget, /dashboard/ceremonie (onglet Laïque ET Catholique)
4. Toggle FR remet tout en français
5. Le contenu DB (catégories budget user, items ajoutés) reste inchangé dans les deux langues
