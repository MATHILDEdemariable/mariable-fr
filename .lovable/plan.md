

## Plan de modifications (3 correctifs + 1 nouvelle fonctionnalite)

---

### 1. Header : Bandeau beige pleine largeur

**Probleme** : Le bandeau beige est contenu dans `container mx-auto px-4`, ce qui le limite a la largeur du container au lieu de toute la largeur de l'ecran.

**Fichier : `src/components/home/PremiumHeader.tsx`**

- Sortir la `<nav>` du bandeau beige en dehors du `<div className="container mx-auto px-4">` pour qu'elle occupe 100% de la largeur de l'ecran
- Garder un `container mx-auto` interieur uniquement pour centrer les liens
- Supprimer le `-mx-4 px-4` actuel qui tente de compenser sans succes

---

### 2. Moodboard PDF : Correction de la deformation

**Probleme** : Le clone utilise `cloneNode(true)` qui copie les elements HTML mais perd les styles CSS computes (Tailwind classes ne sont pas resolues dans le clone hors-ecran). Les images se deforment car la grille CSS ne s'applique pas correctement au clone de 794x1123px.

**Fichier : `src/services/moodboardPdfService.ts`**

- Au lieu de cloner l'element et le repositionner hors-ecran, capturer directement l'element visible avec `html2canvas` en utilisant ses dimensions actuelles
- Calculer le ratio pour mapper le canvas sur une page A4 sans deformation
- Supprimer la logique `createPdfCaptureCopy` qui cause les problemes
- Utiliser `html2canvas` directement sur l'element original `#moodboard-canvas` avec `scale: 2` pour la qualite
- Calculer les dimensions proportionnelles pour que l'image tienne dans la page A4 en conservant le ratio d'origine

```text
Approche :
1. Capturer l'element tel qu'il est affiche (pas de clone)
2. Obtenir le ratio largeur/hauteur du canvas
3. Centrer l'image sur la page A4 en respectant le ratio
```

---

### 3. Nouvelle fonctionnalite : "Site Internet" dans le dashboard

**Fichier : `src/components/dashboard/DashboardSidebar.tsx`**

- Ajouter un lien "Site Internet" dans la sidebar (icone `Globe` de lucide-react), place apres "Moodboard"
- Ce lien ouvrira un modal (pas une navigation)
- Utiliser un state `showSiteInternetModal` et un composant `SiteInternetModal`

**Nouveau fichier : `src/components/dashboard/SiteInternetModal.tsx`**

- Modal (utilisant `DashboardModal` ou `Sheet`) avec :
  - Titre : "Votre site de mariage personnalise"
  - Description : "Creez un site internet elegant et personnalise pour votre mariage, partage avec vos invites. Design editorial sur-mesure."
  - Tarif : "50 euros - Site cle en main" (mise en avant)
  - Exemple visuel : lien vers `/severine-et-olivier` avec un apercu textuel des fonctionnalites (countdown, programme, RSVP, hebergements, etc.)
  - Bouton "Voir l'exemple" qui ouvre `/severine-et-olivier` dans un nouvel onglet
  - Formulaire de contact simple : Nom, Email, Message/details du mariage
  - Bouton "Demander mon site" qui envoie le formulaire (via `supabase.functions.invoke('send-contact-email')` ou insertion dans une table `site_requests`)
- Style coherent : `rounded-none`, `bg-editorial-beige`, `text-editorial-noir`

---

### Resume technique

| Fichier | Modification |
|---------|-------------|
| `src/components/home/PremiumHeader.tsx` | Sortir le bandeau beige du container pour pleine largeur |
| `src/services/moodboardPdfService.ts` | Capturer l'element original sans clone, conserver le ratio |
| `src/components/dashboard/DashboardSidebar.tsx` | Ajouter lien "Site Internet" avec icone Globe |
| `src/components/dashboard/SiteInternetModal.tsx` | Nouveau : modal avec description, prix 50 euros, exemple /severine-et-olivier, formulaire de contact |

