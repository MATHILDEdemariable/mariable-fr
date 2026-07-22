## Modifications sur `/refontejuillet`

### 1. Bouton "Connexion / Créer compte" dans le header (hors menu déroulant)
Dans `src/components/home/editorial/EditorialHeader.tsx`, ajouter — à côté du `LanguageToggle` et avant le bouton burger — un lien visible en desktop (et mobile si l'espace le permet) :
- `Se connecter` → `/login` (icône user + label court en tracking-widest uppercase)
- Style adaptatif : blanc quand header transparent, noir sinon (comme le LanguageToggle actuel).

### 2. Priorité VIP dans le carrousel des lieux
La table `prestataires_rows` n'a pas de champ `vip`, mais a `partner` (booléen) et `featured`. Dans `src/components/home/editorial/EditorialCarousels.tsx > fetchVendors('region')` :
- Ajouter `partner` au SELECT.
- Trier côté client : `partner=true` d'abord, puis `featured=true`, puis le reste.
- Garder la limite à 12.

### 3. Modal "Créez votre compte gratuit" en beige clair
Dans `src/components/home/editorial/SelectionLockModal.tsx`, remplacer `bg-editorial-beige` par `bg-[#F8F5EF]` sur le `DialogContent` pour matcher exactement le beige clair des sections de la page.

### 4. CTA "Passer Premium — 29€" → `/paiement`
Dans `src/components/home/editorial/PricingEditorial.tsx`, changer le `<Link to="/register?premium=1">` en `<Link to="/paiement">`.

### 5. Uniformisation des boutons "Créer un compte gratuit"
Style cible (identique partout) : **fond blanc, bordure noire fine, texte noir en majuscules, tracking widest, police sans-serif, rounded-none**.

Composants à aligner sur ce style commun :
- `EspaceFusionSection.tsx` — bouton principal (actuellement fond vert sauge / texte blanc)
- `PricingEditorial.tsx` — bouton carte Gratuit (déjà noir/blanc, à harmoniser exact)
- `FinalEditorialCTA.tsx` — CTA final
- `SelectionLockModal.tsx` — bouton "Créer mon compte gratuit" (actuellement fond vert sauge)

Tous : `to="/register-gratuit"`, label via i18n existant, classes communes :
`inline-flex items-center justify-center gap-2 bg-white text-editorial-noir border border-editorial-noir hover:bg-editorial-noir hover:text-white px-8 py-4 text-xs uppercase tracking-widest rounded-none transition-colors`.

### Notes
- Aucune modification de logique métier ni de schéma.
- Traductions FR/EN inchangées (les labels existent déjà).
- Sur mobile, le bouton connexion header restera compact (icône seule si nécessaire) pour ne pas rivaliser avec le burger.