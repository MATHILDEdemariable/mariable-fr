# Filtre par jour dans la vue partagée du planning

## Problème
Le filtre multi-jours (`event_day`: J-1, Jour J, J+1, jours custom) existe dans la vue d'édition `MonJourMPlanningContent`, mais les vues **consultatives/partagées** (`/planning/public/...`) affichent toutes les tâches à la suite, sans distinction de jour. Sur la capture, on voit Petit déjeuner / Matin Quartier Libre / Déjeuner / Préparatifs / Arrivée invités mélangés alors qu'ils appartiennent à des jours différents.

## Solution (la plus simple)
Ajouter un **sélecteur de jour** à côté du filtre "membre d'équipe" déjà présent, et filtrer les tâches affichées selon le jour choisi. Pas de changement de logique d'affichage, pas de nouvelle table.

## Fichiers modifiés

### 1. `src/pages/PlanningPublic.tsx`
- Ajouter un state `selectedDay` (default = `'Jour J'`).
- Calculer `availableDays` = jours uniques présents dans `coordinationData.tasks` (en lisant `task.event_day || 'Jour J'`), triés avec ordre logique (J-1, Jour J, J+1, autres alphabétique).
- Si une seule valeur de jour existe → ne pas afficher le sélecteur (rétrocompatibilité).
- Sinon : afficher un `<Select>` (ou groupe de boutons type tabs) à côté du filtre membre, options = `availableDays`.
- Mettre à jour `filteredTasks` pour appliquer **les deux filtres** : jour ET membre.
- Mettre à jour le compteur `Planning (N)` pour refléter le nombre du jour sélectionné.
- Mettre à jour l'export PDF (`tasks` envoyés à `coordinationExportService`) pour exporter selon le jour actif ou ajouter une mention du jour.

### 2. `src/pages/PlanningPublicProject.tsx`
- Même logique, en miroir (cette page utilise `coordination_planning` aussi via `ProjectPlanningContent` partagé).

### 3. (optionnel) `src/components/project-management/ProjectPlanningContent.tsx`
- Vérifier s'il est utilisé en mode lecture seule partagé. Si oui, appliquer le même filtre.

## UI proposée
```
[Filtre jour ▼ Jour J]   [Filtre membre ▼ Voir toutes les tâches]
```
Sur mobile : les deux selects empilés.

## Hors scope
- Pas de modif de la table `coordination_planning` (colonne `event_day` déjà ajoutée).
- Pas de refonte des cartes de tâche.
- Pas de changement de la vue d'édition.
- Pas de regroupement visuel multi-jours sur une même page (un seul jour à la fois, comme dans l'édition).

## Détails techniques
- `event_day` est déjà dans `tasks` via `select('*')` ligne 78.
- Default `'Jour J'` cohérent avec la migration SQL existante.
- Le tri des jours : `['J-1', 'Jour J', 'J+1', ...autresCustomTriésAlpha]`.
