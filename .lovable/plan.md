

# Plan : Suppression de pages et redesign /outils-planning-mariage

---

## 1. Suppression de 4 routes

### Fichiers de pages a supprimer
- `src/pages/Accompagnement.tsx`
- `src/pages/SalonMicroTrottoir.tsx`
- `src/pages/SalonDuMariage2025.tsx`

Note : `src/pages/MoteurRecherche.tsx` ne sera PAS supprime car il est reutilise par la route `/mariage/:region`. Seule la route `/moteur-recherche` sera retiree.

### Modifications dans `src/App.tsx`
- Retirer l'import et la route `/accompagnement`
- Retirer les imports et les 3 routes `/salon-du-mariage-2025`, `/salon-du-mariage-2025/jeu-concours`, `/salon-du-mariage-2025/autorisation-micro-trottoir`
- Retirer les imports `SalonDuMariage2025`, `SalonJeuConcours`, `SalonMicroTrottoir`, `Accompagnement`
- Retirer la route `/moteur-recherche` (garder `/mariage/:region` qui utilise le meme composant)

### Modifications dans `src/pages/Sitemap.tsx`
- Retirer `/accompagnement`, `/salon-du-mariage-2025` du sitemap

### Modifications dans `src/pages/Paiement.tsx`
- Changer la redirection `window.location.href = '/accompagnement'` vers `/dashboard` ou `/` (la page n'existera plus)

### Modifications dans `src/components/admin/maintenance/AppArchitectureView.tsx`
- Marquer les entrees SalonDuMariage2025, SalonMicroTrottoir, MoteurRecherche comme "obsolete" ou les retirer

### Modifications dans `src/pages/OutilsPlanningMariage.tsx`
- Changer le lien `/moteur-recherche` vers `/prestataires` dans la liste des outils

---

## 2. Redesign /outils-planning-mariage (style editorial beige/noir)

### Fichier : `src/pages/OutilsPlanningMariage.tsx`

Remplacer toutes les couleurs vertes et arrondis par le style editorial :

- **Fond principal** : `bg-editorial-beige` au lieu de `bg-gradient-to-b from-white to-wedding-cream/20`
- **Bouton hero** : `bg-editorial-noir hover:bg-editorial-noir/90 text-white rounded-none` au lieu de `bg-wedding-olive`
- **Bouton retour** : `border-editorial-noir/30 text-editorial-noir rounded-none`
- **Icones etapes** : fond `bg-editorial-beige` avec texte `text-editorial-noir` au lieu de `bg-wedding-olive/10` et `text-wedding-olive`
- **Pastilles numerotees** : `bg-editorial-noir` au lieu de `bg-wedding-olive`
- **Section process** : fond `bg-white` reste blanc
- **Cards outils** : `rounded-none`, bordure `border-editorial-noir/10`, fond `bg-white`, suppression des couleurs `wedding-olive` et `wedding-cream`
- **Icones dans les cards** : `text-editorial-noir` au lieu de `text-wedding-olive`
- **Features dans les cards** : `text-editorial-noir/70` au lieu de `text-wedding-olive`
- **Boutons cards** : `border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white rounded-none`
- **Section CTA finale** : `bg-editorial-beige` au lieu de `bg-wedding-olive/5`, boutons en noir
- **Polices** : Playfair Display (deja en place via `font-serif`), pas de gras excessif

---

## Resume des fichiers modifies

| Fichier | Action |
|---|---|
| `src/pages/Accompagnement.tsx` | Supprime |
| `src/pages/SalonMicroTrottoir.tsx` | Supprime |
| `src/pages/SalonDuMariage2025.tsx` | Supprime |
| `src/App.tsx` | Retirer 5 routes et 4 imports |
| `src/pages/Sitemap.tsx` | Retirer 2 entrees |
| `src/pages/Paiement.tsx` | Changer redirection |
| `src/pages/OutilsPlanningMariage.tsx` | Redesign editorial complet + changer lien moteur-recherche |
| `src/components/admin/maintenance/AppArchitectureView.tsx` | Nettoyer entrees obsoletes |

