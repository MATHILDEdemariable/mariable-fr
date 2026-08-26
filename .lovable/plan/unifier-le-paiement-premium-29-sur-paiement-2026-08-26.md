# Unifier le paiement Premium (29 €) sur /paiement

## Le problème confirmé

Sur `/paiement`, le récapitulatif affiche bien « 29 € TTC », mais le bouton « Acheter maintenant » ouvre un **Payment Link Stripe codé en dur** :
`https://buy.stripe.com/7sY00ka2m3xwcMt8Au8bS03` → c'est l'ancien produit **Jour-M à 14,90 €** (`prod_SgTseK9i0oe6v0`), d'où la fenêtre de la capture d'écran.

Second problème : ce Payment Link ne transporte **ni `userId` ni email de compte**, donc même après paiement le webhook ne peut pas fiabiliser le passage en Premium (il cherche l'utilisateur par email saisi dans Stripe).

## Tous les parcours qui mènent aujourd'hui à un paiement Premium

**A. Via la page `/paiement`** (bouton → ancien lien 14,90 €) — liens entrants depuis :
- Home éditoriale, section pricing (`PricingEditorial`)
- Home, bloc CTA (`CallToAction`)
- En-tête / barre du dashboard (`DashboardLayout`)
- Page E-shop guides (`GuidesShop`, 2 emplacements)
- Page SEO album photo (`AlbumPhotoPartage`, 2 emplacements)
- Page d'inscription (`Register`)

**B. Via l'edge function `create-checkout-session`** (Stripe Checkout 29 €, `price_1SyYn8KHghqBzkgj249P8325`) — déclenchée par :
- `StripeButton` (utilisé dans `PremiumModal`, `PaymentModal`, `UserProfile` du dashboard)
- `PremiumModal` affiché par tous les verrous Premium (`usePremiumAction`) : rétroplanning, suivi prestataires, documents, moodboard, exports PDF, seating plan, etc.
- Page `/prix` (`Prix.tsx`), `PricingContent` du dashboard, `HeroStats` (dashboard gaming)

**C. Parcours résiduels obsolètes**
- `PaymentModal` (via `FormulaCTAButton`) annonce encore « Abonnement Premium – 9,9 €/mois » : tarif faux, plus utilisé dans l'offre actuelle.
- `create-ebook-checkout` : achat d'un guide à l'unité — parcours distinct, à conserver tel quel.

## Ce que je propose de corriger

1. **`/paiement` devient l'unique page de paiement Premium.**
   Remplacer le lien `buy.stripe.com` en dur par un appel à `create-checkout-session` (Stripe Checkout, produit `prod_TwRgLqCqV0pMdh`, 29 €), avec `metadata.userId` + email du compte connecté. Si l'utilisateur n'est pas connecté, on l'envoie d'abord sur `/register-gratuit?redirect=paiement`.
2. **Supprimer définitivement l'ancien lien 14,90 €** du code (`Paiement.tsx`). Côté Stripe, il faudra aussi désactiver le Payment Link de `prod_SgTseK9i0oe6v0` depuis le dashboard Stripe (je ne peux pas le faire à ta place).
3. **Aligner l'edge function** `create-checkout-session` sur le prix actif de `prod_TwRgLqCqV0pMdh` (à confirmer : l'ID de prix actuel `price_1SyYn8KHghqBzkgj249P8325` correspond-il bien à ce produit ?).
4. **Centraliser tous les autres parcours** : `StripeButton`, `PremiumModal`, `PricingContent`, `Prix`, `HeroStats` redirigent vers `/paiement` au lieu de créer leur propre session. Un seul point d'entrée = un seul tarif possible.
5. **Nettoyer** `PaymentModal` (9,9 €/mois) et son usage dans `FormulaCTAButton` pour supprimer le tarif fantôme.
6. **Fiabiliser le passage en Premium** : conserver le double filet actuel (webhook `stripe-webhook` + `update-premium-status` au retour sur `/dashboard?payment=success`), en s'appuyant sur `metadata.userId` plutôt que sur l'email saisi dans Stripe.

## Détails techniques

- `Paiement.tsx` : suppression du `window.open(...)`, ajout d'un handler `supabase.functions.invoke('create-checkout-session')` avec état de chargement et toast d'erreur.
- `create-checkout-session/index.ts` : `metadata: { userId, userEmail }` déjà présent ; ajouter `client_reference_id: user.id`.
- `stripe-webhook` / `update-premium-status` : lookup prioritaire par `metadata.userId`, fallback email.
- Aucun changement de schéma de base de données.

## Question à trancher avant implémentation

Le `price_id` exact du produit `prod_TwRgLqCqV0pMdh` (29 €) — si `price_1SyYn8KHghqBzkgj249P8325` n'est pas le bon, il me le faut pour brancher le checkout.
