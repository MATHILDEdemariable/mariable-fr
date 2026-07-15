## Plan validé

### 1. Quiz en page standalone (lead magnet)
- Quiz déjà accessible publiquement via `/planning-personnalise` (pas d'auth) → OK.
- Ajouter sur la page résultats un CTA proéminent **"Créer un compte gratuit"** → `/login` avec argumentaire "Sauvegarder mes résultats + accéder aux outils".
- Si utilisateur non connecté sur la page résultats : bandeau/section CTA visible.

### 2. Header unifié quiz ↔ home
Remplacer `<Header />` par `<PremiumHeader />` dans :
- `src/pages/PlanningPersonnalise.tsx`
- `src/pages/PlanningResultatsPersonnalises.tsx`

### 3. D.A. vert sauge sur `/comparatif` et `/outils-planning-mariage`
- Aligner sur la D.A. de `/guides` : fond blanc/ivoire très clair, accents vert sauge (`wedding-olive`).
- Remplacer les backgrounds beiges dominants (`bg-wedding-cream`, `bg-wedding-beige`) par `bg-white` ou beige ivoire très clair.
- Titres, bordures, CTA en `wedding-olive`.

### 4. Home page — CTA "Créer un compte gratuit"
- Ajouter un CTA vert sauge **"Créer un compte gratuit"** entre `PremiumCoordinationSection` (ton espace mariable) et `PremiumToolsSection` (service en détail).
- Tous les CTA "Créer un compte gratuit" du site → `to="/login"` (le formulaire gère signup).

### 5. Beige plus clair (comme `/professionnelsmariable`)
- Ajuster le token beige dans `src/index.css` vers un ivoire très clair (ex. `#FAF8F3`).
- Vérifier sections concernées : section prix, PremiumFinalCTASection, cards home.
- Point à valider en build : créer un nouveau token `--wedding-ivory` OU écraser `--wedding-cream` — décision prise au moment de l'implémentation en auditant l'impact global.

### 6. ~~Élargissement copy mariage / anniversaire / PACS~~
**Reporté** — on reste sur mariage pur pour l'instant.

### Fichiers principaux impactés
- `src/pages/PlanningPersonnalise.tsx`
- `src/pages/PlanningResultatsPersonnalises.tsx`
- `src/pages/Comparatif.tsx`
- `src/pages/OutilsPlanningMariage.tsx`
- `src/pages/Index.tsx` (ordre sections + CTA)
- Nouveau composant `src/components/home/CreateAccountCTA.tsx`
- `src/index.css` (token beige)
