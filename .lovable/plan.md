# Plan — Refonte dashboard + fix prestataires

## 1. Réorganisation de la sidebar (`src/components/dashboard/DashboardSidebar.tsx`)

Regrouper visuellement les items par **sections** avec de petits titres (`ORGANISATION`, `JOUR-J`, `APRÈS`, `ADMIN`, `BONUS`) au lieu de la liste plate actuelle. Ordre demandé :

**ORGANISATION**
- Tableau de bord (accueil)
- Rétroplanning (lien direct)
- Calculatrice Budget → `/dashboard/budget?tab=calculator`
- Gestion du budget → `/dashboard/budget?tab=detailed`
- RSVP Invités
- Prestataires (dropdown existant)
- Check-list (dropdown existant)

**JOUR-J**
- Planning Jour-J (badge Exclusif)
- Plan de table
- Calculatrice Boisson → `/dashboard/drinks` (sortie du dropdown Budget)
- Cérémonie
- Gestion des logements

**APRÈS JOUR-J**
- Après le jour-J

**ADMIN**
- Mairie – Civil
- Documents
- Site Internet (modal)
- Moodboard

**BONUS**
- Guides PDF
- Générateur QR Code / Liste de mariage
- Assistant virtuel + ChatGPT (sous-menu existant)

**Bas de sidebar** (inchangé) : Paramètres, Installer l'app, Un problème ?, Déconnexion.

Modifications concrètes :
- Supprimer le dropdown "Budget" à 2 items et créer 2 liens standalone (`Calculatrice Budget` / `Gestion du budget`) avec query param `?tab=`.
- Ajouter dans `BudgetPage.tsx` la lecture de `useSearchParams()` pour piloter `activeTab` (`detailed` / `calculator`).
- Introduire un petit composant interne `SidebarSection({title, children})` qui rend un label `text-[10px] uppercase tracking-wider text-muted-foreground px-3 pt-4 pb-1` puis les enfants.
- Ajouter les mêmes clés/labels dans `src/i18n/locales/fr/dashboard.json` et `en/dashboard.json` (sections + `budgetManagement`, `budgetCalculatorItem`, `drinksCalculatorItem`, `qrCodeRegistry`).

## 2. Modernisation de l'accueil dashboard (`src/components/dashboard/ProjectSummary.tsx`)

- **Supprimer** les blocs `<QuestCards />` et `<AchievementBadges />` (+ imports inutilisés).
- **Ajouter** un bandeau large *Install App* juste après `HeroStats`, avant `QuickActions` :
  - Fond dégradé sage (`bg-gradient-to-r from-wedding-olive to-wedding-olive/80`), texte blanc, coins arrondis, icône `Smartphone`.
  - Titre : « 📱 Installez l'app sur votre mobile — sans téléchargement »
  - Sous-titre : « Recommandé pour le Jour-J. Pour préparer votre mariage, préférez un ordinateur ou une tablette 💻 »
  - CTA blanc → `/dashboard/installer-app`.
  - Clés i18n `dashboard.installBanner.*` (FR + EN).
- **Refonte du bloc "Besoin d'aide"** : remplacer `WhatsAppButton` (variant featured) par un bouton unique « Contacter le support » qui ouvre la même `ProblemModal` que "Un problème ?" (importer `ProblemModal`, state local, un seul CTA sage-olive).

## 3. Fix page prestataire publique (`src/pages/prestataire/slug.tsx`)

Erreur : `permission denied for table prestataires_rows` en anon car les grants colonne-par-colonne récents excluent `email/telephone/siret/crm_*`, mais la requête fait `select("*, prestataires_photos_preprod(*)")` → PostgREST refuse.

Correction : remplacer le `select("*")` par une **liste explicite des colonnes publiques** (nom, slug, description, description_complete, ville, region, categorie, sous_categorie, capacite_max_invites, prix_a_partir_de, prix_par_personne, prix_par_groupe, styles, image_url, instagram, site_web, google_place_id, google_rating, google_reviews_count, visible, featured, brochure_url, distance_grande_ville, etc.), plus la relation `prestataires_photos_preprod(*)`. Idem pour la seconde requête `.eq("id", slug)`. Aucune modification RLS/DB (la sécurité récente reste intacte).

Vérifier les usages downstream (`VendorMoreInfo`, `GoogleReviews`, `PhotoGalleryViewer`) qui ne consomment que des champs déjà publics → OK.

## Détails techniques

- Aucune migration DB, aucun changement d'edge function.
- Tous les libellés passent par `t()` avec `dashboard` namespace pour rester bilingue.
- Aucun refactor hors périmètre (les autres pages restent intactes).
- Préserver la logique reader-mode et badge "Exclusif" sur Planning Jour-J.
