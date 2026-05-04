# Plan : correction toggle home + i18n complet du dashboard

## Phase A — Diagnostic & correction du toggle home (rapide)

**Symptôme** : seul le header bascule en EN, le hero et les autres sections restent en FR.

**Causes probables à vérifier dans l'ordre** :
1. Cache `localStorage` `mariable_lang` : si une ancienne valeur est stockée (ex. `fr-FR` ou clé différente), le détecteur peut ignorer le changement pour certains namespaces.
2. Le hook `useTranslation('home')` est appelé après le 1er render alors que `useSuspense: false` → certains composants peuvent rendre les clés brutes ou le fallback FR sans re-render au `languageChanged`.
3. `i18next-browser-languagedetector` peut renvoyer `fr-FR` (navigateur) qui matche `fr` mais qui, combiné à `caches: ['localStorage']`, écrit `fr-FR` → la bascule EN ne déclenche pas un changement perçu.

**Actions** :
- Forcer la normalisation : ajouter `load: 'languageOnly'` + `nonExplicitSupportedLngs: true` dans la config i18n.
- Forcer le re-render global : ajouter un listener `i18n.on('languageChanged')` dans un composant racine (ou utiliser `<I18nextProvider>` autour de `<App />` dans `main.tsx`) pour garantir la propagation.
- Nettoyer la valeur `mariable_lang` au boot si elle ne fait pas partie de `SUPPORTED_LANGUAGES`.
- Tester en preview les 8 sections de la home (Hero, Process, Marketplace, Tools, Coordination, Testimonials, FinalCTA, Footer) en basculant FR ↔ EN.

## Phase B — Traduction complète du dashboard (32 pages)

Découpage en 4 sous-phases pour livrer par incréments testables.

### B.1 — Layout & navigation (fondations)
Composants partagés affichés sur toutes les pages dashboard.
- `DashboardLayout.tsx` (header, breadcrumbs)
- `DashboardSidebar.tsx` (menu latéral desktop)
- `MobileBottomNav.tsx` (navigation mobile)
- `DashboardFeatureCards.tsx`, `DashboardInstructions.tsx`, `DashboardModal.tsx`
- `OnboardingProgress.tsx`, `VerticalOnboardingProgress.tsx`, `ProgressBar.tsx`, `ProgressOverview.tsx`
- `UserProfile.tsx`, `ReaderBanner.tsx`

Namespace : `dashboard-common`.

### B.2 — Pages d'entrée du dashboard
- `UserDashboard.tsx` (accueil)
- `MonMariage.tsx`, `MonMariageDetail.tsx`
- `ProjectSummary.tsx`, `CreateProjectDialog.tsx`
- `HelpPage.tsx`, `GuidesPage.tsx`, `InstallAppPage.tsx`
- `PanierPage.tsx`, `WishlistPage.tsx`

Namespace : `dashboard-home`.

### B.3 — Modules outils
Un namespace par module pour garder les fichiers JSON lisibles.
- `dashboard-checklist` : ChecklistMariagePage, ChecklistPage, ChecklistDixEtapes, ChecklistIntelligente, ChecklistMariageManuelle, ChecklistWidget, TasksList
- `dashboard-budget` : BudgetPage, BudgetCalculator, BudgetSummary, DetailedBudget
- `dashboard-planning` : PlanningPage, PlanningResults, AvantJourJPage, ApresJourJPage, ApresJourJManuelle
- `dashboard-coordination` : CoordinationPage, CoordinatorsPage, CallScheduleModal
- `dashboard-rsvp` : RSVPManagement, RSVPResponses, RSVPTabs, RSVPEventCard, GuestManagement
- `dashboard-vendors` : VendorSelectionPage, VendorTrackingPage, VendorTracking, AddVendorDialog, EditVendorModal, ProfessionnelsMariableDashboard
- `dashboard-tools` : MoodboardPage, DrinksCalculatorPage, DrinksCalculatorWidget, QRCodeGenerator, MairieCivilPage, CeremoniePage, AccommodationsPage
- `dashboard-misc` : DocumentsPage, DocumentsSection, MessagesPage, AssistantPage, SiteInternetModal, ClubMariableModal, SatisfactionModal, ReaderView, GuideStartupContent, InitiationMariageWidget, PricingContent

### B.4 — Données structurées
- `src/data/dashboardFeatures.ts` : transformer les chaînes hardcodées en clés i18n (les composants consommateurs feront `t(feature.titleKey)`).

## Phase C — Exports PDF & emails bilingues

### C.1 — Services d'export PDF (frontend)
Chaque service reçoit la langue active via `i18n.language` et utilise des dictionnaires internes (FR/EN) pour les libellés statiques (titres, en-têtes de colonnes, mentions légales, footer "Généré par Mariable").
- `budgetExportService.ts`
- `planningExportService.ts`, `planningBrandedExportService.ts`, `planningJourJBrandedExport.ts`, `publicPlanningExportService.ts`, `publicPlanningBrandedExportService.ts`
- `coordinationExportService.ts`
- `avantJourJExportService.ts`, `apresJourJExportService.ts`
- `drinksExportService.ts`
- `vendorTrackingExportService.ts`
- `moodboardPdfService.ts`
- `pdfExportService.ts`
- `utils/exportQRCodePDF.ts`

Approche : créer `src/services/i18n/exportLabels.ts` avec un objet `{ fr: {...}, en: {...} }` partagé entre tous les services pour éviter la duplication.

### C.2 — Emails transactionnels (Supabase Edge Functions)
Ajouter un paramètre `lang` (`fr`|`en`) au payload de chaque appel, propagé depuis le frontend via `i18n.language`. Templates dupliqués FR/EN dans chaque fonction.

Edge functions concernées :
- `send-welcome-couple-email` (séquence onboarding)
- `send-welcome-premium-email`
- `send-inscription-email`
- `notify-new-registration` (admin → reste FR)
- `notify-vendor-message` (notification au pro → garder FR car les pros sont francophones)
- `reply-contact-request` (réponse user → bilingue)
- `send-problem-report` (admin → reste FR)
- `auth-email-hook` (mots de passe / vérification → bilingue, via les templates `_shared/email-templates/`)

**Précisions** :
- Auth emails (password reset, email confirmation) : modifier les 6 templates React Email dans `supabase/functions/_shared/email-templates/` pour accepter un prop `lang` et basculer textes/CTA. Stocker `preferred_language` dans `profiles` (nouvelle colonne) lue par l'edge function `auth-email-hook` depuis le user metadata.
- Emails admin internes : restent FR (lecteurs francophones).

### C.3 — Migration DB
Ajouter `preferred_language text default 'fr'` dans la table `profiles` + trigger pour la copier depuis `auth.users.raw_user_meta_data.lang` à l'inscription.

## Hors périmètre

- Blog & articles SEO (FR uniquement, déjà décidé)
- Pages régionales mariage (FR uniquement)
- Pages prestataires individuelles & mini-sites mariage couples (contenu user-generated en FR)
- Admin dashboard (`/admin/*`) — usage interne FR
- Pages publiques RSVP / guides invités (génère par couple, langue propre au mariage)

## Détails techniques

### Structure i18n finale
```text
src/i18n/locales/
  fr/
    common.json
    home.json
    pricing.json
    professionals.json
    dashboard-common.json
    dashboard-home.json
    dashboard-checklist.json
    dashboard-budget.json
    dashboard-planning.json
    dashboard-coordination.json
    dashboard-rsvp.json
    dashboard-vendors.json
    dashboard-tools.json
    dashboard-misc.json
    exports.json          # libellés PDF
    emails.json           # libellés emails (frontend preview)
  en/
    (mêmes fichiers)
```

### Persistance de la langue utilisateur
- Logged-out : `localStorage.mariable_lang`
- Logged-in : colonne `profiles.preferred_language`, sync bidirectionnel au login/logout. Source de vérité = DB quand connecté.

### Règles d'exécution
- Aucun changement de logique métier (formulaires, calculs, RLS, requêtes Supabase)
- Conservation stricte du DOM, des classes Tailwind, et de l'architecture composants
- Génération automatique des traductions EN par l'IA (qualité standard, relecture utilisateur recommandée)
- Tests manuels après chaque sous-phase (B.1, B.2, B.3, B.4, C.1, C.2)

## Estimation & ordre d'exécution recommandé

1. **Phase A** (correction toggle home) — petit, à faire en premier pour valider l'infra
2. **Phase B.1** (layout dashboard) — débloque visuellement toutes les pages
3. **Phase B.2** (pages d'entrée)
4. **Phase B.3** (modules outils) — gros volume, livrable module par module
5. **Phase B.4** (données structurées)
6. **Phase C.1** (exports PDF)
7. **Phase C.3** (migration DB `preferred_language`)
8. **Phase C.2** (emails) — en dernier car dépend de C.3

Chaque phase = livraison testable indépendante.
