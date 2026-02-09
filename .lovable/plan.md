

## Plan d'implementation

---

## 1. Passer les comptes en Premium (base de donnees)

Mise a jour directe des deux profils dans la table `profiles` :

| Email | User ID | Action |
|-------|---------|--------|
| s.o.2026@yopmail.com | d27b6f39-b7b5-4c54-87b0-b55c76f5d874 | subscription_type = 'premium', subscription_expires_at = null |
| mathildelambert.contact@gmail.com | 083e523c-dfd4-41de-bdfe-025ba5e3bf1a | subscription_type = 'premium', subscription_expires_at = null |

Requete SQL a executer via l'admin Supabase (non modifiable par code, sera fait manuellement ou via un appel direct).

**Note importante** : Cette action ne peut pas etre faite via le code frontend. Il faudra executer la requete SQL suivante dans le Cloud View > Run SQL :

```text
UPDATE profiles 
SET subscription_type = 'premium', subscription_expires_at = NULL, updated_at = NOW() 
WHERE id IN (
  'd27b6f39-b7b5-4c54-87b0-b55c76f5d874',
  '083e523c-dfd4-41de-bdfe-025ba5e3bf1a'
);
```

---

## 2. Modifier la page du mini-site mariage

### 2.1 Changement de route

**Fichier : `src/App.tsx`**

- Remplacer `path="/severineetolivier"` par `path="/severine-et-olivier"`

### 2.2 Mise a jour du slug RSVP

**Fichier : `src/pages/WeddingSeverineOlivier.tsx`**

- Changer `rsvpSlug: "severine-olivier"` par `rsvpSlug: "mariageseverineolivier-1"` pour correspondre au formulaire public existant

### 2.3 Mise a jour des contacts

Remplacer la section contact unique par 3 contacts :

```text
Olivier : 06 07 98 00 58
Severine : 06 15 46 28 41
Mathilde Wedding planner : mathilde@mariable.fr
```

**Modifications dans `weddingData.contact`** : transformer en tableau de contacts au lieu d'un seul objet, puis adapter la section Contact du JSX pour afficher les 3 contacts.

---

## Resume des fichiers

### A modifier (2 fichiers)

| Fichier | Modifications |
|---------|---------------|
| `src/App.tsx` | Route `/severineetolivier` vers `/severine-et-olivier` |
| `src/pages/WeddingSeverineOlivier.tsx` | Slug RSVP + 3 contacts |

### Action manuelle (1)

| Action | Details |
|--------|---------|
| SQL dans Run SQL | Passer les 2 comptes en premium |

