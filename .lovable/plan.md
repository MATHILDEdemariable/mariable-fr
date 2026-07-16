# Plan

## 1. Menu déroulant mobile (authentifié) — PremiumHeader.tsx

Ajouter un bouton **Tableau de bord** (`/dashboard`) dans le menu hamburger en haut à droite, entre Accueil et Déconnexion.

État authentifié final :
- Accueil (`/`)
- Tableau de bord (`/dashboard`)
- Déconnexion
- Toggle FR/EN

## 2. Sticky menu du bas — visible sur landing page

Actuellement le sticky bottom menu (mobile, utilisateur connecté) n'apparaît pas sur `/`. Vérifier la condition de rendu dans le composant sticky (probablement `MobileStickyNav` ou équivalent) et retirer l'exclusion de la route `/` pour qu'il s'affiche partout quand l'utilisateur est loggé.

## 3. Ajout de 3 articles de blog

Upload des 3 images de couverture via `lovable-assets` (source `/mnt/user-uploads/`), puis insertion des articles dans la table `blog_posts` via migration Supabase :

| # | Slug | Image |
|---|------|-------|
| A | `belle-famille-mariage-guide-survie` | image 1 (couple + wedding planner) |
| B | `demande-en-mariage-guide-homme` | image 2 (demande sur plage) |
| C | `creer-site-web-mariage` | image 3 (couple devant laptop) |

Pour chaque article : `title`, `subtitle`, `slug`, `category` (Conseils / Fiançailles / Organisation), `content` (HTML converti depuis markdown fourni), `meta_description`, `background_image_url` (URL CDN Lovable), `status: 'published'`, `published_at: now()`, `order_index` incrémenté, `featured: false`.

## 4. Sitemap

Ajouter les 3 nouvelles URLs `/blog/<slug>` dans `scripts/generate-sitemap.ts` (section blog dynamique si elle existe déjà — sinon ajout en dur).

## Détails techniques

- Fichier édité : `src/components/home/PremiumHeader.tsx` + composant sticky bottom mobile.
- Migration Supabase pour l'INSERT des 3 articles (rollback facile si besoin).
- Le contenu markdown est converti en HTML sémantique (h2/h3/p/ul/table) pour respecter le format éditorial existant du blog.

## Hors périmètre

- Pas de modification du design des cartes de blog ni de la page article.
- Pas de refonte du menu hamburger — juste ajout du lien Dashboard.
