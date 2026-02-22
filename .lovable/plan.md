

# Plan : Admin des messages prestataires + Notification email

## Contexte

Les utilisateurs peuvent envoyer des messages aux prestataires via la modale "Contacter" sur `/prestataire/:slug`. Ces messages sont stockes dans la table `vendor_messages` (4 messages existants en base). Actuellement :
- Les utilisateurs voient leurs messages dans `/dashboard/messages`
- **Aucune vue admin** n'existe pour voir tous les messages
- **Aucune notification email** n'est envoyee quand un message est soumis

## Ce qui va etre fait

### 1. Creer le composant admin `VendorMessagesAdmin.tsx`

Un nouveau composant dans `src/components/admin/` qui affiche tous les messages de la table `vendor_messages` dans un tableau avec :
- Date d'envoi
- Email de l'utilisateur (recupere via une jointure ou un appel profiles)
- Nom du prestataire (deja dans `vendor_name`)
- Apercu du message (avec dialog pour voir le message complet)
- Statut lu/non lu (colonne `read_at` existante)
- Actions : marquer comme lu, supprimer

Meme structure et pattern que `VendorContactsAdmin.tsx` existant (recherche, filtres, export CSV).

### 2. Ajouter un onglet dans `/admin/prestataires`

Ajouter un 3e onglet "Messages utilisateurs" dans la page `Prestataires.tsx` qui utilise deja un systeme de Tabs avec "Gestion Prestataires" et "Demandes de Contact". Le nouvel onglet affichera le composant `VendorMessagesAdmin`.

### 3. Creer l'edge function `notify-vendor-message`

Une nouvelle edge function `supabase/functions/notify-vendor-message/index.ts` qui envoie un email a `mathilde@mariable.fr` a chaque nouveau message. Meme pattern que `notify-new-registration` :
- Utilise Resend avec le secret `RESEND` deja configure
- Email depuis `noreply@mariable.fr`
- Contenu : nom du prestataire, email de l'utilisateur, message complet, lien vers l'admin

### 4. Creer un trigger database

Un trigger sur la table `vendor_messages` qui appelle l'edge function `notify-vendor-message` a chaque INSERT, exactement comme le trigger existant `notify_new_user_registration` sur `auth.users`.

### 5. Modifier `VendorMessageModal.tsx`

Recuperer l'email de l'utilisateur connecte pour l'inclure dans le message stocke. Actuellement seul `user_id` est enregistre, ce qui rend difficile le contact depuis l'admin.

## Details techniques

| Fichier | Action |
|---|---|
| `src/components/admin/VendorMessagesAdmin.tsx` | Creer -- tableau admin des messages |
| `src/pages/admin/Prestataires.tsx` | Modifier -- ajouter 3e onglet "Messages utilisateurs" |
| `supabase/functions/notify-vendor-message/index.ts` | Creer -- notification email via Resend |
| `VendorMessageModal.tsx` | Modifier -- stocker aussi l'email utilisateur |
| Base de donnees | Ajouter colonne `user_email` + trigger INSERT |

### Schema du trigger

```text
vendor_messages INSERT
  --> trigger notify_new_vendor_message()
    --> net.http_post() vers edge function notify-vendor-message
      --> Resend API --> mathilde@mariable.fr
```

Meme mecanique que les notifications d'inscription existantes.

