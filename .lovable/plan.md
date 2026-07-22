# Plan

## 1. `/refontejuillet` — cohérence typo & fond beige clair

Référence visuelle (image 1) = section "La sélection exclusive Mariable" :
- **Eyebrow** : `text-xs tracking-[0.3em] uppercase text-editorial-noir/60` mb-3
- **Titre H2** : `font-serif text-4xl md:text-5xl text-editorial-noir leading-tight`
- **Sous-titre** : `italic text-editorial-noir/60` (optionnel)
- Header bloc centré, `max-w-3xl mx-auto text-center mb-10 md:mb-14`

Appliquer ce header type à toutes les sections de la page pour uniformiser :
- `EspaceFusionSection` (eyebrow + titre + sous-titre)
- `PricingEditorial` (eyebrow + titre)
- `EditorialEShop` (déjà conforme, garder)
- `BlogCarouselEditorial` (eyebrow + titre)
- `TestimonialsEditorial` (eyebrow + titre)
- `V2FAQSection` (wrapper : ajouter eyebrow + réharmoniser titre en `font-serif text-4xl md:text-5xl`)
- `FinalEditorialCTA` (garder inversé blanc sur vert sauge, mêmes tailles)

Remplacer les fonds `bg-white` par `bg-[#F8F5EF]` (beige clair) sur :
- Section Coups de cœur (`InstagramHighlightsGrid` wrapper dans `RefonteJuillet.tsx`)
- `EspaceFusionSection`
- `PricingEditorial`
- `TestimonialsEditorial`
- `V2FAQSection` (wrapper)
- Page root `bg-white` → `bg-[#F8F5EF]`

Conserver en **vert sauge** (`bg-wedding-olive`) : `EditorialCarousels`, `BlogCarouselEditorial`, `FinalEditorialCTA`, bande bonus dans `EspaceFusionSection`.

Rythme chromatique final : Hero (vidéo) → Beige → Sauge → Beige → Beige → Beige (E-shop) → Sauge → Beige → Beige → Sauge → Footer.

## 2. E-shop — liens "Découvrir"

Dans `src/components/home/editorial/EditorialEShop.tsx` :
- Remplacer `to={`/guides/${item.slug}`}` par `to="/guides"` sur chaque carte.
- Le lien "Voir toute la collection" en bas reste `/guides`.

## 3. `/guides` — bloc "Tout débloquer" en vert sauge

Dans `src/pages/GuidesShop.tsx` (lignes ~312-334), redesigner le bloc conversion Premium :
- Fond : `bg-wedding-olive` (au lieu de `bg-editorial-noir`)
- Texte principal : blanc
- Eyebrow "PLUS RENTABLE" : `text-white/70`
- Corps : `text-white/85`
- CTA bouton : fond blanc, texte vert sauge (`bg-white text-wedding-olive hover:bg-white/90`) pour un contraste fort et cohérent avec les autres CTA inversés du site (ex: `FinalEditorialCTA`)
- Padding et typographie inchangés
- Ajouter une fine bordure blanche/10 optionnelle pour renforcer la carte

## Fichiers modifiés

- `src/pages/RefonteJuillet.tsx` (fonds)
- `src/components/home/editorial/EditorialEShop.tsx` (liens)
- `src/components/home/editorial/EspaceFusionSection.tsx` (fond + typo header)
- `src/components/home/editorial/PricingEditorial.tsx` (fond + typo header)
- `src/components/home/editorial/BlogCarouselEditorial.tsx` (typo header)
- `src/components/home/editorial/TestimonialsEditorial.tsx` (fond + typo header)
- Wrapper autour de `V2FAQSection` dans `RefonteJuillet.tsx` (fond beige + ajout eyebrow/titre uniforme si nécessaire, sinon override via className parent)
- `src/pages/GuidesShop.tsx` (bloc Premium 312-334)

Aucun changement sur le contenu textuel ni les traductions FR/EN.
