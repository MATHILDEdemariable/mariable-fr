## Contenu de l'espace pro

1. En-tête : « Espace professionnel » + badge « Compte pro », et le nom de la société une fois renseigné.
2. Bloc « Mes informations » : nom, prénom, société, téléphone, ville. Un bandeau invite à compléter tant que c'est vide.
3. Bloc « Mes mariages » : cartes projet (couple, date, lieu, invités) + « Ouvrir ». Bouton « Créer un mariage » en haut.
4. Bloc « Mon offre » : rappel de l'offre Compte Pro (multi-mariages) au lieu de l'offre Premium 29 € des particuliers.

Dans le tableau de bord d'un projet, le bandeau de contexte existant reste : nom du mariage, changement rapide, retour « Mes mariages ».

Dans les paramètres, une ligne « Type de compte : Professionnel » visible en haut, sans ambiguïté, et l'offre affichée est l'offre pro.

## Points techniques

- Route `/pro` : refonte de `MesMariages.tsx` en espace pro, réutilisant `DashboardLayout` (mêmes styles et sidebar) plutôt qu'une mise en page à part ; `ProDashboardMockup` supprimé du routage.
- Redirection à la connexion : `ProtectedRoute` envoie déjà un compte `b2b` sans mariage sélectionné vers `/pro` ; on étend pour que l'arrivée après connexion d'un `b2b` soit toujours `/pro` (le choix du projet reste explicite).
- Barre de gauche : quand aucun mariage n'est ouvert (contexte pro), les entrées de modules sont masquées au profit des entrées pro (Mes mariages, Mes informations, Mon offre, Paramètres).
- Informations pro : champs déjà présents sur `profiles` réutilisés autant que possible ; tout champ manquant est ajouté en colonne additive dans la migration brouillon B2B déjà en attente (elle s'applique à l'acceptation du brouillon).
- Badge compte pro : lu depuis `accountType` de `WeddingContext`, affiché dans `UserProfile` et dans l'espace pro.
- Offre pro : `PremiumBadge`/blocs Premium conditionnés par `accountType`, avec renvoi vers la page d'offre pro existante (`/partenariat`, Mariable Pro 149 €/an) tant qu'aucun tunnel de paiement pro n'existe.
- Création de mariage : `NouveauMariageDialog` conservé, avec ajout du nom du couple et ouverture directe du projet.
- Aucune nouvelle route de module, aucune modification du fonctionnement des modules.

Les tables `weddings` / `wedding_members` / `account_type` viennent du brouillon de base de données déjà préparé : l'espace pro ne devient réellement fonctionnel qu'une fois ce brouillon accepté.
