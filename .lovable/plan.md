# Message d'erreur en français lors de l'ajout d'une étape (Mon Jour-M)

## Cause confirmée

L'erreur vient d'un index unique en base sur `coordination_planning (title, coordination_id)` pour les étapes `jour-m` : deux étapes du même planning ne peuvent pas porter le même titre. Le planning concerné contient déjà une étape « Arrivée traiteur ».

Décision : on garde la règle telle quelle (aucune migration). On corrige uniquement le message affiché.

## Correction

Dans `src/components/mon-jour-m/UnifiedTaskModal.tsx` :

1. Ajout manuel : si Postgres renvoie le code `23505` (doublon), afficher un toast clair en français, par exemple « Une étape porte déjà ce titre dans votre planning. Modifiez le titre pour l'ajouter. » au lieu du message technique anglais.
2. Les autres erreurs affichent un message générique en français, sans détail technique brut.
3. Même traitement pour l'ajout par suggestions (le code `23505` y est déjà ignoré silencieusement — on garde ce comportement).

Aucun changement de base de données, aucune autre modification fonctionnelle.
