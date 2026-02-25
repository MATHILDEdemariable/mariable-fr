

# Modifications demandees : Guide Jour-J, Header transparent et couleur verte

## 1. Page /guide-jour-j : remplacer le PDF et utiliser PremiumHeader

**Fichier : `src/pages/GuideDuJourJ.tsx`**

- Remplacer `import Header from '@/components/Header'` par `import PremiumHeader from '@/components/home/PremiumHeader'`
- Remplacer `<Header />` par `<PremiumHeader />`
- Copier le nouveau PDF uploadé vers `public/guide-jour-j.pdf` pour remplacer l'ancien

**Fichier : nouveau fichier** `public/guide-jour-j.pdf` (copie du PDF uploadé)

---

## 2. Header transparent sur la page d'accueil (sur la video)

L'objectif est que le header se superpose a la video hero sans fond blanc, comme sur le site "The Host" en reference.

**Fichier : `src/components/home/PremiumHeader.tsx`**

- Sur la homepage uniquement (`isHomepage`), rendre le header transparent : `bg-transparent` au lieu de `bg-white`, supprimer le `border-b`
- Le texte du header passe en blanc sur la homepage (logo, boutons)
- La barre de navigation niveau 2 (beige) est supprimee ou rendue transparente aussi
- Les liens de navigation s'integrent directement dans le header principal

**Fichier : `src/components/home/PremiumHeroSection.tsx`**

- Supprimer le `page-content` padding-top sur le hero pour que la video soit bien plein ecran sous le header transparent

**Fichier : `src/index.css`**

- Ajuster le `--header-offset` ou le comportement du `page-content` pour que la homepage n'ait pas le padding-top du header fixe (puisque le header est overlay)

---

## 3. Remplacer le beige par le vert #63745a pour les CTA

**Fichier : `tailwind.config.ts`**

- Changer `editorial.beige` de `'#E1DACA'` vers `'#63745a'`

Attention : cela impacte globalement tous les usages de `editorial-beige` (environ 28 fichiers). Il faut donc verifier que les usages en fond de section (comme `bg-editorial-beige`) restent coherents. Comme beaucoup de ces usages sont des fonds de section ou hover states, deux approches possibles :

**Approche recommandee** : Ne PAS changer la variable `editorial-beige` globalement (cela casserait les fonds de sections clairs). A la place :
- Ajouter une nouvelle couleur `editorial.sage: '#63745a'` dans tailwind config
- Remplacer les CTA qui utilisent `bg-editorial-beige` par `bg-editorial-sage text-white`
- Remplacer les CTA qui utilisent `bg-editorial-olive` par `bg-[#63745a] text-white`
- Mettre a jour `editorial.olive` de `'#4A5548'` vers `'#63745a'` puisque c'est la couleur principale des CTA

**Fichier : `tailwind.config.ts`** (ligne 77)
- Changer `editorial.olive` de `'#4A5548'` vers `'#63745a'`

Cela met a jour automatiquement tous les boutons CTA du site qui utilisent deja `bg-editorial-olive text-white` (hero, sections, etc.) vers la nouvelle teinte verte.

Les fonds beige des sections restent inchanges (ils gardent `editorial-beige: '#E1DACA'`).

La barre de navigation niveau 2 du header passera de beige a transparente (point 2), donc pas d'impact.

---

## Resume des fichiers modifies

| Fichier | Modification |
|---|---|
| `public/guide-jour-j.pdf` | Remplacement par le nouveau PDF uploade |
| `src/pages/GuideDuJourJ.tsx` | Header -> PremiumHeader |
| `src/components/home/PremiumHeader.tsx` | Header transparent + texte blanc sur homepage |
| `src/components/home/PremiumHeroSection.tsx` | Ajustement pour hero plein ecran sous header overlay |
| `src/index.css` | Gestion du padding-top conditionnel pour homepage |
| `tailwind.config.ts` | `editorial.olive` passe de `#4A5548` a `#63745a` |

