# Publication de 5 articles de blog

Créer et publier 5 nouveaux articles sur `/conseilsmariage` avec leurs photos de couverture, puis régénérer le sitemap.

## Articles à créer

| # | Slug | Titre | Catégorie | Image |
|---|------|-------|-----------|-------|
| 1 | `anniversaire-mariage-nouveau-mariage` | Anniversaire de mariage : et si tu organisais un nouveau mariage (en mieux) ? | Après mariage | image 5 (dîner cake extérieur lumières) |
| 2 | `mariage-petit-comite-qualite-quantite` | Mariage en petit comité : pourquoi la qualité battra toujours la quantité | Organisation | image 1 (garden party château) |
| 3 | `mariage-petit-budget-reception-non-obligatoire` | Mariage petit budget : et si la réception traditionnelle n'était pas obligatoire ? | Budget | image 4 (grand déjeuner sous l'arbre) |
| 4 | `renouvellement-voeux-guide-complet` | Renouvellement de vœux : le guide complet (et 100 % libre) | Cérémonie | image 3 (mariés signature mairie) |
| 5 | `mariage-ou-pacs-deux-facons-sengager` | Mariage ou PACS : deux façons de s'engager (et une fête dans les deux cas) | Organisation | image 2 (couple gâteau bougies Paris) |

## Étapes techniques

1. **Upload des 5 photos de couverture** via `lovable-assets create` depuis `/mnt/user-uploads/` — pointers stockés dans `src/assets/blog/` (mais on utilise directement l'URL CDN dans `background_image_url` de la table `blog_posts`).
2. **Insert SQL dans `blog_posts`** (via `supabase--insert`) pour chaque article :
   - `slug`, `title`, `subtitle`, `category`, `meta_title`, `meta_description`, `background_image_url`, `content` (HTML enrichi avec `<h2>`, `<h3>`, `<table>`, `<ul>`, FAQ), `status='published'`, `published_at=now()`, `order_index`, `language='fr'`.
   - Contenu HTML basé sur les textes fournis, formaté avec la structure éditoriale existante (comme les articles précédents `belle-famille-mariage`, etc.).
   - Meta descriptions ~155 caractères, meta titles ~55 caractères.
3. **Maillage interne** : ajouter les liens internes indiqués (articles frères, guides existants) dans le HTML de chaque article.
4. **Régénération du sitemap** : `bunx tsx scripts/generate-sitemap.ts` → mise à jour de `public/sitemap.xml` avec les 5 nouveaux slugs.

## Détails éditoriaux

- Aucun refactoring de code, aucune modification de composants — pure data + assets.
- Chaque article suit la structure : intro chapô, H2 sections, tableau comparatif (si pertinent), section « Ce que Mariable recommande », FAQ H3, « En résumé », maillage interne en fin.
- Aucune traduction EN (langue = FR uniquement, conforme aux articles récents).

## Livrables

- 5 lignes ajoutées dans `blog_posts` (visibles sur `/conseilsmariage` et `/conseilsmariage/<slug>`).
- 5 pointers `.asset.json` dans `src/assets/blog/`.
- `public/sitemap.xml` mis à jour (42 articles blog au total).
