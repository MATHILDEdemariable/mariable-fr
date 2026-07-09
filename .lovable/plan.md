## 1. Dézoom du mockup dashboard (page d'accueil, vue mobile)

**Problème:** `src/components/home/v2/EspaceApercu.tsx` — sur mobile la sidebar est masquée et les KPI/textes débordent (voir capture), on ne voit qu'une partie du dashboard mal cadrée.

**Solution simple (pas de refonte):** garder le mockup tel qu'il est rendu en desktop et le "dézoomer" via un scale CSS sur mobile, pour donner l'aperçu miniature complet.

- Wrapper le mockup navigateur (div ligne 55) dans un conteneur qui applique sur mobile:
  - `transform: scale(0.75)` avec `transform-origin: top left`
  - largeur forcée à `133%` pour compenser (afin qu'il occupe 100% après scale)
  - hauteur ajustée via `origin` + `margin-bottom` négatif pour compenser l'espace vide
- Retirer `hidden sm:block` sur la sidebar pour qu'elle apparaisse aussi en mobile (puisqu'on dézoome).
- Sur `md+`, désactiver le scale (`md:transform-none md:w-auto`).

Résultat: en mobile le mockup s'affiche comme une miniature complète et lisible (sidebar + KPI + cartes visibles), pas de débordement.

## 2. Cartes "Coup de cœur" plus petites — format carré 1:1 uniforme

**Fichier:** `src/components/marketplace/InstagramHighlightsGrid.tsx`

- Réduire la largeur des cartes: `min-w-[180px] max-w-[180px]` (au lieu de ~280px actuellement) sur mobile, `md:min-w-[220px] md:max-w-[220px]`.
- Forcer un **format carré strict** pour toutes les images: `aspect-square` sur le conteneur image (au lieu de `aspect-[4/5]`).
- `object-cover` + `object-center` déjà en place → les 4 images cropperont uniformément en 1:1.
- Titre en dessous en `text-xs` (ou `text-[11px]`), 2 lignes max via `line-clamp-2`.
- Conserver le défilement horizontal (`overflow-x-auto snap-x`) déjà en place; ajuster le `gap` à `gap-3 md:gap-4`.

**Note sur l'aperçu via URL Instagram:** Instagram ne permet pas de récupérer l'image d'un post via son URL publique sans passer par leur API oEmbed (nécessite un token Meta Business). On garde donc les images uploadées en asset Lovable (déjà en place), simplement recadrées uniformément en carré via CSS `aspect-square + object-cover`. C'est visuellement identique à un aperçu Instagram natif.

## Détails techniques

- `EspaceApercu.tsx` lignes 55, 82 : ajout wrapper scale + suppression du `hidden sm:block`.
- `InstagramHighlightsGrid.tsx` : classes des cartes (`min-w`, `aspect-square`, tailles typo).
- Aucune modification de logique métier, données, ou base Supabase.
- Aucun nouveau fichier.
