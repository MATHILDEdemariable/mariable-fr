# Rendre le toggle FR/EN complet (tableau de bord + conseils pros)

## Objectif

Aujourd'hui le bouton FR/EN traduit la page d'accueil et une partie de l'application, mais beaucoup d'écrans restent en français (rétroplanning, plan de table, Mon Jour-M, documents, conseils, espace pro). Objectif : que tout bascule vraiment en anglais, que les guides PDF soient clairement signalés comme disponibles en français uniquement, et que les articles « Conseils professionnels » aient une vraie version anglaise.

## 1. Traduction complète du tableau de bord

Balayage écran par écran de tous les modules, y compris les écrans secondaires, les fenêtres qui s'ouvrent et les messages de confirmation ou d'erreur.

Modules visibles sur vos captures, traités en priorité :
- Rétroplanning (titres, périodes, légendes, notifications)
- Plan de table (statistiques, boutons d'import, cartes de tables)
- Mon Jour-M : ajout d'une étape, planning, équipe, documents, conseils, notes
- Documents pré-remplis (liste photos, plan de table, boutons d'export)
- Espace pro (menu latéral, cartes de mariage, bandeau d'offre)

Puis le reste : budget, invités, RSVP, hébergement, moodboard, QR code, album invités, messages, paramètres, aide, panier, sélection prestataires, notifications.

Méthode : chaque texte affiché passe dans les fichiers de langue FR/EN existants (un fichier par grand module). Aucune modification de logique métier, uniquement l'affichage.

## 2. Guides PDF : mention « français uniquement »

Sur la page Guides du tableau de bord et sur chaque carte de guide/e-book :
- un petit badge avec un drapeau français et la mention « Français uniquement » (« French only » en version anglaise)
- une phrase d'explication en haut de la page : les guides sont pour l'instant disponibles en français, les versions anglaises arrivent

## 3. Contenus pré-remplis (tâches, plannings types, listes)

Les tâches du rétroplanning, les modèles de planning Jour-J, la checklist et les listes de photos sont du contenu, pas de l'interface. Chaque élément aura une version anglaise affichée selon la langue choisie.
- Les modèles qui vivent dans le code sont traduits comme le reste de l'interface.
- Ceux stockés en base reçoivent des colonnes de texte anglais, remplies une fois.
- Les contenus déjà créés par un utilisateur (ses propres tâches, ses notes) restent tels quels : on ne touche jamais à ce qu'il a écrit.

## 4. Conseils professionnels en anglais

Les 5 articles pros sont dupliqués en version anglaise enregistrée (meilleur référencement, chargement instantané).
- Chaque article anglais a sa propre adresse (`/conseils-professionnels/<slug>-en`) et un lien croisé avec sa version française.
- Le bouton FR/EN sur la rubrique et sur un article bascule directement vers la version correspondante ; si un article n'existe pas encore en anglais, la version française s'affiche avec une mention « Available in French only ».
- Le bloc « Conseils & tips » de la page Partenariat et le plan du site suivent la même logique.

Le blog des couples n'est pas concerné à ce stade.

## Détails techniques

- i18n : nouveaux espaces de noms par module (`retroplanning`, `seatingPlan`, `documents`, `pro`, `guides`, `rsvp`, `accommodations`, `moodboard`, `album`, `settings`…), ajoutés dans `src/i18n/index.ts` avec leurs paires `fr/en`.
- Repérage exhaustif par recherche des littéraux accentués/français dans `src/pages/dashboard`, `src/components/dashboard`, `src/components/mon-jour-m`, `src/components/seating-plan`, `src/pages/pro`, plus `toast(...)` et `aria-label`.
- Guides : badge drapeau réutilisable (`GuideLanguageBadge`) posé sur `src/data/guides.ts` → cartes des pages guides/e-books.
- Contenus en base : ajout de colonnes `*_en` (titre/description) sur les tables de modèles concernées via migration, puis remplissage par `UPDATE`; lecture conditionnelle à `i18n.language` avec repli sur le français.
- Articles pros : `blog_posts.language` existe déjà. Insertion de 5 lignes `language='en'`, `audience='pro'`, slugs suffixés `-en`, plus une colonne `translation_of` (référence vers l'article source) pour lier les deux versions. `Blog.tsx` / `BlogArticle.tsx` filtrent par langue courante, gèrent le repli et posent les balises `hreflang`. Sitemap mis à jour avec les URL anglaises.
- Vérification finale : bascule FR→EN sur chaque écran via un passage navigateur automatisé + contrôle TypeScript.

## Livraison en 3 étapes

1. Interface du tableau de bord (modules des captures, puis le reste) + badge guides
2. Contenus pré-remplis en base
3. Articles pros en anglais et bascule des pages
