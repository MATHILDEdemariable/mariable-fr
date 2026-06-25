
# Plan : PWA Mariable + Notifications Push

## 1. Corrections du manifest existant

Mettre à jour `public/manifest.json` :
- Aligner `theme_color` sur **#7F9474** (sage, identique à `index.html`)
- Ajouter icônes **192x192**, **512x512** et une **maskable 512x512** (générées à partir du logo Mariable)
- Conserver `display: standalone`, `start_url: /`, `lang: fr`
- Ajouter `scope: /` et un `id` stable (évite les conflits d'install)

Ajouter dans `index.html` :
- `<link rel="apple-touch-icon" sizes="180x180" …>` dédié (pas le logo brut)
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="default">`

Aucun `vite-plugin-pwa`, aucun service worker app-shell (pas d'offline demandé → règle Lovable).

## 2. Service Worker dédié aux notifications

Créer **`public/push-sw.js`** (worker minimal, uniquement push — pas de cache app shell, donc safe en preview Lovable) :
- `push` → `self.registration.showNotification(title, { body, icon, badge, data: { url } })`
- `notificationclick` → ouvre/focus l'onglet sur `data.url`

Enregistré uniquement en production (guard hostname Lovable preview), depuis un wrapper React.

## 3. Backend : VAPID + Supabase

**Nouvelle table** `push_subscriptions` :
- `user_id` (FK profiles), `endpoint` (unique), `p256dh`, `auth`, `user_agent`, `created_at`
- RLS : user gère uniquement ses propres subscriptions ; `service_role` lit tout
- GRANTs explicites (anon: aucun, authenticated: SELECT/INSERT/DELETE, service_role: ALL)

**Secrets à générer** (via `generate_secret` côté serveur, clés VAPID générées localement et set_secret) :
- `VAPID_PUBLIC_KEY` (exposée au front via edge function ou en clair, c'est publique)
- `VAPID_PRIVATE_KEY` (secret)
- `VAPID_SUBJECT` = `mailto:contact@mariable.fr`

**3 Edge Functions** :
- `push-subscribe` : enregistre la subscription d'un user authentifié
- `push-unsubscribe` : supprime
- `push-send` : envoie une notif (utilise `npm:web-push`) — appelée par triggers DB ou cron pour les 3 cas d'usage

## 4. UI front

- **Hook `usePushNotifications`** : check support, demande permission, enregistre subscription, appelle `push-subscribe`
- **Composant `PushNotificationToggle`** : switch dans Dashboard → Paramètres ("Activer les notifications mobiles")
- **Bannière d'incitation** : afficher uniquement si PWA installée + permission `default`, pour expliquer le bénéfice avant le prompt navigateur (best practice iOS/Android)

## 5. Triggers métier (les 3 cas d'usage)

- **Rappels J-X** : cron Supabase (pg_cron) quotidien → scanne `wedding_coordination.wedding_date` et `todos_planification.due_date` → appelle `push-send`
- **Transactionnel** (devis confirmé, paiement, RSVP) : trigger DB existant ou direct depuis le code → `push-send`
- **Marketing** (nouveau blog post, promo Premium) : trigger sur `blog_posts` insert (status=published) + bouton admin pour campagnes ponctuelles

## Détails techniques

```text
Frontend
  └── usePushNotifications() ──► navigator.serviceWorker.register('/push-sw.js')
                              └► PushManager.subscribe({ applicationServerKey: VAPID_PUBLIC })
                              └► invoke('push-subscribe', { subscription })

Backend (Supabase)
  └── Table push_subscriptions (RLS user-scoped)
  └── Edge function push-send (web-push + VAPID)
       ├── Appelée par pg_cron (rappels J-X)
       ├── Appelée par triggers métier (transactionnel)
       └── Appelée par admin UI (marketing)
```

## Limitations importantes à connaître

- **iOS** : les push web ne fonctionnent que si l'utilisateur a **installé la PWA** sur son écran d'accueil (iOS 16.4+). Sur iPhone non installé → impossible. Il faudra communiquer cette étape dans l'UX.
- **Android/Desktop** : fonctionne sans installation, juste avec la permission navigateur.
- **Preview Lovable** : le service worker n'est PAS enregistré en preview (règle de sécurité). Test uniquement sur `mariable.fr` publié.

## Hors scope (à confirmer si besoin)

- Pas d'offline / cache app shell (non demandé)
- Pas de centre de notifications in-app (les notifs vivent côté OS)
- Pas de segmentation marketing avancée (envoi simple all-users ou par filtre SQL)
