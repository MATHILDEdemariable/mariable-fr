# Import d'étapes depuis un fichier Excel (Mon Jour-M)

Oui, c'est possible. On ajoute un onglet « Import Excel » dans la fenêtre « Ajouter une nouvelle étape » du planning, avec un modèle à télécharger.

## Le modèle à remplir

Un bouton « Télécharger le modèle » fournit un fichier avec 5 colonnes, dont 2 obligatoires :

| Heure | Étape | Durée (min) | Personne assignée | Description |
|---|---|---|---|---|
| 15:00 | Arrivée des invités | 30 | Marie Dupont | Accueil devant la mairie |
| 15:30 | Cérémonie | 45 | Marie Dupont; Paul Martin | |

- Heure au format `15:00` (ou une cellule heure Excel, convertie automatiquement).
- Durée facultative : 30 min par défaut.
- Plusieurs personnes séparées par `;` ou `,`.
- Fichiers acceptés : `.xlsx`, `.xls`, `.csv`.

## Parcours d'import

1. Onglet « Import Excel » → télécharger le modèle → déposer le fichier rempli.
2. Aperçu sous forme de tableau : chaque ligne affichée avec son statut (valide / à corriger), les lignes sans titre ou sans heure valide sont signalées et ignorées.
3. Les personnes assignées sont comparées à l'équipe existante (comparaison sur le nom, insensible à la casse/accents). Les nouveaux noms sont marqués « sera ajouté à l'équipe » avec le rôle « Autre personne » par défaut, modifiable dans l'aperçu.
4. Bouton « Importer X étapes » : création des membres manquants dans l'équipe, puis insertion des étapes rattachées à ces personnes.
5. Message de confirmation : nombre d'étapes ajoutées + nombre de personnes créées. La page Équipe affiche immédiatement les nouveaux membres.

L'import est soumis à la même règle Premium que l'ajout manuel d'étapes.

## Détails techniques

- Nouveau composant `src/components/mon-jour-m/ImportExcelTasksModal.tsx` (ou onglet supplémentaire dans `UnifiedTaskModal.tsx`, même modale que « Manuel / Suggestions / IA Personnalisé »).
- Lecture des fichiers : ajout de la dépendance `xlsx` (SheetJS) pour `.xlsx/.xls`; `papaparse` déjà présent pour le `.csv`. Le modèle est généré côté client avec la même librairie (pas de fichier statique à héberger).
- Équipe : lecture de `coordination_team` (filtre `coordination_id`), insert des manquants (`name`, `role`, `type: 'person'`), réutilisation de la logique de normalisation de rôle déjà présente dans `BulkAddTeamModal.tsx`.
- Étapes : insert groupé dans `coordination_planning` (`coordination_id`, `title`, `description`, `start_time`, `duration`, `category: 'jour-m'`, `priority: 'medium'`, `assigned_to: [ids]`, `position` incrémental à la suite des étapes existantes), puis rafraîchissement de la timeline via le callback existant `onEventAdded` / rechargement du planning.
- Aucun changement de schéma en base : `assigned_to` existe déjà sur `coordination_planning`.
- Traductions FR/EN ajoutées dans `src/i18n/locales/{fr,en}/monJourM.json`.
- Vérifications : `bunx tsgo --noEmit`, puis test d'un import réel (fichier 5 lignes dont 2 nouvelles personnes) et contrôle des lignes créées en base.
