# Corriger l'export PDF du planning partagé (mode consultation)

## Problème constaté

Sur le PDF exporté depuis le planning partagé, les textes se chevauchent : les descriptions d'étapes qui contiennent plusieurs lignes (ex. « Fleurs / Chaises / Enceinte ») sont imprimées en bloc, alors que la position verticale n'avance que d'une seule ligne. L'étape suivante s'écrit donc par-dessus.

De plus, les numéros de téléphone des membres de l'équipe n'apparaissent pas : la page publique envoie les champs `phone`/`email` de chaque membre, mais l'export attend un champ `contact` qui n'existe pas, donc rien ne s'affiche.

## Ce qui va changer

### 1. Mise en page fiable (fin des superpositions)
- Chaque texte long (titre d'étape, description, note) est découpé en lignes calculées selon la largeur disponible, et la position verticale avance du nombre exact de lignes écrites.
- Les descriptions ne sont plus tronquées à 80 caractères : elles s'affichent en entier, proprement retournées à la ligne.
- Le titre de l'étape s'affiche dans une colonne à droite de l'heure, sans déborder sur la marge.
- Contrôle de saut de page avant chaque bloc (étape, membre, document) : si le bloc ne tient pas au-dessus du pied de page, on passe à la page suivante. Plus aucun texte ne peut se retrouver sous la ligne de footer.

### 2. Durée des étapes
- Affichage de la durée à côté de l'heure (ex. « 11:00 · 60 min ») pour rester cohérent avec la vue consultation en ligne.

### 3. Coordonnées de l'équipe
- Pour chaque membre (équipe personnelle et prestataires) : affichage du téléphone et, s'il existe, de l'email, sur une ligne dédiée sous le nom et le rôle.
- Rien n'est affiché si le membre n'a aucune coordonnée renseignée.

## Détails techniques

- Fichier principal : `src/services/publicPlanningBrandedExportService.ts`
  - Introduction de deux utilitaires internes : `ensureSpace(hauteur)` (saut de page) et `writeWrapped(texte, x, largeur)` (retour à la ligne via `pdf.splitTextToSize`, renvoie la nouvelle position Y).
  - Interface `PublicPlanningBrandedData` : `teamMembers` gagne `phone?` et `email?` (le champ `contact?` est conservé en repli), `tasks` gagne `duration?`.
  - Limite basse de page fixée à 270 mm (le footer est tracé à 280 mm).
- Fichier appelant : `src/pages/PlanningPublic.tsx` — l'objet `exportData` transmet explicitement `phone`, `email` et `duration` depuis les données déjà chargées (`coordination_team`, `coordination_planning`). Aucune requête supplémentaire, aucun changement de base de données.

## Vérification

Génération d'un PDF de test à partir d'un planning contenant des descriptions multi-lignes et des membres avec téléphone, puis contrôle visuel page par page (aucun chevauchement, aucun texte coupé, téléphones présents).
