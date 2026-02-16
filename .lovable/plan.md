

## Plan de modifications (4 taches)

---

### 1. Partenariat : ajouter une section "Exemple de posts / stories"

**Fichier : `src/pages/Partenariat.tsx`**

Ajouter une nouvelle section entre "En resume" et le formulaire, avec le titre "Exemple de posts / stories" et une liste de types de publications :

- Actualites
- Date restante ou offre promotionnelle
- Publication d'un mariage
- Un texte : "Nous vous mettrons en avant regulierement et a vous de nous solliciter"

Style : meme esthetique editoriale que le reste de la page (beige, noir, Playfair Display, sans arrondis).

---

### 2. Admin Contact : repondre par email via Resend (mathilde@mariable.fr)

**Situation actuelle** : Le bouton "Repondre par email" ouvre `mailto:` dans le client mail local. L'utilisateur veut envoyer directement depuis l'interface via Resend avec l'adresse `mathilde@mariable.fr`.

**Nouveau fichier : `supabase/functions/reply-contact-request/index.ts`**

Edge function qui :
- Recoit `to` (email destinataire), `subject`, `body`, `requestId`
- Envoie l'email via Resend avec `from: "Mariable <mathilde@mariable.fr>"` (le secret RESEND existe deja)
- Retourne le succes/erreur

**Fichier : `src/pages/admin/ContactRequests.tsx`**

Modifier le dialog de detail :
- Remplacer le bouton `mailto:` par un formulaire inline avec :
  - Champ sujet (pre-rempli avec "Re: Votre demande du DD/MM/YYYY")
  - Zone de texte pour la reponse (pre-remplie avec le template actuel)
  - Bouton "Envoyer via Resend" qui appelle l'edge function
- Afficher un toast de confirmation ou d'erreur apres l'envoi
- Ajouter un etat de chargement pendant l'envoi

---

### 3. Page /comparatif : design editorial (beige/noir, sans arrondis)

**Fichier : `src/pages/Comparatif.tsx`**

- Changer `bg-white` en `bg-editorial-beige` pour le hero
- Garder le fond blanc general mais harmoniser avec la page /prix

**Fichier : `src/components/comparatif/ComparatifTable.tsx`**

Remplacer les couleurs et arrondis pour correspondre au design de /prix :
- Supprimer toutes les classes `rounded-*` (utiliser `rounded-none`)
- Remplacer `wedding-olive` par `editorial-noir` (textes, bordures, badges)
- Remplacer `bg-wedding-olive` par `bg-editorial-noir` pour le header "Recommande"
- Remplacer `bg-wedding-olive/10` par `bg-editorial-beige`
- Les status "best" utilisent `text-editorial-noir` au lieu de `text-wedding-olive`
- Supprimer le jaune (`amber`) : remplacer par du gris ou noir/70
- Cards mobiles : bordures `border-editorial-noir/10`, pas d'arrondis

---

### 4. Dashboard : message mobile-first pour les modules d'organisation

**Fichier : `src/components/dashboard/DashboardLayout.tsx`**

Ajouter un bandeau informatif visible uniquement sur mobile (`isMobile`) en haut du contenu principal :
- Fond `bg-editorial-beige` avec bordure
- Icone info + texte : "Pour une meilleure experience, utilisez un ordinateur ou une tablette pour les modules d'organisation. Seul le module Jour-J est optimise pour mobile."
- Bouton de fermeture (stockage en `localStorage` pour ne pas re-afficher)

---

### Resume technique

| Element | Fichier(s) | Type |
|---------|-----------|------|
| Section posts/stories | `src/pages/Partenariat.tsx` | Modification |
| Reponse email Resend | `supabase/functions/reply-contact-request/index.ts` | Nouveau |
| Reponse email UI | `src/pages/admin/ContactRequests.tsx` | Modification |
| Design comparatif | `src/pages/Comparatif.tsx`, `src/components/comparatif/ComparatifTable.tsx` | Modification |
| Message mobile dashboard | `src/components/dashboard/DashboardLayout.tsx` | Modification |

