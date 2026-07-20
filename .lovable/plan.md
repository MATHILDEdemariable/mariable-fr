## Refonte `/refontejuillet` — alignement D.A. & structure

### 1. Header transparent (image 1)
`EditorialHeader.tsx` :
- Rendre le header transparent au-dessus du hero (position absolute sur la page, pas sticky beige).
- Variante : `bg-transparent` initial, texte/logo en blanc au-dessus du hero ; puis fond blanc/beige clair + texte noir après scroll (via IntersectionObserver ou scroll listener simple).
- Logo Mariable conservé à gauche, liens (E-BOOKS / MON COMPTE / JE SUIS UN PROFESSIONNEL / FR|EN) à droite.

### 2. Palette
- Fonds sections : blanc `#FFFFFF` ou ivoire très clair `#F8F5EF` (comme `/professionnelsmariable`).
- Couleur principale : `wedding-olive` (vert sauge) pour CTA, eyebrows, accents, séparateurs actifs.
- Retirer `bg-editorial-beige` (trop foncé) sur les sections.

### 3. Nouvel ordre des sections
```
1. Hero (vidéo + sous-titre existants)
2. Coups de cœur (InstagramHighlightsGrid — déjà là)
3. Carrousel lieux sélectionnés (EditorialCarousels — 1 seul rang, déjà réduit)
4. Espace Mariable (PremiumToolsCoordinationSection — image 2 & 3)
5. Prix (PricingHighlight — reprendre exact contenu homepage image 4)
6. E-books (EditorialEShop)
7. Témoignages (TestimonialsEditorial)
8. Conseils & inspirations (BlogSection)
9. FAQ (V2FAQSection)
10. CTA final « Votre histoire mérite d'être bien célébrée. » — design image 5 (fond sauge, serif blanc + italique, CTA blanc "Créer un compte gratuit")
11. Footer (Footer.tsx de la homepage)
```
Section supprimée/remplacée : l'ancien bloc "Outils de planification" → remplacé par `PremiumToolsCoordinationSection` (déjà importé, on garde).

### 4. CTA final (image 5)
Réécrire `FinalEditorialCTA.tsx` :
- Fond `bg-wedding-olive`, hauteur large (py-24 md:py-32).
- H2 serif blanc : « Prêt·e à organiser *votre mariage* ? » — remplacer par « Votre histoire mérite *d'être bien célébrée.* »
- Sous-titre blanc/85 : « Rejoignez les milliers de couples qui font confiance à Mariable. »
- CTA blanc rectangle → `Créer un compte gratuit →` vers `/register-gratuit`.

### 5. Footer
- Ajouter `<Footer />` (composant `src/components/Footer.tsx` de la homepage) en bas de `RefonteJuillet.tsx`.

### 6. Menu déroulant — page Contact enrichie
`EditorialHeader.tsx` : le lien CONTACT pointe déjà vers `/contact`. Refonte de `src/pages/Contact.tsx` (ou création d'un nouveau layout) pour combiner :
- **Bloc 1 — Histoire** : reprise du contenu de `/about/histoire` (portrait Mathilde, mission, vision, chiffres-clés, soutiens) en version condensée, CSS blanc + beige clair + accents vert sauge.
- **Bloc 2 — Formulaire de contact** : réutiliser `ContactForm.tsx` existant, dans un section blanche/ivoire.
- Header éditorial + footer homepage identiques.

Note : `/about/histoire` reste accessible pour SEO, mais le menu principal envoie vers `/contact` unifié.

### 7. SEO préservé
Conservation du composant `<SEO>` avec title/description/canonical/keywords actuels sur `/refontejuillet` et mise à jour cohérente sur `/contact`.

---

### Détails techniques

**Fichiers modifiés :**
- `src/components/home/editorial/EditorialHeader.tsx` — header transparent + scroll state
- `src/components/home/editorial/FinalEditorialCTA.tsx` — refonte design image 5
- `src/pages/RefonteJuillet.tsx` — réordonnancement sections, ajout Footer, changement fonds
- `src/pages/Contact.tsx` — ajout bloc histoire au-dessus du formulaire
- Sections diverses (`ManifestoBand`, `EditorialEShop`, `TestimonialsEditorial`, `V2FAQSection`, `PricingHighlight`) — passage `bg-editorial-beige` → `bg-white` ou `bg-[#F8F5EF]` selon alternance.

**Non-changements :**
- Ne pas toucher `PremiumToolsCoordinationSection`, `PricingHighlight`, `V2FAQSection`, `BlogSection` : contenu réutilisé tel quel.
- Ne pas toucher aux routes existantes hors `/contact`.
- `/about/histoire` conservée intacte (route SEO).