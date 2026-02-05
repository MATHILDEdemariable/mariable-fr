
## Plan de correction des 3 problemes identifies

### Resume des problemes

| Probleme | Fichier/Table | Cause identifiee | Priorite |
|----------|---------------|------------------|----------|
| 1. Texte hero /severineetolivier pas lisible | WeddingSeverineOlivier.tsx | Couleurs sombres sur image sombre | Haute |
| 2. Formulaire RSVP erreur "Impossible d'enregistrer" | wedding_rsvp_responses (RLS) | Policy SELECT bloque le RETURNING | Critique |
| 3. PDF Moodboard deforme sans palette | MoodboardCanvas.tsx + service | Images pas chargees + aspect ratio | Moyenne |

---

### 1. Hero /severineetolivier - Texte en blanc

**Probleme** : Les textes du hero utilisent `colors.coral`, `colors.darkGreen` et `colors.green` qui ne ressortent pas sur l'image de fond fleurie.

**Solution** : Modifier les couleurs du texte pour utiliser du blanc avec ombre pour la lisibilite.

**Fichier** : `src/pages/WeddingSeverineOlivier.tsx`

**Modifications (lignes 199-234)** :
- Ajouter une couche de fond semi-transparente sombre derriere le texte
- Changer tous les textes en blanc (`text-white`)
- Ajouter `text-shadow` pour la lisibilite
- Garder le bouton en corail (deja visible)

```text
Code a modifier (ligne 199-234):
- "Nous nous marions" : blanc au lieu de coral
- Titre couple : blanc au lieu de darkGreen  
- Date : blanc au lieu de green
- Venue : blanc au lieu de gray-600
- Countdown : blanc au lieu de coral
- Labels countdown : blanc au lieu de gray-500
```

---

### 2. BUG CRITIQUE - Formulaire RSVP echoue a l'enregistrement

**Cause racine identifiee** :

Les logs PostgreSQL montrent :
```
"new row violates row-level security policy for table wedding_rsvp_responses"
```

Le probleme vient de la combinaison INSERT + `.select().single()` dans le code :

```typescript
const { data: responseData, error: responseError } = await supabase
  .from('wedding_rsvp_responses')
  .insert({...})
  .select()  // <-- Necessite une policy SELECT
  .single();
```

La politique SELECT actuelle ne permet que les proprietaires authentifies de voir les reponses :
```sql
CREATE POLICY "Event owners can view responses" 
ON wedding_rsvp_responses FOR SELECT 
USING (EXISTS (SELECT 1 FROM wedding_rsvp_events WHERE ...user_id = auth.uid()...));
```

Quand un visiteur anonyme soumet le formulaire, l'INSERT reussit mais le `RETURNING *` (genere par `.select()`) echoue car il ne peut pas lire la ligne inseree.

**Solution** : Ajouter une politique SELECT temporaire permettant a l'inserant de lire sa propre reponse fraichement inseree.

**Migration SQL** :
```sql
-- Permettre aux visiteurs de lire les reponses qu'ils viennent d'inserer
-- Cela corrige le bug du RETURNING apres INSERT
CREATE POLICY "Public can read own inserted response" 
ON public.wedding_rsvp_responses 
FOR SELECT 
USING (
  -- L'utilisateur peut lire une reponse si elle vient d'etre inseree (moins de 5 secondes)
  submitted_at > now() - interval '5 seconds'
);
```

**Alternative plus simple** : Modifier le code pour ne pas utiliser `.select()` apres l'insert.

**Fichiers a modifier** :
- `src/components/rsvp/RSVPInlineForm.tsx` (lignes 188-203)
- `src/pages/rsvp/RSVPPublicForm.tsx` (lignes 196-212)

**Changement de code** :
```typescript
// AVANT (problematique)
const { data: responseData, error: responseError } = await supabase
  .from('wedding_rsvp_responses')
  .insert({...})
  .select()
  .single();

// APRES (solution simple)
const { data: responseData, error: responseError } = await supabase
  .from('wedding_rsvp_responses')
  .insert({...})
  .select('id')  // Seulement l'ID pour les sous-reponses
  .single();
```

**Recommandation** : Appliquer les DEUX corrections (migration SQL + modification du code) pour robustesse.

---

### 3. PDF Moodboard deforme et incomplet

**Probleme observe** : Le PDF exporte montre les images mais PAS la palette de couleurs, et le ratio semble incorrect.

**Causes identifiees** :

1. **Images pas completement chargees** : `html2canvas` capture l'element avant que toutes les images soient chargees en memoire
2. **Palette de couleurs coupee** : L'element `#moodboard-canvas` a un `aspectRatio: 210/297` mais le contenu deborde si les images sont grandes
3. **Cross-origin images** : Les images blob:// locales peuvent poser probleme avec `useCORS`

**Solution** :

**Fichier** : `src/services/moodboardPdfService.ts`

**Modifications** :
1. Attendre que toutes les images soient chargees avant la capture
2. Utiliser `scrollWidth/scrollHeight` pour capturer tout le contenu
3. Ajouter des options pour mieux gerer les images

```typescript
export const generateMoodboardPdf = async (data: MoodboardPdfData): Promise<void> => {
  const { coupleName } = data;
  
  const element = document.getElementById('moodboard-canvas');
  if (!element) {
    throw new Error('Moodboard canvas not found');
  }

  // Attendre que toutes les images soient chargees
  const images = element.querySelectorAll('img');
  await Promise.all(
    Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    })
  );

  // Forcer un reflow pour s'assurer que le layout est correct
  element.style.width = '800px';
  await new Promise(resolve => setTimeout(resolve, 100));

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    allowTaint: true,
    width: element.scrollWidth,
    height: element.scrollHeight,
    windowWidth: 1200,
  });

  // Restaurer le style
  element.style.width = '';

  // ... reste du code PDF
};
```

**Fichier** : `src/components/moodboard/MoodboardCanvas.tsx`

**Modification** : S'assurer que le conteneur a une hauteur fixe calculee pour eviter le debordement.

---

### Resume des fichiers a modifier

| Fichier | Modification |
|---------|--------------|
| `src/pages/WeddingSeverineOlivier.tsx` | Hero texte blanc + ombre |
| `src/components/rsvp/RSVPInlineForm.tsx` | Retirer `.select()` ou limiter a `id` |
| `src/pages/rsvp/RSVPPublicForm.tsx` | Retirer `.select()` ou limiter a `id` |
| `src/services/moodboardPdfService.ts` | Attendre images + fixer dimensions |
| Migration SQL | Ajouter politique SELECT temporaire |

---

### Details techniques

**Probleme RSVP explique simplement** :
Quand un invite remplit le formulaire et clique "Confirmer", le systeme essaie d'enregistrer sa reponse ET de recuperer les informations enregistrees. Mais les regles de securite ne permettent pas a un visiteur anonyme de lire les donnees - meme les siennes. La solution est de soit changer ces regles, soit ne pas demander a recuperer les donnees apres l'enregistrement.

**Probleme PDF explique simplement** :
L'outil qui "photographie" la page pour creer le PDF prend la photo avant que toutes les images soient completement affichees, et il ne capture pas tout le contenu car il depasse de la zone visible. La solution est d'attendre que tout soit charge et de forcer la capture de l'integralite du contenu.
