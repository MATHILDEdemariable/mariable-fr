# Parcours professionnel : premium pro à 149 €/an

Un compte professionnel doit avoir son propre statut premium, son propre prix et un accès rapide à « Mes mariages ».

## 1. Statut premium professionnel (base de données)

- Nouvelle valeur possible du statut d'abonnement : `pro_premium`, à côté de `free` et `premium`.
- Un compte professionnel passé en `pro_premium` débloque exactement les mêmes fonctions illimitées qu'un particulier premium, plus le nombre illimité d'espaces mariage.
- La date d'expiration existante sert pour l'échéance annuelle (149 €/an).
- Les comptes particuliers ne changent pas.

## 2. Dans le tableau de bord d'un pro

- Les boutons « Passer Premium » affichent, pour un compte professionnel : **149 €/an (soit 12,40 €/mois)** et renvoient vers **/partenariat** au lieu de /paiement.
- Un bouton **« Mes mariages »** est ajouté dans la barre de navigation rapide en haut, juste à côté d'« Accueil », visuellement séparé du reste (séparateur vertical). Il reste aussi disponible sur mobile.
- Pour un particulier, rien ne change : 29 € et /paiement.

## 3. Administration

- Dans la page admin « Utilisateurs » : une action par ligne permet de passer un inscrit professionnel en **Pro Premium** (et de le repasser en gratuit), avec date d'échéance à un an.
- Le badge de statut affiche « Pro Premium » pour ces comptes, et un filtre permet de les isoler.

## 4. Page /partenariat

Le dernier point de la liste des frais d'adhésion est remplacé par :

- « Un accès Pro organisateur pour gérer les mariages de vos clients, **ou** 3 accès Mariable Premium à offrir à vos mariés via un code promo unique — selon que vous organisez vous-même ou souhaitez offrir l'expérience à vos couples. »

Les codes promo restent gérés manuellement pour l'instant (aucun système automatique dans cette version). Texte mis à jour en français et en anglais.

## Détails techniques

- Migration : élargir la contrainte / valeurs de `profiles.subscription_type` pour accepter `pro_premium` ; aucune donnée existante modifiée.
- `useUserProfile` / `useUserStatus` : `isPremium` devient vrai pour `premium` et `pro_premium` non expiré ; ajout d'un `isProPremium` et d'un statut d'affichage dédié.
- `DashboardLayout.tsx` : bouton « Mes mariages » (visible si `account_type = b2b`) + CTA premium conditionnel (libellé, prix, cible `/partenariat`).
- `WeddingContext` : la limite d'un seul mariage gratuit pour les pros est levée par `pro_premium`.
- `src/pages/admin/Users.tsx` : action de mise à jour de `subscription_type` et `subscription_expires_at` via Supabase, réservée aux admins.
- `src/i18n/locales/fr|en/partenariat.json` : libellé du point 8 mis à jour.
