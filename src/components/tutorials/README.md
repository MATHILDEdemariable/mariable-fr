# 🎬 Tutoriels Vidéo Loom - Guide d'intégration

## ⚠️ Statut actuel
Structure préparée mais vidéos non intégrées. Les IDs Loom sont des placeholders (`PLACEHOLDER_LOOM_ID`).

## 📋 Étapes pour activer les vidéos

### 1. Créer les vidéos Loom
- Enregistrer les tutoriels pour chaque module
- Récupérer les IDs de vidéo Loom (format : chaîne alphanumérique)
- Exemple d'ID Loom : `a5f4b8c9d2e1f3g4h5i6`

### 2. Mettre à jour la configuration
Éditer `src/config/tutorialVideos.ts` et remplacer les `PLACEHOLDER_LOOM_ID` par les vrais IDs.

Exemple :
```typescript
export const TUTORIAL_VIDEOS: Record<TutorialVideoId, TutorialVideo> = {
  welcome: {
    id: 'welcome',
    loomId: 'a5f4b8c9d2e1f3g4h5i6', // ✅ Vrai ID Loom
    title: 'Bienvenue sur Mariable',
    description: 'Découvrez comment utiliser la plateforme',
  },
  // ... autres vidéos
};
```

### 3. Intégrer dans ProjectSummary (Dashboard principal)
Dans `src/components/dashboard/ProjectSummary.tsx`, après le header "Bonjour & bienvenue" (ligne ~209) :

```tsx
import { LoomVideoEmbed } from '@/components/tutorials/LoomVideoEmbed';
import { TUTORIAL_VIDEOS } from '@/config/tutorialVideos';

// Dans le JSX, après le header personnalisé
<div className="bg-white rounded-xl shadow-sm border border-wedding-olive/20 p-6 mb-6">
  <h3 className="text-xl font-serif text-wedding-olive mb-4 flex items-center gap-2">
    🎬 Guide vidéo de démarrage
  </h3>
  <LoomVideoEmbed
    videoId={TUTORIAL_VIDEOS.welcome.loomId}
    title={TUTORIAL_VIDEOS.welcome.title}
    description={TUTORIAL_VIDEOS.welcome.description}
  />
</div>
```

### 4. Ajouter des boutons "Tuto vidéo" dans les modules

#### Exemple pour ChecklistMariagePage :

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { TutorialVideoModal } from '@/components/tutorials/TutorialVideoModal';

const ChecklistMariagePage = () => {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <>
      {/* Header de la page avec bouton tuto */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-serif">Ma Checklist</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTutorial(true)}
        >
          <Play className="h-4 w-4 mr-2" />
          Tuto vidéo
        </Button>
      </div>

      {/* Contenu existant... */}

      {/* Modal vidéo */}
      <TutorialVideoModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        videoId="checklist"
      />
    </>
  );
};
```

### 5. Modules à équiper

Liste des modules à équiper avec des boutons "Tuto vidéo" :

- ✅ **Dashboard principal** (`src/components/dashboard/ProjectSummary.tsx`) - Vidéo principale
- 📝 **Checklist** (`src/pages/dashboard/ChecklistMariagePage.tsx`)
- 📝 **Budget** (`src/pages/dashboard/BudgetPage.tsx`)
- 📝 **Suivi prestataires** (`src/pages/dashboard/VendorTracking.tsx`)
- 📝 **Calculatrice boissons** (`src/components/drinks/DrinksCalculator.tsx`)
- 📝 **RSVP** (`src/pages/dashboard/GuestRSVP.tsx`)
- 📝 **Planning** (`src/pages/dashboard/PlanningPage.tsx`)
- 📝 **Coordination jour J** (path: `/mon-jour-m`)
- 📝 **Après le mariage** (`src/pages/dashboard/ApresJourJ.tsx`)
- 📝 **Gestion des logements** (`src/pages/dashboard/AccommodationsPage.tsx`)
- 📝 **Plan de table** (`src/pages/dashboard/SeatingPlanPage.tsx`)

## 🎨 Design Guidelines

### Position du bouton
- **Desktop** : En haut à droite de chaque page
- **Mobile** : En dessous du titre principal

### Style du bouton
```tsx
<Button
  variant="outline"
  size="sm"
  onClick={() => setShowTutorial(true)}
  className="flex items-center gap-2"
>
  <Play className="h-4 w-4" />
  Tuto vidéo
</Button>
```

### Modal
- Largeur maximale : `max-w-4xl`
- Hauteur maximale : `max-h-[90vh]`
- Overlay : Fond sombre par défaut (shadcn Dialog)
- Vidéo : Aspect ratio 16:9 responsive

## 🔍 Vérifications avant activation

Avant d'activer les vidéos, vérifier :

1. ✅ Tous les IDs Loom sont valides (pas de placeholders)
2. ✅ Les vidéos Loom sont publiques et accessibles
3. ✅ Les vidéos se chargent correctement dans l'iframe
4. ✅ Le responsive fonctionne sur mobile et desktop
5. ✅ Les modales s'ouvrent et se ferment correctement
6. ✅ Les boutons sont visibles et accessibles

## 📱 Tests recommandés

- [ ] Desktop Chrome/Firefox/Safari
- [ ] Mobile iOS Safari
- [ ] Mobile Android Chrome
- [ ] Tablette iPad
- [ ] Vitesse de chargement des vidéos
- [ ] Navigation au clavier (accessibilité)

## 💡 Conseils

- **Performance** : Les iframes Loom sont optimisées, mais éviter de charger plusieurs vidéos simultanément
- **UX** : Privilégier les modales pour ne pas perturber le flux de travail
- **Accessibilité** : Toujours fournir un titre descriptif pour les vidéos
- **Analytics** : Considérer l'ajout de tracking pour mesurer l'utilisation des tutoriels

## 🚀 Roadmap future (optionnel)

Améliorations possibles :
- Page dédiée `/dashboard/tutorials` avec toutes les vidéos
- Système de progression (vidéos vues / non vues)
- Favoris et recommandations
- Transcriptions textuelles pour l'accessibilité
- Versions courtes vs complètes
