# Pub Meta « Guide Wedding Planner » + Fiche Guide dans /pro

## 1. Pub Meta (nouvelle campagne lead magnet)
- Visuel carré 1080×1080 à partir de la photo éditoriale « wedding planner château » (pas d'image IA).
- Titre Playfair Display blanc : « Rejoignez la sélection des Wedding Planners de France »
- Sous-titre : « Référencez votre agence et obtenez 1 mois d'outil pro offert »
- Texte court : « Wedding planner ? Gagnez en visibilité auprès des futurs mariés de votre région. Bonus : l'appli pour coordonner vos Jour J. Inscription offerte, sans engagement. »
- Destination : /register-gratuit?type=pro (formulaire inchangé).
- Campagne séparée 5 €/jour, FR/BE/CH francophone, pixel existant, optimisation inscription, créée en pause puis activée après validation.

## 2. Encart « Ma fiche Guide » dans /pro
- Nouvelle entrée dans le menu de l'espace pro, sous « Mon espace pro ».
- Formulaire : nom de l'agence, prénom/nom, ville, téléphone, email, Instagram, site web, photo portrait, courte description.
- Bouton « Voir ma fiche publique ».
- Indicateur de complétude (ex. 4/8) + rappel discret sur l'accueil /pro tant que la fiche est incomplète.

## 3. Fonctionnement
- Au premier enregistrement, création d'une fiche annuaire liée au compte (catégorie Wedding Planner, adresse web automatique).
- Fiche « En attente de validation » : Mathilde la valide depuis l'admin avant publication sur le Guide (préserve la sélection).
- Photo stockée dans l'espace fichiers existant ; seule la pro propriétaire peut modifier sa fiche.

## Détails techniques
- `prestataires_rows` : ajout `owner_user_id` + RLS (lecture publique si visible, écriture par propriétaire) ; lien via `profiles.prestataire_id`.
- Nouveau composant ProGuideProfile + entrée ProSidebar ; FR/EN.
- Visuel généré par script (Pillow) puis upload Meta, campagne via API Meta.
