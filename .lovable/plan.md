
## 1. Page `/mariage-civil` — alignement CSS home

- Repasser `src/pages/MairieCivilPublic.tsx` (hero + sections) sur le fond `#F8F5EF` (beige clair éditorial) et cartes blanches à bord fin (`border border-editorial-beige/60 rounded-none`).
- Remplacer les zones actuelles trop colorées / arrondies par les encadrés rectangulaires éditoriaux (comme sur la home et `/guides`).
- Titres en `font-serif` (Playfair) noir éditorial, accents `wedding-olive` (sage green), CTA `bg-wedding-olive text-white rounded-none uppercase tracking-widest`.
- Conserver le contenu SEO et les CTA existants (créer un compte / explorer les prestataires).

## 2. Dashboard — fond beige clair

- Dans `src/components/dashboard/DashboardLayout.tsx`, s'assurer que le fond utilise bien `#F8F5EF` (ivory) et pas un beige plus foncé.
- Vérifier qu'aucune surcharge locale ne réintroduit un ton plus sombre (`bg-editorial-beige` sans variante claire, ou classe globale).
- Harmoniser cartes/sections internes sur blanc pur pour retrouver le contraste doux de la homepage.

## 3. Nouvel article de blog

- Upload image de couverture (`user-uploads://30.jpeg`) via `lovable-assets` → `src/assets/blog/demarches-administratives-mariage.jpg.asset.json`.
- `INSERT` dans `blog_posts` :
  - `slug`: `demarches-administratives-apres-mariage-5-erreurs`
  - `title` / `h1_title`: "Démarches administratives après le mariage : les 5 erreurs que font (presque) tous les jeunes mariés"
  - `meta_title`: "Démarches après mariage : 5 erreurs à éviter"
  - `meta_description`: ~155 car., axée SEO (démarches administratives, nom d'usage, impôts, régime matrimonial)
  - `category`: "Conseils"
  - `background_image_url`: URL CDN
  - `content`: HTML complet (h2/h3, tableau des 4 régimes matrimoniaux, listes ordonnées de priorité, encart "Point de vue Mariable", FAQ)
  - `status`: `published`, `published_at`: now, `language`: `fr`
- Ajouter l'URL `/conseilsmariage/demarches-administratives-apres-mariage-5-erreurs` dans `public/sitemap.xml` (sans `lastmod`, en cohérence avec les entrées existantes bulk).

## Point à confirmer

Le slug reste sous `/conseilsmariage/...` (route existante `BlogArticle`), pas `/blog/...`, comme pour les précédents articles. Dis-moi si tu veux le contraire.
