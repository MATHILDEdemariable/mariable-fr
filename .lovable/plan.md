# Nouveau logo + couleur verte pour les CTA

## 1. Remplacement du logo par le cachet "M"

Le fichier `cachet_M.webp` sera copie dans `public/cachet_M.webp`, puis le composant `Logo.tsx` sera mis a jour pour pointer vers cette nouvelle image.

**Fichier : `src/components/Logo.tsx**`

- Changer `src` de `/logo-mariable-new.webp` vers `/cachet_M.webp`
- Ajuster la taille (`h-12 w-12` au lieu de `h-16 w-auto`) pour un rendu harmonieux du cachet rond

**Fichier : `src/components/home/PremiumHeader.tsx**`

- Retirer le filtre `brightness-0 invert` sur le logo en homepage : le cachet vert rend bien tel quel sur fond sombre (pas besoin de l'inverser en blanc)

## 2. CTA du hero en vert olive au lieu de beige mais aussi sur le reste des pages 

**Fichier : `src/pages/Mariable.tsx` (ligne 63)**

- Remplacer `bg-editorial-beige text-primary` par `bg-editorial-olive text-white hover:bg-editorial-olive/90`
- Le bouton "Creer mon compte gratuit" aura desormais un fond vert `#63745a` avec texte blanc

Les autres CTA du site utilisent deja `bg-editorial-olive text-white` (sections Conciergerie, Temoignages, etc.) donc ils sont deja corrects.

## Resume des modifications


| Fichier                                 | Modification                                    |
| --------------------------------------- | ----------------------------------------------- |
| `public/cachet_M.webp`                  | Copie du fichier uploade                        |
| `src/components/Logo.tsx`               | Nouvelle image `/cachet_M.webp`, taille ajustee |
| `src/components/home/PremiumHeader.tsx` | Retrait du filtre invert sur le logo homepage   |
| `src/pages/Mariable.tsx`                | CTA hero : `bg-editorial-olive text-white`      |
