# Deux nouveaux articles de blog budget + maillage interne

## Articles à publier

**1. Prix mariage 2027**
- Slug : `prix-mariage-2027`
- Titre SEO : Prix d'un mariage en 2027 : les vrais chiffres sans langue de bois
- Image de couverture : la photo des billets qui tombent (ambiance beige/ivoire)

**2. Budget mariage 20 000 €**
- Slug : `budget-mariage-20000-euros`
- Titre SEO : Budget mariage 20 000 € : l'exemple détaillé poste par poste
- Image de couverture : le laptop « Budget mariage 2027 » en extérieur de réception

Contenu repris intégralement des fichiers fournis, converti en HTML éditorial (h2/h3, listes, tableaux responsives), FAQ conservée en h3 avec « ? » pour alimenter le schema FAQPage déjà généré par la page article.

## Maillage interne

- Les deux articles se citent mutuellement dans le corps du texte
- Liens vers l'article existant « Mariage au bon rapport qualité-prix » (`/conseilsmariage/mariage-bon-rapport-qualite-prix`)
- CTA final vers le simulateur `/budget-mariage` (liens internes relatifs, pas d'URL absolue)
- Ajout d'un lien retour depuis l'article « bon rapport qualité-prix » vers les deux nouveaux articles

## Technique

- Deux pointeurs Lovable Assets pour les images de couverture, renseignés en `background_image_url`
- Deux insertions dans `blog_posts` : status `published`, `published_at` = maintenant, `meta_title`, `meta_description`, `h1_title`, `content` HTML, catégorie budget
- Ajout des deux URLs dans `public/sitemap.xml`
- Vérification du rendu des deux pages dans le preview
