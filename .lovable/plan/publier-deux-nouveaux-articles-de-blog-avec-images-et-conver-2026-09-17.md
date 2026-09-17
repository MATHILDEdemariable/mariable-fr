# Publier deux nouveaux articles de blog avec images et conversion

## Articles à créer

1. **Comment organiser son mariage : par où commencer et dans quel ordre**
   - Slug public adapté au site : `/conseilsmariage/comment-organiser-son-mariage-etapes`
   - Image : le couple montrant ses alliances
   - Contenu repris du fichier fourni, sans les checklists éditoriales SEO/GEO placées après l’article

2. **Plan de table mariage : comment le faire, idées et inspirations**
   - Slug public adapté au site : `/conseilsmariage/plan-de-table-mariage-idees-inspiration`
   - Image : la mariée dans la salle de réception dressée
   - Contenu repris du fichier fourni, sans les checklists éditoriales SEO/GEO placées après l’article

Les deux nouveaux articles seront publiés même si des articles plus anciens traitent déjà de sujets proches, conformément à votre choix.

## Promotion de Mariable

- Ajouter dans chaque article des CTA naturels vers `/register-gratuit`, avec une promesse adaptée au sujet :
  - organisation : centraliser budget, checklist, prestataires et planning du jour J ;
  - plan de table : créer et ajuster le plan de table dans Mariable.
- Conserver le CTA final déjà présent sur les pages d’article, avec le bouton **Créer un compte gratuit**.
- Répartir les CTA dans le contenu sans interrompre excessivement la lecture ni transformer l’article en page publicitaire.

## Maillage interne

- Relier directement les deux nouveaux articles entre eux aux passages pertinents.
- Ajouter des liens vers des contenus et outils déjà publiés : budget mariage, mariage en petit comité, checklist/rétroplanning et outil de plan de table.
- Employer uniquement des URLs réellement disponibles sur Mariable afin d’éviter les liens morts.

## SEO et publication

- Convertir les contenus Markdown en HTML éditorial propre : un seul H1, H2/H3, listes, citation et tableau responsive.
- Transformer les questions de FAQ en vrais titres interrogatifs pour alimenter automatiquement le balisage FAQPage existant.
- Enregistrer le titre SEO, la méta-description, le H1, la catégorie, la langue française, l’audience couple, l’image et le statut publié dans `blog_posts`.
- Téléverser les deux images via Lovable Assets et utiliser leurs URLs CDN comme couvertures.
- Régénérer `public/sitemap.xml` pour inclure les deux nouvelles URLs sur `https://mariable.fr`.

## Vérification

- Ouvrir les deux pages sur ordinateur et mobile.
- Contrôler les images, titres, tableau, liens croisés, CTA de création de compte, métadonnées et absence d’erreur visible.
- Vérifier que chaque CTA mène bien à `/register-gratuit`.
