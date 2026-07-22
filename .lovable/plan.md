# Refonte Juillet → Home + Header global

## 1. Route racine → RefonteJuillet

Dans `src/App.tsx` (ligne 185) :
- Remplacer `<Route path="/" element={<VersionJuin26 />} />` par `<Route path="/" element={<RefonteJuillet />} />`
- Garder `/refontejuillet` en place pour rétrocompatibilité (ou le rediriger vers `/`, à confirmer)
- Garder `/versionjuin26` accessible via son ancienne route pour référence interne

Le SEO de `RefonteJuillet.tsx` (title/description/canonical) sera ajusté pour cibler `/` au lieu de `/refontejuillet`.

## 2. Header global = EditorialHeader

Approche la plus simple (respecte "si ça marche, n'y touche pas") : **transformer `PremiumHeader` en simple ré-export de `EditorialHeader`**.

- Fichier `src/components/home/PremiumHeader.tsx` : remplacer tout son contenu par un ré-export de `EditorialHeader` (default export identique).
- Toutes les pages qui importent `PremiumHeader` (~40 pages listées : Blog, Prix, Comparatif, régionales Mariage*, Prestataires, Contact, FAQ, Login, Register, dashboards non-authentifiés, etc.) affichent automatiquement le nouveau header, sans toucher à leur code.
- Aucun changement dans les imports existants, aucun risque de casser une page.

### Points à trancher pour le header global

`EditorialHeader` est conçu pour la home avec option `transparent` (superposé à la vidéo hero). Sur les autres pages il n'y a pas de vidéo → il faut :
- Forcer le mode **opaque** par défaut (fond ivoire `#F8F5EF`, texte noir) dès qu'on n'est pas sur la home.
- Détecter la home via `useLocation()` : si `pathname === '/'` → `transparent` autorisé (comportement scroll actuel), sinon toujours opaque.
- Ajuster le padding-top du contenu des pages qui utilisaient `PremiumHeader` : `EditorialHeader` est en `position: fixed`, comme `PremiumHeader` a priori — à vérifier au premier rendu (une page test suffit).

### Menu du header

Le menu actuel de `EditorialHeader` (Nos recommandations, L'appli, Ebooks, Espace pros, Contact) devient le menu de tout le site. La navigation FR/EN et le bouton "Connexion" restent visibles partout. Le menu mobile burger (Sheet) reste en place.

## 3. Nettoyage minimal

- Ne rien supprimer de `VersionJuin26.tsx` ni de ses composants (`HeroV2`, `PainPointsSection`, etc.) — ils restent utilisables via `/versionjuin26` au cas où. À supprimer plus tard sur demande explicite.
- Le composant `Header` classique (non-Premium) utilisé sur les pages `/planning-personnalise`, `/resultats-personnalises` etc. n'est **pas** touché ici. Si tu veux qu'il devienne aussi EditorialHeader, dis-le et je l'inclus.

## Fichiers modifiés

- `src/App.tsx` — 1 ligne (route `/`)
- `src/pages/RefonteJuillet.tsx` — SEO (canonical `/`)
- `src/components/home/PremiumHeader.tsx` — remplacé par un ré-export de EditorialHeader
- `src/components/home/editorial/EditorialHeader.tsx` — logique "transparent uniquement sur `/`"

## Question ouverte

1. La route `/refontejuillet` : je la **garde active** (duplicate de `/`) ou je la **redirige** vers `/` ? Recommandation : redirection 301 côté React Router pour éviter du contenu dupliqué SEO.
2. Le `Header` standard (non-Premium) utilisé sur ~10 pages doit-il aussi être remplacé, ou seulement `PremiumHeader` ?
