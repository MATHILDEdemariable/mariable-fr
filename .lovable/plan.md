# Inscription : type de compte, langue, CGV en modal

## 1. Formulaire /register-gratuit

- **Langue préférée** : nouveau champ obligatoire « Dans quelle langue souhaitez-vous utiliser Mariable ? » avec deux choix, Français / English. Pré-rempli selon la langue affichée au moment de l'inscription.
- **« Je suis un professionnel »** : case à cocher ajoutée juste sous « Pourquoi vous inscrivez-vous ? ». Elle est synchronisée avec le sélecteur Particulier / Professionnel déjà présent en haut : cocher la case bascule le compte en professionnel, et inversement. Une seule information est enregistrée, pas de risque de contradiction.
- **Prix 29 € masqué pour les pros** : dès que « Professionnel » est sélectionné, le bloc « Limites de la version gratuite » avec « Passer Premium — 29 € » et le lien « Découvrir Premium — 29 € à vie » en bas du formulaire disparaissent. À la place, un bloc pro : accès professionnel Mariable, 149 €/an, avec lien vers /partenariat. Les particuliers voient exactement ce qu'ils voient aujourd'hui.

## 2. CGV en fenêtre modale

Le lien « conditions générales » sous la case à cocher ouvre désormais une fenêtre par-dessus le formulaire, avec le texte des CGV et un bouton Fermer. Plus d'ouverture dans un onglet séparé, l'inscription en cours n'est jamais perdue. Le texte affiché est celui des CGV couples pour un particulier, celui des CGV pros pour un professionnel.

## 3. Tableau admin des inscrits

Deux colonnes ajoutées au tableau /admin/users :
- **Type de compte** : badge « Particulier » ou « Professionnel ».
- **Langue** : FR ou EN.

Ces deux colonnes sont aussi ajoutées à l'export CSV, et un filtre « Particuliers / Professionnels » vient compléter les filtres existants.

## Détails techniques

- La colonne `profiles.preferred_language` (texte, contrainte `fr`/`en`, défaut `fr`) existe déjà — vérifié. Elle n'est aujourd'hui renseignée par personne.
- `handle_new_user()` insère `first_name, last_name, phone, referral_source, registration_purpose, account_type` ; migration pour y ajouter `preferred_language` depuis `raw_user_meta_data`, avec repli `'fr'`. `Register.tsx` envoie `preferred_language` dans les métadonnées de `signUp`.
- `supabase/functions/get-users/index.ts` : ajouter `preferred_language` aux deux `select` sur `profiles` (lignes 102 et 144) ; `account_type` est déjà remonté.
- `src/pages/admin/Users.tsx` : étendre l'interface `UserRegistration.profile`, ajouter les deux en-têtes/cellules, le filtre type de compte, et les colonnes dans `exportUsersToCSV` (`src/lib/csvExport.ts`).
- CGV : extraire le corps de `src/pages/CGVCouples.tsx` et de `src/pages/CGV.tsx` dans des composants de contenu réutilisables, affichés dans un `Dialog` scrollable depuis `Register.tsx`. Les routes `/cgv` et `/cgv-couples` continuent d'exister à l'identique (SEO inchangé).
- Nouvelles clés i18n FR/EN dans `auth.json` : libellé et options du champ langue, case « je suis un professionnel », bloc pro 149 €/an, titre et bouton de la modale CGV.
- Vérification : `bunx tsgo --noEmit` puis passage navigateur sur /register-gratuit (bascule particulier/pro, ouverture de la modale) en FR et EN.
