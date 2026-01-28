
## Fonctionnalite Moodboard - Creation de planche d'inspiration avec palette de couleurs IA

### Vision du projet

Creer une nouvelle fonctionnalite dans le dashboard permettant aux couples de :
1. Uploader 5 a 10 photos d'inspiration
2. Analyser automatiquement les couleurs dominantes via IA
3. Generer un moodboard avec disposition editoriale (tailles variees)
4. Exporter en PDF avec nom des maries, date et palette de couleurs

---

### Architecture technique

```text
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND                                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ src/pages/dashboard/MoodboardPage.tsx                        ││
│  │ - Upload de 5-10 photos                                      ││
│  │ - Preview des photos                                         ││
│  │ - Formulaire (nom maries, date)                             ││
│  │ - Bouton "Generer le moodboard"                             ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ src/components/moodboard/MoodboardCanvas.tsx                 ││
│  │ - Affichage du moodboard genere                             ││
│  │ - Layout editorial avec photos tailles variees              ││
│  │ - Palette de couleurs affichee                              ││
│  │ - Bouton export PDF                                         ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND                                     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ supabase/functions/analyze-moodboard-colors/index.ts         ││
│  │ - Recoit les URLs des images                                ││
│  │ - Appelle Lovable AI (Gemini) pour analyser les couleurs    ││
│  │ - Retourne palette de 5-6 couleurs dominantes en HEX        ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

### Fichiers a creer

| Fichier | Description |
|---------|-------------|
| `src/pages/dashboard/MoodboardPage.tsx` | Page principale du moodboard dans le dashboard |
| `src/components/moodboard/MoodboardUploader.tsx` | Composant d'upload multiple de photos |
| `src/components/moodboard/MoodboardCanvas.tsx` | Affichage du moodboard avec layout editorial |
| `src/components/moodboard/ColorPalette.tsx` | Affichage de la palette de couleurs extraites |
| `src/components/moodboard/MoodboardPDFExport.tsx` | Logique d'export PDF avec jsPDF |
| `src/services/moodboardPdfService.ts` | Service d'export PDF specifique moodboard |
| `supabase/functions/analyze-moodboard-colors/index.ts` | Edge function pour analyse IA des couleurs |
| `src/hooks/useMoodboard.ts` | Hook custom pour gerer l'etat du moodboard |

---

### Fichiers a modifier

| Fichier | Modification |
|---------|--------------|
| `src/pages/dashboard/UserDashboard.tsx` | Ajouter route `/dashboard/moodboard` |
| `src/components/dashboard/DashboardSidebar.tsx` | Ajouter lien "Moodboard" dans la sidebar |
| `src/components/dashboard/MobileBottomNav.tsx` | Ajouter dans le menu "Plus" |

---

### Structure detaillee

#### 1. Page MoodboardPage.tsx

Interface principale avec 3 etapes :

**Etape 1 - Informations du mariage**
- Champ : Nom des maries (ex: "Marie & Pierre")
- Champ : Date du mariage (pre-rempli depuis le profil si disponible)

**Etape 2 - Upload des photos**
- Zone drag & drop pour 5-10 photos
- Preview des photos avec possibilite de supprimer
- Validation : minimum 5 photos requises

**Etape 3 - Generation et export**
- Bouton "Analyser les couleurs" → appel Edge Function
- Affichage du moodboard genere
- Bouton "Telecharger en PDF"

---

#### 2. Layout editorial du moodboard

Disposition asymetrique des photos pour un effet "magazine" :

```text
┌─────────────────────────────────────────────────────────────┐
│                    MARIAGE                                   │
│               Marie & Pierre                                │
│                12 Juillet 2026                              │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌──────────────────────────────────┐    │
│  │               │  │                                   │    │
│  │   Photo 1     │  │          Photo 2 (grande)        │    │
│  │   (moyenne)   │  │                                   │    │
│  │               │  │                                   │    │
│  └───────────────┘  └──────────────────────────────────┘    │
│  ┌──────────────────────────────────┐  ┌───────────────┐    │
│  │                                   │  │               │    │
│  │          Photo 3 (grande)        │  │   Photo 4     │    │
│  │                                   │  │   (moyenne)   │    │
│  │                                   │  │               │    │
│  └──────────────────────────────────┘  └───────────────┘    │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐    │
│  │   Photo 5     │  │   Photo 6     │  │   Photo 7     │    │
│  │   (petite)    │  │   (petite)    │  │   (petite)    │    │
│  └───────────────┘  └───────────────┘  └───────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                    PALETTE DE COULEURS                       │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐           │
│  │#F5C6│ │#D4A5│ │#8B7B│ │#C9B8│ │#E8D8│ │#A69B│           │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘           │
│   Rose    Peche   Olive   Beige   Creme   Taupe            │
├─────────────────────────────────────────────────────────────┤
│                    mariable.fr                               │
└─────────────────────────────────────────────────────────────┘
```

---

#### 3. Edge Function : analyze-moodboard-colors

Utilise Lovable AI (Gemini avec vision) pour analyser les couleurs :

```typescript
// Prompt pour l'IA
const systemPrompt = `Tu es un expert en design de mariage et colorimetrie.
Analyse ces images et extrait les 6 couleurs dominantes qui definissent 
l'ambiance generale.

Pour chaque couleur, fournis :
- Le code HEX
- Un nom poetique en francais (ex: "Rose poudre", "Vert sauge", "Beige lin")

Reponds en JSON strict :
{
  "colors": [
    { "hex": "#F5C6D6", "name": "Rose poudre" },
    { "hex": "#D4A574", "name": "Caramel dore" },
    ...
  ],
  "ambiance": "Description en 1 phrase de l'ambiance generale"
}`;
```

---

#### 4. Export PDF

Utilise jsPDF (deja installe) pour generer un PDF A4 portrait :

- En-tete : Titre "MOODBOARD" + nom des maries + date
- Corps : Mosaique des photos avec layout editorial
- Pied : Palette de couleurs avec codes HEX + noms
- Footer : Logo Mariable

---

### Integration dans le dashboard

#### Sidebar (desktop)

Ajouter dans la section "Bonus" ou creer une nouvelle section "Inspiration" :

```typescript
{
  label: 'Moodboard',
  icon: <Palette className="h-4 w-4" />,
  path: '/dashboard/moodboard'
}
```

#### Mobile Bottom Nav

Ajouter dans le drawer "Plus" du menu mobile.

---

### Flux utilisateur

1. L'utilisateur accede a `/dashboard/moodboard`
2. Il renseigne le nom des maries (ou utilise celui du profil)
3. Il uploade 5 a 10 photos d'inspiration
4. Il clique sur "Generer mon moodboard"
5. L'IA analyse les photos et extrait la palette
6. Le moodboard s'affiche avec le layout editorial
7. L'utilisateur peut telecharger le PDF

---

### Gestion des images

**Option 1 - Upload temporaire (recommande pour MVP)**
- Les images sont converties en base64 cote client
- Envoyees a l'Edge Function pour analyse
- Pas de stockage permanent (privacy-friendly)

**Option 2 - Stockage Supabase (pour evolution future)**
- Upload dans bucket `moodboards`
- Sauvegarde des moodboards pour consultation ulterieure
- Historique des moodboards crees

Pour le MVP, je recommande l'option 1 (pas de stockage).

---

### Estimation technique

| Composant | Complexite |
|-----------|------------|
| Page principale | Moyenne |
| Composant upload | Faible |
| Layout moodboard | Moyenne |
| Extraction couleurs IA | Moyenne |
| Export PDF | Moyenne |
| Integration dashboard | Faible |

---

### Coherence avec la charte graphique

- Utilisation de `font-serif` (Playfair Display) pour le titre du moodboard
- Boutons `rounded-none` selon la charte editoriale
- Couleurs `premium-sage` et `editorial-beige` pour l'interface
- Style minimal et elegant coherent avec le reste du dashboard

---

### Resume des actions

1. Creer l'Edge Function `analyze-moodboard-colors` pour l'analyse IA
2. Creer le composant `MoodboardUploader` pour l'upload multiple
3. Creer le composant `MoodboardCanvas` pour le layout editorial
4. Creer le composant `ColorPalette` pour afficher les couleurs
5. Creer le service `moodboardPdfService` pour l'export PDF
6. Creer la page `MoodboardPage` assemblant le tout
7. Ajouter la route dans `UserDashboard.tsx`
8. Ajouter le lien dans la sidebar et le menu mobile
