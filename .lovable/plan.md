# Remplacer les 7 PDF du bucket `ebooks`

Parfait, les 7 vrais PDF sont fournis. Je vais les uploader dans le bucket `ebooks` en écrasant les fichiers HTML corrompus actuels, avec les noms exacts attendus par l'edge function `get-ebook-download-url`.

## Mapping fichier uploadé → nom cible dans le bucket

| Fichier uploadé | → Nom cible |
|---|---|
| `Catalogue_Prix_Mariage_2026_en_France` | `catalogue-prix-mariage-2026.pdf` |
| `Organiser_la_Cérémonie_Laïque` | `guide-ceremonie-laique.pdf` |
| `Débutants_Mariage` | `guide-debutants-mariage.pdf` |
| `Do_Dont_du_Discours_de_Mariage` | `guide-discours-mariage.pdf` |
| `Checklist_pour_les_Témoins` | `checklist-temoins.pdf` |
| `Sélection_des_prestataires_Checklist_questions` | `checklist-questions-prestataires.pdf` |
| `Checklist_pour_la_Mariée` | `checklist-mariee.pdf` |

## Méthode

Script shell qui, pour chaque fichier :
1. Récupère un token d'upload via l'API Supabase Storage (avec la service role key)
2. Fait un `PUT` sur `/storage/v1/object/ebooks/<slug>.pdf` avec `x-upsert: true` pour écraser
3. Vérifie que le nouveau fichier fait bien plusieurs Mo et commence par `%PDF-`

Aucun changement de code : bucket, edge function, table `ebook_purchases`, pages `/mes-guides/[token]` et `/dashboard/mes-guides` restent identiques — elles fonctionnaient déjà, c'était juste le contenu du bucket qui était mauvais.

## Vérification post-upload

Après upload, je testerai avec votre token existant :
```
POST get-ebook-download-url { slug: "catalogue-prix-mariage-2026", token: "26be01d6..." }
→ télécharger l'URL signée → vérifier que le fichier commence par %PDF- et pèse plusieurs Mo
```

Puis je vous donne le OK pour re-tester le clic « Télécharger » sur `/mes-guides/[token]`.

## Détails techniques
- Utilise `SUPABASE_SERVICE_ROLE_KEY` (déjà en secret) pour l'upload — jamais exposée au client
- `x-upsert: true` écrase les 7 fichiers HTML corrompus (uploadés le 09/07 à 07:14, ~2.6 Ko chacun)
- Le bucket reste privé (correct), accès uniquement via URL signée générée par l'edge function
