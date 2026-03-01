
# Chargement de 7 articles dans le blog

## Ce qui sera fait

Insertion de 7 articles dans la table `blog_posts` via des requetes SQL INSERT, en statut **draft** pour que vous puissiez les relire et publier depuis l'admin.

## Articles a inserer

| # | Titre | Slug | Categorie |
|---|-------|------|-----------|
| 1 | Checklist mariage : ce que tu dois faire 18, 12, 6 et 3 mois avant le jour J | `checklist-mariage-retroplanning` | Organisation |
| 2 | Budget mariage 2026 : les vrais chiffres, sans langue de bois | `budget-mariage-2026` | Budget |
| 3 | Comment organiser son mariage sans wedding planner (et sans perdre la tete) | `organiser-mariage-sans-wedding-planner` | Organisation |
| 4 | Photographe mariage : 10 questions a poser avant de signer | `choisir-photographe-mariage` | Prestataires |
| 5 | Comment choisir son traiteur mariage : les criteres que personne ne te dit | `choisir-traiteur-mariage` | Prestataires |
| 6 | Mariage civil uniquement : est-ce vraiment suffisant ? | `mariage-civil-uniquement` | Ceremonie |
| 7 | Faut-il vraiment inviter toute la famille ? | `inviter-famille-mariage` | Invites |

## Details techniques

- **Statut** : `draft` (vous publiez quand vous voulez depuis /admin/blog)
- **Contenu** : le markdown sera converti en HTML pour le champ `content`
- **Meta description** : extraite de chaque article
- **H1 et H2** : renseignes pour le SEO
- **Pas d'image** : le champ `background_image_url` restera vide, vous pourrez ajouter les images depuis l'admin

## Methode

- 7 requetes INSERT via l'outil d'insertion Supabase
- Aucune modification de code necessaire, uniquement des donnees en base
