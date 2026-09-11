# Parcours professionnel : documentation et points d'amélioration

## Ce que j'ai pu vérifier

Le test bout en bout avec un vrai compte n'est pas possible depuis l'atelier : la base est un projet Supabase externe, aucune session de test ne peut être créée ici. J'ai donc vérifié le parcours par lecture du code et par requêtes directes en base.

Constats en base (réels, vérifiés) :
- 1 249 espaces mariage existent, 2 comptes sont de type professionnel, 0 compte en « pro premium » aujourd'hui.
- Les modules rattachés à un mariage possèdent bien la colonne de rattachement : budget (tableau + détail), check-list manuelle, suivi prestataires, invités, RSVP, coordination jour-J, plan de table, hébergements, documents, QR codes, album invités, états d'outils.
- Le rattachement des données existantes est complet : seules 2 lignes anciennes (1 budget, 1 suivi prestataire) n'ont pas de mariage associé.
- La règle d'accès aux espaces mariage est stricte : seul le propriétaire y accède.

## Le parcours professionnel, étape par étape

1. **Inscription** — formulaire d'inscription gratuit, choix « Professionnel », langue préférée, conditions en fenêtre. Le type de compte et la langue sont enregistrés dans le profil.
2. **Confirmation e-mail** puis connexion.
3. **Redirection automatique** : tant qu'aucun mariage n'est ouvert, un compte professionnel est renvoyé vers son espace « Mes mariages ».
4. **Espace pro (/pro)** — trois blocs : mes mariages, mes informations (prénom, nom, société, téléphone, ville), mon offre.
5. **Création d'un mariage** — titre, date, lieu, nombre d'invités. Enregistré en base, sélection immédiate.
6. **Ouverture d'un mariage** — le professionnel arrive sur le tableau de bord habituel, avec un bandeau indiquant le mariage en cours et un retour vers la liste.
7. **Utilisation des modules** — chaque enregistrement est écrit en base avec le mariage courant ; à la lecture, le filtre du mariage est appliqué.
8. **Changement de mariage** — via le bandeau ou la liste ; le choix est mémorisé sur l'appareil.
9. **Limite gratuite** — 1 mariage ; au-delà, message renvoyant vers l'offre professionnelle à 149 €/an.

## Défauts et risques identifiés

1. **Modules encore rattachés au compte et non au mariage** : rétroplanning, check-list « 10 étapes » / to-do de planification, pense-bête, tâches générées, suivi de progression, moodboard. Pour un professionnel qui gère deux mariages, ces écrans affichent les mêmes contenus dans les deux espaces. C'est le point le plus visible.
2. **Sélection du mariage stockée uniquement sur l'appareil** : en changeant de navigateur ou en effaçant les données, le professionnel repasse par la liste. Acceptable, mais à confirmer comme choix.
3. **Aucun mariage créé automatiquement à l'inscription pro** : le premier écran est vide ; une création guidée immédiate serait plus fluide.
4. **Le statut « pro premium » n'est utilisé par personne** : la levée de la limite n'a jamais été éprouvée en conditions réelles.
5. **Pas de suppression ni d'archivage d'un mariage** : un mariage créé par erreur reste indéfiniment et consomme le quota gratuit.
6. **Aucune notion de client** : pas de nom des mariés distinct du titre, pas de coordonnées, pas de statut (en cours / passé), donc pas de tri utile au-delà de quelques mariages.
7. **Partage avec le couple non pensé côté pro** : les liens de partage existent par module, mais rien ne permet d'inviter le couple sur un espace mariage.
8. **Deux lignes anciennes sans mariage associé** (1 budget, 1 suivi prestataire) : à rattacher pour éviter un affichage incohérent.
9. **Écran d'espace pro peu informatif** : pas de date la plus proche, ni de compte à rebours, ni d'indicateur d'avancement par mariage.

## Prochain sprint : ce que je propose

**Priorité 1 — étanchéité complète entre mariages**
- Rattacher au mariage : rétroplanning, to-do de planification, pense-bête, tâches générées, suivi de progression, moodboard.
- Reprise des données existantes sur le mariage par défaut de chaque compte, sans perte.
- Rattacher les 2 lignes orphelines.

**Priorité 2 — confort de gestion**
- Archiver / supprimer un mariage (avec confirmation), quota gratuit calculé sur les mariages actifs.
- Champs client : prénoms des mariés, contact, statut ; tri par date de mariage.
- Création guidée d'un premier mariage juste après l'inscription professionnelle.

**Priorité 3 — valeur perçue**
- Vignettes de mariage enrichies : jours restants, avancement, budget engagé.
- Invitation du couple sur un espace mariage en lecture ou en contribution.
- Vérification réelle du passage en pro premium sur un compte de test.

## Détails techniques

- Rattachement : ajout d'une colonne `wedding_id` (nullable) sur `wedding_retroplanning`, `todos_planification`, `pense_bete`, `generated_tasks`, `user_progress` et la table du moodboard, backfill `wedding_id = user_id`, policy additive via `has_wedding_access`, puis passage des écrans concernés par `useWeddingScope` (`scopeQuery` / `withWedding`), comme déjà fait pour le budget et la check-list manuelle.
- Archivage : colonne `archived_at` sur `weddings`, filtrage dans `WeddingContext`, `canCreateMoreWeddings` calculé sur les actifs.
- Champs client : `partner_1`, `partner_2`, `client_email`, `status` sur `weddings` + `ModifierMariageDialog`.
- Sélection persistée : conserver `localStorage` et, si souhaité, ajouter `last_wedding_id` sur `profiles`.
- Un test authentifié complet nécessitera un compte de test sur le Supabase du projet.
