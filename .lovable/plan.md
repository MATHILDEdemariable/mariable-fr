## Objectif

Unifier la navigation mobile (un seul menu sticky), corriger les chemins cassés, éviter les erreurs sur pages authentifiées non connecté, et rendre plus visibles les bannières notifications.

## 1. Un seul menu sticky mobile partout

Deux menus coexistent aujourd'hui :
- `src/components/layout/MobileBottomNav.tsx` (4 items) monté globalement dans `App.tsx`
- `src/components/dashboard/MobileBottomNav.tsx` (5 items + Plus) monté dans `DashboardLayout`

Conserver **uniquement** celui à 5 items (image 4 : Accueil / Check-list / Budget / Jour-J / Plus) et l'afficher globalement.

- Déplacer la version 5-items vers `src/components/layout/MobileBottomNav.tsx` (remplacer le contenu actuel).
- Supprimer l'import + montage dans `DashboardLayout.tsx` (évite le doublon).
- Garder l'import global dans `App.tsx` avec la même liste `HIDDEN_PATTERNS` (masqué sur marketing/admin/auth/embeds).
- Accueil → `/dashboard` (déjà OK).

## 2. Corriger les chemins cassés du menu "Plus"

- Lien "Paramètres" : remplacer `/dashboard/parametres` par `/dashboard/settings` (route réellement définie dans `UserDashboard.tsx`).
- Vérifier les autres liens du drawer et corriger ceux qui n'existent pas :
  - `/dashboard/chat-gpt-mariage` et `/dashboard/assistant-mariage` → route existante `/dashboard/assistant`.

## 3. Pas de "bug" quand non-connecté

Quand un visiteur non-connecté clique sur "Jour-J" (`/mon-jour-m/planning`), la page tente de charger la coordination et affiche des popups rouges "Erreur de chargement de la coordination" (image 1) + toast "Utilisateur non authentifié".

Corriger dans :
- `src/pages/MonJourMPlanning.tsx` (et pages sœurs `MonJourMEquipe`, `MonJourMDocuments`, `MonJourMConseils`, `MonJourMPenseBete`) : ajouter un check d'auth en amont comme dans `src/pages/MonJourM.tsx` — si pas de session, `navigate('/login', { state:{ from: pathname }})` **sans** afficher de toast destructif.
- `src/hooks/useMonJourMCoordination.ts` : si `!user`, retourner silencieusement (`setIsLoading(false)`, pas de toast, pas de retry en boucle). L'écran de login prend le relais.

## 4. Page `/prestataires` (marketing)

Dans `src/pages/services/Prestataires.tsx` :
- Boutons "Trouver des prestataires" (2 occurrences, lignes 22 et 152) : `navigate('/selection')` → `navigate('/professionnelsmariable')`.
- Boutons "Planning personnalisé" (lignes 30 et 160) : `navigate('/planning-personnalise')` → `navigate('/register')` (création de compte).
- Ne pas toucher aux liens catégories `/selection?category=...` (fonctionnels).

## 5. Bannière notifications plus visible

`PushNotificationBanner` existe déjà dans `ProjectSummary` (dashboard) mais discret.

- Dashboard (`ProjectSummary.tsx`) : remonter la bannière tout en haut, styliser comme la bannière "Installer l'app" (fond olive clair, icône Bell, CTA large). Retirer le seuil `DISMISS_DAYS = 7` pour la rendre plus persistante (ou réduire à 2 jours).
- Landing (`src/pages/Index.tsx`) : monter `<PushNotificationBanner />` en tête de page, visible uniquement si supporté (le composant gère déjà `isPushSupported`).

## Fichiers modifiés

- `src/components/layout/MobileBottomNav.tsx` (remplacé par version 5-items unifiée avec chemins corrigés)
- `src/components/dashboard/MobileBottomNav.tsx` (supprimé)
- `src/components/dashboard/DashboardLayout.tsx` (retirer import/montage)
- `src/hooks/useMonJourMCoordination.ts` (silence si non-auth)
- `src/pages/MonJourMPlanning.tsx`, `MonJourMEquipe.tsx`, `MonJourMDocuments.tsx`, `MonJourMConseils.tsx`, `MonJourMPenseBete.tsx` (guard auth)
- `src/pages/services/Prestataires.tsx` (redirections CTA)
- `src/components/dashboard/ProjectSummary.tsx` (bannière push en tête)
- `src/pages/Index.tsx` (bannière push landing)
- `src/components/dashboard/PushNotificationBanner.tsx` (style plus visible)

Aucune modification backend / base de données.