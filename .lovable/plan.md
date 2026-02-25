
# Corrections globales : CTA verts, sections vertes, logo, tagline

## 1. Logo : taille naturelle (non deformee)

**Fichier : `src/components/Logo.tsx`**
- Retirer les contraintes `w-12 h-12` qui forcent un carre et deforment le cachet
- Utiliser `h-12 w-auto` pour respecter les proportions naturelles de l'image
- Mettre a jour `width` et `height` HTML en coherence

## 2. Tagline du hero

**Fichier : `src/pages/Mariable.tsx` (lignes 42-49)**
- Titre h1 : "Le wedding planning, entre vos mains."
- Sous-titre : "Outils intelligents pour les couples" + retour a la ligne + "qui organisent seuls -- et le font bien."

## 3. Boutons CTA "En savoir plus" des cartes prestataires : fond vert

**Fichier : `src/components/vendors/VendorCard.tsx` (ligne 256)**
- Remplacer `bg-editorial-noir hover:bg-editorial-noir/80` par `bg-editorial-olive hover:bg-editorial-olive/90 text-white`

## 4. Bouton "Voir tous les professionnels" : fond vert

**Fichier : `src/components/home/VenuesSection.tsx` (ligne 176)**
- Remplacer `bg-editorial-noir hover:bg-editorial-noir/80 text-white` par `bg-editorial-olive hover:bg-editorial-olive/90 text-white`

## 5. Bouton "Selection personnalisee offerte" : fond vert + texte blanc

**Fichier : `src/components/home/VenuesSection.tsx` (ligne 100)**
- Remplacer `bg-editorial-beige text-primary` par `bg-editorial-olive text-white hover:bg-editorial-olive/90`

## 6. Section "Rejoignez le club Mariable" : fond vert au lieu de beige, boutons fond blanc + texte noir

**Fichier : `src/pages/Mariable.tsx` (lignes 197-238)**
- Section : `bg-editorial-olive` au lieu de `bg-editorial-beige`
- Texte h2 : `text-white` au lieu de `text-editorial-noir`
- Bouton "Rejoindre le Club" : `bg-white text-editorial-noir hover:bg-white/90` au lieu de `bg-editorial-noir text-white`
- Boutons "Devenir Lieu Ambassadeur" et "Devenir Partenaire" : `bg-white text-editorial-noir` au lieu de `bg-primary`

## 7. Page Prix : sections beige deviennent vertes, boutons adaptes

**Fichier : `src/pages/Prix.tsx`**
- Ligne 98 : hero `bg-editorial-beige` -> `bg-editorial-olive`, textes en blanc
- Ligne 119 : card header gratuit `bg-editorial-beige` -> `bg-editorial-olive/10` (leger vert)
- Ligne 252 : colonne premium `bg-editorial-beige/50` -> `bg-editorial-olive/10`
- Ligne 307 : section CTA finale `bg-editorial-beige` -> `bg-editorial-olive`, textes en blanc
- Boutons CTA : `bg-white text-editorial-noir` au lieu de `bg-editorial-noir text-white` (sur fond vert)

## 8. Page Partenaire : sections beige deviennent vertes

**Fichier : `src/pages/MariablePartenaire.tsx`**
- Ligne 63 : hero `bg-editorial-beige` -> `bg-editorial-olive`
- Ligne 389 : CTA final `bg-editorial-beige` -> `bg-editorial-olive`, textes en blanc, bouton `bg-white text-editorial-noir`

## 9. Page Ambassadeur : sections beige deviennent vertes

**Fichier : `src/pages/MariableAmbassadeur.tsx`**
- Ligne 72 : hero `bg-editorial-beige` -> `bg-editorial-olive`, ajuster gradient overlay
- Ligne 73 : gradient `from-editorial-beige/30` -> `from-editorial-olive/30`
- Ligne 439 : CTA final `bg-editorial-beige` -> `bg-editorial-olive`, textes en blanc, bouton `bg-white text-editorial-noir`

## 10. Page Comparatif : section beige devient verte

**Fichier : `src/pages/Comparatif.tsx` (ligne 54)**
- `bg-editorial-beige` -> `bg-editorial-olive`, textes en blanc, bouton `bg-white text-editorial-noir`

---

## Resume des fichiers modifies

| Fichier | Modification |
|---|---|
| `src/components/Logo.tsx` | `h-12 w-auto` pour proportions naturelles |
| `src/pages/Mariable.tsx` | Nouvelle tagline hero + section club en vert + boutons blancs |
| `src/components/vendors/VendorCard.tsx` | CTA "En savoir plus" en vert |
| `src/components/home/VenuesSection.tsx` | 2 boutons en vert |
| `src/pages/Prix.tsx` | Sections beige -> vert, boutons adaptes |
| `src/pages/MariablePartenaire.tsx` | Sections beige -> vert |
| `src/pages/MariableAmbassadeur.tsx` | Sections beige -> vert |
| `src/pages/Comparatif.tsx` | Section beige -> vert |
