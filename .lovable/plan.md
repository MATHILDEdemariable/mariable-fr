# Augmenter la performance SEO & GEO de mariable.fr

## Ce que disent les données réelles (Search Console, 6 juil → 2 août 2026)

- 242 clics / 10 793 impressions, position moyenne 9,9, CTR 2,2 %.
- Le trafic vient quasi exclusivement du blog : `renouvellement-voeux-guide-complet` (135 clics), `mariage-petit-budget` (43), `anniversaire-mariage` (17), `creer-site-web-mariage` (14).
- Les pages produit/outils sont loin : `/services/budget` position 13,4, `/comparatif` position 25,4.
- Google indexe `https://www.mariable.fr/` comme canonique (cohérent avec le code) — pas de problème d'indexation sur la home.

Lecture : le site est visible mais bloqué en bas de page 1. Les gains les plus rapides sont (1) le CTR, (2) la conversion du trafic blog vers les outils, (3) la lisibilité par les IA.

## Problèmes techniques constatés dans le projet

1. **`index.html` statique quasi vide pour les crawlers** : `<title>Mariable</title>`, aucune meta description, aucun og:*. Les crawlers sociaux et une partie des crawlers IA (qui n'exécutent pas le JS) ne voient que ça. React Helmet ne les aide pas.
2. **`public/llms.txt` obsolète** : il pointe encore vers `/about/histoire` et `/about/charte`, supprimées. Il ne liste pas les articles de blog qui font tout le trafic.
3. **`public/sitemap.xml` désynchronisé** : mêmes pages supprimées encore listées, et `<lastmod>` uniformes non fiables.
4. **Schema FAQ présent sur 4 pages seulement** (`/comparatif`, `/prix`, club, sitemap HTML) alors que les articles blog gagnants contiennent des blocs FAQ non balisés.
5. **Pas de maillage interne systématique** entre les articles gagnants et les outils (budget, checklist, sélection).

## Plan d'action

### Phase 1 — Fondations techniques (rapide, impact GEO immédiat)

- Renseigner un vrai `<title>`, `<meta name="description">`, `og:*` et `twitter:card` dans `index.html` (fallback sitewide pour crawlers sans JS).
- Réécrire `public/llms.txt` : retirer les pages supprimées, ajouter une section « Articles de référence » listant les 10 articles à fort trafic avec une phrase de résumé chacun. C'est le fichier que lisent les moteurs IA.
- Régénérer `public/sitemap.xml` depuis les routes réelles + les articles publiés ; retirer les URLs mortes et les `<lastmod>` fabriqués.
- Vérifier que `robots.txt` ne bloque pas les crawlers IA (GPTBot, ClaudeBot, PerplexityBot) — actuellement `User-agent: *` les autorise, on le documente explicitement.

### Phase 2 — Données structurées (rich results + citations IA)

- Ajouter `FAQPage` sur les articles qui ont déjà une FAQ rédigée (renouvellement de vœux, mariage petit budget, mariage ou PACS, bague de fiançailles).
- Ajouter `HowTo` sur les contenus procéduraux (checklist mariage, coordination jour J, démarches administratives).
- Ajouter `Article` complet (author, datePublished, dateModified) sur tous les articles blog — aujourd'hui incomplet.
- Ajouter `SoftwareApplication` sur `/prix` et `/fonctionnalites` (l'app est un produit, pas un simple site éditorial).

### Phase 3 — Exploiter le trafic existant

- Sur les 4 articles gagnants : bloc CTA contextuel en milieu d'article vers l'outil correspondant (budget, checklist, sélection) + création de compte.
- Créer des clusters : depuis `renouvellement-voeux` (135 clics) lier vers 3–4 articles satellites (cérémonie laïque, mairie, texte de vœux) pour capter la longue traîne autour du sujet qui marche déjà.
- Réécrire les title/description des pages à position 10–25 (`/services/budget`, `/comparatif`, `/creer-site-web-mariage`) pour améliorer le CTR — c'est le levier le plus rapide à position constante.

### Phase 4 — GEO (visibilité dans les réponses IA)

- Structurer chaque article gagnant avec une réponse directe de 2–3 phrases sous le H1 (format que les IA citent).
- Ajouter des tableaux comparatifs et des chiffres sourcés : les moteurs génératifs citent préférentiellement les contenus factuels et structurés.
- Publier une page « données » (prix moyens mariage France par poste et par région) : contenu chiffré, très citable, aligné sur les requêtes commerciales.

## Limite honnête à connaître

Le site est une SPA Vite sans rendu serveur. Les métadonnées par page injectées par React Helmet sont vues par Googlebot mais **pas** par les crawlers sociaux ni par une partie des crawlers IA, qui ne lisent que le HTML statique. Pour des aperçus sociaux et un contenu par page réellement servis côté serveur, l'app peut passer en SSR via le template le plus récent de Lovable — tapez « / » dans le chat puis « Migrate to TanStack Start », ou demandez-le moi. [Ce que l'upgrade apporte](https://lovable.dev/blog/building-apps-using-tanstack-start)

## Ordre proposé

Phase 1 et 2 d'abord (techniques, sans risque sur l'existant), puis Phase 3, puis Phase 4 article par article.
