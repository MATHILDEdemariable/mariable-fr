

## Plan d'implementation - 4 modifications

---

## 1. Settings : remplacer "Statut d'abonnement" par "Compte Premium"

**Fichier : `src/components/dashboard/UserProfile.tsx`**

Le profil affiche actuellement "Statut d'abonnement" avec un bouton "Annuler l'abonnement" et un texte sur le renouvellement. Comme le modele est maintenant un achat unique a 29 euros (pas un abonnement), il faut :

- Ligne 190 : Remplacer "Statut d'abonnement" par "Statut du compte"
- Lignes 194-198 : Supprimer le bloc "Prochain renouvellement" (plus pertinent avec achat unique)
- Lignes 201-215 : Supprimer le bloc "Annuler l'abonnement" (impossible d'annuler un achat unique)
- Remplacer par un simple message : "Compte Premium actif - Acces a vie" si premium, ou un bouton "Passer au Premium - 29 euros" si gratuit
- Supprimer la fonction `handleCancelSubscription` (lignes 110-135) car plus necessaire

---

## 2. RSVP : retirer le paywall sur la creation de formulaire

**Fichier : `src/pages/dashboard/RSVPManagement.tsx`**

Actuellement, `handleCreateEvent` et `handleDelete` sont encapsules dans `executeAction()` du hook `usePremiumAction`, ce qui bloque les utilisateurs gratuits.

Modifications :
- Ligne 152-153 : Remplacer `executeAction(async () => {` par un appel direct `async` sans wrapper premium
- Ligne 241-242 : Meme chose pour `handleDelete`
- Supprimer l'import et l'usage de `usePremiumAction` et `PremiumModal` (lignes 15-16, 48-55, 578-585)

---

## 3. Page /comparatif : aligner le style avec la homepage

**Fichier : `src/pages/Comparatif.tsx`**

Actuellement la page utilise des classes `premium-*` (ancien design). Il faut passer au style editorial :

- Ligne 21 : Remplacer `bg-gradient-to-br from-premium-light via-white to-premium-cream` par `bg-white`
- Ligne 28 : Remplacer `text-premium-black font-bold` par `font-serif text-editorial-noir font-normal`
- Ligne 31 : Remplacer `text-premium-charcoal` par `text-editorial-noir/70`
- Lignes 41-53 : Refaire le CTA avec le style editorial (fond `bg-editorial-beige`, texte noir, bouton `rounded-none`)

**Fichier : `src/components/comparatif/ComparatifTable.tsx`**

- Ligne 25 : Mettre a jour le prix Mariable de "Gratuit" a "Gratuit + Premium 29 euros"
- Ajuster les descriptions pour mentionner le modele freemium

---

## 4. Homepage : optimiser la conversion

**Fichier : `src/pages/Mariable.tsx`**

Modifications du Hero (lignes 53-76) :
- Ligne 53-55 : Remplacer le titre par "Tout pour organiser un mariage parfait"
- Ligne 58-60 : Remplacer le sous-titre par "Les meilleurs outils d'organisation et prestataires mariage au meme endroit"
- Ligne 75 : Changer le CTA "Creer votre mariage" en "Creer mon compte gratuit"

---

## Resume des fichiers

| Fichier | Modifications |
|---------|---------------|
| `src/components/dashboard/UserProfile.tsx` | Remplacer "abonnement" par "compte premium", supprimer annulation |
| `src/pages/dashboard/RSVPManagement.tsx` | Retirer le paywall sur creation/suppression RSVP |
| `src/pages/Comparatif.tsx` | Style editorial + prix 29 euros |
| `src/components/comparatif/ComparatifTable.tsx` | Prix "Gratuit + Premium 29 euros" |
| `src/pages/Mariable.tsx` | Nouvelle tagline + CTA optimise |

