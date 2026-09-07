## Détails techniques

### Base de données (migration additive, appliquée à l'acceptation du brouillon)

- `organizations` + `organization_members` : un compte pro crée son organisation à la première utilisation.
- `weddings` (organisation, titre, date, lieu, nombre d'invités, créateur) et `wedding_members` (utilisateur, mariage, rôle) — multi-utilisateurs préparé mais non exposé en V1.
- `profiles` : ajout de `account_type` (`b2c` / `b2b`), défaut `b2c`.
- Colonne `wedding_id` **nullable** ajoutée sur : `budgets_dashboard`, `budgets_detail`, `checklist_mariage_manuel`, `vendors_tracking`, `wedding_guest_list`, `wedding_rsvp_events`, `wedding_coordination`, `seating_plans`, `wedding_accommodations`, `wedding_documents`, `qr_codes`, `guest_albums`. Toutes ces tables possèdent déjà `user_id`, conservé tel quel. Les tables enfants (`coordination_planning`, `coordination_team`, `wedding_rsvp_sub_events`, `seating_tables`…) héritent par leur parent, aucune modification.
- Nouvelles tables de persistance pour les outils aujourd'hui locaux (résultats boissons / budget / planning), avec `user_id` + `wedding_id`.
- `GRANT` explicites sur chaque nouvelle table (`authenticated`, `service_role`), puis RLS et policies.
- Fonction `security definer` `has_wedding_access(_user_id, _wedding_id)`. Les policies existantes sont **complétées** par « ou membre du mariage », jamais remplacées.
- Migration de données : pour chaque utilisateur existant, création d'un mariage par défaut et affectation de ses lignes. Aucune suppression.

### Front

- `WeddingContext` exposant `currentWeddingId` : B2C → mariage par défaut ; B2B → mariage sélectionné, persisté dans l'URL et `localStorage`.
- Un utilitaire partagé applique le filtre `wedding_id` et l'écrit à l'insertion, pour éviter de dupliquer la logique dans chaque hook.
- `ProtectedRoute` / redirection après connexion : compte pro sans mariage sélectionné → `/pro`.

### Ordre de livraison

1. Tables, `account_type`, fonction d'accès, migration des données.
2. `WeddingContext` + bascule des hooks module par module (B2C d'abord, comportement identique vérifié à chaque étape).
3. Choix Particulier / Professionnel à l'inscription.
4. « Mes mariages », création, bandeau de contexte.
5. Limite 1 mariage gratuit, vérification d'étanchéité entre mariages, contrôle du mode consultation.

### Point d'attention

Les changements de base ne prennent effet qu'à l'acceptation de ce brouillon : les écrans qui dépendent des nouvelles tables ne peuvent pas être vérifiés avant.
