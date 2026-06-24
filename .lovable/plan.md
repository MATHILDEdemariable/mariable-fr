## Objectif
Créer un nouvel article de blog « Mariage en canicule : le guide complet pour survivre (et profiter) quand il fait +30°C » avec l'image fournie en couverture.

## Étapes

1. **Uploader l'image de couverture** via `lovable-assets` depuis `/mnt/user-uploads/8.png` → récupération de l'URL CDN (pas de binaire dans le repo).

2. **Créer une migration Supabase** qui insère une ligne dans `public.blog_posts` :
   - `slug` : `mariage-canicule-guide-complet-survivre-profiter-30-degres`
   - `title` / `h1_title` : « Mariage en canicule : le guide complet pour survivre (et profiter) quand il fait +30°C »
   - `meta_title` (≤60c) : « Mariage en canicule : guide complet +30°C | Mariable »
   - `meta_description` (≤160c) : reprise du texte fourni
   - `category` : `Conseils`
   - `status` : `published`, `published_at` = now, `language` = `fr`, `featured` = true
   - `background_image_url` : URL CDN de l'image
   - `h2_titles` : JSONB avec les 6 sections
   - `content` : HTML éditorial complet selon la structure mémoire `blog-seo-generation-prompt` (intro, H2/H3, listes, CTA Mariable, section bonus carrousel Instagram 9 slides en fin d'article)
   - `tags` : `["mariage été", "canicule", "conseils", "organisation"]`

3. **Vérification** : build OK + lecture de `/blog/mariage-canicule-guide-complet-survivre-profiter-30-degres` côté front (composant existant `BlogArticle.tsx`, aucune modification de code nécessaire).

## Notes techniques
- Aucun changement de code applicatif : l'article est rendu par les pages existantes `Blog.tsx` et `BlogArticle.tsx`.
- Contenu HTML stylé avec classes Tailwind Prose (h2/h3/ul/p/blockquote) conformes à la mémoire `blog/formatting-prose-typography`.
- CTA final pointe vers `mariable.fr` (création d'espace gratuit).
- Pas de modification du schéma (`blog_posts` existe déjà avec toutes les colonnes nécessaires).
