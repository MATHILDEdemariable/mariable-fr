# Landing SEO/GEO — "Combien coûte vraiment votre mariage ?"

Page autonome, simple et lisible : un hero vidéo comme la home, 3 parcours, puis les sections éditoriales de la home dupliquées à l'identique.

## URL et D.A.

- Route : `/budget-mariage`, page publique.
- Header `EditorialHeader` + footer standard.
- Hero vidéo identique à la home (même composant/vidéo `HeroEditorial`, même traitement typographique et overlay) mais avec le H1 « Combien coûte vraiment votre mariage ? » et le sous-titre « Mariable vous aide à comprendre votre budget, décrypter vos devis et trouver des prestataires adaptés à votre projet. »
- Même D.A. que la home : beige clair #F8F5EF, vert sauge #63745A, Playfair, `rounded-none`.

## Structure de la page

1. **Hero vidéo** — H1 + sous-titre + les 3 CTA côte à côte (empilés en mobile) :
   - Estimer mon budget
   - Analyser mon devis
   - Trouver mes prestataires
2. **Parcours 1 — Estimer mon budget** — bloc éditorial (texte court + visuel), bouton qui ouvre le simulateur existant en modal.
3. **Parcours 2 — Analyser mon devis** — « Votre devis mariage est-il au juste prix ? Envoyez-nous votre devis. Nous vous aidons à comprendre les prix, identifier les postes à challenger et préparer vos questions au prestataire. » + formulaire.
4. **Parcours 3 — Trouver mes prestataires** — pitch curation + lien vers la sélection de prestataires.
5. **Les guides ultimes** — duplication iso de la section E-shop de la home.
6. **Conseils & inspirations** — duplication iso du carrousel blog de la home.
7. **Témoignages** — duplication iso de la section témoignages de la home.
8. **Créer votre espace Mariable** — bloc final CTA (compte gratuit) repris de la home.

Pas de tableau de répartition en %, pas de grille invités, pas de grille enveloppes, pas de tableau de prix par prestataire : le SEO/GEO passe par le contenu rédigé des 3 parcours, la FAQ légère et les données structurées.

## Les 3 parcours en détail

**A. Estimer mon budget**
- Modal (`Dialog`) contenant le composant existant `src/components/dashboard/BudgetCalculator.tsx` — aucune duplication de logique.
- À la fin de l'estimation : « Vous souhaitez recevoir les prestataires qui correspondent à ce budget ? 👉 Oui, je veux découvrir ».
- Clic → `/register-gratuit?source=budget&intent=prestataires`, estimation conservée en `sessionStorage`. Après création du compte : enregistrement d'une demande `type = 'prestataire'` dans `contact_requests` (budget, invités, région, niveau) + email de notification à mathilde@mariable.fr.

**B. Analyser mon devis**
- Formulaire : email, catégorie (Lieu / Traiteur / Photographe / Vidéaste / Fleuriste / DJ / Wedding planner / Décoration / Autre), upload PDF (max 10 Mo, PDF/JPG/PNG), commentaire optionnel.
- Analyse semi-manuelle au départ : stockage du fichier, demande visible en admin, email de notification à mathilde@mariable.fr avec lien du fichier.
- Confirmation à l'écran + promesse de réponse sous 48h.

**C. Trouver mes prestataires**
- Lien vers la marketplace existante, pré-filtrée par catégorie si l'utilisateur en choisit une.

## SEO / GEO

- Title : « Budget mariage : combien coûte vraiment un mariage ? » ; meta description < 160 caractères ; canonical.
- Un seul H1 (hero), H2 par section, H3 dans les parcours.
- Contenu rédigé des parcours couvrant les mots-clés principaux (budget mariage, combien coûte un mariage, prix mariage, coût moyen mariage France, simulateur budget mariage, réduire le budget d'un mariage).
- Petite FAQ (6 questions) en fin de page avec JSON-LD `FAQPage`, plus `BreadcrumbList` et `WebApplication` pour le simulateur.
- Ajout au sitemap + liens entrants depuis le footer (Outils), `/comparatif` et les articles de blog budget.

## Détails techniques

- `src/pages/BudgetMariage.tsx` + sous-composants dans `src/components/budget-landing/` (HeroBudget, ParcoursEstimation, ParcoursDevis, ParcoursPrestataires, BudgetFaq).
- Sections dupliquées : réutilisation directe de `EditorialEShop`, `BlogCarouselEditorial`, `TestimonialsEditorial`, `FinalEditorialCTA`.
- Route via `lazyWithRetry` dans `src/App.tsx`.
- Backend (migration Supabase) :
  - Bucket privé `devis-analyses` (upload par URL signée, lecture admin/service role).
  - Table `devis_analyses` (id, email, categorie, commentaire, file_path, statut, created_at) avec GRANTs explicites ; RLS : insert public, lecture admin via `is_admin()`.
  - Edge function `notify-devis-analyse` (Resend) → mathilde@mariable.fr.
- Textes FR en dur pour ce test (hors i18n), extraction possible plus tard.
- Mobile-first : CTA empilés, sections en 1 colonne < 768px.
