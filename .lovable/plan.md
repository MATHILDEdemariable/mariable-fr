# Module Album Photo Invités (QR code)

Un espace album créé par le couple Premium depuis le dashboard (section Après le jour-J), partagé aux invités via un lien court + QR code imprimable. Les invités déposent photos/vidéos sans compte. Le couple consulte, modère et télécharge depuis son dashboard.

## Parcours

**Côté couple (privé, `/dashboard/album`)**
- Création de l'album (titre, message d'accueil), Premium requis.
- Génération d'un lien court `mariable.fr/album/<token>` + QR code téléchargeable en PDF/PNG (le lien est aussi imprimé en clair sous le QR).
- Galerie : vignettes photos + vidéos lisibles et téléchargeables (une par une ou en lot).
- Modération : masquer/supprimer un média.
- Compteur d'usage : X / 400 médias, jours restants sur 90.
- Activer / désactiver le lien à tout moment.

**Côté invité (public, `/album/<token>`)**
- Page mobile-first : prénom + sélection de fichiers (multi).
- Upload direct navigateur → stockage, 3 fichiers en parallèle, barre de progression par fichier, bouton réessayer.
- Fichiers > 6 Mo en upload résumable (reprise après coupure 4G).
- Après envoi : liste des photos déposées (vignettes) et des vidéos (prénom + durée, sans lecteur).
- Messages clairs si album désactivé, expiré ou quota atteint.

## Règles produit

- Inclus Premium : **400 médias, 90 jours**. Packs d'extension (médias supplémentaires, prolongation +19€) prévus plus tard : le schéma prévoit déjà des colonnes de quota et de date d'expiration modifiables.
- Plafonds techniques invisibles : vidéo max 90 s et 150 Mo par fichier ; fusible global en Go anti-abus, jamais affiché à l'utilisateur.
- Vidéos non lisibles côté invité (aucun lien de lecture généré sur la page publique).

## Détails techniques

**Stockage**
- Nouveau bucket **privé** `guest-album`. Aucune lecture publique : signed URLs de lecture 1 h générées à la demande.
- Fichiers stockés **octet pour octet** : pas de compression, pas de resize, pas de conversion, pas de base64. HEIC conservé tel quel.
- Seule transformation : une vignette JPEG 400 px générée côté navigateur (canvas) et stockée **en plus** de l'original, sous `.../thumbs/`. Si le navigateur ne sait pas décoder le fichier (HEIC), la vignette est simplement absente et un placeholder s'affiche.

**Base de données (migration)**
- `guest_albums` : user_id, title, welcome_message, share_token (nanoid 10, unique), is_active, expires_at, media_limit (défaut 400), bytes_limit, created_at/updated_at.
- `guest_album_media` : album_id, uploader_name, storage_path, thumb_path, mime_type, file_size, duration_seconds, kind (photo/video), is_hidden, created_at.
- `guest_album_upload_events` : empreinte (hash IP + user agent), album_id, created_at — pour le rate limit.
- RLS : le couple accède uniquement à ses albums et médias ; **aucun accès anon** (les invités passent exclusivement par les edge functions).
- Fonction `validate_guest_album_token(token)` sur le modèle des `validate_*_share_token` existants.

**Edge functions (service_role)**
1. `album-public-info` — renvoie titre, message, état (actif / expiré / quota), et la liste des dépôts déjà faits (vignettes signées pour les photos, métadonnées seules pour les vidéos).
2. `album-request-upload` — vérifie album actif, propriétaire toujours Premium, format, taille, durée, quota médias + fusible Go, rate limit par empreinte ; renvoie une **signed upload URL** (classique ou résumable selon la taille). Aucun octet ne transite par la fonction.
3. `album-confirm-upload` — enregistre la ligne média après upload réussi.
4. `album-media-url` — signed URL de lecture 1 h, réservée au couple propriétaire (JWT vérifié en code).

**Front**
- Dépendances à ajouter : `nanoid`, `tus-js-client`.
- `src/pages/dashboard/AlbumPage.tsx` (+ entrée sidebar sous « Après le jour-J »), `src/pages/GuestAlbumPublic.tsx` (route publique `/album/:token`, sans header dashboard).
- Composants : `AlbumCreation`, `AlbumQRCard` (réutilise `qrcode` déjà installé et le pattern d'export PDF existant), `AlbumGallery`, `GuestUploader`.
- Design : ivoire / vert sauge, cohérent avec la homepage éditoriale.

## Ordre de livraison

1. Migration DB + bucket privé.
2. Edge functions + rate limit.
3. Page publique invité (upload résumable, vignettes, vidéos listées).
4. Dashboard couple (création, QR, galerie, modération, quota).
