# Filtre "Voir toutes les tâches" coupé en mobile

## Problème
Sur la page de consultation du Jour-M, le menu déroulant de filtre par membre s'ouvre en se superposant au bouton. Quand l'équipe compte beaucoup de membres, la liste dépasse la hauteur de l'écran mobile et la première ligne ("Voir toutes les tâches") sort du champ visible : impossible de revenir à l'affichage complet des tâches.

## Correctif
1. Forcer l'ouverture du menu **sous** le déclencheur (mode "popper" avec décalage), au lieu de la superposition, pour que la première option reste toujours visible.
2. Limiter la hauteur du menu à la hauteur disponible de l'écran et rendre la liste défilante à l'intérieur, avec la largeur alignée sur le déclencheur.
3. Rendre les deux sélecteurs (jour et membre) pleine largeur en mobile pour éviter le débordement horizontal.

Même correction appliquée aux deux vues concernées (consultation publique et vue Jour-M) pour un comportement identique.

## Détails techniques
- `src/pages/PlanningPublicProject.tsx` et `src/pages/JourMVue.tsx`
- Sur `SelectContent` : `position="popper"`, `sideOffset={4}`, `className="max-h-[60vh] overflow-y-auto w-[var(--radix-select-trigger-width)]"`
- Sur `SelectTrigger` : `w-full sm:w-48` (et `w-full sm:w-40` pour le filtre jour), conteneurs de filtre en `w-full sm:w-auto`
- Aucun changement de logique de filtrage.
