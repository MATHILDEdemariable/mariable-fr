# Extension B2B — V1

## Ce que l'audit a montré

Aujourd'hui, il n'existe pas d'entité « mariage » indépendante : chaque module range ses données directement sous l'identifiant du compte (budget, checklist, prestataires, invités, plan de table, documents, jour-J...). Un compte = un mariage, implicitement.

Pour qu'un professionnel gère plusieurs mariages sans mélange, il faut donc créer cette entité « mariage » et y rattacher les modules concernés — sans rien changer pour les particuliers, qui auront automatiquement un mariage unique créé à partir de leurs données actuelles.

## Parcours cibles

Particulier : connexion → son tableau de bord (inchangé).

Professionnel : connexion → « Mes mariages » → ouverture d'un mariage → exactement le même tableau de bord, mais dans le contexte du mariage choisi, avec un retour permanent vers la liste.

## Périmètre des modules (V1)

Deviennent multi-mariages, avec le design B2C actuel conservé :
budget et calculatrice de budget, checklist manuelle, suivi prestataires, RSVP / invités, planning du jour-J, plan de table, calculatrice boissons, gestion des logements, documents, liste de mariage / QR code, album invités.

Restent liés au compte (hors périmètre V1) : profil, panier / e-shop, assistant IA, guides, messages, moodboard.

## Type de compte et accès

- À l'inscription, l'utilisateur choisit « Particulier » ou « Professionnel ».
- Le type est stocké sur le profil ; le parcours après connexion en découle.
- Professionnel : 1 mariage gratuit, puis mariages supplémentaires réservés aux comptes pro payants (illimité). En V1, aucune page de paiement pro n'est créée : la limite s'appuie sur le statut d'abonnement existant et affiche un message d'invitation à passer pro au-delà du premier mariage.

## Écrans à créer

1. **Mes mariages** (`/pro`) — liste des mariages du professionnel (couple, date, lieu), bouton « Ouvrir », bouton « + Nouveau mariage ».
2. **Nouveau mariage** — formulaire léger réutilisant les champs existants (titre / couple, date, lieu, nombre d'invités). À la création, le mariage est ouvert directement.
3. **Bandeau de contexte** dans le tableau de bord pour un pro : nom du mariage en cours + lien « ← Mes mariages » + changement rapide de mariage.

Aucun nouveau tableau de bord, aucune nouvelle route de module : les routes existantes sont réutilisées telles quelles.

## Mode consultation

Le système de partage par lien existant est conservé tel quel, sans nouveau mécanisme. Les jetons resteront valides ; ils pointeront simplement vers le mariage concerné. L'extension du partage à d'autres modules reste possible plus tard, mais n'est pas faite ici.

## Détails techniques

**Base de données**

- Nouvelle table `weddings` (organisation propriétaire, titre, date, lieu, nombre d'invités, créateur) et table `wedding_members` (utilisateur, mariage, rôle) pour préparer le multi-utilisateurs sans l'exposer en V1.
- Nouvelle table `organizations` + `organization_members` ; un compte pro crée son organisation à la première utilisation.
- `profiles` : ajout de `account_type` (`b2c` / `b2b`).
- Ajout d'une colonne `wedding_id` **nullable** sur les tables du périmètre : `budgets_dashboard`, `budgets_detail`, `checklist_mariage_manuel`, `vendors_tracking`, `wedding_guest_list`, `wedding_rsvp_events`, `wedding_coordination`, `seating_plans`, `wedding_accommodations`, `wedding_documents`, `qr_codes`, `guest_albums`. Les tables enfants (`coordination_planning`, `coordination_team`, `wedding_rsvp_sub_events`, `seating_tables`, etc.) héritent du contexte par leur parent — aucune modification.
- Migration de données : pour chaque utilisateur existant, création d'un mariage « par défaut » et affectation de toutes ses lignes existantes. Aucune suppression, la colonne `user_id` est conservée telle quelle.
- Sécurité : fonction `security definer` `has_wedding_access(user_id, wedding_id)` ; les règles d'accès actuelles sont complétées par « ou membre du mariage », jamais remplacées, pour garantir zéro régression B2C.

**Front**

- `WeddingContext` (nouveau) exposant `currentWeddingId`, résolu ainsi : B2C → mariage par défaut de l'utilisateur ; B2B → mariage sélectionné (persisté dans l'URL/`localStorage`).
- Les hooks de données du périmètre filtrent sur `wedding_id` fourni par le contexte au lieu de `user_id` seul, et l'écrivent à l'insertion. Un utilitaire partagé évite de dupliquer cette logique hook par hook.
- `ProtectedRoute` / redirection après connexion : un compte pro sans mariage sélectionné atterrit sur `/pro`.
- Aucune refonte visuelle : les composants, layouts et styles existants sont réutilisés à l'identique.

## Ordre de livraison

1. Tables `organizations` / `weddings` / `wedding_members`, `account_type`, fonction d'accès, migration des données existantes.
2. `WeddingContext` + bascule des hooks du périmètre sur `wedding_id` (B2C d'abord, comportement identique vérifié).
3. Choix Particulier / Professionnel à l'inscription.
4. Écran « Mes mariages », création de mariage, bandeau de contexte et retour à la liste.
5. Limite 1 mariage gratuit, vérification qu'aucune donnée ne fuit entre deux mariages, contrôle du mode consultation.

## Points de vigilance

- La bascule des hooks est l'étape sensible : elle sera faite module par module, avec vérification que le parcours particulier reste identique avant de passer au suivant.
- La calculatrice de boissons et certains calculs stockent des données localement : ils seront rattachés au mariage seulement s'ils persistent en base ; sinon ils restent tels quels.
