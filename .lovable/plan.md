## Objectif

Rendre le toggle EN/FR fonctionnel sur tout `/dashboard` pour :
1. **Chrome** : sidebar, mobile bottom nav, header, bannières, modales d'onboarding, boutons "Accueil / Sélection de professionnels", titres et meta `<Helmet>` des pages dashboard.
2. **3 pages prioritaires entièrement traduites** : Budget, Plan de table (Seating), Checklist mariage.

Le toggle EN/FR existe déjà dans `PremiumHeader` (utilisé par `DashboardLayout`) → aucune nouvelle UI à créer, on branche juste les clés.

**Hors scope** (V1) : autres pages dashboard (Planning, Mon Jour-M, Invités, Moodboard, Guides PDF, RSVP, Drinks, Coordination, etc.) — elles restent en FR mais la langue est mémorisée et le toggle visible partout. Contenus dynamiques DB (noms prestataires, tâches générées par IA, descriptions) → restent dans leur langue d'origine.

## Architecture i18n (réutilise l'existant)

`react-i18next` est déjà configuré (`src/i18n/index.ts`) avec `localStorage: mariable_lang`. On ajoute **3 nouveaux namespaces** :

```
src/i18n/locales/{fr,en}/
  dashboard.json     ← chrome partagé (sidebar, mobile nav, bannières, boutons globaux, helmet titles)
  budget.json        ← page Budget complète
  seating.json       ← Plan de table complet
  checklist.json     ← Checklist mariage complète
```

Enregistrement dans `src/i18n/index.ts` (ajout aux imports, à `resources`, à `ns: [...]`).

## Pages & composants à modifier

**Chrome (namespace `dashboard`)**
- `src/components/dashboard/DashboardLayout.tsx` — boutons "Accueil", "Sélection de professionnels", bannière mobile, alt textes.
- `src/components/dashboard/DashboardSidebar.tsx` — labels de navigation.
- `src/components/dashboard/MobileBottomNav.tsx` — labels mobile.
- `src/components/dashboard/SatisfactionModal.tsx` — textes modale (titres/CTA).
- Titres `<Helmet>` génériques des pages dashboard (CoordinatorsPage, GuidesPage, etc.) — uniquement le `<title>` et `<meta description>`, pour cohérence SEO/onglet.

**Pages prioritaires entièrement traduites**
- `src/pages/dashboard/BudgetPage.tsx` + `src/components/dashboard/BudgetCalculator.tsx` + `BudgetSummary.tsx` + `DetailedBudget.tsx` (namespace `budget`).
- `src/pages/SeatingPlan.tsx` + composants enfants de plan de table (namespace `seating`). À vérifier au moment de l'implémentation : lister les sous-composants utilisés et les traduire ensemble.
- `src/pages/dashboard/ChecklistMariagePage.tsx` + `ChecklistMariageManuelle.tsx` + `ChecklistIntelligente.tsx` + `ChecklistDixEtapes.tsx` + `TasksList.tsx` (namespace `checklist`).

Pour chaque composant : remplacer les chaînes FR en dur par `t('cle.explicite')` (convention métier, pas d'abréviations).

## Règles & garde-fous

- **Ne pas toucher** à la logique métier, aux requêtes Supabase, aux exports PDF (les PDF restent en FR — c'est cohérent avec un produit FR-first et évite de refondre `budgetExportService` / `seating` export).
- **Contenus DB** non traduits : descriptions, noms, tâches générées par IA s'affichent tels quels.
- **Boutons toast/erreurs** des 3 pages prioritaires : traduits. Toasts des pages hors scope : restent en FR.
- **Clés i18n** : convention `page.section.element` (ex: `budget.summary.totalEstimated`, `checklist.task.markDone`).
- **Pluriels** : utiliser la syntaxe i18next `key_one` / `key_other` quand pertinent (ex: nb invités, nb tâches).
- **Dates et nombres** : formater via `Intl.DateTimeFormat(i18n.language)` / `Intl.NumberFormat` pour budget (€ reste affiché, séparateurs adaptés).

## Livrables

1. 8 fichiers JSON (`fr` + `en` × 4 namespaces).
2. `src/i18n/index.ts` : enregistrement des namespaces.
3. Chrome dashboard traduit (4-5 composants).
4. 3 pages prioritaires + sous-composants traduits.
5. Vérification manuelle : toggle EN dans le header → sidebar/mobile-nav/3 pages basculent ; reload → langue persistée ; les autres pages dashboard restent lisibles (FR par défaut, pas d'erreurs).

## Hors scope explicite (à traiter dans une V2 si besoin)

- Pages dashboard : Planning, Mon Jour-M (et sous-pages), Invités/RSVP, Moodboard, Guides PDF, Drinks Calculator, Coordination, Documents, Hébergements, QR Code, Wishlist, Messages, etc.
- Traduction des exports PDF (budget, plan de table, checklist).
- Traduction des contenus DB / IA.
- Emails transactionnels dashboard.
