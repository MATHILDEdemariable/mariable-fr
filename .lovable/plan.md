# Corriger le CLS mobile (> 0,25 sur 71 pages)

Le CLS mesure les sauts de mise en page pendant le chargement. Sur mobile, quatre causes sont présentes dans le code actuel et expliquent un score élevé sur presque toutes les pages (donc des éléments globaux : polices, header, images, chargement des routes).

## 1. Polices web (cause globale, la plus probable)

Les polices Google sont chargées via `media="print" onload="this.media='all'"`. La page s'affiche d'abord en `system-ui` puis bascule sur Playfair/Inter : tous les titres changent de largeur et de hauteur → décalage sur 100 % des pages.

Correction :
- Charger la feuille de style Google Fonts normalement (`rel="stylesheet"`, sans bascule `print`), en conservant `preconnect` et `display=swap`.
- Ajouter dans le CSS critique inline un `@font-face` de secours avec `size-adjust` / `ascent-override` (fallback métrique aligné) pour que la substitution ne change plus les dimensions.

## 2. Images sans dimensions réservées

Plusieurs images n'ont ni `width`/`height` ni conteneur à ratio fixe : la capture dashboard (`EspaceFusionSection`), les visuels d'articles de blog, les logos du header, les images des pages secondaires. Tant que l'image n'est pas chargée, sa hauteur est nulle puis pousse le contenu.

Correction :
- Ajouter `width`/`height` (ou `aspect-ratio` via classe Tailwind) sur chaque `<img>` sans ratio parent.
- Sur le logo du header, fixer explicitement les dimensions.

## 3. Hero vidéo

Le hero utilise une vidéo plein écran sans `poster` ni dimensions. Sur mobile lent, le conteneur reste vide puis la vidéo s'affiche, et le fond change de couleur/hauteur.

Correction :
- Ajouter un `poster` (image compressée du 1er frame) et une couleur de fond, `preload="metadata"`, dimensions déclarées.

## 4. Chargement différé des routes et blocs asynchrones

Les routes sont en `lazy` avec un fallback vide ou de hauteur différente, et plusieurs sections (carrousels prestataires, blog) affichent d'abord un état vide puis les données Supabase.

Correction :
- Donner au fallback `Suspense` une hauteur minimale équivalente à la page.
- Donner aux carrousels/listes des squelettes de la même hauteur que les cartes finales (déjà partiellement le cas dans `EditorialCarousels`, à généraliser au blog et aux listes prestataires).

## Vérification

Après déploiement : relancer PageSpeed/Search Console sur la home, une page blog et `/professionnelsmariable`. Les données Search Console mettent ~28 jours à refléter la correction.

## Détails techniques

Fichiers concernés : `index.html` (fonts + fallback métrique), `src/components/home/editorial/HeroEditorial.tsx`, `EspaceFusionSection.tsx`, `BlogCarouselEditorial.tsx`, `EditorialFeatured.tsx`, `src/components/Header.tsx`, `src/components/home/BlogSection.tsx`, `src/App.tsx` (fallback Suspense).

Aucune modification de logique métier, uniquement présentation et chargement.
