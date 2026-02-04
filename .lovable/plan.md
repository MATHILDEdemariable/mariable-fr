
## Plan de modifications demandees

### Resume des changements

| Element | Modification | Fichier |
|---------|--------------|---------|
| 1. Hero /severineetolivier | Supprimer l'effet de fondu blanc | WeddingSeverineOlivier.tsx |
| 2. Section hebergement | Un seul lien "Selection de logement a cote" | WeddingSeverineOlivier.tsx |
| 3. Planning | Mise a jour horaires + supprimer soiree dansante | WeddingSeverineOlivier.tsx |
| 4. Admin Contact | Bouton "Repondre par mail" | admin/ContactRequests.tsx |
| 5. Header | "Partenariat" devient "Je suis un professionnel" | PremiumHeader.tsx |

---

### 1. Supprimer l'effet de fondu sur l'image hero

**Fichier** : `src/pages/WeddingSeverineOlivier.tsx`

**Ligne 220 actuelle** :
```tsx
<div className="absolute inset-0 bg-white/70" />
```

**Modification** : Supprimer cette ligne pour afficher l'image sans filtre blanc.

---

### 2. Section hebergement simplifiee

**Fichier** : `src/pages/WeddingSeverineOlivier.tsx`

**Modification des donnees (lignes 39-60)** :
Remplacer le tableau complet par un seul lien :
```typescript
accommodations: [
  { 
    name: "Notre sélection de logements à côté", 
    mapsLink: "https://www.google.com/maps/search/Hotels+Saint-Emilion",
    distance: ""
  },
]
```

**Modification de l'affichage (lignes 412-434)** :
Simplifier pour afficher un seul bouton centre au lieu d'une grille de cartes :
```tsx
<section id="logements" className="py-20 px-4 bg-white">
  <div className="max-w-4xl mx-auto text-center">
    <Home className="h-12 w-12 mx-auto mb-6" style={{ color: colors.coral }} />
    <h2 className="font-serif text-4xl mb-4" style={{ color: colors.darkGreen }}>Hebergements</h2>
    <p className="text-gray-600 mb-8 max-w-lg mx-auto">
      Retrouvez notre selection d'hebergements a proximite du lieu de reception.
    </p>
    <a 
      href="https://www.google.com/maps/search/Hotels+Saint-Emilion"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
      style={{ backgroundColor: colors.coral }}
    >
      <MapPin className="h-5 w-5" />
      Selection de logements a cote
      <ExternalLink className="h-4 w-4" />
    </a>
  </div>
</section>
```

---

### 3. Mise a jour du planning

**Fichier** : `src/pages/WeddingSeverineOlivier.tsx`

**Modification des donnees (lignes 27-33)** :
```typescript
schedule: [
  { time: "16h30", event: "Ceremonie laique", location: "Chateau de Saint Clair", icon: "💒" },
  { time: "18h00", event: "Vin d'honneur", location: "Jardins du Chateau", icon: "🥂" },
  { time: "20h00", event: "Cocktail dinatoire et festivites", location: "Chateau de Saint Clair", icon: "🍽️" },
  { time: "11h00 (+1)", event: "Brunch du lendemain", location: "Terrasse du Chateau", icon: "☕" },
],
```

**Elements supprimes** : "Soiree dansante" (fusionnee avec cocktail dinatoire)

---

### 4. Admin Contact - Repondre par email

**Fichier** : `src/pages/admin/ContactRequests.tsx`

**Ajout dans le Dialog (apres ligne 319)** :
Un bouton permettant d'ouvrir directement l'application mail avec un email pre-rempli :

```tsx
// Apres la section "Message" dans le Dialog
<div className="flex gap-3 pt-4 border-t">
  <Button
    onClick={() => {
      const subject = encodeURIComponent(`Re: Votre demande du ${format(new Date(selectedRequest.created_at), 'dd/MM/yyyy', { locale: fr })}`);
      const body = encodeURIComponent(`Bonjour,\n\nSuite a votre message :\n\n"${selectedRequest.message.substring(0, 200)}..."\n\nCordialement,\nL'equipe Mariable`);
      window.location.href = `mailto:${selectedRequest.email}?subject=${subject}&body=${body}`;
    }}
    className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90 text-white"
  >
    <Mail className="w-4 h-4 mr-2" />
    Repondre par email
  </Button>
</div>
```

**Import necessaire** : `Button` est deja importe.

---

### 5. Header - Bouton "Je suis un professionnel"

**Fichier** : `src/components/home/PremiumHeader.tsx`

**Modification Desktop (lignes 53-58)** :
```tsx
<Link 
  to="/partenariat"
  className="text-xs tracking-widest uppercase text-editorial-noir/80 hover:text-editorial-noir transition-colors font-sans"
>
  Je suis un professionnel
</Link>
```

**Modification Mobile (lignes 103-109)** :
```tsx
<Link 
  to="/partenariat"
  onClick={() => setMobileOpen(false)}
  className="text-sm tracking-widest uppercase text-editorial-noir/80 hover:text-editorial-noir"
>
  Je suis un professionnel
</Link>
```

---

### Resume des fichiers a modifier

| Fichier | Type de modification |
|---------|---------------------|
| `src/pages/WeddingSeverineOlivier.tsx` | Hero, Planning, Hebergements |
| `src/pages/admin/ContactRequests.tsx` | Bouton reponse email |
| `src/components/home/PremiumHeader.tsx` | Texte bouton Partenariat |

---

### Details techniques

**Email Reply (Admin Contact)** :
Le bouton utilise `mailto:` avec parametres pre-remplis :
- **subject** : "Re: Votre demande du DD/MM/YYYY"
- **body** : Message de base avec citation du message original

Cette approche est simple et ne necessite pas de backend d'envoi d'email. Elle ouvre le client mail par defaut de l'utilisateur (Outlook, Gmail, Apple Mail, etc.) avec tous les champs pre-remplis.

Si une solution plus avancee est souhaitee (envoi direct depuis l'interface sans ouvrir de client mail), cela necessiterait :
1. Integration avec Resend via Edge Function
2. Stockage de l'historique des reponses en base
3. Templates d'emails

La solution `mailto:` est recommandee car elle est immediate et ne necessite aucune configuration supplementaire.
