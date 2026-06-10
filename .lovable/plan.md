## Modifications du Kit Média (`/kitmedia`)

### 1. Fond beige unifié + cartes blanches
Adopter le beige de `professionnelsmariable` (≈ `#f5f4ef` — déjà défini comme `editorial-cream`) pour le fond global des slides clairs, et passer toutes les cartes/blocs en fond blanc avec quelques touches discrètes de vert sauge (`editorial-olive`).

Dans `src/pages/MediaKit.tsx` :
- Conserver `bg-editorial-cream` pour les slides clairs (déjà beige `#f5f4ef`).
- Slide 3 (Ce qu'est Mariable) : ajouter `bg-white` + bordure fine `border-editorial-olive/15` aux cartes du `grid md:grid-cols-2`.
- Slide 5 (Offre Pros) : les `<article>` cartes — remplacer le fond actuel par `bg-white` (déjà le cas) en renforçant la bordure sauge `border-editorial-olive/20` au hover, badge en `bg-editorial-cream` (au lieu de beige plus foncé).
- Slide 4 (Chiffres clés) : encadrer les `Stat` dans des blocs `bg-white p-8` pour ressortir sur le beige.
- Touches sauge ponctuelles uniquement (labels, accents, séparateurs) — déjà via `editorial-olive`.

### 2. Slide Fondatrice
- Réduire la taille du H2 "Mathilde" de `text-5xl md:text-7xl` → `text-4xl md:text-5xl`.
- Ajouter un padding-top sur la colonne photo (`md:pt-12` ou `md:mt-12`) pour la descendre et l'aligner visuellement avec le bloc de texte.
- Augmenter le gap entre colonnes : `md:gap-16` au lieu de `md:gap-12`.

### 3. Slide 5 — Titre visible
Le H2 "Ce que je propose aux pros." est masqué car la slide a une hauteur fixe `md:h-screen` et la grille 2×2 prend toute la place. Solutions :
- Réduire le padding vertical de la slide (`py-12` au lieu de `py-16`) **et** le `mb-10` du paragraphe sous-titre à `mb-6`.
- Réduire la taille du titre à `text-3xl md:text-4xl`.
- Réduire `gap-6` → `gap-4` sur la grille de cartes et `p-6 md:p-7` → `p-5` à l'intérieur des articles.

Cela libère l'espace en haut pour que le H2 reste visible sans scroll.

### Fichier modifié
- `src/pages/MediaKit.tsx` (uniquement)
