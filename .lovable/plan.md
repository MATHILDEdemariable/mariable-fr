# Recentrer la page d’accueil sur l’application Jour J

## Objectif

Faire de l’application Jour J la promesse principale de Mariable, tout en conservant l’univers éditorial mariage. La nouvelle home reste inspirante grâce à la vidéo, aux photos éditoriales et aux témoignages, mais son parcours devient plus lisible : comprendre le produit, choisir Couple ou Pro, découvrir les autres outils, puis s’inscrire.

## Nouvelle structure de la home

1. **Header éditorial existant**
   - Conserver le logo, la navigation, la connexion et le sélecteur FR/EN.
   - Garder le comportement transparent sur la vidéo puis opaque au défilement.

2. **Hero vidéo — Mariable = l’application Jour J**
   - Conserver la vidéo actuelle.
   - Remplacer le contenu par la nouvelle promesse : « L’application qui simplifie vraiment le Jour J. »
   - Ajouter le texte sur le planning unique, les bonnes informations et les bonnes personnes.
   - Ajouter deux CTA de segmentation :
     - « Je suis un couple » → défilement vers le bloc Couple.
     - « Je suis wedding planner ou lieu de mariage » → défilement vers le bloc Pro.
   - Afficher « Essai gratuit · Sans carte bancaire » sans prix dans le hero.

3. **Focus produit — Un seul déroulé, toujours à jour**
   - Mettre en scène le vrai écran du planning Jour J dans un ordinateur et un téléphone, à partir des captures existantes.
   - Expliquer les besoins différents du traiteur, du DJ, des témoins, du lieu et du couple.
   - Présenter les informations centralisées : horaires, rôles, contacts, prestataires, briefs, documents, logistique et changements.
   - Montrer clairement le partage ciblé depuis le téléphone, sans laisser entendre que le filtrage se fait automatiquement sans choix du destinataire.
   - CTA « Découvrir l’appli Jour J » vers la page dédiée au module Jour J.

4. **Double entrée Couple / Pro**
   - Deux blocs distincts et équilibrés, avec photos de mariage pour préserver l’émotion.
   - Couple : un projet, une source d’information, partage avec témoins, proches et prestataires.
   - Pro : projets illimités, suivi de plusieurs mariages, collaboration clients, équipes, documents et prestataires.
   - CTA Couple « Créer mon mariage gratuitement » → `/register-gratuit`.
   - CTA Pro « Tester Mariable Pro » → `/register-gratuit?type=pro`.

5. **Mariable au-delà du Jour J**
   - Introduire les outils de préparation : rétroplanning/checklist, budget, invités/RSVP, plan de table, prestataires et outils pratiques.
   - Réutiliser les captures réelles Budget et Plan de table en visuels secondaires, avec une mise en page plus légère que le focus Jour J.
   - CTA « Découvrir toutes les fonctionnalités » vers la création de compte ou la présentation de l’application, selon le lien public existant le plus pertinent au moment de l’implémentation.

6. **Tarifs — Gratuit, Couple et Pro**
   - Remplacer le comparatif actuel à deux offres par trois niveaux clairs :
     - Gratuit pour commencer.
     - Couple : 29 € par projet, paiement unique.
     - Pro : 149 €/an, projets illimités, collaboration clients et référencement.
   - CTA « Créer mon espace gratuitement » → inscription Couple.
   - CTA « Tester Mariable Pro » → inscription Pro préremplie.
   - Aucun prix dans le hero.

7. **Guides & ressources**
   - Placer les guides avant la sélection de prestataires.
   - Mettre en avant les guides Jour J, débutant, budget et discours avec leurs visuels actuels.
   - CTA « Découvrir les guides » → `/guides`.

8. **Sélection Mariable**
   - Déplacer la sélection de lieux et prestataires après les guides.
   - La conserver comme complément éditorial, non comme porte d’entrée principale.
   - CTA « Découvrir la sélection » en gardant le parcours d’accès actuellement prévu.
   - Retirer de la home le bloc Instagram « Coups de cœur » redondant avec cette nouvelle hiérarchie.

9. **Réassurance et contenu**
   - Conserver puis adapter les témoignages couples existants, avec priorité à celui qui cite l’appli Jour J.
   - Conserver le carrousel de conseils mariage.
   - Ponctuer les sections avec les couvertures des articles « Comment organiser son mariage » et « Budget mariage 2026 », après vérification de leurs URLs réelles en base.

10. **FAQ Jour J et offres**
    - Revoir la FAQ autour de : Gratuit vs Premium, paiement unique Couple à 29 € par projet, différence Couple/Pro, collaboration couple–wedding planner, partage avec les prestataires, multi-projets, application web/mobile.
    - Conserver un balisage accessible et ajouter/mettre à jour le schéma `FAQPage` si la FAQ de la home n’en produit pas déjà un.

11. **CTA final et footer**
    - Nouveau message final centré sur un Jour J fluide et partagé.
    - CTA « Créer un compte » → `/register-gratuit`.
    - Conserver le footer actuel.

## Direction visuelle

- Conserver la DA Mariable : Playfair Display, vert sauge, beige très clair, noir éditorial et angles droits.
- Alterner blocs produit sobres et respirations photographiques pour éviter une impression de logiciel froid.
- Utiliser uniquement des photos et captures déjà disponibles ; ne générer un nouveau visuel que si les vraies captures ne permettent pas un mockup ordinateur + mobile crédible.
- Mobile first : CTA lisibles, carrousels tactiles, aucun débordement et aperçu du bloc suivant dès le premier écran.
- Respecter les préférences de mouvement réduit.

## Contenus et traduction

- Intégrer le texte français fourni en le structurant pour le web, sans changer la promesse.
- Ajouter l’équivalent anglais complet dans le namespace de traduction actuel.
- Traduire les CTA, les offres et la FAQ ; le sélecteur FR/EN doit mettre à jour toute la home.
- Mettre à jour le titre, la description SEO et les données structurées pour positionner Mariable comme application de coordination Jour J pour couples et professionnels.

## Mise en œuvre technique

- Conserver `/` sur la page `RefonteJuillet` et réordonner ses blocs plutôt que créer une seconde home.
- Modifier le hero existant et créer seulement les petits blocs spécifiques nécessaires au focus Jour J et à la double entrée.
- Réutiliser les composants Guides, Sélection, Témoignages et Blog déjà en place.
- Adapter le bloc tarifaire existant aux trois offres sans modifier les parcours de paiement hors de la home.
- Vérifier en base les deux images d’articles demandées avant de les afficher.
- Ne pas toucher aux autres pages ni refactoriser les composants qui fonctionnent sans nécessité.

## Vérifications

- Tester la home en français et en anglais, sur mobile et ordinateur.
- Vérifier les deux scrolls du hero, tous les CTA Couple/Pro, les liens Guides/Sélection/Conseils et le changement de langue.
- Vérifier le mockup Jour J, les photos, les états de chargement des contenus dynamiques et l’absence de décalage visuel.
- Contrôler la hiérarchie H1–H3, les textes alternatifs, le clavier, les contrastes, les métadonnées et la FAQ structurée.
- Lancer la validation TypeScript et contrôler les erreurs console sur le parcours public.
