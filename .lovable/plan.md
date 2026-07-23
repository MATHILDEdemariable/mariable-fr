## Objectif

Ajouter un nouvel article de blog "Bague de fiançailles : faire ta demande en mariage l'été, c'est encore jouable" avec la photo fournie en image de couverture, et mettre à jour le sitemap.

## Étapes

1. **Upload de l'image de couverture** via `lovable-assets` depuis `/mnt/user-uploads/engagement_aesthetic🤍.jpeg` → pointeur `src/assets/blog/bague-fiancailles-ete.jpg.asset.json`.

2. **Insert dans `blog_posts`** (via `supabase--insert`) avec :
   - `slug`: `bague-de-fiancailles-demande-en-mariage-ete` (aligné sur le format existant `/conseilsmariage/:slug` — pas `/blog/…`, qui n'est pas la route utilisée sur le projet)
   - `title` / `h1_title`: "Bague de fiançailles : faire ta demande en mariage l'été, c'est encore jouable"
   - `meta_title`: "Bague de fiançailles : faire sa demande cet été"
   - `meta_description`: version 156 caractères fournie
   - `subtitle`: accroche courte
   - `category`: "Conseils"
   - `background_image_url`: URL CDN retournée par lovable-assets
   - `content`: HTML complet structuré (h2/h3, tableaux `<table>` pour les 5 grilles maisons/gammes, listes, FAQ, encart "point de vue Mariable")
   - `status`: `published`, `published_at`: now, `language`: `fr`
   - JSON-LD `FAQPage` intégré via `custom_styles` non nécessaire — la page article gère déjà le schema BlogPosting

3. **Régénérer `public/sitemap.xml`** en ajoutant l'URL `/conseilsmariage/bague-de-fiancailles-demande-en-mariage-ete` avec `lastmod` du jour.

## Point à confirmer

Le slug demandé commence par `/blog/…`, mais toutes les URLs d'articles du site sont sous `/conseilsmariage/:slug` (voir `BlogArticle.tsx`, `BlogPostCard.tsx`, sitemap existant). Je pars sur `/conseilsmariage/bague-de-fiancailles-demande-en-mariage-ete` pour rester cohérent et éviter un 404 — dis-moi si tu veux vraiment créer une route séparée `/blog/:slug`.
