## Modifications du Kit Média (/kitmedia)

### 1. Nouvelle photo Mathilde
- Uploader `user-uploads://photomathilde.jpeg` via `lovable-assets` vers `src/assets/mathilde-portrait-v2.jpg.asset.json`.
- Remplacer l'import existant `mathildePortrait` par la nouvelle photo.
- Supprimer l'ancien asset `mathilde-portrait.png.asset.json`.

### 2. Slide 2 — Fondatrice (layout photo gauche / texte droite)
- Conserver la grille `md:grid-cols-[auto_1fr]` (photo gauche, texte droite déjà en place).
- Agrandir la photo carrée : `w-56 h-56 md:w-72 md:h-72`, garder cadre blanc + ombre.
- Réduire la taille du bloc « L'idée : transformer l'organisation… » :
  - Passer de `font-serif italic text-xl md:text-2xl` à `text-sm md:text-base not-italic font-sans` (texte courant, plus discret).
  - Garder la bordure gauche olive.

### 3. Slide 3 — Mariable : ajouter le label numéroté
- Le `GoldLabel` existe déjà (`03 — Mariable`) — le remplacer par : `03 — Ce qu'est Mariable` 
- Mettre à jour le titre h2 : « La référence moderne dans l'univers du mariage. » (remplace l'actuel « Le média mariage moderne, pour toutes les personnes mariables. »)
- Conserver le reste (sous-titre, cartes).

### 4. Thème clair uniforme (fond beige, texte noir)
- Slide 4 (`audience`) : retirer `dark` → `<Slide id="audience">` (sans prop dark).
- Slide 6 (`contact`) : retirer `dark` → `<Slide id="contact">`.
- Slide 1 (hero) : conserver `dark` (vidéo de fond → garde l'overlay noir). Confirmer plus bas si l'utilisateur veut aussi changer le hero.
- Adapter les couleurs internes des slides 4 et 6 :
  - `GoldLabel dark` → `GoldLabel` (olive foncé sur beige).
  - `text-editorial-cream` → `text-editorial-noir`.
  - `text-editorial-cream/85` → `text-editorial-noir/80`.
  - `text-editorial-olive-light` → `text-editorial-olive`.
  - Barres âge : fond `bg-editorial-noir/10`, remplissage `bg-editorial-olive`.
  - Barre genre : `bg-editorial-olive` + `bg-editorial-noir/15`.
  - Cartes contact : bordures `border-editorial-noir/15`, hover olive.

### 5. Slide 4 — Chiffres clés
- Supprimer la `Stat` « Utilisateurs plateforme » (c6).
- Grille passe à `grid-cols-1 md:grid-cols-3` avec 3 stats (Abonnés, Vues, Femmes).
- Réduire la taille du titre h2 : `text-3xl md:text-4xl` (au lieu de `text-4xl md:text-5xl`) + `mb-8` pour libérer de l'espace vertical.
- Réduire la taille des chiffres dans `Stat` : `text-3xl md:text-5xl` (au lieu de `text-4xl md:text-6xl`).
- Réduire l'espacement vertical du contenu (mb-12 → mb-8, gap-y-12 → gap-y-8) pour que le titre soit visible.

### 6. Homogénéisation typographique
- Titres slides : tous en `font-serif text-4xl md:text-5xl` (slides 2, 3, 4, 5 alignées ; slide 6 reste plus grande comme finale, slide 1 reste hero).
- Labels numérotés : tous via `GoldLabel` (déjà cohérent).
- Texte courant : `text-base leading-relaxed text-editorial-noir/80`.
- Aucun changement de routing, SEO, ou logique de slider.

### Fichiers touchés
- `src/pages/MediaKit.tsx` (édits ciblés).
- `src/assets/mathilde-portrait-v2.jpg.asset.json` (création).
- `src/assets/mathilde-portrait.png.asset.json` (suppression).
