

## Plan de modifications

---

### 1. Header : Barre beige uniquement sur la page d'accueil

**Fichier : `src/components/home/PremiumHeader.tsx`**

- Importer `useLocation` de `react-router-dom` pour detecter la route active
- Supprimer "Conseils" et "Temoignages" du tableau `navLinks` (garder Prestataires, Outils, Prix)
- Conditionner l'affichage de la barre de navigation beige (niveau 2) : visible uniquement si `pathname === "/"` ou `pathname === "/accueil"`
- Le lien "Outils" renverra vers `/#outils-planification` (ancre vers la section outils de la homepage) au lieu de `/outils-planning-mariage`
- Sur les autres pages, seul le bandeau blanc (logo + boutons) sera affiche
- Mettre a jour le menu mobile pour refleter les memes liens (sans Conseils ni Temoignages)

---

### 2. Page /prix : Ajouter les guides dans le Premium

**Fichier : `src/pages/Prix.tsx`**

- Remplacer la ligne "Guides mariage PDF : non inclus / Inclus" par une description plus riche :
  - Gratuit : "Non inclus"
  - Premium : "+ 10 guides mariage & checklists PDF"
- Ajouter une sous-liste ou un texte descriptif dans la card Premium mentionnant les guides specifiques : Guide jour-J, Organisation debutant, Guide prestataires, Checklist marie(e)s & proches, Checklist mairie & ceremonie
- Le bouton "Passer au Premium" verifiera si l'utilisateur est authentifie :
  - Si oui : appeler la logique Stripe existante (`create-checkout-session` via `supabase.functions.invoke`)
  - Si non : rediriger vers `/login` avec un message ou un parametre `?redirect=premium`
- Meme logique pour le CTA final et les boutons mobile

**Fichier : `src/components/dashboard/PricingContent.tsx`**

- Meme mise a jour du contenu guides (10 guides & checklists)
- Meme logique de bouton Premium (login requis)

---

### 3. Bouton Premium dans le tableau de bord

**Fichier : `src/components/dashboard/gaming/HeroStats.tsx`**

- Ajouter un bouton "Premium" a cote de la card "% d'organisation completee"
- Le bouton sera visible uniquement si l'utilisateur n'est PAS deja premium (utiliser `useUserProfile` + `isPremium`)
- Au clic : ouvrir la page de paiement Stripe (meme logique que `StripeButton.tsx` : appel a `create-checkout-session`)
- Si deja premium : afficher un badge "Premium" a la place du bouton
- Style : `bg-editorial-noir text-white rounded-none` coherent avec le design system

---

### 4. Section Outils de la homepage : ajouter une ancre

**Fichier : `src/components/home/PremiumToolsCoordinationSection.tsx`**

- Ajouter un `id="outils-planification"` sur la `<section>` pour que le lien `/#outils-planification` du header puisse y ancrer

---

### Resume technique

| Fichier | Modification |
|---------|-------------|
| `src/components/home/PremiumHeader.tsx` | Supprimer Conseils/Temoignages, barre beige homepage-only, lien Outils vers ancre |
| `src/pages/Prix.tsx` | Enrichir guides (10 PDF), bouton Premium conditionne a l'auth |
| `src/components/dashboard/PricingContent.tsx` | Meme enrichissement guides + bouton conditionne |
| `src/components/dashboard/gaming/HeroStats.tsx` | Bouton Premium a cote du % completion |
| `src/components/home/PremiumToolsCoordinationSection.tsx` | Ajouter id="outils-planification" |
