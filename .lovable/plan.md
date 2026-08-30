# Afficher la durée des étapes dans le planning partagé

## Constat
Dans l'éditeur (`/mon-jour-m/planning`), chaque étape affiche « Durée: X minutes » à partir du champ `duration`.
La page publique `/planning-public/:token` (`src/pages/PlanningPublic.tsx`) récupère bien toutes les colonnes (`select('*')`, la colonne `duration` existe en base) mais n'affiche que `start_time` et, s'il est renseigné, `end_time`. Comme `end_time` est souvent vide, aucune information de durée n'apparaît.

## Correction
Dans `src/pages/PlanningPublic.tsx`, pour chaque tâche :
- afficher la durée à côté de l'heure, en mobile et en desktop, sous la forme `09:00 · 60 min` (ou `09:00 - 10:00` si `end_time` est renseigné, puis `60 min`) ;
- n'afficher le bloc durée que si `duration > 0` ;
- même style discret que les infos secondaires (petit texte, teinte vert sauge atténuée), sans changer la structure des cartes.

Ajout des libellés dans les fichiers de traduction FR/EN utilisés par cette page (namespace du planning public) pour « min ».

## Portée
Aucun changement de données ni de logique métier — uniquement l'affichage de la page de consultation partagée.
