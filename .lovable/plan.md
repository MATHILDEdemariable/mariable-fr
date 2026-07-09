## Diagnostic

Le blocage ne vient pas d’un simple re-load : la chaîne actuelle est fragile à deux endroits.

1. **Edge function `get-ebook-download-url` cassée**
   - Le fichier contient du code dupliqué/orphelin après le `return` final (`status: 200...` répété).
   - Ce type d’erreur peut empêcher le déploiement ou faire tourner une ancienne version.

2. **Accès PDF trop dépendant d’URLs externes**
   - Le dashboard et `/mes-guides/:token` appellent l’edge function, puis ouvrent une URL PDF externe.
   - Si le navigateur bloque l’URL, ou si l’edge function renvoie une ancienne URL Supabase/signée, l’utilisateur voit encore une erreur.

3. **Bucket `ebooks` non fiable actuellement**
   - Les objets existent, mais les tailles remontées côté Supabase Storage sont ~2,6 KB, alors que les vrais PDF font ~1,5 MB.
   - Donc je ne vais pas baser le correctif principal sur ce bucket tant que les fichiers ne sont pas ré-uploadés proprement.

4. **Logique attendue confirmée**
   - `/dashboard/guides` : accès uniquement si utilisateur connecté + premium.
   - `/guides` : utilisateur non premium, connecté ou non, passe par Stripe.
   - Après paiement Stripe : accès via lien personnel `/mes-guides/:token`.

## Plan de correction minimal

### 1. Réparer `get-ebook-download-url`
- Supprimer le code dupliqué invalide.
- Garder deux modes d’accès :
  - **token achat Stripe** pour `/mes-guides/:token` ;
  - **session utilisateur premium** pour `/dashboard/guides`.
- Retourner une erreur claire si : non premium, token invalide, guide inconnu.

### 2. Ne plus ouvrir le PDF avec `window.open(..., '_blank')`
- Remplacer sur :
  - `src/pages/dashboard/GuidesPage.tsx`
  - `src/pages/MesGuides.tsx`
- Utiliser la logique native d’export PDF déjà attendue :
  - récupérer l’URL via l’edge function ;
  - `fetch(url)` ;
  - créer un `Blob` PDF ;
  - déclencher un téléchargement dans le même onglet via un lien temporaire `download`.

### 3. Sécuriser la compatibilité prod
- Les URLs PDF retournées par l’edge function doivent utiliser les assets Lovable CDN déjà accessibles en production.
- Je garderai les URLs absolues fonctionnelles, mais je vérifierai qu’elles ne pointent plus vers Supabase signed URLs.

### 4. Vérifier les deux parcours
- Tester l’edge function :
  - avec token achat invalide → refus attendu ;
  - avec token achat existant → URL PDF attendue ;
  - sans token et sans session premium → refus attendu.
- Vérifier que le PDF public CDN est bien accessible.
- Contrôler que les deux composants frontend utilisent bien le téléchargement Blob même onglet.

## Hors scope volontaire

- Je ne ré-upload pas les PDF dans le bucket `ebooks` pour ce correctif, car le chemin le plus simple et robuste est d’utiliser les PDF Lovable CDN déjà accessibles.
- Je ne change pas la logique Stripe ni les prix.
- Je ne modifie pas le statut premium ni les règles business existantes.