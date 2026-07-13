## Corrections mobile

### 1. Supprimer le hamburger dans le dashboard

Le `PremiumHeader` (marketing) est actuellement monté dans `DashboardLayout.tsx` (ligne 84) — c'est lui qui affiche le hamburger avec Prestataires/Outils/Prix/E-books.

- Dans `DashboardLayout.tsx` : retirer `<PremiumHeader />` **en version mobile uniquement** (`{!isMobile && <PremiumHeader />}`). Sur mobile connecté, le menu sticky bas (5 items + Plus) suffit.
- Le hamburger marketing reste sur les pages publiques (Index, Prestataires, /login, etc.).

### 2. Toast "Non connecté" non bloquant

Aujourd'hui, quand un visiteur non-connecté atterrit sur une page protégée, on affiche un toast rouge `destructive` "Non connecté" AVANT de rediriger vers `/login`. Le toast peut rester à l'écran et gêner.

- `src/pages/MonJourM.tsx` : supprimer le toast destructif ; rediriger directement vers `/login` avec `state.from`.
- `src/pages/dashboard/UserDashboard.tsx` : idem, supprimer le toast destructif, redirection directe.
- Les toasts de session expirée légitimes (perte de session après connexion) restent inchangés.

### 3. Masquer le menu sticky bas sur `/partenariat`

Dans `src/components/layout/MobileBottomNav.tsx`, ajouter `^\/partenariat` et `^\/professionnels` (alias) à la liste `HIDDEN_PATTERNS`. Cohérent avec la page d'accueil / marketing.

## Fichiers modifiés

- `src/components/dashboard/DashboardLayout.tsx` (PremiumHeader desktop uniquement)
- `src/pages/MonJourM.tsx` (redirection silencieuse)
- `src/pages/dashboard/UserDashboard.tsx` (redirection silencieuse)
- `src/components/layout/MobileBottomNav.tsx` (patterns cachés)

Aucune modification backend.