# Landing SEO/GEO — "Combien coûte vraiment votre mariage ?"

Nouvelle page autonome (test d'approche), pensée comme hub budget : très SEO/GEO, design éditorial moderne, 3 parcours actionnables et connectés au reste du site.

## URL et positionnement

- Route : `/budget-mariage` (mot-clé head term principal), page publique, hors dashboard.
- Header/Footer : `EditorialHeader` global + footer standard, D.A. homepage (beige clair #F8F5EF, vert sauge #63745A, Playfair, `rounded-none`).
- Liens entrants : footer (section Outils), page `/comparatif`, fin d'articles de blog budget, et `/outils-planning-mariage`.

## Structure de la page

1. **Hero** — H1 « Combien coûte vraiment votre mariage ? », sous-titre « Mariable vous aide à comprendre votre budget, décrypter vos devis et trouver des prestataires adaptés à votre projet. » + 3 CTA côte à côte : Estimer mon budget / Analyser mon devis / Trouver mes prestataires. Animation légère d'apparition, chiffre clé animé (budget moyen France).
2. **Réponse directe (bloc GEO)** — encadré « En bref » : réponse chiffrée en 3 phrases + tableau *Répartition du budget en %* par poste (lieu, traiteur, photo, DJ, fleurs, tenues, papeterie, divers). Format optimisé answer-box / citation IA.
3. **Grille "Budget par nombre d'invités"** — cartes 30 / 50 / 80 / 100 / 150 personnes avec fourchette basse-moyenne-haute. Chaque carte ouvre le simulateur pré-rempli.
4. **Grille "Budget par enveloppe"** — 15 000 / 20 000 / 25 000 / 30 000 / 40 000 / 50 000 € : ce que ça permet concrètement (invités, niveau de prestation). Cible longue traîne transactionnelle.
5. **Prix par prestataire** — tableau des fourchettes (lieu, traiteur/pers., photographe, DJ, fleuriste, wedding planner) + lien vers la sélection de prestataires filtrée par catégorie.
6. **Section "Analyser mon devis"** — pitch + formulaire (voir plus bas).
7. **Section "Réduire son budget"** — ce qu'on peut couper sans que ça se voie / les fausses économies (angle éditorial Mariable, cible mots-clés douleurs).
8. **FAQ** (8-10 questions issues des mots-clés info) avec schéma `FAQPage`.
9. **CTA final** — créer un compte gratuit + passer Premium.

## Les 3 parcours

**A. Estimer mon budget (modal)**
- Ouvre en modal le composant existant `src/components/dashboard/BudgetCalculator.tsx` (aucune duplication de logique).
- À la fin de l'estimation, bloc de conversion : « Vous souhaitez recevoir les prestataires qui correspondent à ce budget ? 👉 Oui, je veux découvrir ».
- Clic → redirection vers `/register-gratuit?source=budget&intent=prestataires` avec l'estimation gardée en `sessionStorage`. Après création du compte : enregistrement d'une demande de type `prestataire` (budget, invités, région, niveau) et envoi d'un email à mathilde@mariable.fr.

**B. Analyser mon devis**
- Formulaire : email, catégorie (Lieu / Traiteur / Photographe / Vidéaste / Fleuriste / DJ / Wedding planner / Décoration / Autre), budget indicatif optionnel, upload PDF (max 10 Mo, PDF/JPG/PNG).
- Traitement semi-manuel au départ : le devis est stocké, la demande listée dans l'admin, et une notification email arrive sur mathilde@mariable.fr avec le lien du fichier.
- Confirmation à l'écran + email de réponse sous 48h annoncé.

**C. Trouver mes prestataires**
- Lien direct vers la sélection de prestataires (page marketplace existante), pré-filtrée si une catégorie a été choisie.

## SEO / GEO

- `<title>` : « Budget mariage 2027 : combien coûte vraiment un mariage ? » ; meta description < 160 car. ; canonical.
- Un seul H1, H2 par section, H3 pour les sous-blocs (respect du standard de nesting du projet).
- Schémas JSON-LD : `FAQPage`, `BreadcrumbList`, `HowTo` (estimer son budget en 4 étapes), `WebApplication` pour le simulateur.
- Contenu couvrant les clusters fournis : head terms dans le hero + bloc "En bref", moyenne traîne dans les grilles invités/postes, longue traîne dans les cartes enveloppe et la FAQ.
- Ajout de la page au sitemap et maillage interne vers les articles de blog budget existants et les pages prestataires.

## Détails techniques

- Fichier page : `src/pages/BudgetMariage.tsx` + sous-composants dans `src/components/budget-landing/` (Hero, RepartitionTable, GuestGrid, EnvelopeGrid, VendorPrices, DevisForm, BudgetFaq).
- Route ajoutée dans `src/App.tsx` via `lazyWithRetry`.
- Modal simulateur : `Dialog` shadcn enveloppant `BudgetCalculator`.
- Backend (migration Supabase) :
  - Bucket privé `devis-analyses` (upload via URL signée, lecture réservée au service role / admin).
  - Table `devis_analyses` (id, email, categorie, budget_indicatif, file_path, statut, notes_admin, created_at) avec GRANTs explicites, RLS : insert anonyme autorisé, lecture réservée aux admins (`is_admin()`).
  - Edge function `notify-devis-analyse` : email vers mathilde@mariable.fr (Resend, comme les autres notify).
  - Les leads « je veux découvrir les prestataires » sont enregistrés dans `contact_requests` avec `type = 'prestataire'` et notifiés par email.
- Textes en dur en FR pour ce test (page hors i18n pour l'instant), extraction possible plus tard.
- Mobile-first : grilles 1 colonne < 768px, CTA hero empilés, tableaux scrollables horizontalement.
