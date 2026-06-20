## Objectif

Compléter la traduction FR/EN pour que le toggle langue fonctionne sur les modules restants. Aucune logique métier ni structure de données modifiée — uniquement remplacement des strings UI codées en dur par `t('…')`.

## Périmètre

### 1. Module `/mon-jour-m` (Jour J)
Pages + composants partagés :
- `src/pages/MonJourMPlanning.tsx` + `src/components/mon-jour-m/MonJourMPlanning*.tsx`, `MonJourMTimeline.tsx`, `SimpleTaskManager.tsx`, `TaskEditModal.tsx`, `UnifiedTaskModal.tsx`, `AddManualEventModal.tsx`, `TimeReferenceModal.tsx`, `MathildeExampleModal.tsx`, `PlanningGuidePopup.tsx`, `AISuggestionsModal.tsx`, `AITaskSelectionModal.tsx`, `PersonalizedScenarioTab.tsx`, `ImportFromDashboardModal.tsx`, `MonJourMOnboardingModal.tsx`, `MonJourMLayout.tsx`, `LoadingState.tsx`.
- `src/pages/MonJourMEquipe.tsx` + `SimpleTeamManager.tsx`, `BulkAddTeamModal.tsx`.
- `src/pages/MonJourMDocuments.tsx` + `MonJourMDocuments.tsx`.
- `src/pages/MonJourMConseils.tsx`.
- Boutons de partage : `PlanningShareButton.tsx`, `SharePublicButton.tsx`.

### 2. Page consultation publique
- `src/pages/PlanningPublic.tsx` (URL `/planning-public/:coordinationId`) — titres, badges (heure, lieu, intervenants), états vides, messages d'erreur, footer.

### 3. `/dashboard/settings`
- `src/components/dashboard/UserProfile.tsx` — labels formulaires, boutons, toasts, sections (compte, profil, sécurité, suppression).

### 4. Modal Website (Site Internet)
- `src/components/dashboard/SiteInternetModal.tsx` — titre, description, CTA, contenu de la modal ouverte depuis la sidebar dashboard.

### 5. `/dashboard/rsvp`
- Re-vérification de `src/pages/dashboard/RSVPManagement.tsx`, `RSVPResponses.tsx`, `RSVPTabs.tsx`, `RSVPEventCard.tsx` — compléter les strings oubliées (titres d'onglets, colonnes tableau, statuts, modales d'invitation, exports).

## Approche technique

### i18n — nouveaux namespaces
Création de deux fichiers `src/i18n/locales/{fr,en}/monJourM.json` regroupant :
- `planning.*` (tâches, timeline, modales, IA)
- `team.*` (équipe, ajout en masse)
- `documents.*`
- `conseils.*`
- `public.*` (page consultation `/planning-public/...`)
- `share.*` (boutons partage)

Extension de l'existant :
- `dashboard.json` : ajout `settings.*` (profil utilisateur) et `website.*` (modal site internet).
- `weddingDay.json` : compléments éventuels pour RSVP (clés manquantes uniquement).

### Composants
- Ajout `useTranslation('monJourM')` (ou namespace concerné) dans chaque composant.
- Remplacement systématique des strings FR codées par `t('clé')`.
- Listes / objets éditoriaux passés via `t('…', { returnObjects: true })`.
- Aucune modification de props, state, hooks, requêtes Supabase, edge functions, schémas.

### Enregistrement
- Mise à jour `src/i18n/index.ts` pour charger le namespace `monJourM` FR + EN.

## Hors périmètre (non touché)
- Edge functions et données stockées en base (les tâches IA déjà sauvegardées en FR restent en FR — l'utilisateur peut régénérer si besoin, comme convenu précédemment).
- Logique métier, layout, styles, permissions, RLS.
- Routes et navigation.

## Validation
- Toggle FR ↔ EN sur chaque écran listé : vérification visuelle qu'aucune string FR ne subsiste en mode EN (et inversement).
- Vérification que les fonctionnalités existantes (création tâche, ajout équipe, partage public, RSVP, sauvegarde profil) restent opérationnelles — aucun changement de signature.
