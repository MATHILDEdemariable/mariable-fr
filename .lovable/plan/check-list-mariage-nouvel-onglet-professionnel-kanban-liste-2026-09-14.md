# Check-list Mariage : nouvel onglet « Professionnel » (Kanban / Liste / Calendrier)

Objectif : mieux organiser les tâches de la check-list, avec les mêmes tâches partagées entre l'onglet Manuelle (post-it) et un nouvel onglet Professionnel qui propose trois vues.

## Ce qui change pour vous

- La page Check-list passe à 4 onglets : **10 étapes**, **Manuelle**, **Intelligente (IA)**, **Professionnel** (nouveau).
- Les tâches sont les mêmes partout : une tâche créée en vue post-it apparaît dans le Kanban, et inversement. Chaque tâche gagne un **statut** (À faire / En cours / Terminé) et une **priorité**.
- Dans la vue post-it existante, cocher une tâche la passe en « Terminé » ; la déplacer en « Terminé » dans le Kanban la coche. Les deux restent synchronisés.
- Accessible à tous les comptes, en français et en anglais, utilisable sur mobile.

## Onglet Professionnel

**En haut** : trois cartes de synthèse — À faire / En cours / Terminées (neutre, info, succès).

**Barre de contrôle** : bascule segmentée `Kanban | Liste | Calendrier` dans un fond `bg-muted rounded-lg p-1`, bouton « Ajouter une tâche » à droite.

**Kanban** : 3 colonnes déposables (À faire neutre, En cours info léger, Terminé succès léger), hauteur minimale 300px, compteur par colonne, anneau de surbrillance sur la colonne survolée pendant le glisser. Le dépôt enregistre le nouveau statut en base. Aperçu de la carte pendant le déplacement (DragOverlay), capteur pointeur avec contrainte de 8px.

**Carte tâche** : poignée de déplacement, bouton d'icône de statut (cercle / horloge / coche) qui bascule terminé ↔ à faire, titre barré si terminé, description tronquée sur 2 lignes, date d'échéance au format `dd MMM`, actions éditer/supprimer au survol.

**Liste** : mêmes tâches en lignes plus larges avec catégorie, échéance et personne assignée.

**Calendrier** : grille mensuelle 7 colonnes (Lun→Dim, locale fr/en), navigation mois précédent/suivant, cellules de 80px minimum, jusqu'à 3 tâches colorées par statut + compteur `+N`, jour courant mis en évidence, clic sur une tâche = ouverture de l'édition.

Messages de confirmation (toasts) sur ajout, modification, complétion et suppression.

## Détails techniques

Réutilisation de la table existante `public.checklist_mariage_manuel` (déjà : `title`, `description`, `category`, `completed`, `due_date`, `responsible`, `position`, `user_id`, `wedding_id`, RLS propriétaire + accès mariage). Pas de table `tasks` en double : elle dupliquerait les données de la check-list manuelle.

Migration :

```sql
ALTER TABLE public.checklist_mariage_manuel
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'medium';

UPDATE public.checklist_mariage_manuel
SET status = 'completed' WHERE completed = true AND status = 'pending';

CREATE INDEX IF NOT EXISTS idx_checklist_manuel_status
  ON public.checklist_mariage_manuel (wedding_id, status);
```

Statuts : `pending`, `in_progress`, `completed`. Priorités : `low`, `medium`, `high`. Règle de cohérence appliquée côté écriture : `completed = (status === 'completed')`.

Nouveaux fichiers :

- `src/hooks/useChecklistTasks.ts` — react-query, scopé par `useWeddingScope()` (attendre `weddingId`), tri par `due_date` puis `position`, `createTask` / `updateTask` / `deleteTask`, invalidation `['checklist-tasks', weddingId]`.
- `src/components/dashboard/checklist/TasksTab.tsx` — cartes de synthèse, bascule de vue, dialog d'ajout/édition.
- `src/components/dashboard/checklist/KanbanView.tsx`, `ListView.tsx`, `CalendarView.tsx`, `TaskCard.tsx`, `TaskDialog.tsx`.

Modifications : `src/pages/dashboard/ChecklistMariagePage.tsx` (4e onglet + `?tab=pro`, `grid-cols-4`), `ChecklistMariageManuelle.tsx` (écrire `status` en même temps que `completed`), locales `src/i18n/locales/{fr,en}/checklist.json` (bloc `tasks`).

Dépendance à installer : `@dnd-kit/core` (`date-fns` et `framer-motion` sont déjà présents).

Couleurs via les jetons du thème (vert sauge / beige) — aucune couleur en dur. Gestion d'erreurs et logs de debug sur chaque mutation, vérification `bunx tsgo --noEmit` en fin de tâche.
