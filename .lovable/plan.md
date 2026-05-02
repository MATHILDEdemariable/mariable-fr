# 4 chantiers : nettoyage routes pros, notifications, audit stats, dashboard user

## 1. Supprimer la page `/professionnels`

- Supprimer `src/pages/Professionnels.tsx`
- Dans `src/App.tsx` : retirer la route `/professionnels` (ligne 260) et l'import
- Remplacer les liens vers `/professionnels` par `/partenariat` dans :
  - `src/components/Footer.tsx` (lien "Professionnels" du footer)
  - `src/components/admin/maintenance/AppArchitectureView.tsx` (référence cartographie)
- **Conservées** : `/accueilprofessionnels` et `/professionnelsmariable` (différentes, intentionnelles d'après mémoire projet)

## 2. Notifications email vers `mathilde@mariable.fr` pour les pros

Deux déclencheurs sur la même logique que `notify-new-registration` (qui envoie déjà un mail à chaque inscription user) :

### A. Inscription professionnelle
Dans `supabase/functions/register-professional/index.ts`, après l'insertion réussie dans `prestataires_rows`, appeler une nouvelle Edge Function `notify-new-professional` qui envoie un email Resend à mathilde@mariable.fr avec : nom, catégorie, email, téléphone, SIRET, région, site web, description.

### B. Demande de démo (lead pro)
Le formulaire `DemoRequestForm.tsx` insère directement en base via le client → ajouter un appel `supabase.functions.invoke('notify-new-payment-lead', ...)` après l'insertion réussie. Cette nouvelle Edge Function envoie le mail (nom, email, téléphone, catégorie, message).

Les deux nouvelles fonctions utilisent le secret `RESEND` déjà configuré et suivent le pattern de `notifyNewContact`.

## 3. Audit `/admin/usage-stats`

Vérifier que `supabase/functions/get-usage-stats/index.ts` reflète bien l'état réel :
- Lister les modules actuels du dashboard utilisateur (`src/data/dashboardFeatures.ts`) et croiser avec les tables interrogées dans la fonction
- Vérifier que toutes les tables clés sont présentes : budgets_dashboard, wedding_rsvp_events, checklist_mariage_manuel, coordination_planning, coordination_documents, vendor_wishlist, vendors_tracking_preprod, wedding_accommodations, seating_plans, planning_avant_jour_j, planning_apres_jour_j, moodboard, drinks
- Ajouter les modules manquants éventuels (notamment Avant/Après jour J, Moodboard, Boissons, Pense-bête) et redéployer la fonction
- Mettre à jour `src/pages/admin/UsageStats.tsx` pour afficher les nouveaux modules

## 4. Nouveau dashboard admin : analyse d'un utilisateur

Nouvelle page `src/pages/admin/UserAnalysis.tsx` accessible depuis le menu admin :

**Interface**
- Champ recherche par email (autocomplete sur les profiles)
- Sélection d'un user → fiche détaillée

**Fiche utilisateur affichée**
- Profil : nom, email, date inscription, dernière connexion, type abonnement (premium/free), date mariage, nombre invités
- État d'avancement par module avec indicateur (vide / commencé / complété) :
  - Budget (lignes saisies + montant total)
  - Checklist (% tâches cochées)
  - Coordination jour J (planning créé, nb événements)
  - Documents (nb uploadés)
  - RSVP (nb événements, nb invités, nb réponses)
  - Wishlist prestataires (nb)
  - Suivi prestataires (nb + statuts)
  - Hébergements (nb)
  - Plan de table (créé ou non)
  - Avant/Après jour J (% complétion)
  - Moodboard (nb images)
- Score global d'avancement (%)

**Implémentation technique**
- Nouvelle Edge Function `get-user-analysis` qui prend un `user_id` ou `email` et agrège toutes les données depuis les différentes tables (équivalent de `get-usage-stats` mais ciblé sur un user)
- Route `/admin/user-analysis` ajoutée dans `App.tsx`
- Lien dans `src/components/admin/AdminLayout.tsx` (ou équivalent)
- Protection par `is_admin()`

## Fichiers concernés

| Fichier | Action |
|--------|--------|
| `src/pages/Professionnels.tsx` | Supprimer |
| `src/App.tsx` | Retirer route + ajouter route admin user-analysis |
| `src/components/Footer.tsx` | Lien → /partenariat |
| `src/components/admin/maintenance/AppArchitectureView.tsx` | Lien → /partenariat |
| `supabase/functions/notify-new-professional/index.ts` | Créer |
| `supabase/functions/notify-new-payment-lead/index.ts` | Créer |
| `supabase/functions/register-professional/index.ts` | Ajouter appel notif |
| `src/components/professionnels/DemoRequestForm.tsx` | Ajouter appel notif |
| `supabase/functions/get-usage-stats/index.ts` | Compléter modules |
| `src/pages/admin/UsageStats.tsx` | Afficher nouveaux modules |
| `supabase/functions/get-user-analysis/index.ts` | Créer |
| `src/pages/admin/UserAnalysis.tsx` | Créer |
| `src/components/admin/AdminLayout.tsx` | Ajouter lien menu |
