## Modifications `/kitmedia` (`src/pages/MediaKit.tsx`)

### 1. Fond beige unifié
Remplacer `bg-editorial-cream` (#f5f4ef) par `bg-editorial-beige/40` (le beige #E1DACA à 40% utilisé en première section de `/professionnelsmariable`) sur :
- Le wrapper global de la page (ligne 213)
- Le composant `Slide` clair (ligne 62)
- Tous les badges/pastilles internes qui utilisent encore `bg-editorial-cream` (ex. ligne 474)

### 2. Textes en noir, vert sauge réservé aux accents
Règle : **aucun texte courant en `text-editorial-olive`**. Le vert sauge reste autorisé uniquement pour :
- Les numéros / labels de slide (`GoldLabel` "01 — INTRO", etc.)
- Les icônes (Newspaper, Wrench, etc.)
- Les grands chiffres stats (valeur numérique uniquement)
- Les filets/barres décoratives (`border-l-2 border-editorial-olive`, barres de progression)

À repasser en noir (`text-editorial-noir` ou `text-editorial-noir/80`) :
- Citation "Être Mariable : être en état de se marier." (l.321)
- Paragraphe italique vide servant de séparateur (l.311) — sans effet visible mais conservé en noir par cohérence
- Titres de cartes "Le Média / La Plateforme" déjà noirs — vérifier les `<h3>` voisins
- Pourcentages dans la slide Audience (l.379) → noir
- Chiffre `4.7M`/valeurs `Stat` secondaires en texte → noir, sauf le grand nombre principal
- Numéros `c.n` des cartes Offre Pros (l.473) → noir
- Hover des CTA (l.628-631) : retirer le passage en vert au survol, garder noir
- Mot "ensemble." (l.501) → noir
- Citation italique du hero (l.243) si elle est olive-light → la garder claire car sur fond noir (OK, reste lisible)
- Lien retour (l.281) → noir avec soulignement au hover

### 3. Cartes & bordures
- Conserver `bg-white` pour les cartes (slides 3, 4, 5).
- Garder les filets sauge `border-l-2 border-editorial-olive` (accent décoratif autorisé).
- Cartes Offre Pros : bordure sauge conservée comme accent, badge passe sur fond `bg-editorial-beige/40` avec texte noir.

### Fichier modifié
- `src/pages/MediaKit.tsx` uniquement.
