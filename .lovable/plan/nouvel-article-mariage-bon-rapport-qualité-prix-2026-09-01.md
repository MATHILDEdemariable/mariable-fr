# Nouvel article : Mariage bon rapport qualité-prix

## Contenu
- Slug : `mariage-bon-rapport-qualite-prix`
- Titre SEO : Mariage bon rapport qualité-prix : où mettre ton argent
- Meta description : la version fournie
- H1 : Mariage au bon rapport qualité-prix : où mettre ton argent (et où arrêter d'en perdre)
- Corps repris intégralement, mis en HTML éditorial (h2/h3, paragraphes, listes, tableau de répartition budgétaire)
- FAQ conservée en h3 se terminant par « ? » pour alimenter automatiquement le schema FAQPage déjà généré par la page article
- Lien interne : CTA final vers `/budget-mariage` (simulateur), plus lien contextuel vers la sélection prestataires

## Image de couverture
La photo jointe (calculatrice blanche « MARIAGE ») est publiée comme visuel de couverture via un pointeur Lovable Assets, puis renseignée en `background_image_url`.

## Technique
- Insertion d'une ligne dans `blog_posts` (status `published`, `published_at` = maintenant, langue fr, `meta_title`, `meta_description`, `h1_title`, `subtitle`, `content` HTML)
- Le tableau budget est rendu en `<table>` responsive dans le contenu
- Ajout de l'URL `https://www.mariable.fr/conseilsmariage/mariage-bon-rapport-qualite-prix` dans `public/sitemap.xml`
- Vérification finale du rendu de la page article dans le preview
