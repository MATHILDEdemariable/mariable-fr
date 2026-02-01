

## Plan de corrections et nouvelles fonctionnalites

### Resume des demandes

| Demande | Type | Priorite |
|---------|------|----------|
| 1. Moodboard absent du menu dashboard | Bug | Haute |
| 2. Export PDF moodboard deforme les images | Bug | Haute |
| 3. Double RSVP (Jour-J + Brunch) | Nouvelle fonctionnalite | Moyenne |
| 4. Page mini-site /severineetolivier | Nouvelle fonctionnalite | Moyenne |

---

### 1. Correction : Moodboard absent du menu dashboard

**Analyse du probleme** :
En verifiant `DashboardSidebar.tsx`, le lien Moodboard est bien present dans le menu "Bonus" (lignes 91-95). Le probleme pourrait etre :
- Le dropdown "Bonus" n'est pas visible ou est mal positionne
- Le lien existe mais n'est pas accessible au clic

**Solution** :
Ajouter le Moodboard comme lien standalone dans la sidebar (comme les autres liens directs) en plus du menu Bonus pour une meilleure visibilite.

**Fichier a modifier** : `src/components/dashboard/DashboardSidebar.tsx`

```typescript
// Ajouter apres le lien "Plan de table" (ligne 356) :
{/* Moodboard */}
<Link 
  to={isReaderMode ? '#' : '/dashboard/moodboard'} 
  onClick={e => { if (isReaderMode) { e.preventDefault(); } }}
  className={cn(
    "flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors",
    isActive('/dashboard/moodboard') 
      ? 'bg-wedding-olive text-white shadow-sm' 
      : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive',
    isReaderMode ? 'pointer-events-none opacity-70' : ''
  )}
>
  <Palette className="h-4 w-4" />
  <span className="ml-2 sm:ml-3 leading-tight">Moodboard</span>
</Link>
```

---

### 2. Correction : Export PDF moodboard deforme les images

**Analyse du probleme** :
Dans `moodboardPdfService.ts`, l'export utilise `jsPDF.addImage()` avec des dimensions fixes calculees en grille. Le probleme est que les images sont inserees avec des ratios fixes qui ne respectent pas le ratio original de chaque image.

**Solution** :
Utiliser `html2canvas` pour capturer le moodboard visuellement tel qu'affiche a l'ecran, puis l'ajouter au PDF comme une seule image. Cela preserve exactement l'apparence du moodboard.

**Fichier a modifier** : `src/services/moodboardPdfService.ts`

**Nouvelle approche** :
```typescript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateMoodboardPdf = async (data: MoodboardPdfData): Promise<void> => {
  // Capturer le canvas HTML avec html2canvas
  const element = document.getElementById('moodboard-canvas');
  if (!element) {
    throw new Error('Moodboard canvas not found');
  }

  // Render avec scale elevee pour qualite
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  // Creer PDF A4
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgWidth = 210; // A4 width
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Ajouter l'image capturee au PDF
  const imgData = canvas.toDataURL('image/png', 1.0);
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

  // Sauvegarder
  const fileName = `moodboard-${(data.coupleName || 'mariage').toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
  pdf.save(fileName);
};
```

Cette approche capture exactement ce que l'utilisateur voit a l'ecran, sans deformation.

---

### 3. Nouvelle fonctionnalite : Double RSVP (Jour-J + Brunch)

**Objectif** : Permettre aux couples de creer un formulaire RSVP qui collecte les reponses pour 2 evenements distincts (ex: mariage + brunch lendemain) avec des decomptes separes.

**Architecture proposee** :

#### Option A : Multi-evenements dans un seul formulaire (Recommandee)

Ajouter un systeme d'evenements secondaires lies a un evenement principal.

**Modifications BDD** :
```sql
-- Nouvelle table pour les sous-evenements
CREATE TABLE wedding_rsvp_sub_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_event_id UUID REFERENCES wedding_rsvp_events(id) ON DELETE CASCADE,
  sub_event_name TEXT NOT NULL, -- "Brunch du lendemain"
  sub_event_date DATE,
  sub_event_time TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Nouvelle table pour les reponses aux sous-evenements
CREATE TABLE wedding_rsvp_sub_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES wedding_rsvp_responses(id) ON DELETE CASCADE,
  sub_event_id UUID REFERENCES wedding_rsvp_sub_events(id) ON DELETE CASCADE,
  attending BOOLEAN DEFAULT false,
  number_of_adults INTEGER DEFAULT 0,
  number_of_children INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Fichiers a modifier/creer** :

| Fichier | Action |
|---------|--------|
| Migration SQL | Creer les nouvelles tables |
| `src/pages/dashboard/RSVPManagement.tsx` | Ajouter option "Ajouter un evenement secondaire" |
| `src/pages/rsvp/RSVPPublicForm.tsx` | Afficher les sous-evenements avec cases a cocher |
| `src/pages/dashboard/RSVPResponses.tsx` | Afficher les decomptes par sous-evenement |

**Interface utilisateur - Formulaire de creation** :

```
[x] Ajouter un evenement secondaire

Nom du 2eme evenement : [Brunch du lendemain        ]
Date (optionnel) :      [01/07/2026                 ]
Horaire (optionnel) :   [11h00                      ]

[+ Ajouter un autre evenement]
```

**Interface utilisateur - Formulaire public RSVP** :

```
--- Participation aux evenements ---

[ ] Mariage de Severine & Olivier - 30 juin 2026
    Nombre d'adultes : [2]  Enfants : [0]

[ ] Brunch du lendemain - 1er juillet 2026  
    Nombre d'adultes : [2]  Enfants : [0]
```

**Affichage des resultats** :

```
SYNTHESE DES REPONSES

Mariage (30 juin 2026)
- 45 adultes confirmes
- 8 enfants confirmes
- Total : 53 personnes

Brunch (1er juillet 2026)
- 32 adultes confirmes
- 6 enfants confirmes
- Total : 38 personnes
```

---

### 4. Nouvelle fonctionnalite : Page mini-site /severineetolivier

**Objectif** : Creer une page one-pager mobile-friendly pour le mariage de Severine et Olivier avec :
- Header avec navigation par ancres
- Section planning du mariage
- Lien RSVP
- Informations sur les logements

**Architecture** :

**Fichiers a creer** :

| Fichier | Description |
|---------|-------------|
| `src/pages/WeddingMiniSite.tsx` | Page mini-site template |
| Route dans `src/App.tsx` | `/severineetolivier` |

**Structure de la page** :

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER STICKY (mobile-friendly)                            │
│  [Accueil] [Programme] [RSVP] [Logements] [Contact]        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HERO SECTION                                               │
│  Photo + Noms des maries + Date + Countdown                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PROGRAMME / PLANNING                                       │
│  Timeline verticale avec :                                  │
│  - Ceremonie civile (horaire, lieu)                        │
│  - Ceremonie religieuse (horaire, lieu)                    │
│  - Vin d'honneur                                           │
│  - Diner                                                   │
│  - Soiree dansante                                         │
│  - Brunch lendemain                                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  RSVP                                                       │
│  - Message d'introduction                                   │
│  - Bouton CTA "Confirmer ma presence"                      │
│    (lien vers /rsvp/severine-olivier)                      │
│  - Date limite de reponse                                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  LOGEMENTS                                                  │
│  - Liste des hebergements recommandes                      │
│  - Adresses et liens de reservation                        │
│  - Carte ou indication de distance                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CONTACT                                                    │
│  - Coordonnees des maries ou temoin                        │
│  - WhatsApp / Email                                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  FOOTER                                                     │
│  Severine & Olivier - 30 juin 2026                         │
│  Powered by Mariable                                       │
└─────────────────────────────────────────────────────────────┘
```

**Design mobile-first** :
- Navigation hamburger sur mobile
- Sections en full-width
- Touch-friendly (boutons larges)
- Police serif pour les titres
- Style editorial coherent avec Mariable

**Exemple de contenu (a personnaliser)** :

```typescript
const weddingData = {
  couple: "Severine & Olivier",
  date: "30 juin 2026",
  rsvpSlug: "severine-olivier", // Lien vers /rsvp/severine-olivier
  rsvpDeadline: "15 mai 2026",
  schedule: [
    { time: "14h30", event: "Ceremonie civile", location: "Mairie de Bordeaux" },
    { time: "16h00", event: "Ceremonie religieuse", location: "Eglise St-Michel" },
    { time: "17h30", event: "Vin d'honneur", location: "Domaine de Badine" },
    { time: "20h00", event: "Diner", location: "Domaine de Badine" },
    { time: "23h00", event: "Soiree dansante" },
    { time: "11h00 (+1)", event: "Brunch", location: "Domaine de Badine" },
  ],
  accommodations: [
    { name: "Hotel Mercure Libourne", address: "...", link: "...", distance: "5 km" },
    { name: "Airbnb recommandes", link: "...", note: "Liste curee par les maries" },
  ],
  contact: {
    email: "severineetolivier@gmail.com",
    phone: "06 XX XX XX XX",
  }
};
```

---

### Resume des fichiers a modifier/creer

| Fichier | Action | Demande |
|---------|--------|---------|
| `src/components/dashboard/DashboardSidebar.tsx` | Modifier | 1 |
| `src/services/moodboardPdfService.ts` | Modifier | 2 |
| Migration SQL (sub_events, sub_responses) | Creer | 3 |
| `src/pages/dashboard/RSVPManagement.tsx` | Modifier | 3 |
| `src/pages/rsvp/RSVPPublicForm.tsx` | Modifier | 3 |
| `src/pages/dashboard/RSVPResponses.tsx` | Modifier | 3 |
| `src/pages/WeddingSeverineOlivier.tsx` | Creer | 4 |
| `src/App.tsx` | Modifier (route) | 4 |

---

### Ordre d'implementation recommande

1. **Correction Moodboard menu** (5 min) - Impact immediat
2. **Correction PDF export** (15 min) - Resolution du bug critique
3. **Page /severineetolivier** (30 min) - Nouvelle page autonome
4. **Double RSVP** (45 min) - Fonctionnalite plus complexe avec BDD

