# Ajout d'étapes bloqué dans Mon Jour-M

## Cause confirmée

Le message d'erreur est explicite : `duplicate key value violates unique constraint "idx_coordination_planning_unique_title_coordination"`.

Vérifié en base : il existe un index unique sur `coordination_planning (title, coordination_id)` limité aux étapes de catégorie `jour-m`. Autrement dit, **deux étapes du même planning ne peuvent pas porter le même titre**, même à des heures ou des jours différents.

Vérifié aussi : le planning concerné contient déjà une étape nommée « Arrivée traiteur ». L'ajout est donc refusé par la base — ce n'est ni un bug de RLS ni un problème de permissions.

Cet index avait été créé pour éviter les doublons lors des générations IA en lot, mais il empêche un usage légitime : avoir « Arrivée traiteur » la veille et le jour J, ou deux « Pause photos » à deux moments.

## Correction proposée

1. Migration : remplacer l'index unique actuel par un index unique plus fin sur `(coordination_id, title, event_day, start_time)` pour les étapes `jour-m`. Les vrais doublons (même titre, même jour, même heure) restent bloqués ; les titres répétés à des horaires différents redeviennent possibles.
2. Côté interface (`UnifiedTaskModal.tsx`) : si la base renvoie tout de même un doublon (code `23505`), afficher un message clair en français — « Une étape avec ce titre existe déjà à cette heure » — au lieu du message technique Postgres.
3. Vérification : refaire un ajout réel d'étape avec un titre déjà utilisé à une autre heure, et confirmer que la ligne est bien enregistrée.

## Détail technique

- Suppression de `idx_coordination_planning_unique_title_coordination`, création de `idx_coordination_planning_unique_slot` : `UNIQUE (coordination_id, title, event_day, start_time) WHERE category = 'jour-m'`.
- Les insertions en lot (suggestions, IA) conservent leur protection anti-doublons puisqu'elles insèrent au même horaire par défaut.
