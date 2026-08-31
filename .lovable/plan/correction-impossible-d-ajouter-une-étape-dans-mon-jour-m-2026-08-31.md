# Correction : impossible d'ajouter une étape dans Mon Jour-M

## Cause identifiée (vérifiée)

Une requête sur les permissions de la base montre que la table `coordination_planning` n'a **aucun GRANT** : aucune ligne dans `information_schema.role_table_grants` pour cette table. Les rôles `authenticated`, `anon` et `service_role` n'ont donc plus le droit d'écrire (ni de lire) via l'API.

Résultat : à l'insertion d'une étape, PostgREST renvoie une erreur « permission denied for table coordination_planning », que l'interface affiche en « Impossible d'ajouter l'étape ».

Les politiques RLS, elles, sont correctes (elles autorisent bien le propriétaire de la coordination) — ce n'est pas un problème de RLS mais de privilèges de table.

## Correction

1. Migration pour rétablir les privilèges sur `coordination_planning` :
   - lecture/écriture pour les utilisateurs connectés,
   - lecture pour les visiteurs non connectés (nécessaire au planning partagé en lecture seule via lien),
   - accès complet pour le rôle serveur (edge functions).
2. Vérifier dans la même migration les autres tables du module Jour-M utilisées par la page (coordination, équipe, documents, pense-bête, tokens de partage) et rétablir les privilèges manquants uniquement là où ils ont disparu, pour éviter que le même symptôme ressurgisse ailleurs.
3. Vérification après migration : relire les privilèges de ces tables, puis tester réellement un ajout d'étape sur un compte connecté et confirmer que la ligne est bien enregistrée.

Aucun changement de code applicatif n'est nécessaire : le formulaire d'ajout fonctionne, seul l'accès base est bloqué.
