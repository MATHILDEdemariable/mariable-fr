## Objectif
Sur la home (`/`), section "Sélection" (composant `EditorialCarousels.tsx`) :
1. Supprimer la vignette/badge "Membres" affichée en surimpression sur chaque photo.
2. Remplacer le carrousel actuel (12 lieux) par une sélection mixte et variée : **6 lieux de réception + 3 traiteurs + 3 photographes**, avec priorité aux partenaires puis featured.

## Modifications

**Fichier unique : `src/components/home/editorial/EditorialCarousels.tsx`**

- Retirer le `<span>` qui affiche `carousels.membersBadge` sur chaque carte (lignes 140–142).
- Remplacer la fonction `fetchVendors` par un seul fetch qui récupère 3 lots en parallèle :
  - 6 × `Lieu de réception`
  - 3 × `Traiteur`
  - 3 × `Photographe`
  - Chaque lot trié par `partner` desc, puis `featured` desc.
- Concaténer les 3 lots dans l'ordre : lieux → traiteurs → photographes (pour la variété visible d'entrée).
- Le carrousel reste unique (pas de tabs), toujours scrollable horizontalement.
- La catégorie s'affiche déjà sous chaque carte (ligne 146), donc la variété sera lisible.

## Hors périmètre
- Pas de refonte du layout, du header, ni des couleurs.
- Le lien "voir toute la sélection" et le modal de lock restent inchangés.
- Clés i18n : `carousels.membersBadge` devient orpheline, laissée en place (pas de suppression pour éviter tout risque de casse).
