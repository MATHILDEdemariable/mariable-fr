# SEO/GEO : corrections d'indexation, stratégie B2B et page pilier

## 1. Vérification du fichier 1 (constaté sur le site en ligne)

| Point | Constat | Statut |
|---|---|---|
| Site invisible sans JavaScript | Le HTML servi ne contient que le titre et la description génériques | Confirmé |
| Canonical = accueil partout | `index.html` contient `canonical https://www.mariable.fr/` servi sur toutes les pages (ex. /partenariat) ; Helmet en ajoute un second | Confirmé |
| www → mariable.fr en 302 | `curl` renvoie bien 302 | Confirmé (réglage domaine, pas code) |
| Title/description identiques | /partenariat sort « Organisez votre mariage de A à Z » | Confirmé |
| /professionnelsmariable | Protégée par connexion mais présente dans le sitemap | Confirmé |
| SoftwareApplication | Existe (Prix, fonctionnalités, SEO) sans offre Pro 149 € | Confirmé |

### Corrections
- Supprimer le canonical et `og:url` statiques de `index.html` (un seul canonical par page via Helmet, sans www).
- **Pré-rendu des en-têtes au build** : un petit script post-build génère un `index.html` par page publique (accueil, /partenariat, pages pro, conseils, régions, articles) avec son propre title, description, canonical, og:* et JSON-LD, plus un bloc texte (H1 + answer box + liens) lisible sans JS. L'hébergement sert ce fichier s'il existe : robots IA et réseaux sociaux voient enfin le bon contenu.
- Retirer /professionnelsmariable du sitemap et du lien public du menu (ou le pointer vers une page publique).
- Enrichir SoftwareApplication : offre 149 €/an, `BusinessApplication`, `operatingSystem: Web, iOS, Android (PWA)`.
- Redirection 301 : à faire par vous dans Paramètres > Domaines en définissant mariable.fr comme domaine principal (je vous guiderai).

Limite honnête : le pré-rendu couvre l'en-tête et un résumé, pas toute la page. Pour un rendu serveur complet, l'app peut passer au template récent (« / » puis « Migrate to TanStack Start »). [Ce que ça apporte](https://lovable.dev/blog/building-apps-using-tanstack-start)

## 2. Stratégie B2B (fichier 2) — priorisée

- **Maintenant** : cluster A (page pilier /logiciel-wedding-planner) + cluster B (renforcer /pro/feuille-de-route-jour-j, déjà en ligne, liée à la pilier).
- **Sprint suivant** : C /pro/ia-wedding-planner, F /pro/tarifs, E /pro/alternative-excel (concurrence quasi nulle, rapide).
- **Ensuite** : D pages métiers (lieu de réception, coordinateur, officiant), E autres alternatives, F bis /pro/alternative-mariages-net (faits datés).
- **Couples (G)** : /installer-app refondue en /application-mariage, distincte de la pilier pro pour éviter la cannibalisation.
- **Anglais (H)** : plus tard, /en/wedding-planner-software.
- Maillage : chaque page satellite pointe vers la pilier et inversement ; lien dans le header pro et le footer.

## 3. Page pilier /logiciel-wedding-planner

- Contenu du fichier 3 intégré tel quel : H1, answer box, douleurs, fonctionnalités (H3), IA, visibilité, comparatif Mariages.net (formulé en retours de pros), pour qui, deux usages, prix, alternatives Excel/Notion, FAQ, co-construction.
- Direction éditoriale Mariable (beige, vert sauge, Playfair, angles droits), mobile first, FR/EN.
- CTA « Essayer gratuitement » → `/register-gratuit?type=pro` ; « Échanger 30 min avec Mathilde » → Calendly.
- Schémas SoftwareApplication (offre), FAQPage, BreadcrumbList ; title et description du fichier ; sitemap.
- **/partenariat** : conservée (elle porte aussi Studio). Je propose de ne pas la rediriger mais de la relier fortement à la pilier et de lui donner un vrai title pro. À confirmer.
- Section témoignages : masquée tant qu'il n'y a pas de vrais retours (rien d'inventé).
- Lignes « à vérifier » du comparatif (prix Mariages.net, Instagram) : laissées de côté tant que non fournies.

## Informations à me donner (sinon je les omets)
1. Lien Calendly.
2. La visibilité (plateforme + Instagram) est-elle incluse dans les 149 €/an ?
3. Essai gratuit sans carte bancaire : confirmé ?
4. Hébergement des données (Europe ?) pour la FAQ.

## Technique
- `index.html` : retrait canonical/og:url statiques.
- Script `scripts/prerender-heads.ts` lancé après `vite build` (liste des routes + métadonnées), écrit `dist/<route>/index.html`.
- Nouvelle page `src/pages/LogicielWeddingPlanner.tsx`, route dans `App.tsx`, traductions FR/EN, ajout aux générateurs de sitemap.
- Vérification : curl du HTML construit (canonical unique, title propre), Playwright mobile/desktop, tsgo.
