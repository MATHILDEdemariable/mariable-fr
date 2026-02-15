

## Plan de modifications (4 taches)

---

### 1. Correction erreur envoi contact_requests (Site Internet)

**Cause** : La table `contact_requests` a une contrainte CHECK sur la colonne `type` qui n'accepte que : `couple, lieu, marque, prestataire, bug, feature, account, suggestion, other`. Le modal envoie `type: 'site_internet'` qui est rejete par la base de donnees.

**Solution** : Migration SQL pour ajouter `'site_internet'` a la liste des types autorises.

**Migration SQL** :
```sql
ALTER TABLE contact_requests DROP CONSTRAINT contact_requests_type_check;
ALTER TABLE contact_requests ADD CONSTRAINT contact_requests_type_check 
  CHECK (type = ANY (ARRAY['couple','lieu','marque','prestataire','bug','feature','account','suggestion','other','site_internet']));
```

---

### 2. Panier coupe par le sticky header sur l'accueil

**Cause** : Le bouton panier (`CartIcon.tsx`) est positionne en `fixed top-24` (96px). Sur la homepage, le header a 2 niveaux (h-16 + h-10 = ~104px), donc le panier est partiellement cache derriere le bandeau beige.

**Fichier : `src/components/cart/CartIcon.tsx`**

- Changer `top-24` en `top-28` ou `top-32` pour pousser le panier sous les 2 niveaux du header sur la homepage
- Alternative plus robuste : utiliser `top-20` par defaut et ajouter une marge supplementaire uniquement sur la homepage via une prop ou un calcul dynamique. Toutefois pour rester simple, `top-32` (128px) devrait fonctionner partout.

---

### 3. Creer la page /exemplesite (duplicata de /severine-et-olivier)

**Nouveau fichier : `src/pages/ExempleSite.tsx`**

- Copie de `WeddingSeverineOlivier.tsx` avec les modifications suivantes :
  - Couple : noms generiques (ex: "Marie & Thomas")
  - Lieu : "Domaine de l'Amour" au lieu de "Chateau de Saint Clair"
  - Adresse : "Provence, Sud de la France"
  - Supprimer tous les numeros de telephone des contacts
  - Garder les emails generiques (ex: contact@exemple.fr)
  - Supprimer le RSVP slug reel (utiliser un slug factice ou desactiver le formulaire)
  - Garder la meme structure et les memes couleurs
  - Mettre a jour le Helmet (titre, meta)

**Fichier : `src/App.tsx`**

- Ajouter la route `/exemplesite` avec lazy import de `ExempleSite`

---

### 4. Mettre a jour le modal Site Internet

**Fichier : `src/components/dashboard/SiteInternetModal.tsx`**

- Changer le lien "Voir un exemple" de `/severine-et-olivier` vers `/exemplesite`
- Ajouter un texte explicatif apres le formulaire ou dans la description : "Apres votre demande, nous vous recontacterons par email puis par WhatsApp pour valider ensemble les images et textes de votre site."
- Mettre a jour le message de confirmation : "Nous vous recontacterons par email puis WhatsApp sous 24h pour creer votre site ensemble."

---

### Resume technique

| Fichier | Modification |
|---------|-------------|
| Migration SQL | Ajouter `site_internet` a la contrainte CHECK de `contact_requests.type` |
| `src/components/cart/CartIcon.tsx` | Ajuster `top-24` en `top-32` pour eviter le chevauchement header |
| `src/pages/ExempleSite.tsx` | Nouveau : duplicata anonymise (faux lieu, pas de telephone) |
| `src/App.tsx` | Ajouter route `/exemplesite` |
| `src/components/dashboard/SiteInternetModal.tsx` | Lien vers `/exemplesite`, texte recontact email+WhatsApp |

