# Inscription bilingue, email pro, page partenariat

## 1. Langue à l'inscription
- Nouveau champ obligatoire sur `/register` : « Langue d'utilisation » → Français / English (valeur par défaut = langue active du site).
- Valeur enregistrée dans le compte (métadonnées) et dans le profil, pour pouvoir plus tard afficher l'appli et écrire les emails dans la bonne langue.
- Traductions FR/EN du libellé ajoutées dans les fichiers de langue.

## 2. Email de bienvenue adapté aux professionnels
- Aujourd'hui, tout nouvel inscrit reçoit le même email « Félicitations… votre mariage ».
- Nouveau modèle pro : accueil dans l'espace professionnel, rappel de l'offre Mariable Pro (référencement + accès plateforme), lien vers `/pro` et vers `/partenariat`, aucun message lié à « votre mariage ».
- À la confirmation d'email, on regarde le type de compte : particulier → email actuel, professionnel → nouvel email.

## 3. Page de confirmation d'email
- `/auth/email-confirmation` utilise un ancien en-tête ; on le remplace par l'en-tête actuel de la page d'accueil, avec le fond beige clair du reste du site.

## 4. Page /partenariat
- Bloc « Accès à la plateforme Mariable » : retirer la liste détaillée (budget, planning jour J, plan de table, checklist, carnet d'adresses) et garder une formulation courte du type « toutes les fonctionnalités de wedding planning digital ».
- Séparer visuellement les deux offres en deux blocs clairement distincts : **Référencement & visibilité** et **Accès à la plateforme**.
- Ajouter un astérisque sur « Référencement & visibilité » : « * voir les conditions d'éligibilité au référencement », qui ouvre le modal existant contenant les conditions d'admission.
- Supprimer la grande section « Les conditions d'admission pour le référencement » de la page : son contenu ne vit plus que dans le modal. Les ancres/CTA existants pointeront vers le modal.

## 5. SEO de /partenariat (intention « pro du mariage »)
État actuel : titre et description centrés sur « référencement / marketing », un seul H1, JSON-LD présent. Manque le vocabulaire réellement recherché par les pros.
Améliorations prévues :
- Titre et description retravaillés autour de « trouver des clients mariage », « visibilité et communication pour professionnels du mariage ».
- Sous-titres (H2) intégrant : trouver des clients mariage, être référencé comme prestataire mariage, communication et publicité mariage.
- Un paragraphe d'introduction réellement rédigé pour ces requêtes (pas seulement des puces).
- FAQ enrichie de 2-3 questions typiques (« Comment trouver des clients pour mon activité de mariage ? », « Combien coûte le référencement sur Mariable ? ») avec balisage FAQ pour Google.
- Liens internes depuis les pages pros existantes.

## Détails techniques
- Migration : colonne `preferred_language text default 'fr'` sur `public.profiles` (+ contrainte fr/en), écriture depuis `signUp` metadata et depuis le formulaire.
- Nouvelle edge function `send-welcome-pro-email` (Resend, même style que `send-welcome-couple-email`) ; `src/pages/auth/Callback.tsx` choisit la fonction selon `profiles.account_type`.
- `src/pages/auth/EmailConfirmation.tsx` : remplacer `Header` par `EditorialHeader`.
- `src/pages/Partenariat.tsx` + `src/i18n/locales/{fr,en}/partenariat.json` : suppression de `pro.included.plateforme.features`, restructuration des deux groupes, astérisque déclenchant `conditionsOpen`, suppression de la section `#conditions-admission`, mise à jour `seo` + FAQ JSON-LD.
- Aucune modification des parcours particuliers existants.
