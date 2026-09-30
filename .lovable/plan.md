# Pages B2B : footer, liens croisés, indexation

## Réponses rapides
- **Pages créées** : une seule nouvelle page, `/logiciel-wedding-planner` (FR/EN), plus `/demo-pro`. Les autres (IA, tarifs, alternative Excel, métiers, /application-mariage) sont des priorités proposées, **pas encore créées**. `/pro/feuille-de-route-jour-j` existait déjà.
- **Sitemap** : la page pilier et la feuille de route y sont déjà. Rien à modifier. Après le Publish : dans Google Search Console, « Inspection de l'URL » sur `https://mariable.fr/logiciel-wedding-planner` puis « Demander l'indexation » (idem pour /partenariat).
- **Traduction EN** : la page bascule bien tout son texte selon la langue choisie (FR/EN). Je revérifierai par capture après les changements.

## Changements proposés
1. **Footer réorganisé** : nouvelle colonne « Professionnels » regroupant :
   - Logiciel wedding planner (pilier)
   - Feuille de route jour J
   - Mariable Pro & Studio (/partenariat)
   - Démo live
   - Conseils professionnels
   Retrait des doublons « Professionnels » / « Partenariat » de la colonne À propos, et des 2 liens vers /professionnelsmariable (page qui demande une connexion) : « Sélection » supprimé, « Voir toutes les régions » pointé vers /selection.
2. **/partenariat → pilier** : un CTA « Découvrir le logiciel wedding planner » dans la section Mariable Pro.
3. **Pilier → /partenariat** : le lien existe déjà (fil d'Ariane et bouton bas de page vers Studio) ; ajout d'un CTA clair « Voir l'offre Mariable Pro » dans la section prix.
4. **/pro/feuille-de-route-jour-j → pilier** : le lien actuel pointe vers un article de conseil ; ajout d'un lien direct vers la page pilier.
5. **Nouvelle page `/pro/alternative-mariages-net`** (pros, FR/EN) : H1 « L'alternative à Mariages.net pour les wedding planners », réponse courte en haut, tableau comparatif (uniquement les points déjà présents sur la page pilier, formulés en retours de pros, sans prix ni chiffres non vérifiés), ce que Mariable fait en plus (déroulé partagé, lien prestataires sans compte, IA), pour qui, FAQ, CTA « Essayer gratuitement » et lien vers la pilier.
6. **Nouvelle page `/pro/ia-organisation-mariage`** (pros, FR/EN) : H1 « L'IA pour organiser un mariage : ce qu'elle fait vraiment dans Mariable », réponse courte, cas d'usage concrets (génération du déroulé, check-list, rétroplanning, textes), limites honnêtes, FAQ, CTA essai + lien pilier.
7. Les deux pages : même style que la pilier, ajoutées au footer (colonne Professionnels), au sitemap et au pré-rendu (titre/description visibles sans JavaScript), liées depuis la pilier.


## Technique
- `Footer.tsx` + `common.json` FR/EN (nouvelle section `footer.section.pro`, clés liens).
- `Partenariat.tsx` : bouton Link vers `/logiciel-wedding-planner` + traductions.
- `LogicielWeddingPlanner.tsx` : CTA dans CONTENT fr/en.
- `ProFeuilleRouteJourJ.tsx` : ajout lien pilier.
- `prerenderHeads.ts` : ajout du lien pilier dans /pro/feuille-de-route-jour-j (déjà présent) et /demo-pro.
- Vérification Playwright FR/EN mobile.
