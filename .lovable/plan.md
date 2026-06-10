## Problèmes identifiés sur `/media-kit`

1. **Vidéo en `position: fixed`** sur le hero → elle reste visible derrière TOUTES les slides (au lieu d'être uniquement sur la slide 1). Sur mobile elle "fuit" aussi sur les autres sections.
2. **Slides non fonctionnelles** :
   - Le container parent cumule `snap-y snap-mandatory` (mobile) ET `md:flex md:overflow-hidden` avec `translateX`. Le `snap-y` reste actif en desktop et entre en conflit.
   - Chaque `<Slide>` a `min-h-screen` ET `md:h-screen` → en desktop, le contenu peut déborder en hauteur sans scroll réel.
   - Sur mobile, `md:w-screen md:flex-shrink-0` est ignoré, mais l'absence de `w-full` explicite + le flex parent (sans `md:` flex en mobile) marche par défaut. À sécuriser.
3. **Pas de bouton plein écran** : l'utilisateur s'attend à un mode présentation type Keynote (Fullscreen API).

## Corrections proposées

### 1. Vidéo hero confinée à la slide 1
- Retirer `position: fixed` et le style inline.
- Mettre la vidéo en `absolute inset-0` **à l'intérieur** de la slide hero uniquement, avec un wrapper `relative overflow-hidden` qui couvre toute la slide (incluant l'overlay sombre).
- Le contenu textuel passe en `relative z-10`.

### 2. Slides fonctionnelles
- Retirer `snap-y snap-mandatory` du container quand on est en desktop (le garder uniquement via `md:snap-none` + classes mobile dédiées).
- Restructurer : container mobile = `flex flex-col` avec `snap-y` ; desktop = `md:flex-row md:overflow-hidden md:h-screen md:w-screen` avec transform.
- Chaque slide : largeur `w-full md:w-screen`, hauteur `min-h-screen md:h-screen`, `overflow-y-auto` en desktop pour le contenu long (slide 5 surtout).
- Garder les flèches ←/→ clavier + dots + boutons prev/next existants.

### 3. Mode plein écran (présentation)
- Ajouter un bouton "Présenter" (icône `Maximize`) dans la barre de contrôle desktop.
- Au clic : `document.documentElement.requestFullscreen()`.
- Écouter `fullscreenchange` pour nettoyer l'état.
- En plein écran : masquer la barre de contrôle après 3s d'inactivité (réapparaît au mouvement souris), masquer le curseur, fond noir.
- `Escape` quitte (géré nativement par le navigateur) ; `F` (ou bouton) bascule.
- Sur mobile, le bouton plein écran reste disponible mais le mode reste en scroll vertical.

### 4. Détails techniques
- Conserver toute la logique existante (compteurs animés, IntersectionObserver, contenu des 6 slides).
- Aucun changement sur le routing ni le SEO.
- Un seul fichier modifié : `src/pages/MediaKit.tsx`.

## Résultat attendu
- Slide 1 : vidéo en fond, uniquement sur cette slide.
- Desktop : navigation horizontale fluide avec flèches/clavier/dots, bouton "Présenter" qui passe en vrai plein écran.
- Mobile : scroll vertical snap entre slides, vidéo confinée au hero.