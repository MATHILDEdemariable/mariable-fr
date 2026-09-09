# Page d'accueil : visuel animé de l'appli + nouvel ordre des sections

## 1. Les 3 écrans de l'appli deviennent un visuel animé

Aujourd'hui le visuel « Votre mariage, votre organisation » est une seule image figée où les trois écrans (budget, plan de table, planning) sont collés ensemble : les deux écrans du fond restent peu lisibles.

À la place : un petit carrousel automatique qui fait défiler les trois écrans, un par un, en plein cadre.

- Défilement automatique toutes les 4 secondes, en fondu-glissé doux
- Trois puces cliquables sous l'image pour naviguer à la main
- Une étiquette discrète sur chaque écran : Budget / Plan de table / Planning Jour-J
- Pause de l'animation au survol ; sur mobile, glissement au doigt possible
- L'animation se coupe pour les personnes qui ont désactivé les animations sur leur appareil

Les trois écrans seront produits en images séparées à partir du montage actuel, dans le même style et les mêmes couleurs.

## 2. Le bloc vide sous les fonctionnalités

Le dernier élément de la liste (icône appareil photo sans texte) affichera :
« Et bien d'autres fonctionnalités à découvrir » — sans texte descriptif secondaire.

## 3. Nouvel ordre des sections de l'accueil

1. Hero
2. Lieux & prestataires recommandés
3. Coups de cœur (sélection)
4. Ton espace Mariable (l'appli)
5. Les guides (e-shop)
6. Témoignages
7. Conseils & inspirations (blog)
8. Le prix (gratuit / premium)
9. FAQ
10. CTA final
11. Footer

## Détails techniques

- `src/components/home/editorial/EspaceFusionSection.tsx` : remplacement de l'`<img>` unique par un carrousel léger (state + `setInterval`, transition CSS opacity/translate, `prefers-reduced-motion` respecté), ratio 16/10 conservé pour éviter tout décalage de mise en page (CLS).
- 3 nouveaux assets `dashboard-budget`, `dashboard-plan-de-table`, `dashboard-planning` créés via Lovable Assets ; l'asset composite actuel reste en fallback.
- Clé `espace.features.album` mise à jour dans `src/i18n/locales/fr/refonteJuillet.json` et `en/refonteJuillet.json`.
- `src/pages/RefonteJuillet.tsx` : réordonnancement des sections uniquement, aucun changement de contenu, de SEO ni de routage.
