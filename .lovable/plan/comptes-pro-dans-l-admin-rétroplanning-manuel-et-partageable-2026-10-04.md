# Comptes pro dans l'admin + Rétroplanning manuel et partageable

## 1. Comptes professionnels invisibles dans /admin/users

**Constat vérifié** : l'inscription fonctionne. testmariable2@yopmail.com est bien enregistré « professionnel » en base (3 comptes pro au total). Le problème est dans l'affichage admin : il y a 1 263 comptes, et la récupération des fiches se fait en une seule requête plafonnée à 1 000 lignes. Les comptes les plus récents (dont les pros) arrivent donc sans fiche et sont affichés comme « particulier ».

Correction :
- Récupérer les fiches par paquets (toutes les 1 263) au lieu d'une seule requête.
- Ajouter une carte « Professionnels » dans le tableau récapitulatif (à côté de Total, Premium, Expirés, Nouveaux 7j), cliquable pour filtrer la liste sur les pros.
- Vérification : testmariable2 apparaît en « Professionnel » dans la liste et dans le compteur.

## 2. Rétroplanning : onglets « IA » et « Manuel »

Sur /dashboard/mon-mariage/retroplanning, deux onglets en haut, sur le modèle de la Check-list :
- **Avec l'IA** : le fonctionnement actuel, inchangé.
- **Manuel** : création de son propre rétroplanning, étape par étape — titre, date ou période (ex. « J-6 mois »), catégorie, statut (à faire / en cours / terminé), note. Vues Liste et Calendrier, ajout / modification / suppression, rattaché au mariage sélectionné (utile pour les pros multi-mariages). FR/EN.

## 3. Partage par lien sans compte

Bouton « Partager » sur les deux onglets (IA et manuel), comme pour le planning Jour J :
- Génère un lien du type `mariable.fr/retroplanning-public/<code>`, à copier ou désactiver.
- La personne qui ouvre le lien voit le rétroplanning en lecture seule (étapes, dates, statut), sans pouvoir modifier, sans se connecter. Page non indexée par Google.

## Détails techniques

- `supabase/functions/get-users` : remplacer `.in('id', userIds)` unique par une boucle paginée `.range()` sur `profiles` ; `src/pages/admin/Users.tsx` : carte compteur b2b + clic → `setAccountTypeFilter('b2b')`.
- Manuel : réutiliser `wedding_retroplanning` avec une nouvelle colonne `mode text default 'ai'` ('ai' | 'manual') ; étapes manuelles stockées dans `timeline_data` (même format que l'IA pour un rendu partagé unique). Composant `RetroplanningManuel` inline dans la page embed.
- Partage : table `retroplanning_share_tokens` (retroplanning_id, token, is_active, created_by) avec GRANT + RLS propriétaire ; fonction `get_public_retroplanning(token)` SECURITY DEFINER renvoyant uniquement titre/date/timeline ; route publique `/retroplanning-public/:token` (noindex), bouton calqué sur `PlanningShareButton`.
