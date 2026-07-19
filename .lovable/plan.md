## 1. Refonte page /register — Gratuit en avant, Premium en second onglet

**Fichier:** `src/pages/auth/Register.tsx`

- Ajouter `Tabs` shadcn en haut du formulaire :
  - **"Compte gratuit"** (défaut, actif) → formulaire email/password/nom, CTA "Créer mon compte gratuit"
  - **"Premium 29€ à vie"** → même formulaire + redirection Stripe checkout après création
- Retirer toutes les mentions prix/Premium/comparatifs de l'onglet gratuit
- Sous l'onglet gratuit : texte discret "Vous pourrez passer Premium plus tard depuis votre dashboard"
- Conserver la logique auth Supabase existante (signUp, emailRedirectTo, redirections)

## 2. Nouvelle page /refontejuillet — refonte éditoriale (sans toucher à la home actuelle)

**Nouveau fichier :** `src/pages/RefonteJuillet.tsx`  
**Nouvelle route** dans `src/App.tsx` : `/refontejuillet` → `<RefonteJuillet />`

La page `Index.tsx` / `Mariable.tsx` actuelle reste inchangée. Aucune migration BDD.

**D.A. conservée :** tokens existants (`--editorial-noir`, `--editorial-beige` #F8F5EF, `--wedding-olive`, Playfair Display, `rounded-none`). Aucune nouvelle couleur.

### Structure de RefonteJuillet.tsx

```
EditorialHeader                     ← nouveau (utilisé UNIQUEMENT sur cette page)
HeroEditorial (vidéo actuelle)
ManifestoBand
EditorialFeatured        id="selection"
EditorialCarousels       (BDD prestataires)
PremiumToolsCoordinationSection  ← composant existant réutilisé
TestimonialsEditorial    (verbatims fournis)
BlogSection              ← existant réutilisé
EditorialRendezVous
FAQSection               ← existant réutilisé
FinalEditorialCTA
Footer                   ← existant
```

### Nouveaux composants (dossier `src/components/home/editorial/`)

**`EditorialHeader.tsx`**
- Sticky, fond `bg-editorial-beige`, hairline `border-b border-editorial-noir/10`
- Gauche : wordmark **mariable** minuscules Playfair (text-2xl)
- Droite : `INSTAGRAM` (tracking-widest text-xs) · toggle FR|EN · burger (3 traits)
- Burger → overlay plein écran, slide-in droite 300ms, Échap + croix pour fermer :
  - Liens majuscules alignés droite : `NOS RECOMMANDATIONS` (/professionnelsmariable), `L'APPLI` (/register-gratuit), `EBOOKS` (/guides), `À PROPOS` (/about), `CONTACT` (/contact/nous-contacter)
  - Pied overlay : "Se connecter" (/login) + "Espace professionnels" (/partenariat) + INSTAGRAM + toggle FR|EN

**`HeroEditorial.tsx`**
- Reprend la vidéo background actuelle + overlay sombre
- Centré : "mariable" petit tracking-widest ; titre serif *Les plus beaux lieux & pros,* ***sélectionnés*** *— et l'appli qui vous accompagne jusqu'au Jour J.*
- UN SEUL CTA outline blanc "Découvrir Mariable" → ancre `#selection`

**`ManifestoBand.tsx`** — filets hairline haut/bas ; label `NOTRE ENGAGEMENT` ; titre *Une sélection, pas un annuaire.* (italique sur "pas un annuaire") ; paragraphe manifesto complet.

**`EditorialFeatured.tsx`** — grille 2/3 – 1/3
- Gauche : L'ADRESSE DE LA SEMAINE (image + titre serif overlay + tag localisation) — contenu statique éditable en tête de fichier
- Droite : ZOOM SUR (image verticale + légende 2 lignes) — statique
- Clic → modale verrou (voir plus bas)

**`EditorialCarousels.tsx`** — 3 carrousels **dynamiques** (React Query, staleTime 5min, select explicite : `nom, ville, region, categorie, photo_principale, slug`)
- **PAR RÉGION** (Provence, Bretagne, Paris & IDF)
- **PAR ENVIE** (petit comité, château, bord de mer, campagne chic — filtre sur tags/description)
- **PAR CATÉGORIE** (Photographes, Traiteurs, DJ)
- Chaque carrousel : label petites capitales + flèches ← → ; scroll horizontal `snap-x` + `scrollBy({ left: ±320 })` ; cartes image ratio fixe + légende serif 2 lignes + "Découvrir" souligné
- Mobile : swipe tactile natif
- Sous chaque : lien "Voir toute la Sélection →" (verrou)

**`SelectionLockModal.tsx`** — règle de verrou partagée
- Cartes non-cliquables vers détail public
- Pastille "Détail réservé aux membres" en overlay bas
- Clic → shadcn Dialog : "Créez votre compte gratuit pour accéder aux adresses de la Sélection" + bouton "Créer mon compte gratuit" (`/register-gratuit`)
- Bypass modale si `useAuth()` retourne un user connecté (redirection vers fiche prestataire)

**`TestimonialsEditorial.tsx`** — titre *Ils ont célébré leur histoire avec Mariable* ; 3 cartes sobres avec filet hairline ; **verbatims exacts fournis** (Julie & Thomas Paris, Emma & Lucas Bretagne, Sophie & Marc Provence).

**`EditorialRendezVous.tsx`** — label `CONSEILS & INSPIRATIONS` ; 3 blocs filet supérieur épais + label petites capitales : ebooks → `/guides`, conseils → `/conseilsmariage`, faq → `/faq`.

**`FinalEditorialCTA.tsx`** — titre *Votre histoire mérite d'être bien célébrée.* ; bouton "Créer mon compte Mariable" → `/register-gratuit` ; micro-texte "Gratuit · Sans engagement · En 2 minutes".

### SEO

Sur RefonteJuillet : `<SEO>` avec title "Mariable — sélection de lieux de mariage & Wedding planner en ligne", `noindex` tant que non validée (pour ne pas dupliquer avec la home actuelle).

### Interdits respectés

Aucun de ces mots : "magazine", "réserver", "disponibilités", "dates", "prix" (contexte prestataires), "demande de devis", "sponsoring".

## Détails techniques

- **Modale** : shadcn Dialog partagé, contexte simple ou prop `onLockedClick`
- **Auth** : `useAuth()` pour bypass
- **Images** : `loading="lazy"` + `aspect-[4/5]` ou `aspect-square`
- **Micro-interactions** : `transition-colors duration-200`, `hover:underline underline-offset-4`
- **i18n** : nouvelles clés `home.editorial.*` dans `src/i18n/locales/{fr,en}/home.json`
- **Rien de modifié** sur : PremiumHeader, MobileBottomNav, Index.tsx/Mariable.tsx actuelle, autres pages, design tokens

## Questions ouvertes (bloquantes pour build)

1. **Handle Instagram** exact ? (défaut `https://instagram.com/mariable.fr` sinon)
2. **"L'adresse de la semaine" + "Zoom sur"** : photos + textes à fournir maintenant, ou placeholders éditoriaux (à remplacer plus tard) ?
3. **3ème carrousel** = "PAR CATÉGORIE" (Photo/Traiteur/DJ) — OK ou autre thème (ex "PAR SAISON") ?