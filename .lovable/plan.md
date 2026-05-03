## 4 changements demandés

### 1. Refonte fiche prestataire `/prestataire/:slug` — éditoriale

**Fichier :** `src/pages/prestataire/slug.tsx`

Réorganiser l'ordre du contenu pour donner la priorité aux photos et aux infos, et reléguer les prix/formules en dernier.

**Nouvel ordre :**
1. Hero photo full-width (inchangé visuellement)
2. **Bouton « Retour » repositionné** : actuellement `top-4 left-4` → caché par le sticky header. Le déplacer hors du hero, dans une barre dédiée juste sous le header (sticky-safe : `mt-20` ou positionné sous le PremiumHeader avec un fond blanc/discret).
3. Infos clés (nom déjà dans hero) + description « À propos »
4. **Galerie photo complète** (remontée — actuellement après les formules)
5. Avis Google
6. Documents utiles (brochures)
7. More info / site web
8. **Formules / Prix EN DERNIER**

**Sections SUPPRIMÉES :**
- ❌ Section « Les Avantages » (le bloc 4 cards capacité/prix/Club Mariable/avis)
- ❌ Sidebar droite « Demander les disponibilités » + bouton Contacter + alerte Club Mariable + dialogs RDV/Contact
- ❌ Toute mention « Club Mariable » sur la fiche

**Layout :** passer d'un layout 2 colonnes (contenu + sidebar) à un layout 1 colonne centrée (`max-w-4xl` ou `max-w-5xl`) plus éditorial.

**À garder :** les modals `VendorContactModal` et `VendorMessageModal` peuvent être supprimés du fichier (plus utilisés).

### 2. Suppression du bouton « Sélection personnalisée offerte » (Homepage + Pros)

- **`src/components/home/VenuesSection.tsx`** (lignes 98-104) : supprimer le bloc CTA « Sélection personnalisée offerte ». Garder le modal import / state si utilisé ailleurs ou le supprimer entièrement.
- **`src/pages/ProfessionnelsMariable.tsx`** (lignes 339-347) : supprimer le bouton « Sélection personnalisée » qui apparaît à côté du compteur de résultats. Garder le compteur seul.

### 3. Refonte `/professionnelsmariable` — esprit magazine

**Fichier :** `src/pages/ProfessionnelsMariable.tsx`

Garder la **fonctionnalité filtres** (search, pills catégories, région, pagination) mais habiller la page comme un magazine éditorial Mariable.

**Changements :**
- **Hero** : remplacer le hero overlay sombre actuel par un hero éditorial type homepage : fond beige `bg-premium-base` ou `bg-editorial-beige/30`, titre serif imposant (« Le guide des prestataires mariage » / « Notre sélection éditoriale »), sous-titre élégant, **petite image éditoriale** (pas plein écran assombri), pas de double CTA bruyant — un seul lien discret « Découvrir la sélection ↓ ».
- **Section éditoriale d'intro** (nouvelle) : 1 paragraphe manifesto-style avant les filtres, expliquant la sélection (qualité, valeurs, curation).
- **Filtres restylés** :
  - Search bar plus fine, sans border épaisse, fond beige, design éditorial
  - Category pills : style plus subtil (sans `bg-editorial-noir` quand actif → utiliser `border-b-2 border-premium-sage` ou underline éditorial)
  - Région : select simple aligné
- **Grille prestataires** : garder VendorCard mais avec plus d'air entre les cartes (`gap-8` au lieu de `gap-4`), passer en 2-3 colonnes max au lieu de 4 sur desktop pour respiration magazine.
- **Section éditoriale entre les résultats** (optionnel) : tous les 8 prestataires, insérer un encart magazine (citation, mise en avant d'une catégorie, mini-article).
- ❌ Supprimer la section « How It Works » (déjà retirée du JSX, supprimer le composant inutilisé).
- ❌ Supprimer le bouton « Sélection personnalisée » (cf. point 2).
- Conserver : filtres, pagination, navigation vers fiches prestataires, cart icon.

**Hero sticky-safe** : ajouter padding-top suffisant pour ne pas être masqué par PremiumHeader.

### 4. Header incorrect sur `/services/budget` et pages `/mariage-<région>`

**Problème :** ces pages utilisent `import Header from '@/components/Header'` au lieu de `PremiumHeader` (qui est le header officiel du site).

**Action :** remplacer dans les 13 pages Mariage régionales + `services/Budget.tsx` :

```tsx
- import Header from '@/components/Header';
+ import PremiumHeader from '@/components/home/PremiumHeader';
...
- <Header />
+ <PremiumHeader />
```

Fichiers à modifier (14 au total) :
- `src/pages/services/Budget.tsx`
- `src/pages/MariageAuvergneRhoneAlpes.tsx`
- `src/pages/MariageBourgogne.tsx`
- `src/pages/MariageBretagne.tsx`
- `src/pages/MariageCentreValLoire.tsx`
- `src/pages/MariageCorse.tsx`
- `src/pages/MariageGrandEst.tsx`
- `src/pages/MariageHautsFrance.tsx`
- `src/pages/MariageNormandie.tsx`
- `src/pages/MariageNouvelleAquitaine.tsx`
- `src/pages/MariageOccitanie.tsx`
- `src/pages/MariageParis.tsx`
- `src/pages/MariagePaysLoire.tsx`
- `src/pages/MariageProvence.tsx`

Note : si le layout casse à cause du sticky PremiumHeader (qui demande un padding-top), ajouter `pt-20` sur le main de chaque page régionale.

### Hors scope

- Pas de changement DB, pas de changement de routes
- Les 16 autres pages utilisant l'ancien `Header` (CGV, Login, etc.) ne sont pas touchées (l'utilisateur a explicitement listé budget + mariage régions)
- Les composants modaux `VendorContactModal`/`VendorMessageModal` ne sont pas supprimés du codebase (peuvent être réutilisés ailleurs)
