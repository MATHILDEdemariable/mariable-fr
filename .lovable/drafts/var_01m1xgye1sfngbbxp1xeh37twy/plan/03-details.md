# Ce que je propose de faire

1. Ajouter le champ « type de compte » à la fiche utilisateur (valeur par défaut : particulier), en même temps que les champs société et ville déjà préparés.
2. Faire en sorte que ce champ soit rempli automatiquement à la création du compte, à partir du choix fait sur le formulaire d'inscription.
3. Rattraper les comptes déjà créés qui avaient choisi « Professionnel » (dont le compte de test), pour qu'ils basculent bien en professionnel.
4. Revérifier ensuite : la page paramètres doit afficher « Professionnel » et la connexion doit mener à l'espace pro (« Mes mariages »).

# Important

Ces modifications de base font partie du brouillon en cours : elles ne prennent effet qu'au moment où vous acceptez ce brouillon. Tant qu'il n'est pas accepté, l'inscription professionnelle continuera d'afficher « Particulier » dans l'aperçu — ce n'est pas une erreur supplémentaire.

# Détails techniques

- `profiles.account_type text not null default 'b2c'` (contrainte `b2c`/`b2b`), ajouté de façon additive dans la migration du brouillon.
- `handle_new_user()` complété pour lire `raw_user_meta_data ->> 'account_type'` avec repli sur `b2c`.
- Backfill : mise à jour des profils dont le compte auth porte `account_type = 'b2b'`.
- Aucun changement nécessaire côté `Register.tsx`, `Login.tsx`, `WeddingContext` ni `UserProfile.tsx` : ils lisent déjà ce champ.
