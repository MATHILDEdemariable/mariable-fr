
# Refonte `/refontejuillet` — alignement DA & structure

## 1. Header éditorial (`EditorialHeader.tsx`)
- Remplacer le texte "mariable" en haut à gauche par le **logo `<Logo />`** (composant existant `cachet_M.webp`, h-12).
- Menu déroulant droite : remplacer l'entrée **"À propos"** par **"Espace professionnels"** (lien `/professionnels`).
- Conserver le toggle FR/EN et le CTA login.

## 2. Hero (`HeroEditorial.tsx`)
- Garder le grand titre serif mais **réintroduire un sous-titre descriptif** sous le titre (2 lignes max, style `text-lg md:text-xl text-editorial-noir/70`), calqué sur le pattern `PremiumHeroSection` de la homepage.
- Conserver le CTA principal existant.

## 3. Palette / DA
- Rebasculer la page sur **sage green (`wedding-olive` #7F9474) comme couleur principale** + **beige très clair** (celui utilisé sur `/professionnels-mariable`, ~`#F8F5EF`) pour les fonds de section.
- Retirer les fonds beige foncé actuels (`editorial-beige` saturé) au profit du beige clair uniforme.
- Accents (liens "DÉCOUVRIR →", underlines, CTAs) en `wedding-olive`.

## 4. Sélection éditoriale
- **Supprimer** `EditorialFeatured` ("L'adresse de la semaine" + "Zoom sur").
- **Remplacer par la section "Coups de cœur"** telle qu'affichée sur `/professionnels-mariable` (réutiliser le composant existant `LieuxPartenairesSection` ou équivalent — à identifier lors du build).

## 5. Carrousels
- **Supprimer** les sections "Par envie", "Par région", etc. dans `EditorialCarousels.tsx`.
- **Garder un seul carrousel horizontal** (le plus pertinent — sélection de lieux/prestataires).

## 6. Section outils
- **Remplacer** `PremiumToolsCoordinationSection` par la section **"Ton espace Mariable — le service en détail"** de la homepage (composant existant `PremiumToolsSection` + visuels associés).

## 7. Section E-shop (remplace "Conseils & inspirations")
- Nouvelle section **"E-SHOP"** présentant les **e-books & guides digitaux**.
- Layout 3 colonnes éditorial (lignes hairline, serif titres) reprenant le style visuel de la capture actuelle, mais avec contenu = e-books (source : `src/data/guides.ts` ou table `ebooks`).
- Chaque carte : catégorie / titre / description courte / lien "DÉCOUVRIR →" vers `/ebooks` ou fiche produit.

## 8. Section Prix
- Ajouter la section **"Gratuit pour commencer. Premium pour aller plus loin."** telle qu'affichée sur la homepage (composant existant à repérer, probablement dans `PremiumFinalCTASection` ou dédié).

## 9. FAQ
- Ajouter la **FAQ de la homepage** (`FAQSection` de `Mariable.tsx`) juste avant le CTA final.

## 10. Refonte `/about/histoire`
- Aligner sur la charte actuelle (Playfair, sage green, beige clair, `rounded-none`).
- Contenus conservés :
  - **Mission** : "Célébrer l'amour — simplement."
  - **Vision** : "Transformer l'organisation des mariages en une expérience simple et agréable."
- **Supprimer** la section "Notre approche".
- **Supprimer** le footer sur cette page.
- Rendre la mise en page plus dynamique : hero avec photo Mathilde, alternance texte/image, animations `framer-motion` légères, citations en pull-quote serif.
- Conserver `<SEO />` et la structure sémantique (h1 unique, h2/h3).

## 11. SEO / GEO
- Conserver `<SEO />` sur `/refontejuillet` (title, description, canonical, keywords) — la page étant destinée à remplacer la home.
- Garder les schémas JSON-LD `WebSite` + `ItemList` de la homepage actuelle (à porter depuis `Index.tsx`).
- H1 unique dans le hero, hiérarchie h2/h3 propre par section.

## Détails techniques

Fichiers modifiés :
- `src/components/home/editorial/EditorialHeader.tsx` (logo + menu)
- `src/components/home/editorial/HeroEditorial.tsx` (sous-titre)
- `src/components/home/editorial/EditorialCarousels.tsx` (réduire à 1 carrousel)
- `src/pages/RefonteJuillet.tsx` (remplacer sections, palette, ajouter FAQ/Prix/E-shop)
- `src/pages/about/Histoire.tsx` (refonte + suppression footer)
- `src/index.css` uniquement si un token beige-clair manque

Fichiers créés :
- `src/components/home/editorial/EshopSection.tsx` (nouvelle section e-books)

Aucun changement de logique métier — uniquement présentation & structure.

## Points à confirmer avant build
1. Pour "Coups de cœur", tu confirmes que je réutilise **exactement** le composant `LieuxPartenairesSection` de `/professionnels-mariable` (ou tu veux une version adaptée éditoriale) ?
2. Pour la section E-shop, la source des e-books doit être **statique** (contenus curés) ou **dynamique** (fetch table Supabase `ebooks`) ?
3. Pour `/about/histoire`, tu as une nouvelle photo à intégrer ou on garde `mathilde-portrait-v2.jpg` ?
