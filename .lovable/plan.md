

# Refonte visuelle de /ceremonie-laique — Style premium Homepage

## Probleme

La page actuelle est en `bg-white` avec des Cards generiques noir/blanc. Elle ne reprend pas la charte premium du site (fond beige `bg-premium-base`, accents sage green `#63745a`, typographie Playfair Display, badges, sections alternees).

## Modifications — fichier unique : `src/pages/CeremoniePublic.tsx`

### 1. Hero section premium
- Fond sage green (`bg-[#63745a]`) pleine largeur avec texte blanc, comme les heros de la homepage
- Badge "Guide complet" style premium (petit badge au-dessus du H1)
- Sous-titre en blanc/80

### 2. Fond general
- Remplacer `bg-white` par `bg-premium-base` (beige chaud du site)

### 3. Sections alternees
- Alterner entre `bg-premium-base` et `bg-premium-warm` (beige plus chaud) pour chaque bloc, comme la homepage
- Chaque section en pleine largeur (`section className="py-16 bg-..."`) au lieu de Cards empilees dans un container unique

### 4. Suppression des Cards generiques
- Remplacer les `<Card>` par des `<section>` pleine largeur avec container interieur
- Titres de section en `font-serif text-2xl text-premium-black` avec icone sage green
- Badges sage green pour les labels de section (comme `PremiumProcessSection`)

### 5. Couleurs et accents
- Numeros d'etapes : fond `bg-[#63745a]` (sage green) au lieu de `bg-primary` generique
- Liens et accents en `text-premium-sage` / `text-[#63745a]`
- Fond des items : `bg-white` avec legere ombre au lieu de `bg-muted/30`
- Conseils rituels : fond `bg-premium-sage-very-light` au lieu de `bg-amber-50`

### 6. CTA final
- Section pleine largeur fond sage green avec bouton blanc (texte noir), comme `PremiumFinalCTASection`

### 7. Table musique
- Restyle avec fond blanc, header sage green, lignes alternees beige

## Resultat attendu

Page visuellement coherente avec la homepage : fond beige, sections alternees, accents sage green, typographie serif pour les titres, badges premium. Plus de look "documentation noir et blanc".

