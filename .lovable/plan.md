# Extension B2B — V1 (version simplifiée)

## Principe retenu

Pas d'organisations, pas de liste de membres. Tout repose sur **le type de compte** :

- Particulier / Particulier premium → parcours actuel, inchangé.
- Professionnel / Professionnel premium → écran « Mes mariages » puis le même tableau de bord.
- Toute autre personne (couple, prestataire) → mode consultation existant, par lien de partage.

Le passage premium garde exactement la même logique qu'aujourd'hui, quel que soit le type de compte.

## Migration sans risque

Chaque compte existant reçoit un mariage par défaut qui **reprend son propre identifiant**. Toutes les données actuelles sont donc rattachées automatiquement, sans recalcul ni correspondance à construire : l'identifiant du compte devient l'identifiant de son mariage. Aucune donnée n'est déplacée ni supprimée, la colonne actuelle « utilisateur » reste en place partout.

## Modules concernés en V1

Budget et calculatrice de budget, checklist manuelle, suivi prestataires, RSVP / invités, planning du jour-J, plan de table, calculatrice boissons, logements, documents, liste de mariage / QR code, album invités. Design B2C conservé à l'identique.

Restent liés au compte : profil, panier / e-shop, assistant IA, guides, messages, moodboard.

## Écrans

1. **Mes mariages** (`/pro`) — liste des mariages du professionnel, bouton « Ouvrir », bouton « + Nouveau mariage ».
2. **Nouveau mariage** — formulaire léger (couple, date, lieu, nombre d'invités), ouverture immédiate après création.
3. **Bandeau de contexte** dans le tableau de bord pour un pro : mariage en cours, retour « ← Mes mariages », changement rapide.

Aucun nouveau tableau de bord, aucune route de module dupliquée.

## Limite

1 mariage gratuit pour un compte professionnel ; au-delà, un message invite à passer premium (illimité). Aucune nouvelle page de paiement n'est créée : le statut d'abonnement existant sert de référence.

## Mode consultation

Conservé tel quel. Les liens de partage existants restent valides et continuent de pointer vers les mêmes données.

## Détails techniques

Base de données (une seule migration, strictement additive) :

- Table `weddings` (`id`, `owner_id`, titre, date, lieu, invités, `is_default`), règle d'accès `owner_id = auth.uid()`.
- `profiles.account_type` (`b2c` / `b2b`) avec contrainte, rempli par `handle_new_user()` depuis le formulaire d'inscription ; rattrapage des comptes pro déjà créés.
- Mariage par défaut créé avec `id = profiles.id` pour chaque compte existant, et à chaque nouvelle inscription.
- Colonne `wedding_id` **nullable** ajoutée sur : `budgets_dashboard`, `budgets_detail`, `checklist_mariage_manuel`, `vendors_tracking`, `wedding_guest_list`, `wedding_rsvp_events`, `wedding_coordination`, `seating_plans`, `wedding_accommodations`, `wedding_documents`, `qr_codes`, `guest_albums` — backfill `wedding_id = user_id`. Les tables enfants héritent par leur parent.
- Fonction `security definer` `has_wedding_access(user, wedding)` et policy additive par table ; les policies existantes ne sont pas touchées.
- `wedding_tool_states` pour les outils dont l'état n'est pas encore persisté (calculatrice boissons, etc.).
- Index unique `budgets_detail (user_id, wedding_id, item_id)` en remplacement de l'ancien.

Front :

- `WeddingContext` exposant `currentWeddingId` : B2C → son mariage par défaut ; B2B → mariage sélectionné (persisté).
- `useWeddingScope` : utilitaire partagé qui ajoute le filtre `wedding_id` en lecture et l'injecte en écriture, module par module.
- Redirection après connexion selon `account_type` ; `/pro` pour les professionnels.

## Ordre de livraison

1. Migration base + mariage par défaut.
2. `WeddingContext` + bascule des modules du périmètre, en vérifiant à chaque étape que le parcours particulier est identique.
3. Choix Particulier / Professionnel à l'inscription et redirection.
4. Écran « Mes mariages », création, bandeau de contexte.
5. Limite gratuite et vérification de l'étanchéité entre deux mariages + contrôle du mode consultation.
