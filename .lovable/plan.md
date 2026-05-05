## Nouvelle page `/agence` — Slideshow professionnel

Création d'une page commerciale type **présentation slideshow** (à destination des pros de l'événementiel : lieux, traiteurs, etc.), reprenant le contenu de `/partenariat` avec le même design (Playfair, Sage Green, Editorial Beige/Noir, `rounded-none`).

### Fichier créé
- `src/pages/Agence.tsx`
- Route ajoutée dans `src/App.tsx` : `<Route path="/agence" element={<Agence />} />`

### Structure — 8 slides plein écran

Chaque slide = section `min-h-screen` avec navigation (flèches latérales + indicateurs en bas + clavier ←/→). Transitions framer-motion (fade + slide). Compteur "03 / 08" en haut à droite. Logo Mariable + bouton "Retour" en haut à gauche.

1. **Cover** — Visuel hero plein écran (image générée : mariage éditorial). Titre "L'agence de communication des professionnels du mariage", sous-titre, CTA "Découvrir".
2. **Le constat** — Pourquoi les pros du mariage ont besoin d'une agence spécialisée (3 chiffres-clés en gros).
3. **Notre approche** — Manifesto éditorial court + visuel.
4. **Service 1 — Stratégie & Création de contenu** (avec visuel : shooting iPhone 17 / reels).
5. **Service 2 — Community management & Meta Ads** (visuel : feed instagram mockup).
6. **Service 3 — Développement digital** (visuel : site web / guide digital).
7. **Bonus inclus** — Mise en avant éditoriale Mariable + audience +1000 futurs mariés.
8. **Contact / CTA final** — `mathilde@mariable.fr`, bouton devis, retour accueil.

### Design system
- Couleurs : `bg-white`, `bg-editorial-beige/30`, `bg-editorial-noir` (slides alternées pour rythme)
- Typo : `font-serif` (Playfair) pour titres XXL (`text-6xl md:text-8xl`), corps en sans
- Accents : `text-premium-sage`, `border-premium-sage`
- Aucun `rounded` (cohérence éditoriale)

### Visuels (3 images générées via imagegen, format 16:9)
- `src/assets/agence-hero.jpg` — scène mariage éditorial sage/beige
- `src/assets/agence-content.jpg` — création de contenu / shooting
- `src/assets/agence-digital.jpg` — site web / mockup digital

### Navigation slideshow
- État `currentSlide` (0–7)
- Boutons prev/next, raccourcis clavier, dots cliquables
- Animation `AnimatePresence` (fade + translateX)
- Mobile : swipe via `framer-motion` drag

### SEO
Helmet : title "Agence de communication mariage — Présentation | Mariable", canonical `/agence`, meta description orientée pro.

Aucune modification de `/partenariat` (qui reste la page SEO de référence). `/agence` = version commerciale "deck de présentation".
