## Correction fond beige `/kitmedia`

### Problème
`bg-editorial-beige/40` est bien appliqué sur `<main>` et `<Slide>`, mais le rendu visuel diffère de `/professionnelsmariable` car derrière le `<main>` le fond n'est pas blanc (body hérite du theme global), donc l'opacité 40 % laisse passer une autre teinte.

### Solution
Dans `src/pages/MediaKit.tsx`, remplacer les 2 occurrences `bg-editorial-beige/40` par la couleur résolue en dur — équivalent exact de `#E1DACA` à 40 % sur blanc :
- `<main>` (l.213) : `bg-editorial-beige/40` → `bg-[#F6F3EC]`
- `<Slide>` clair (l.62) : `bg-editorial-beige/40` → `bg-[#F6F3EC]`

Cela garantit le même rendu beige clair que `/professionnelsmariable` quel que soit le fond parent.

### Bonus demandé précédemment — chiffres et barres en noir (slide Audience)
Toujours à appliquer dans la même passe :
- Pourcentages `{r.v}%` (l.379) : `text-editorial-olive` → `text-editorial-noir`
- Barres de progression (l.383, l.399) : `bg-editorial-olive` → `bg-editorial-noir`
- Grand chiffre partenaires `+{c7}` (l.410) : `text-editorial-olive` → `text-editorial-noir`

Les bordures latérales sauge et les `GoldLabel` restent inchangées.

### Fichier modifié
- `src/pages/MediaKit.tsx`
