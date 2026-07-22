## Plan de modifications

### 1. Page `/mariage-civil` (`src/pages/MairieCivilPublic.tsx`)
- Aligner le design sur la homepage : fond `#F8F5EF` / blanc, titres en `font-serif` (Playfair), accents `wedding-olive` (sage), boutons `rounded-none` en capitales.
- Ajouter une section CTA en bas de page avec deux boutons :
  - **"Créer un compte Mariable"** → `/register-gratuit`
  - **"Explorer la sélection de lieux & professionnels"** → `/selection`
- Style boutons iso à ceux de la refonte (blanc bordure noire + olive plein).

### 2. Footer (`src/components/Footer.tsx`)
- Rediriger `footer.links.guideJourJ` et `footer.links.guideBeginner` de `/guide-jour-j` et `/guide-debutant` vers `/guides` (guides payants).

### 3. Dashboard & Seating Plan
- **Supprimer le logo/badge "BETA"** dans l'entête dashboard et dans l'éditeur de plan de table.
- Adoucir le design pour cohérence homepage : fonds `#F8F5EF` / blanc au lieu du gris froid, cartes `rounded-none`, accents `wedding-olive`, titres `font-serif`.
- **Desktop** : déplacer les boutons "Tutoriel" et "Export PDF" en haut à droite de la page seating (ils resteront empilés sur mobile).
- **Centrer le bouton "Nouvelle table"** dans l'éditeur seating.

### 4. Page `/comparatif` (`src/pages/Comparatif.tsx`)
- Reprendre la charte homepage (ivoire clair, serif, olive, rounded-none).
- Enrichir le SEO :
  - Meta title/description et H2/paragraphes intégrant : *organiser son mariage avec l'IA, wedding planning digital, wedding planner digital, organisateur mariage en ligne, outils d'organisation mariage, conseils mariage, organisation mariage pas cher, tuto mariage*.
  - Ajouter 2 sections texte SEO (avant et après le tableau) et compléter la FAQ existante avec 2-3 questions ciblant ces mots-clés.
  - Mettre à jour `<meta name="keywords">` et le JSON-LD FAQ.

### 5. Suppression pages "À propos"
- Supprimer les fichiers `src/pages/about/Charte.tsx` et `src/pages/about/Histoire.tsx`.
- Retirer les imports + routes `/about/charte` et `/about/histoire` dans `src/App.tsx`.
- Retirer les liens correspondants dans `src/components/Footer.tsx` (section "À Propos").

### 6. Page `/coordination-jour-j` (`src/pages/CoordinationJourJ.tsx`)
- Aligner sur la charte homepage (ivoire/blanc, serif, olive, `rounded-none`).
- **Supprimer le badge/logo "39€"**.
- Optimisation SEO/GEO :
  - Nouveau `<title>` + meta description centrés sur *coordination mariage, wedding planner jour j, aide témoins mariage, planning jour j mariage, exemple de planning jour j mariage, exemple de planning mariage, inspiration organisation journée mariage*.
  - Ajouter H2 et paragraphes éditoriaux intégrant ces expressions.
  - Ajouter un bloc "Exemple de planning jour J" (liste horaire type) pour matcher la requête.
  - JSON-LD `Service` + `FAQPage` avec 3-4 Q/R utilisant ces mots-clés.

### Détails techniques
- Les tokens couleur (`wedding-olive`, `--editorial-beige` = ivory `#F8F5EF`) sont déjà en place ; aucune modification de `index.css` requise.
- Tous les nouveaux CTA "Créer un compte" pointent vers `/register-gratuit` (règle établie).
- Aucune logique métier ni schéma modifié — travail frontend/présentation + suppression de 2 pages statiques.
- Après suppression des routes `/about/*`, aucune redirection ajoutée (pages jamais indexées comme piliers SEO ; les liens internes sont retirés en même temps).