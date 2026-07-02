## 1. Vérification Google Search Console sur mariable.fr

- Récupérer un nouveau token de vérification META pour `https://mariable.fr/` via le gateway GSC.
- Remplacer la meta `google-site-verification` actuelle dans `index.html` par le token de `mariable.fr`.
- Après publication, lancer la vérification + soumettre `https://mariable.fr/sitemap.xml`.

## 2. Page /content-creator-mariage — format article + toggle FR/EN

- Refondre `src/pages/ContentCreatorMariage.tsx` sur le même gabarit visuel que les articles de blog (`BlogArticle.tsx`) :
  - Header avec logo Mariable + `LanguageToggle` (variant dark).
  - Hero éditorial (cover image, titre h1 Playfair, sous-titre, meta auteur/date).
  - Corps `prose` (Tailwind typography) avec sections h2/h3, blockquotes, listes.
  - CTA final vers formulaire de contact / réservation.
  - Helmet SEO (title, description, canonical, og:*, JSON-LD Article).
- Créer namespace i18n dédié : `src/i18n/locales/fr/contentCreator.json` + `src/i18n/locales/en/contentCreator.json` (traduction complète EN).
- Enregistrer le namespace dans `src/i18n/index.ts`.
- Toggle FR/EN fonctionnel via `LanguageToggle` déjà existant.

## 3. Onglet "Passer Premium" dans /dashboard

- Dans `DashboardLayout.tsx`, ajouter un 3ᵉ bouton à côté de "Accueil" et "Sélection de professionnels" :
  - Label : "Passer Premium — 29€" (au lieu de 59€).
  - Style : accent (sage/gold) pour se démarquer.
  - Lien vers la page de paiement premium existante (`/paiement` ou équivalent — à confirmer via `useUserStatus`).
- Conditionner l'affichage : masquer si l'utilisateur est déjà premium (via `useUserStatus` hook déjà présent).
- Ajouter les clés i18n dans `dashboard.json` (FR/EN).

## 4. Page /partenariat — retirer WhatsApp, ajouter LinkedIn

- Dans `src/pages/Partenariat.tsx` (et son modal `ContactModal`), remplacer l'affichage du numéro WhatsApp (`directPhone`) par un lien LinkedIn : `https://www.linkedin.com/in/lambertmathilde/`.
- Mettre à jour les clés `partenariat.json` FR/EN :
  - Supprimer `modal.directPhone` (numéro).
  - Ajouter `modal.directLinkedin` : "LinkedIn" + label.
- Garder l'email direct.

## Questions ouvertes

- **Point 3** : confirme-tu que le lien "Passer Premium" doit pointer vers `/paiement` ? (ou une autre route ?)
- **Point 2** : dois-je conserver le contenu texte actuel de `/content-creator-mariage` tel quel (juste re-mise en forme éditoriale) ou souhaites-tu que je réécrive/enrichisse le contenu façon article SEO long-form ?
