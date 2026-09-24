# Home, /partenariat et retour depuis la page Jour-J pro

## 1. Home
- **Titre du hero** : la version anglaise devient une traduction fidèle du français, « Celebrate love. Simplify the wedding day. ». Le titre tient sur 2 lignes sur ordinateur et sur mobile (taille et largeur ajustées).
- **Section « Pour votre mariage ou ceux de vos clients »** : la photo actuelle est remplacée par l'image 1 (le couple qui marche dans le jardin).
- **Boutons de cette section** : fond vert sauge et texte clair, au lieu du simple contour.
- **Section « Célébrer l'amour »** : la photo est remplacée par l'image 2 (le dîner sous l'arbre devant le château).

## 2. Page /partenariat : style éditorial de la home, même contenu
- Les sections alternent les fonds beige clair, vert sauge et blanc, comme sur la home, avec des bords droits et de l'espace.
- Des photos rythment la page : les deux nouvelles images et des photos déjà utilisées sur le site, placées en colonne ou en bandeau à côté des blocs Pro et Studio.
- **Nouvel ordre** : la section « La transparence qui vous fait gagner du temps » passe juste après « Mariable Pro — ce que comprend vos frais d'adhésion ».
- **Hero** : les prix n'y apparaissent plus. Il présente simplement les deux options :
  - **Mariable Pro** : d'abord l'appli Jour-J (avec plusieurs mariages), ensuite le référencement auprès des couples ;
  - **Mariable Studio** : la communication sur les réseaux sociaux.
  Les prix restent affichés plus bas, dans les sections détaillées.
- Aucun autre texte n'est modifié. Les versions FR et EN suivent les mêmes changements.

## 3. Page /pro/feuille-de-route-jour-j
- Un lien « ← Retour à Mariable Pro » vers /partenariat est ajouté en haut, sous le menu.

## Détails techniques
- Les images sont envoyées vers Lovable Assets (`src/assets/home/*.asset.json`). `JourJHomeSections.tsx` utilise une constante par section au lieu de `EDITORIAL_WEDDING_IMAGE`.
- `hero.title` EN est modifié dans `refonteJuillet.json`. Dans `HeroEditorial.tsx`, la taille du titre est réduite (`max-w` + `text-balance`) pour tenir sur 2 lignes.
- Dans `Partenariat.tsx` : on change les fonds, on ajoute des blocs image et on déplace le JSX de la section « central » après `#mariable-pro`. Les prix sont retirés des cartes du hero, sans supprimer les clés de traduction.
- Vérifications : tsgo, puis Playwright sur ordinateur et mobile, en FR et en EN.
