
# Plan global — /versionjuin26, footer, SEO/GEO

3 chantiers livrés en séquence : (A) page /versionjuin26, (B) footer, (C) SEO/GEO. Tu valides à chaque batch avant de passer au suivant.

---

## A. Page /versionjuin26

### A.1 — Hero (HeroV2.tsx)
On garde le fond vidéo (déjà en place — pas touché).
- **H1 sur 2 lignes max** : « Le premier wedding planner » / « *de poche.* » → on supprime la version actuelle qui passe en 3 lignes mobile, on force `whitespace-nowrap` sur la 2e ligne et on ajuste le `text-5xl md:text-6xl lg:text-7xl` pour qu'aucune ligne ne casse.
- Sous-titre conservé : « Pour les futurs mariés qui organisent eux-mêmes. »
- Ajout d'une **mini-ligne sous le CTA** : « Gratuit pour commencer · Premium 29€ à vie » (texte petit, opacity 70) → première mention claire de la dualité free/paid.
- 1 seul CTA conservé : « Découvrir Mariable » → `#planner-included`.

### A.2 — Nouvelle section « Free vs Premium » (FreemiumSection.tsx)
Insérée **après `IncludedSection`** (donc avant `DifferentiatorSection`). Inspirée de `/prix` mais condensée.
- Eyebrow : « Comment ça marche »
- H2 : « Gratuit pour commencer. Premium pour aller plus loin. »
- 2 cards côte à côte (mobile : empilées) :
  - **Mariable Gratuit** — accès aux outils (rétroplanning, budget, invités, plan de table, coordination Jour J) avec limites (3 exports, IA limitée, etc.)
  - **Mariable Premium — 29€ à vie** — tout illimité, IA sans limite, exports illimités, support prioritaire, accès complet à la bibliothèque de guides
- CTAs : « Créer un compte gratuit » + « Passer Premium 29€ »
- Source de vérité des features = `src/i18n/locales/fr/pricing.json` (déjà rempli) pour éviter la duplication.

### A.3 — Nouvelle section « E-shop guides à la carte » (GuidesShopSection.tsx)
Insérée **après `FreemiumSection`**, avant `DifferentiatorSection`.
- Eyebrow : « Bibliothèque de guides »
- H2 : « Achète juste le guide qu'il te faut. »
- Sous-titre : « Tu n'as pas besoin de toute la plateforme ? Tous nos guides sont disponibles à l'unité. »
- Grid 3 colonnes desktop / 1 colonne mobile, chaque card guide = couverture (image) + titre + prix + bouton « Acheter — Xe »
- **À cadrer avec toi avant codage** : liste exacte des guides + prix unitaires + visuels (couvertures PDF). Format souhaité :
  ```
  - Guide Budget Mariage — 9€ — /assets/guides/budget.jpg
  - Guide Rétroplanning — 9€ — /assets/guides/retroplanning.jpg
  - Guide Jour J — 12€ — /assets/guides/jour-j.jpg
  - ...
  ```
- **Intégration Stripe** : on utilise déjà `create-checkout-session` (edge function existante pour le Premium 29€). On crée une nouvelle edge function `create-guide-checkout` qui prend un `guide_id` et redirige vers Stripe Checkout. Webhook `stripe-webhook` étendu pour livrer le PDF par email après paiement (via `send-inscription-email` ou nouvelle fonction `deliver-guide-pdf`).
- **Table Supabase** `guides` : `id, slug, title, description, price_cents, cover_url, pdf_url, stripe_price_id, active, created_at`. RLS lecture publique (anon), écriture service_role uniquement.
- Stockage des PDF : bucket Supabase Storage privé `guides-pdf`, signed URLs envoyées par email après paiement réussi.

### A.4 — Refonte de PricingHighlight.tsx en comparatif « À la carte vs Premium »
- Eyebrow : « Le prix »
- H2 : « 29€ tout inclus. *Ou à la carte si tu préfères.* »
- **Tableau comparatif** 2 colonnes :

  ```text
  À LA CARTE                          PREMIUM 29€ (À VIE)
  ─────────────────────────────       ─────────────────────────────
  Guide Budget          9€            ✓ Tous les guides
  Guide Rétroplanning   9€            ✓ Tous les outils illimités
  Guide Jour J          12€           ✓ IA wedding planner illimitée
  Guide Invités         9€            ✓ Exports PDF illimités
  Guide Plan de table   9€            ✓ Mises à jour à vie
  ─────────────────────────────       ─────────────────────────────
  TOTAL :              48€            29€  ← économise 19€
  ```
- Sous le tableau : ligne italique « *vs un wedding planner à partir de 2 000€ — ≈ 70× moins cher* » (conservée).
- CTA principal : « Accéder à Mariable — 29€ » → `/paiement`
- CTA secondaire (texte simple) : « Voir les guides à l'unité » → ancre `#guides-shop`

### A.5 — Ordre final des sections dans VersionJuin26.tsx
```
Hero → ReassuranceBar → PainPoints → EspaceApercu → IncludedSection
  → FreemiumSection (NEW) → GuidesShopSection (NEW)
  → DifferentiatorSection → PremiumTestimonialsSection
  → PricingHighlight (refonte comparatif) → FAQSection
  → BlogSection → FinalCTASection
```

---

## B. Footer — refonte best-practice

Constat actuel (`src/components/Footer.tsx`) : 5 colonnes denses, 30+ liens, doublons (Contact apparaît 3×), aucune hiérarchie commerciale, colonne « Régions » prend autant de place que la colonne produit principale.

### B.1 — Nouvelle structure (inspirée Notion / Linear / Superhuman)
4 colonnes resserrées, max 5 liens par colonne, hiérarchie commerciale claire :

```text
┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│ MARIABLE         │ PRODUIT          │ RESSOURCES       │ ENTREPRISE       │
│ (logo + tagline) │                  │                  │                  │
│                  │ • Outils gratuits│ • Blog & conseils│ • Notre histoire │
│ Le 1er wedding   │ • Coordination   │ • FAQ            │ • Notre charte   │
│ planner de poche.│   Jour J         │ • Guides à l'unité│ • Devenir prestat.│
│                  │ • Prestataires   │ • Guide débutant │ • Contact        │
│ [IG] [LinkedIn]  │ • Prix & Premium │ • Témoignages    │ • CGV            │
│                  │ • Connexion      │                  │                  │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┘

Bas de footer (full-width, en discret) :
Mariages par région : Provence · Paris · Auvergne-Rhône-Alpes · Nouvelle-Aquitaine · Toutes les régions →

Bottom bar : © 2026 Mariable · Mentions légales · Confidentialité · CGV
```

### B.2 — Pourquoi cette structure
- **Hiérarchie commerciale** : « Produit » en colonne 2 (premier réflexe œil utilisateur après le logo) avec Prix bien visible.
- **Régions en bas en chips inline** : conserve le SEO maillage régional (important — cf §C) mais libère de la place visuelle. Une seule ligne au lieu d'une colonne entière.
- **Suppression doublons** : Contact apparaît 1× (Entreprise), pas 3×. « Partenariat » et « Devenir partenaire » fusionnés.
- **Logo admin caché** : actuellement le logo M lie vers `/admin/dashboard` — on garde le geste mais on déplace le lien sur un clic discret (icône invisible) pour éviter l'incongruité UX.

### B.3 — Liens conservés vs supprimés
Supprimés du footer (toujours accessibles via header ou sitemap) : `/selection`, `/mon-jour-m`, `/guide-jour-j`, `/services/budget`, `/jeunes-maries`, `/outils-planning-mariage`, `/coordination-jour-j`, `/guidepersonnalise`, `/about/approche`, `/comparatif`. Ces pages restent indexables mais n'occupent plus le footer.

---

## C. Audit SEO/GEO + plan d'implémentation

### C.1 — État actuel (données Semrush, marché FR)

**Performance globale**
- **107 keywords organiques**, **29 visiteurs/mois estimés** (très faible pour 6 mois+ d'existence).
- Domaine connu sur 1 seul keyword brand (« mariable », vol. 260, position 1).
- Concurrents directs (demoiselledujour.com : 938 visites/mois sur 263 keywords) sont **30× plus performants** sur le même créneau.

**Top pages qui drivent du trafic**
| Page | Keywords | Traffic share |
|---|---|---|
| `/` (homepage) | 1 | 31% (uniquement brand) |
| `/checklist-mariage` | 15 | 27% |
| `/conseilsmariage/temoins-de-mariage...` | 18 | 27% |
| `/services/budget` | 8 | 7% |
| `/mariage-paris` | 17 | 7% |

**Diagnostic** : 3 pages portent 85% du trafic. Tout le reste (régions, blog, outils) est sous-exploité. **Pages régionales = grand gisement** : `/mariage-paris` ranking #7 sur « mariage paris » (vol. 480) mais les 12 autres régions n'apparaissent quasi pas.

### C.2 — Audit livrable

Document `/mnt/documents/audit-seo-mariable.md` structuré :

1. **Snapshot actuel** : 107 KW, 29 visites/mois, position vs 4 concurrents principaux (compare_domains).
2. **Quick wins SEO (sprint 1)** :
   - Pages au bord du top 10 à pousser : « to do list mariage » (#8, vol. 590), « temoin pour un mariage » (#7, vol. 1000), « simulateur budget mariage » (#12, vol. 260). Cible : passer top 3.
   - Pages régionales sous-optimisées : 12 régions / 13 ne rankent quasi pas. Audit individuel de chacune (longueur contenu, schema LocalBusiness, maillage interne).
   - Meta titles dupliqués / trop génériques (`useEffect` + `react-helmet-async` déjà en place, à exploiter).
3. **Structure du site & maillage interne** :
   - Cluster topique « Wedding Planning » : `/outils-planning-mariage` doit être le pilier reliant les 5-6 outils (rétroplanning, budget, invités, plan de table, coordination, calculateur boissons).
   - Cluster « Régions » : `/professionnelsmariable` (hub) → 13 pages régionales → fiches prestataires. Maillage actuel insuffisant.
   - Cluster « Conseils » : `/conseilsmariage` (blog) → articles. Linker depuis chaque outil vers 2-3 articles thématiques.
4. **GEO / AI search optimization** :
   - `public/llms.txt` existe : audit + enrichissement (lister explicitement les outils, prix 29€, différenciation).
   - Schémas JSON-LD : ajouter `Product` sur `/prix` (Premium 29€) et sur chaque guide e-shop, `FAQPage` sur `/contact/faq`, `HowTo` sur les guides pratiques. Déjà : `Organization`, `LocalBusiness` (régions), `Article` (blog).
   - Optimiser pour les requêtes conversationnelles : « comment organiser son mariage sans wedding planner », « combien coûte un wedding planner », « checklist mariage gratuite ». Pages dédiées + FAQ riches.
5. **Technique** : sitemap.xml présent (statique), à migrer vers générateur dynamique (couvre blog + guides e-shop nouveaux). Robots OK. Vérifier canonical sur toutes les pages dupliquées (variantes URL).
6. **Backlinks** : analyse séparée (à lancer si tu veux).
7. **Concurrents prioritaires** à étudier : **demoiselledujour.com** (10× plus de KW, 938 visites/mois). Keyword gap → liste de 20-30 sujets de contenu à créer.

### C.3 — Plan d'implémentation séquencé

Une fois l'audit validé, on découpe en **3 batchs** que tu valides un par un :

**Batch 1 — Quick wins techniques (1 session)**
- Audit + correction des meta tags (titles + descriptions) sur les 15 pages les plus stratégiques (homepage, /prix, /checklist-mariage, /outils-planning-mariage, /conseilsmariage, 13 pages régionales).
- Ajout schemas JSON-LD manquants (Product sur /prix, FAQPage sur /contact/faq).
- Migration sitemap statique → générateur dynamique (script `scripts/generate-sitemap.ts` + `predev`/`prebuild` npm hooks) pour inclure blog dynamique + futurs guides e-shop.
- Vérification canonical sur toutes pages.

**Batch 2 — Maillage interne & contenus piliers (1-2 sessions)**
- Refonte `/outils-planning-mariage` en page pilier (hub outils) avec maillage descendant vers chaque outil.
- Refonte `/professionnelsmariable` en page pilier régions.
- Boost des pages régionales : pour chaque région, audit du contenu (longueur, structure H1/H2/H3), enrichissement LocalBusiness JSON-LD, maillage croisé.
- Ajout breadcrumbs JSON-LD partout.

**Batch 3 — Contenu éditorial & GEO (continu)**
- Liste des 20-30 articles à créer (keyword gap vs demoiselledujour.com).
- Enrichissement `llms.txt`.
- FAQ riches sur les outils principaux pour cibler requêtes conversationnelles AI search.
- Plan de tracking : Search Console + retest Semrush mensuel.

---

## Ordre d'exécution proposé

1. **D'abord** : tu me confirmes la liste exacte des guides + prix + visuels pour l'e-shop (§A.3).
2. **A.1 + A.2 + A.4 + A.5** : refonte page /versionjuin26 (hero 2 lignes + section freemium + comparatif à la carte + réordonnancement). On peut faire sans l'e-shop section visible si la liste tarde — j'utilise des placeholders activables.
3. **A.3** : intégration e-shop Stripe (table guides + edge functions + UI) une fois la liste reçue.
4. **B** : refonte footer.
5. **C.2** : génération de l'audit SEO/GEO en document markdown livré.
6. **C.3 Batch 1 → 2 → 3** : implémentation séquencée après validation de l'audit.

## Détails techniques (annexe)

- **Tous les composants v2** restent sous `src/components/home/v2/` (`FreemiumSection.tsx`, `GuidesShopSection.tsx` nouveaux).
- **Stripe** : on réutilise l'intégration existante (`create-checkout-session` + webhook `stripe-webhook`). Pour les guides on ajoute des Stripe Products + Prices distincts du Premium 29€. Pas de mutualisation avec le BYOK actuel — on reste sur le mécanisme existant.
- **Supabase** : nouvelle table `guides` + nouvelle table `guide_purchases` (`id, user_id NULL, email, guide_id, stripe_session_id, status, delivered_at`). Bucket privé `guides-pdf`. RLS strict.
- **Page reste en `noindex`** tant qu'on est en build — on retire le noindex quand tu décides de basculer /versionjuin26 → / (route principale).
- **Footer** : un seul composant `src/components/Footer.tsx` modifié → impact sitewide (toutes les pages publiques).
- **i18n** : nouvelles chaînes ajoutées dans `src/i18n/locales/fr/home.json` et `common.json`. Anglais en placeholder (Phase 1 i18n = home + header/footer seulement, cf memory).
