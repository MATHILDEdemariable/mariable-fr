
# Plan d'optimisation `/refontejuillet` (validé)

## Nouvel ordre des sections

1. **Hero** (vidéo)
2. **Coups de cœur** (Instagram) — blanc
3. **Lieux sélectionnés** (carrousel) — vert sauge
4. **Ton espace Mariable — fusion 2-en-1** — blanc
   - Aperçu du dashboard (`EspaceApercu`) + « Le service en détail » (`IncludedSection`) réunis sous un même chapeau éditorial
   - CTA explicite : « Créer un compte gratuit » → `/register-gratuit` + lien « J'ai déjà un compte » → `/login`
   - Message clé : « Ton wedding planner de poche — crée ton compte pour tout organiser où que tu sois »
5. **E-books / E-shop** (`EditorialEShop`) — beige clair (réintégré)
6. **Gratuit / Premium** (`FreemiumSection`) — blanc (réintégré, fond de la section forcé en blanc)
   - Ajouter mention explicite dans la carte Premium : « Tous les guides & ebooks Mariable inclus »
   - Retirer / masquer la carte e-shop redondante en bas de `FreemiumSection` sur `/refontejuillet` (l'e-shop a déjà sa section 5)
7. **Conseils & inspirations** — vert sauge, format carrousel identique aux « Lieux sélectionnés »
   - Nouveau composant `BlogCarouselEditorial` : eyebrow gauche + flèches ‹ ›, cards scrollables snap-x, image large, catégorie olive uppercase, titre serif, extrait, lien « Découvrir »
   - Réutilise le pattern visuel de `EditorialCarousels` (textes blancs sur fond sauge)
8. **Témoignages** (`TestimonialsEditorial`) — blanc
9. **FAQ** (`V2FAQSection`) — blanc
10. **CTA final** (`FinalEditorialCTA`) — vert sauge
11. **Footer**

## Rythme chromatique
```
Hero → blanc → sauge → blanc → beige → blanc → sauge → blanc → blanc → sauge → footer
```
Alternance respectée, sauge comme accents forts (lieux, blog, CTA final).

## Modifications par fichier

### `src/pages/RefonteJuillet.tsx`
- Réintégrer `EditorialEShop` (après section 4) et `FreemiumSection` (après E-shop)
- Remplacer `<BlogSection />` par `<BlogCarouselEditorial />`
- Retirer `IncludedSection` en tant que section séparée (fusionnée dans `EspaceApercu`)
- Wrapper `FreemiumSection` avec override fond blanc si nécessaire

### `src/components/home/v2/EspaceApercu.tsx` (fusion 2-en-1)
- Conserver le mockup dashboard existant
- Injecter en dessous le contenu de `IncludedSection` (grille 6 fonctionnalités « Le service en détail »)
- Ajouter bloc CTA final : titre « Ton wedding planner de poche », sous-texte, bouton `Créer un compte gratuit` + lien secondaire connexion
- Une seule section blanche cohérente

### `src/components/home/v2/FreemiumSection.tsx`
- Ajouter dans la liste `premiumFeatures` (via i18n `fr/homeV2.json` + `en/homeV2.json`) : « Tous les guides & ebooks Mariable inclus »
- Masquer conditionnellement la carte e-shop du bas sur `/refontejuillet` (prop `hideEshopCard` ou détection route)
- Fond section : passer de `bg-editorial-cream` → `bg-white` (ou wrapper override) uniquement pour `/refontejuillet` pour ne pas casser la home

### `src/components/home/editorial/BlogCarouselEditorial.tsx` (nouveau)
- Clone visuel de `EditorialCarousels` (fond sauge, textes blancs, flèches, snap-x)
- Récupère les 6 derniers articles publiés depuis `blog_posts`
- Card : image (h-64 md:h-80), catégorie uppercase, titre serif, extrait 2 lignes, lien « Découvrir »
- CTA final : « Voir tous les articles → » vers `/blog`

## Mobile responsive (audit ciblé)
- Hero : titre `text-4xl md:text-6xl lg:text-7xl`, CTA pleine largeur mobile
- Carrousels (Lieux + Blog) : snap-x mandatory, ~85vw / card mobile, flèches masquées `<md`, swipe natif
- Espace Mariable fusionné : mockup `w-full object-contain`, grille service en détail 1 col mobile / 2 tablette / 3 desktop, CTA empilés
- FreemiumSection : cartes empilées mobile, badge « Recommandé » lisible, padding réduit
- FAQ : accordéons pleine largeur, texte min 16px
- Vérifier absence de `min-w` desktop cassant scroll mobile

## Notes
- Aucune modif business logic — uniquement présentation et réagencement
- Homepage `/` intacte (composants partagés protégés par props/wrapper)
- SEO conservé
