# 4 nouveaux articles de blog — anniversaire de mariage

Les 5 fichiers envoyés contiennent 4 articles distincts (le fichier « anniversaire de mariage à deux » est en double, il sera publié une seule fois).

## Articles publiés

1. **Comment fêter ton anniversaire de mariage : 6 idées** — `comment-feter-anniversaire-de-mariage`
2. **Organiser une fête surprise pour un anniversaire de mariage** — `fete-surprise-anniversaire-de-mariage`
3. **Anniversaire de mariage à deux : escapades et idées d'intimité** — `anniversaire-de-mariage-a-deux`
4. **Renouvellement de vœux vs anniversaire de mariage : différence** — `renouvellement-voeux-vs-anniversaire-de-mariage`

Pour chacun : titre SEO, méta description, mots-clés et contenu repris tels quels depuis le fichier. Catégorie « Anniversaire de mariage », statut publié, date du jour. Les liens de maillage interne indiqués en tête de chaque fichier seront transformés en vrais liens quand l'article cible existe déjà sur le site ; sinon ils sont retirés (pas de lien mort).

## Photos de couverture proposées

| Article | Photo |
| --- | --- |
| Comment fêter ton anniversaire de mariage | Couple entouré d'invités, terrasse au soleil couchant (verticale, oliviers) |
| Fête surprise | Toast collectif en extérieur, coupes levées au soleil |
| Anniversaire à deux | Couple qui s'embrasse, soirée, fond sombre |
| Renouvellement de vœux vs anniversaire | Couple enlacé qui rit, guirlandes lumineuses en fin de journée |

La 5e photo (toast du soir, guirlandes) reste en réserve. Dites-moi si vous voulez une autre répartition.

## Détails techniques

- Insertion dans `blog_posts` (titre, slug, sous-titre, meta_description, contenu, catégorie, `background_image_url`, `status = published`, `published_at`).
- Images téléversées via Lovable Assets (CDN) et référencées par leur URL.
- Mise à jour de `public/sitemap.xml` avec les 4 nouvelles URLs `/conseilsmariage/<slug>`.
- Vérification : ouverture de chaque page d'article en préview pour contrôler titre, image et mise en forme.
