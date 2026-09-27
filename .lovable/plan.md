# Prix promo, toggle mobile, FAQ, inscription, contact, guides

## 1. /partenariat — prix barrés
- Offre Pro : prix barré « 200 € » à côté de « 149 €/an » + petite mention « Offre de lancement » (FR/EN).
- Prix couple 29 € (là où il apparaît sur /partenariat et dans le bloc tarifs de la home) : prix barré « 59 € ».

## 2. Home
- Mobile : afficher le toggle FR | EN directement dans l'en-tête, à côté du lien Instagram, sans ouvrir le menu.
- FAQ « Mariable est-il une application mobile ? » : oui, mais pas sur Google Play / App Store — c'est normal, elle s'utilise sans téléchargement ; installation ultra simple depuis le lien web (renvoi vers « Comment installer Mariable ? »). FR + EN.
- Resynchroniser toute la version anglaise de la home sur les derniers textes français modifiés à la main.

## 3. /register-gratuit
- Traduire le choix de profil : « Couple / J'organise mon mariage » et « Professionnel / J'organise pour des couples » ; EN « Couple / I'm planning my wedding », « Professional / I plan weddings for couples ». Traduire aussi « Je suis ».

## 4. /contact (refonte du contenu, FR + EN)
- Histoire : Mariable est née d'une envie de jeune mariée, et s'adresse aujourd'hui aussi aux pros grâce à l'expertise de Mathilde en IA.
- Wedding app développée à 80 % grâce à l'IA.
- Projet de cœur, pas l'activité principale : Mathilde est consultante Growth & IA — lien LinkedIn (https://www.linkedin.com/in/lambertmathilde/).
- Bloc chiffres/prix supprimé, remplacé par une frise « Parcours en 3 temps » inspirée de l'image jointe, aux couleurs Mariable (vert sauge, beige) :
  - 2019 — Diplôme école de commerce IESEG (Master International Business, spécialisation finance)
  - +6 ans — Finance d'entreprise (Business Analyst & Controller — Pernod Ricard, Sandro, L'Oréal)
  - +2 ans — Entrepreneuriat & IA (Solo founder mariable.fr, autodidacte IA & no-code, certification Growth Marketing) puis consultante Growth & IA
- Mission : non plus « faciliter » mais « sublimer » le Jour J.
- Formulaire et toute la page traduits pour que le toggle fonctionne.

## 5. /guides
- En anglais : message visible « Guides are available in French only for now » (renforcer le message existant en bandeau bien visible).

## Technique
- Fichiers : Partenariat.tsx + partenariat.json, JourJHomeSections / pricing home, EditorialHeader.tsx (toggle mobile), HomeJourJFAQ + refonteJuillet.json (fr/en), Register.tsx + auth.json, NousContacter.tsx + nouveau namespace contact.json (fr/en) déclaré dans src/i18n/index.ts, GuidesPage / GuideShop.
- Vérification Playwright FR/EN mobile et desktop.
