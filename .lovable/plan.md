# Homepage mobile, feature Album photo & nouveaux contenus

## 1. Sections carrousels responsives (mobile)

Sur mobile, les cartes occupent presque toute la largeur (85vw / 260px) avec un ratio 4/5 : les visuels sont trop hauts.

- Sélection de lieux (`EditorialCarousels`) et Conseils & inspirations (`BlogCarouselEditorial`) : cartes réduites à ~62vw (max 240px) sur mobile, 300px à partir de md.
- Ratio image passé en 3/4 sur mobile (4/5 conservé en desktop) pour réduire la hauteur.
- Typo des cartes légèrement resserrée sur mobile (titre serif base au lieu de lg).
- Le peek de la carte suivante reste visible pour indiquer le défilement.

## 2. Nouvelle fonctionnalité affichée sur la home

Ajout d'une 7e entrée dans la grille « Ton espace Mariable » :
- Icône appareil photo, titre « Album photo partagé », description « Récupérez les photos de vos invités facilement grâce à un QR code ».
- Traductions FR + EN ajoutées.
- La grille passe donc à 7 items (3 colonnes desktop), le titre du bloc reste inchangé.

## 3. Page standalone SEO : Album photo partagé

Nouvelle page `/album-photo-partage-mariage` avec la même direction artistique que `/checklist-mariage` (header global, fond ivoire, blocs rectangulaires, vert sauge).

Contenu :
- H1 + accroche, explication du problème (photos éparpillées sur 40 téléphones).
- Comment ça marche en 3 étapes (créer l'album → imprimer le QR code → récupérer les photos).
- Bloc avantages (aucun compte invité, qualité originale, album privé, quota 400 médias / 90 jours).
- FAQ (4-5 questions) avec schéma FAQPage + BreadcrumbList.
- CTA principal vers la création de compte Premium (`/register-premium` selon la route existante, sinon `/paiement`), CTA secondaire vers `/register-gratuit`.
- Métadonnées via le composant SEO existant, ajout au sitemap.

## 4. Deux articles de blog

Insertion en base (`blog_posts`, statut publié) à partir des fichiers fournis :
1. « Album photo partagé mariage : le comparatif 2026 » — slug `album-photo-partage-mariage`, image de couverture = photo des polaroids.
2. « Cadeau de mariage : le top 5 des idées à offrir en 2026 » — slug `idees-cadeau-mariage-top-5`, image de couverture = photo du livre d'or.

Les deux images sont uploadées en assets CDN, titres/meta descriptions repris des en-têtes des fichiers md, contenu converti en HTML au format éditorial existant. L'article album renvoie vers la nouvelle page fonctionnalité. Sitemap régénéré.

## Détails techniques

- Fichiers modifiés : `EditorialCarousels.tsx`, `BlogCarouselEditorial.tsx`, `EspaceFusionSection.tsx`, locales `refonteJuillet.json` (fr/en), `App.tsx` (nouvelle route lazy), `public/sitemap.xml`.
- Nouveau fichier : `src/pages/AlbumPhotoPartage.tsx`.
- Articles insérés via requête SQL sur `blog_posts` (aucune modification de schéma).
