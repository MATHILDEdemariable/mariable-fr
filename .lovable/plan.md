## Objectif
Corriger `/refontejuillet` : fond sauge sur le carrousel des lieux, remplacer 2 sections par le contenu exact de la homepage (`/`), et harmoniser la palette (blanc / beige clair `#F8F5EF` / sauge uniquement).

## Modifications

### 1. Section carrousel "Lieux de réception sélectionnés" → fond sauge
Fichier : `src/components/home/editorial/EditorialCarousels.tsx`
- `<section>` wrapper : `bg-editorial-beige` → `bg-wedding-olive`
- Adapter les couleurs internes de `Carousel` : label, bordures, chevrons, titres cartes, "Découvrir", CTA "Voir toute la sélection" passent sur variantes claires (blanc / blanc 70-85%) au lieu de `editorial-noir`.
- Badge "Membres" : garder pastille beige clair pour contraste.

### 2. Remplacer les 2 sections "Outils de planification" + "Un investissement unique"
Fichier : `src/pages/RefonteJuillet.tsx`
- Supprimer `PremiumToolsCoordinationSection` et le `PricingHighlight` actuel (v2 avec "Un investissement unique").
- Importer et insérer à la place, dans l'ordre, les composants exacts utilisés sur `/` (`VersionJuin26`) :
  - `EspaceApercu` (Ton espace Mariable — "Un aperçu de ce qui t'attend")
  - `IncludedSection` (Ce qui est inclus — "Le service en détail" + bandeau Carnet d'adresses)
  - `FreemiumSection` (Comment ça marche — "Gratuit pour commencer. Premium pour aller plus loin.")
- Aucune modification du contenu de ces composants (reprise à l'identique de la homepage).

### 3. Ordre final des sections de `/refontejuillet`
1. `HeroEditorial` (vidéo)
2. `InstagramHighlightsGrid` — Coups de cœur (fond blanc)
3. `EditorialCarousels` — Lieux sélectionnés (**fond sauge**)
4. `EspaceApercu` (fond blanc)
5. `IncludedSection` (fond beige clair)
6. `FreemiumSection` (fond blanc)
7. `EditorialEShop` — Ebooks (fond beige clair)
8. `TestimonialsEditorial` (fond blanc)
9. `BlogSection` — Conseils & inspirations
10. `V2FAQSection` (fond beige clair)
11. `FinalEditorialCTA` (fond sauge)
12. `Footer`

### 4. Rythme chromatique cohérent
Vérifier chaque `<section>` sur la page pour respecter strictement l'alternance blanc ↔ `#F8F5EF` avec sauge en points d'accent (carrousel lieux + CTA final). Ajuster les fonds si `EspaceApercu`/`IncludedSection`/`FreemiumSection` cassent le rythme (override via wrapper `<div>` si nécessaire, sans toucher aux composants partagés avec la homepage).

## Notes techniques
- Aucune modif métier, uniquement présentation.
- Composants réutilisés tels quels, pas de duplication.
- SEO/schemas de `RefonteJuillet.tsx` conservés.
