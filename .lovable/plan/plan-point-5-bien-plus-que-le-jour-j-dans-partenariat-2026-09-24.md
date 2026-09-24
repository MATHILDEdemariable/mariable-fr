# Plan — Point 5 « Bien plus que le Jour J » dans /partenariat

## Objectif
Dans la section « espace professionnel » (bloc `workspace`), ajouter un 5e point numéroté « 05 » pour signaler qu'au-delà du module Jour J, Mariable Pro inclut aussi les modules d'avant Jour J : budget, plan de table, RSVP en ligne, etc.

## Modification
Le composant `Partenariat.tsx` parcourt déjà `workspace.items` avec numérotation automatique (`0{index + 1}`) — aucun changement de code nécessaire, uniquement les locales i18n.

1. `src/i18n/locales/fr/partenariat.json` → ajout d'un item dans `workspace.items` :
   - **titre** : « Bien plus que le Jour J »
   - **corps** : « Au-delà du module Jour J, préparez l'avant Jour J avec le budget détaillé, le plan de table, les RSVP en ligne et tous les autres modules de l'app. »
2. `src/i18n/locales/en/partenariat.json` → même item traduit en anglais.

## Vérification
- `bunx tsgo --noEmit` passe.
- Vérification visuelle rapide de la page /partenariat (le point « 05 » apparaît en fin de liste, FR et EN).
