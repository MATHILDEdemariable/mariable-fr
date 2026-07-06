## 4 chantiers indépendants, priorisés

### 1. Admin Instagram : upload JPG direct
**Objectif :** plus besoin d'uploader d'abord dans un bucket puis coller l'URL.

- Ajouter un input `<input type="file" accept="image/jpeg,image/png,image/webp">` dans `InstagramHighlightsAdmin.tsx` à côté du champ URL (les deux restent possibles : upload OU coller un lien).
- À l'upload : compression rapide côté client (max 1600px) → `supabase.storage.from('prestataires-photos').upload('instagram-highlights/{uuid}.jpg')` → récupération de la `publicUrl` → injection dans `form.image_url`.
- Bucket `prestataires-photos` déjà en place et public (utilisé par PhotoManager). Aucune nouvelle table/migration.
- Prévisualisation immédiate de l'image avant sauvegarde.

### 2. Sélection Instagram mise en avant
**Objectif :** meilleure exposition sans complexifier.

- **Page d'accueil :** ajouter une section « Coups de cœur Instagram » (grid 4-6 images) juste avant le CTA final ou après la reassurance bar (à confirmer selon densité). Utilise le composant existant `InstagramHighlightsGrid` avec `context='both'` limité à 6.
- **`/professionnels` :** remonter le bloc `InstagramHighlightsGrid` **avant** la carte « Explore the guide » (actuellement en dessous).
- **`/conseilsmariage` (Blog) :** remonter également au-dessus des articles, avec titre éditorial « Conseils de prestataires ».
- Aucune nouvelle rubrique ni route → on réutilise ce qui existe, on change juste l'ordre + on ajoute une section home.

### 3. Notifications PWA
**Recommandation :** ne PAS forcer via conditions d'inscription (friction + risque légal RGPD sur consentement groupé). À la place :

- **Bannière opt-in douce sur le dashboard** (`UserDashboard`) : au premier login post-registration, afficher un card discret « Active les notifications pour ne rien manquer (rappels rétroplanning, RSVP…) » avec bouton « Activer ».
- Utiliser `Notification.requestPermission()` natif du navigateur (pas besoin de FCM si on veut juste des notifs locales/rappels côté client). Si push serveur souhaité → nécessite FCM + service worker de messaging (chantier séparé plus lourd).
- Table `push_subscriptions` existe déjà → prêt pour un vrai push serveur si on veut aller plus loin.
- Bannière dismissible + rappel toutes les X sessions si pas encore activé.

**Question ouverte :** on part sur notifications locales simples (rappels dans le navigateur) ou vraies push notifications serveur (via edge function + FCM) ? La 2ème demande +2j de dev.

### 4. SEO `/guides` — long tail "guide mariage" / "checklist mariage"
**État actuel :** `GuidesShop.tsx` est une page e-shop, peu de contenu texte → faible potentiel SEO.

**Stratégie recommandée : transformer en hub éditorial + shop.**

Ajouter en haut de page (avant la grille de guides) :
- **H1 unique** : « Guide de mariage complet : checklist, rétroplanning et conseils pour organiser votre mariage »
- **Meta title (60 char)** : « Guide mariage & checklist mariage gratuite | Mariable »
- **Meta description (155 char)** : « Le guide complet pour organiser votre mariage : checklist mariage 12 mois, rétroplanning, budget, prestataires. Modèles gratuits et e-books à télécharger. »
- **Introduction éditoriale 300-400 mots** ciblant : *guide mariage, checklist mariage, checklist mariage 12 mois, guide organisation mariage, planning mariage étape par étape, retroplanning mariage gratuit*
- **Sommaire ancré (table of contents)** avec liens internes vers les guides ci-dessous → boost UX + SEO
- **6-8 sections H2** en long tail :
  - « Checklist mariage : les 12 mois avant le jour J »
  - « Guide budget mariage : combien prévoir pour 100 invités ? »
  - « Guide invités : liste, RSVP et plan de table »
  - « Choisir ses prestataires : lieu, traiteur, photographe »
  - « Rétroplanning mariage : les étapes clés mois par mois »
  - « Checklist jour J : le déroulé minute par minute »
  - « FAQ mariage » (5-6 Q/R → schema `FAQPage`)
- **JSON-LD** : `Article` + `BreadcrumbList` + `FAQPage` via `<Helmet>`
- **Maillage interne** : liens contextuels vers `/checklistmariage`, `/budget`, `/retroplanning`, `/professionnels`, blog
- **Images** avec alt descriptif long tail

**Complément :** créer 3-4 pages piliers longues (`/checklist-mariage-12-mois`, `/retroplanning-mariage`, `/budget-mariage`) qui pointent toutes vers `/guides` — vraie stratégie topic cluster. À faire en 2ème temps si tu valides le principe.

---

## Ordre d'exécution proposé

1. **Chantier 1** (upload JPG admin) — 20 min, aucune migration
2. **Chantier 2** (repositionnement Instagram) — 30 min, pur UI
3. **Chantier 4** (SEO /guides) — 1h, contenu éditorial + Helmet
4. **Chantier 3** (notifs PWA) — 45 min pour la version bannière locale

À valider avant que je bascule en build :
- **Notifs :** version simple (locale) ou complète (push serveur FCM) ?
- **SEO /guides :** je pars sur la V1 hub éditorial dans la même page, ou tu veux qu'on crée d'abord les 3 pages piliers ?
