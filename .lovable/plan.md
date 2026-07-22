## Objectif

1. Refondre la zone milieu de `/refontejuillet` selon la structure demandée (3 sections resserrées).
2. Rendre le toggle FR/EN opérationnel sur toute la page (hero, header/menu, sections milieu, blog, témoignages, FAQ, CTA final, footer).

---

## 1. Nouvelle zone milieu (entre Coups de cœur/Lieux et Blog)

Ordre final de la page :

```text
1. Hero (vidéo)
2. Coups de cœur — blanc
3. Lieux sélectionnés (carrousel) — vert sauge
── ZONE MILIEU ──
4. TON ESPACE MARIABLE — blanc (fusion aperçu + service en détail)
5. COMMENT ÇA MARCHE — blanc (pricing 2 cartes)
6. LES GUIDES / E-shop — beige clair (déplacé APRÈS pricing)
── /ZONE MILIEU ──
7. Conseils & inspirations (blog carrousel) — vert sauge
8. Témoignages — blanc
9. FAQ — blanc
10. CTA final — vert sauge
11. Footer
```

### Section 4 — TON ESPACE MARIABLE (refonte de `EspaceFusionSection`)

Un seul bloc au lieu de deux :

- Suptitle : `TON ESPACE MARIABLE`
- Titre : `Tout ton mariage, dans un seul espace.`
- Sous-titre : `Une plateforme web complète, accessible depuis ton téléphone, ta tablette ou ton ordi. Sans téléchargement, sans engagement.`
- Capture dashboard pleine largeur (visuel existant repris de `EspaceApercu`).
- Grille 3×2 (mobile : 1 col) — 1 ligne courte par item, icône discrète :
  - Rétroplanning intelligent — Une timeline selon ta date et ton style.
  - Budget réel — Tes dépenses suivies, prestataire par prestataire.
  - Liste invités & RSVP — 200 invités sans Excel. Allergies, hébergement.
  - Plan de table interactif — Drag & drop, imprime en un clic.
  - Coordination Jour J — Le déroulé partagé avec ton équipe.
  - Calculateur de boissons — Les bonnes quantités, sans gaspillage.
- Bande bonus fond vert sauge, texte blanc : `INCLUS · Le Carnet d'adresses Mariable — lieux d'exception et pros vérifiés.`
- CTA bas de section : `Créer un compte gratuit` (`/register-gratuit`) + lien secondaire `J'ai déjà un compte` (`/login`).

### Section 5 — COMMENT ÇA MARCHE (pricing resserré)

Nouveau composant `PricingEditorial` (ne modifie pas `FreemiumSection` utilisé ailleurs) :

- Suptitle : `COMMENT ÇA MARCHE`
- Titre : `Gratuit pour commencer. Premium pour aller plus loin.`
- 2 cartes côte à côte (empilées mobile) :
  - **Gauche — MARIABLE GRATUIT**, `0€ / pour toujours`, sous-titre `Pour démarrer sans engagement.`, 2 ✓ (outils / prestataires + blog), ligne limites (IA, stockage & exports plafonnés), CTA `Créer un compte gratuit`.
  - **Droite — MARIABLE PREMIUM** (fond vert sauge, badge blanc `RECOMMANDÉ`), prix `29€` avec `59€` barré, mention `à vie · un seul paiement · aucun abonnement · mises à jour incluses`, 3 ✓ (tout sans limite / bibliothèque de guides & ebooks incluse / support prioritaire), CTA blanc `Passer Premium — 29€`.
- Ligne de repère centrée sous les cartes : `vs un wedding planner à partir de 2 000€ — ≈ 70× moins cher.`

`FreemiumSection` retiré de cette page (reste utilisé sur `/` et autres).

### Section 6 — LES GUIDES / E-shop (déplacé après pricing, `EditorialEShop`)

- Suptitle : `E-SHOP`
- Titre : `Pas encore prêt·e à créer ton compte ? Commence par un guide.`
- Grille 3 colonnes :
  - Guide Ultime Jour-J — 4,90€ · Tout orchestrer de M-1 au Jour J.
  - Guide Ultime Débutants — 4,90€ · Organiser ton mariage à partir de zéro.
  - Do & Don't du Discours — 4,90€ · Structure et exemples pour un discours réussi.
- Lien bas : `VOIR TOUS LES GUIDES →` (vers `/ebooks`).
- Note discrète : `Déjà inclus dans Premium.`

---

## 2. Toggle FR/EN fonctionnel sur `/refontejuillet`

Utiliser l'infra i18n existante (`react-i18next`, namespaces déjà en place). Créer un namespace dédié **`refonteJuillet`** (fr + en) pour éviter d'impacter les autres pages.

Éléments à traduire :

- **Header éditorial** (`EditorialHeader`) : liens menu (Sélection, Espace, Guides, Espace pros, Contact), CTA `Créer un compte`, labels du menu mobile.
- **Hero** (`HeroEditorial`) : eyebrow, H1 `Célébrer l'amour`, paragraphe, CTA.
- **Coups de cœur** (`InstagramHighlightsGrid` context homepage) : eyebrow + titre passés en props traduites depuis la page.
- **Lieux sélectionnés** (`EditorialCarousels`) : eyebrow, titre, chevrons/aria, libellés catégories.
- **Ton espace Mariable** (nouvelle section) : suptitle, titre, sous-titre, 6 items grille, bande bonus, CTAs.
- **Pricing** (nouvelle section) : suptitle, titre, cartes complètes, ligne de repère.
- **E-shop** (`EditorialEShop`) : suptitle, titre, 3 cartes, lien "voir tous les guides".
- **Blog carrousel** (`BlogCarouselEditorial`) : eyebrow, titre, libellé `Découvrir`, fallback catégories. Les articles restent en FR (contenu DB non traduit) — noté dans la limite ci-dessous.
- **Témoignages** (`TestimonialsEditorial`) : eyebrow, titre, éventuels labels.
- **FAQ** (`V2FAQSection`) : réutilise clés `homeV2` si déjà traduites ; sinon ajoute les manquantes.
- **CTA final** (`FinalEditorialCTA`) : titre, sous-titre, CTA.
- **Footer** : déjà i18n dans `common` — vérifier couverture, compléter au besoin.

`LanguageToggle` déjà présent dans le header : rendre `changeLanguage` effectif partout via `useTranslation('refonteJuillet')` dans chaque composant concerné.

### Limite explicite

Les données dynamiques (articles de blog, fiches lieux/pros, Instagram) restent dans leur langue d'origine (FR). Seuls les libellés statiques UI de la page sont traduits. Documenté dans le composant pour éviter les faux bugs.

---

## Détails techniques

- Nouveaux fichiers :
  - `src/components/home/editorial/PricingEditorial.tsx`
  - `src/i18n/locales/fr/refonteJuillet.json`
  - `src/i18n/locales/en/refonteJuillet.json`
- Modifiés :
  - `src/pages/RefonteJuillet.tsx` (ordre + remplacement `FreemiumSection` → `PricingEditorial`)
  - `src/components/home/editorial/EspaceFusionSection.tsx` (contenu resserré selon le brief)
  - `src/components/home/editorial/EditorialEShop.tsx` (3 guides fixes + lien global)
  - `src/components/home/editorial/HeroEditorial.tsx`, `EditorialHeader.tsx`, `EditorialCarousels.tsx`, `BlogCarouselEditorial.tsx`, `TestimonialsEditorial.tsx`, `FinalEditorialCTA.tsx` (branchement `useTranslation`)
  - `src/i18n/index.ts` (enregistrement du namespace `refonteJuillet`)
- Aucune modif base de données, aucune modif d'auth, aucune modif hors page `/refontejuillet` (les composants partagés reçoivent des props traduites depuis la page pour ne pas casser la home actuelle).
- Responsive mobile : grilles `grid-cols-1 md:grid-cols-3` (services / e-shop), cartes pricing empilées < md, bande bonus pleine largeur.
