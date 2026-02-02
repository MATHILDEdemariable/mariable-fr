

## Plan de corrections et nouvelles fonctionnalites

### Resume des demandes

| Demande | Type | Priorite |
|---------|------|----------|
| 1. Double RSVP ne fonctionne pas (sous-evenements invisibles) | Bug critique | Haute |
| 2. Page /severineetolivier - Date/lieu incorrect | Correction contenu | Haute |
| 3. RSVP en modal sur la meme page | Amelioration UX | Moyenne |
| 4. Logements - Lien Google Maps au lieu de liste | Amelioration | Moyenne |
| 5. Photo hero + palette couleurs corail/orange | Design | Moyenne |
| 6. Contact = Mathilde : Wedding Planner | Correction contenu | Faible |
| 7. Gestion des informations privees (ceremonie civile) | Recommandation | Moyenne |

---

### 1. BUG CRITIQUE : Double RSVP - Sous-evenements invisibles

**Cause identifiee** :
La politique RLS (Row Level Security) sur la table `wedding_rsvp_sub_events` ne permet la lecture QU'aux utilisateurs authentifies proprietaires de l'evenement :

```sql
-- Policy actuelle (PROBLEME)
CREATE POLICY "Users can view sub_events of their events" 
ON public.wedding_rsvp_sub_events 
FOR SELECT 
USING (parent_event_id IN (SELECT id FROM wedding_rsvp_events WHERE user_id = auth.uid()));
```

Les visiteurs du formulaire RSVP public sont anonymes et ne possedent pas l'evenement. Donc la requete Supabase retourne zero sous-evenement.

**Solution** :
Ajouter une politique RLS permettant a n'importe qui de lire les sous-evenements (comme c'est deja le cas pour `wedding_rsvp_events` qui est public) :

```sql
-- Nouvelle policy a ajouter
CREATE POLICY "Public can view sub_events" 
ON public.wedding_rsvp_sub_events 
FOR SELECT 
USING (true);
```

**Action** : Migration SQL pour ajouter cette policy.

---

### 2. Page /severineetolivier - Mise a jour du contenu

**Modifications dans `src/pages/WeddingSeverineOlivier.tsx`** :

| Element | Ancienne valeur | Nouvelle valeur |
|---------|-----------------|-----------------|
| Date | 30 juin 2026 | 5 septembre 2026 |
| Lieu principal | Domaine de Badine | Chateau de Saint Clair |
| Variable weddingDate | 2026-06-30 | 2026-09-05 |
| Contact | Mathilde (temoin de la mariee) | Mathilde : Wedding Planner |

**Mise a jour du programme** :
Adapter les horaires et lieux pour refleter le nouveau lieu (Chateau de Saint Clair).

---

### 3. RSVP en modal sur la meme page

**Approche** :
Au lieu de naviguer vers `/rsvp/severine-olivier`, ouvrir le formulaire RSVP dans un Dialog (modal) directement sur la page mini-site.

**Implementation** :
1. Importer le composant `Dialog` et creer un etat `isRsvpModalOpen`
2. Remplacer le `<Link>` par un `<Button>` qui ouvre le modal
3. Integrer une version simplifiee du formulaire RSVP dans le modal
4. Alternative : utiliser un iframe du formulaire existant

**Solution recommandee** : Creer un composant `RSVPModal` qui integre le formulaire inline (plus propre qu'un iframe).

**Code cible** :
```typescript
const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);

// Dans la section RSVP :
<Button onClick={() => setIsRsvpModalOpen(true)}>
  Confirmer ma presence
</Button>

<Dialog open={isRsvpModalOpen} onOpenChange={setIsRsvpModalOpen}>
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
    <RSVPInlineForm 
      eventSlug={weddingData.rsvpSlug}
      onSuccess={() => setIsRsvpModalOpen(false)}
    />
  </DialogContent>
</Dialog>
```

**Fichier a creer** : `src/components/rsvp/RSVPInlineForm.tsx` (version embedable du formulaire)

---

### 4. Logements - Remplacer par liens Google Maps

**Modifications** :

Simplifier la section hebergements en remplacant les liens de reservation par des liens Google Maps directs :

```typescript
accommodations: [
  { 
    name: "Hotel & Spa de Pavie", 
    mapsLink: "https://maps.google.com/?q=Hotel+Spa+de+Pavie+Saint-Emilion",
    distance: "8 km"
  },
  // ...
]
```

**Interface simplifiee** :
- Nom de l'hebergement
- Distance approximative
- Bouton "Voir sur Google Maps"

---

### 5. Photo hero + Palette couleurs

**Image a integrer** :
L'utilisateur a fourni une photo de fleurs avec palette corail/orange/rose/vert.

**Actions** :
1. Copier l'image dans `src/assets/severine-olivier-hero.jpeg`
2. Ajouter l'image en hero background ou en decoration
3. Extraire la palette de couleurs dominantes :

**Palette proposee (basee sur la photo)** :

| Couleur | HEX | Utilisation |
|---------|-----|-------------|
| Corail vif | #E8736E | Boutons primaires |
| Orange fleur | #E89557 | Accents, hover |
| Rose tendre | #F5B5A8 | Backgrounds clairs |
| Vert feuillage | #6B8E4E | Textes secondaires |
| Blanc creme | #FEFBF5 | Fond principal |
| Vert fonce | #4A6741 | Textes importants |

**CSS a ajouter** :
```css
/* Variables couleurs Severine & Olivier */
--so-coral: #E8736E;
--so-orange: #E89557;
--so-pink: #F5B5A8;
--so-green: #6B8E4E;
--so-cream: #FEFBF5;
--so-dark-green: #4A6741;
```

**Mise a jour des boutons** :
Remplacer `wedding-olive` par la palette corail/orange.

---

### 6. Contact : Mathilde Wedding Planner

**Modification simple** dans `weddingData.contact` :
```typescript
contact: {
  name: "Mathilde",
  role: "Wedding Planner",
  email: "mathilde@mariable.fr", // A confirmer
  phone: "06 XX XX XX XX" // A confirmer
}
```

---

### 7. Recommandations : Gestion des informations privees

**Problematique** :
La ceremonie civile et le diner de la veille ne concernent que certains invites. Comment afficher ces informations sans gener les autres ?

**Recommandations (par ordre de complexite)** :

#### Option A : Lien protege par mot de passe (Recommandee)
Creer une section "Informations VIP" accessible via un code :
```
/severineetolivier?code=vip2026
```
Si le code est present, afficher les evenements prives.

**Implementation** :
```typescript
const searchParams = new URLSearchParams(window.location.search);
const hasVipAccess = searchParams.get('code') === 'vip2026';

// Affichage conditionnel
{hasVipAccess && (
  <div className="bg-coral-50 p-6 rounded-lg">
    <h3>Programme VIP - Veille du mariage</h3>
    <p>Ceremonie civile : 4 septembre a 15h</p>
    <p>Diner intime : 4 septembre a 20h</p>
  </div>
)}
```

**Avantages** :
- Simple a implementer
- URL partageable aux invites VIP uniquement
- Pas d'authentification requise

#### Option B : Accordeon "Plus d'informations"
Ajouter un accordeon discret en bas de page avec mention "Invites de la veille".

#### Option C : Pages separees
Creer deux pages :
- `/severineetolivier` - Tous les invites
- `/severineetolivier/vip` - Invites VIP avec programme complet

**Recommandation finale** : Option A (code URL) car elle est simple, discrete, et ne necessite aucune authentification.

---

### Resume des fichiers a modifier/creer

| Fichier | Action | Description |
|---------|--------|-------------|
| Migration SQL | Creer | Ajouter policy RLS publique pour sub_events |
| `src/pages/WeddingSeverineOlivier.tsx` | Modifier | Date, lieu, couleurs, modal RSVP, Google Maps |
| `src/components/rsvp/RSVPInlineForm.tsx` | Creer | Formulaire RSVP embeddable en modal |
| `src/assets/severine-olivier-hero.jpeg` | Copier | Image hero fleurs |

---

### Ordre d'implementation

1. **Migration SQL** - Corriger le bug critique RLS (5 min)
2. **Mise a jour contenu** - Date, lieu, contact (10 min)
3. **Photo + Palette couleurs** - Integration visuelle (15 min)
4. **Modal RSVP** - Formulaire inline (20 min)
5. **Section VIP** - Code URL pour infos privees (10 min)

