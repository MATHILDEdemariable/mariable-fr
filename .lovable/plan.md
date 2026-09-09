# Visuel de l'appli : repartir des vraies captures, dans un écran iMac

Le carrousel actuel affiche des images recréées de toutes pièces. On repart des trois captures réelles de l'appli que vous avez fournies (Calculatrice Budget, Plan de Table, Mon Jour-J) et on les présente dans un cadre type écran iMac moderne.

## Ce qui change

- Les trois visuels du carrousel sont refaits à partir de vos captures d'écran réelles, sans redessiner ni inventer de contenu.
- Chaque capture est posée dans un cadre d'ordinateur moderne : écran fin bord à bord, léger reflet, pied central, ombre douce, fond beige clair et accents vert sauge.
- Le format reste identique (même hauteur de bloc), donc rien ne bouge dans la mise en page.
- Le défilement automatique, les pastilles cliquables, le survol qui met en pause et le balayage mobile restent tels quels.
- Les libellés restent Budget / Plan de table / Planning Jour-J.

## Ce qui ne change pas

Textes, boutons, ordre des sections de l'accueil, navigation, référencement : rien n'est touché.

## Détails techniques

- Sources : `Capture_d_écran_2026-09-09_à_09.53.09.png` (budget), `09.54.05.png` (plan de table), `09.54.19.png` (planning).
- Composition par script (PIL) : cadre iMac vectoriel dessiné autour de chaque capture redimensionnée, sortie 1600x1000 JPEG.
- Remplacement en place des pointeurs `src/assets/dashboard-budget.jpg.asset.json`, `dashboard-plan-de-table.jpg.asset.json`, `dashboard-planning.jpg.asset.json` via Lovable Assets.
- `EspaceFusionSection.tsx` : aucune modification structurelle attendue, seules les images changent.
- Vérification finale : typecheck + rendu de la section sur l'accueil.
