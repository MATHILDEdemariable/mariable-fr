# Rubrique "Conseils professionnels"

Créer un espace d'articles réservé aux professionnels du mariage, totalement séparé des conseils destinés aux couples. Même design, contenu différent.

## Ce que verront les utilisateurs

- Une nouvelle page **/conseils-professionnels** : même mise en page que la page conseils actuelle, mais uniquement des articles pour les pros.
- Un **lien "Conseils professionnels" dans le pied de page** (colonne Professionnels).
- Sur **/partenariat**, une section **"Conseils & tips"** avec les 3 derniers articles pros et un lien vers la rubrique complète.
- Les articles pros **n'apparaissent pas** dans /conseilsmariage, ni sur la page d'accueil, ni dans les carrousels couples.

## Les 5 articles créés (avec les visuels fournis)

1. Se lancer comme wedding planner : le guide honnête — `se-lancer-wedding-planner`
2. Combien coûte un community manager mariage — `prix-community-manager-mariage`
3. 30 idées de posts Instagram pour prestataire mariage — `idees-posts-instagram-prestataire-mariage`
4. Gestion d'un Instagram pro dans le mariage — `gestion-instagram-professionnel-mariage`
5. Agence social media mariage : est-ce que ça vaut le coup — `agence-social-media-mariage`

Chaque article reprend le texte fourni, ses métadonnées SEO (titre, description, mots-clés), ses liens internes entre articles, et un appel à l'action vers Mariable Pro / Studio. Les 5 photos jointes servent d'images de couverture (une par article, dans l'ordre ci-dessus).

## Détails techniques

- Base de données : ajout d'une colonne `audience` sur `blog_posts` (`'couple'` par défaut, `'pro'` pour les nouveaux articles). Aucune donnée existante modifiée.
- Filtrage : `.eq('audience','couple')` ajouté aux requêtes existantes (`Blog.tsx`, `BlogSection`, `BlogCarouselEditorial`, sitemap, outil MCP), et `.eq('audience','pro')` pour la nouvelle page.
- Nouvelles routes dans `App.tsx` : `/conseils-professionnels` (liste) et `/conseils-professionnels/:slug` (article), en réutilisant les composants `Blog.tsx` / `BlogArticle` via une prop `audience` — pas de duplication de design.
- Images : upload des 5 visuels via Lovable Assets, URL enregistrée dans `background_image_url`.
- Contenu : conversion Markdown → HTML, insertion dans `blog_posts` avec `status = 'published'`, `category = 'Professionnels'`, `language = 'fr'`.
- SEO : mise à jour de `public/sitemap.xml` (5 nouvelles URLs) et JSON-LD `Blog` propre à la rubrique pro.
- Footer : ajout de la clé de traduction FR/EN `footer.links.proAdvice`.

## Hors périmètre

Aucun changement sur le design global, les pages couples existantes, la tarification ou les parcours d'inscription.
