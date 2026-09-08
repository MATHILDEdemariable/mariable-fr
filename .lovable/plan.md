# Correction du mockup dashboard sur la homepage

## Problème constaté
Dans la section « Ton espace Mariable » de la homepage (`/`), le visuel du dashboard Mariable ne s’affiche pas : seul le texte alternatif apparaît à la place de l’image. L’URL asset actuelle renvoie du HTML au lieu du JPEG, ce qui rend le bloc visuellement vide.

## Objectif
Réafficher un vrai mockup de l’application Mariable (budget, invités, planning, tâches) dans cette section, en remplaçant l’asset corrompu/manquant.

## Étapes
1. **Générer un nouveau mockup dashboard** — créer une image propre au format 16:10 montrant l’interface Mariable (sidebar, compteur J-127, tuiles budget/invités/progression, liste de tâches) dans la palette beige/vert sauge du site.
2. **Uploader le fichier via Lovable Assets** — utiliser `lovable-assets create` pour obtenir un nouveau `.asset.json`.
3. **Mettre à jour `EspaceFusionSection.tsx`** — remplacer l’import `dashboard-mockup.jpg.asset.json` par le nouveau pointeur asset.
4. **Vérifier le rendu** — s’assurer que l’image se charge correctement en desktop et mobile via screenshot Playwright.

## Fichiers concernés
- `src/components/home/editorial/EspaceFusionSection.tsx`
- `src/assets/dashboard-mockup.jpg.asset.json` (à remplacer/supprimer après création du nouvel asset)

## Non-concerné
- Aucune modification du texte, des CTAs, du routing ou du SEO de la page.
