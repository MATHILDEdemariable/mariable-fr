# Plan — Refonte page /guides + ajout ebook Jour J

## 1. Lien "E-books" dans le header d'accueil

`src/components/home/PremiumHeader.tsx`
- Ajouter un lien vers `/guides` dans la nav desktop de la homepage (actuellement vide), placé **avant** le bloc compte/login.
- Ajouter le même lien dans le menu mobile (Sheet).
- Clé i18n `header.nav.ebooks` = « E-books » / « E-books » (FR/EN) dans `src/i18n/locales/{fr,en}/common.json`.

## 2. Prix affiché à 4,90€

`src/data/guides.ts`
- Passer `price: 4` → `price: 4.9` sur les 7 guides (+ le nouveau, cf. §4).

Impact automatique : cartes, modal, JSON-LD Product, section SEO.

Textes à ajuster :
- `src/pages/GuidesShop.tsx` : « dès 4 € » → « dès 4,90 € » (hero + FAQ + bloc Premium « rentable dès 4 guides » recalculé → « dès 6 guides »).
- `src/pages/Prix.tsx` / `src/i18n/locales/{fr,en}/pricing.json` : occurrences éventuelles de « 4€ ».

**Point à confirmer** : le Price Stripe partagé `price_1Tqv7UKHghqBzkgj4mOMVYty` est aujourd'hui à 4,00 €. L'affichage 4,90 € ne suffit pas — Stripe encaissera toujours 4 €. Deux options :
- **(a)** vous me fournissez un nouveau `price_id` Stripe à 4,90 € → je mets à jour `SHARED_EBOOK_PRICE_ID`.
- **(b)** je change uniquement l'affichage et vous mettez le prix Stripe à jour ensuite depuis le dashboard Stripe (le même `price_id` réutilisé si vous éditez ce Price côté Stripe).

À défaut de réponse, je pars sur **(b)** (affichage + le `price_id` reste, à mettre à jour côté Stripe).

## 3. Cartes plus petites + preview sommaire au clic sur "Acheter"

`src/data/guides.ts`
- Ajouter un champ `summary: string[]` par guide, avec le sommaire que vous avez fourni (Jour-J, Débutants, Checklist Mariée, Checklist Témoins, Sélection prestataires, Do & Don't Discours, Cérémonie Laïque, Catalogue Prix 2026).

`src/pages/GuidesShop.tsx`
- **Cartes plus compactes** : remplacer le visuel plein format `aspect-[4/5]` par une carte carrée réduite (`aspect-square` ou hauteur fixe ~200px), grille passée à `sm:grid-cols-2 lg:grid-cols-4` pour densifier. Titre + prix + bouton visibles sans scroll interne.
- **Modal en 2 étapes** au clic sur « Acheter » :
  1. **Étape 1 — Aperçu** : titre du guide + prix + liste `summary` (icônes check, style éditorial), bouton « Continuer vers le paiement » (ou bouton retour).
  2. **Étape 2 — Email + Stripe** (le formulaire actuel).
- État local `modalStep: 'preview' | 'checkout'`, reset à la fermeture.

## 4. Nouvel ebook « Guide Ultime Jour-J »

**Asset PDF** (fichier fourni : `Guide_Ultime_Jour-J_Mariable.pdf`)
- Upload via `lovable-assets create --file /mnt/user-uploads/...pdf` → `src/assets/ebooks/guide-jour-j.pdf.asset.json`.

**`src/data/guides.ts`**
- Nouvelle entrée :
  - `slug: 'guide-jour-j'`
  - `title: 'Guide Ultime Jour-J'`
  - `theme: 'organisation'`
  - `price: 4.9`
  - Description courte + `summary[]` (timeline M-1 → J-J, prestataires, valises, déroulé heure/heure, check-lists).

**Edge function `supabase/functions/get-ebook-download-url/index.ts`**
- Ajouter dans `EBOOK_URLS` : `"guide-jour-j": "/__l5e/assets-v1/<uuid>/guide-jour-j.pdf"` (uuid récupéré du pointeur asset).
- Redéployer.

**`src/pages/dashboard/GuidesPage.tsx`** : rien à faire — la page itère sur `GUIDES`, le nouveau guide apparaît automatiquement pour les Premium.

**Stripe** : même `SHARED_EBOOK_PRICE_ID`, aucun changement côté `create-ebook-checkout`.

## Hors périmètre
- Pas de refonte du flow paiement/webhook.
- Pas de changement du système Premium ni de la page `/prix` (hors ajustements de wording 4€ → 4,90 €).
- Pas de nouveau bucket Storage — les PDF restent servis via CDN Lovable.

## Détail technique
- Le flux download blob (déjà en place sur `MesGuides.tsx` et `dashboard/GuidesPage.tsx`) reste inchangé.
- Le nouveau guide hérite du même mécanisme d'accès (token public post-Stripe OU session Premium).
