# Refonte page `/versionjuin26`

## Objectif

Aligner le mockup sur l'identité Mariable (vert sage `editorial-olive`, beige, noir éditorial — **plus aucun terracotta orange**) et ajuster la structure : hero plus aéré, prix repoussé, fonctionnalités mises à jour, ajout blog + Instagram.

## Vocabulaire imposé

- ❌ "outil", "planner", "kit", "guide"
- ✅ **"service de wedding planning en ligne avec IA"**, **"Mariable"**, **"ton espace Mariable"**
- Pour ceux/celles **qui organisent eux-mêmes leur mariage**
- Toujours rappeler : **100% web, accessible navigateur — mobile, tablette, ordinateur. Aucun téléchargement.**

## Nouvelle structure (ordre)

```
PremiumHeader
1. HERO — vidéo + texte uniquement (1 colonne centrée ou 2 col texte gauche / visuel simple droite, SANS carte mockup, SANS prix, SANS phrase "wedding planner 2000€")
2. BANDE RÉASSURANCE — fond noir éditorial, 4 items (web · mobile/tablette/ordi · accès à vie · mis à jour)
3. APERÇU ESPACE MARIABLE — la carte mockup déplacée ici (présente le contenu, toujours sans prix)
4. PAIN POINTS — "Tu te reconnais ?"
5. CE QUI EST INCLUS — 6 cartes mises à jour (voir ci-dessous) + bonus carnet d'adresses
6. DIFFÉRENCIATEUR — "Pas un tableur Excel"
7. TESTIMONIALS — `PremiumTestimonialsSection` (conservée — "Ils ont organisé leur mariage avec Mariable")
8. SECTION PRIX & VALEUR — bloc dédié avec 29€ / 59€ barré + phrase "vs wedding planner 2 000€ → 70× moins cher, 100% de contrôle"
9. FAQ
10. BLOG — réutiliser `BlogSection` existant (Conseils & inspirations mariage)
11. CTA FINAL — fond crème, accent vert sage (plus de terracotta)
Footer (avec lien Instagram ajouté si manquant)
```

## Changements de design tokens

Dans les composants v2, **remplacer toutes les classes `editorial-terracotta` par `editorial-olive**` (vert sage Mariable existant) :

- Accents, puces, icônes Check, CTA primaire, hover states
- Les tokens `--editorial-terracotta` et `--editorial-gold-light` ajoutés en juin restent en place mais ne sont plus utilisés sur cette page. (Pas de suppression pour éviter régression ailleurs.)
- Le CTA principal passe sur `bg-editorial-noir text-editorial-cream hover:bg-editorial-olive` pour rester sobre, ou `bg-editorial-olive` selon contraste.

## Fonctionnalités "Ce qui est inclus" (mise à jour)

Remplacer la carte **06 Assistant IA** par **Calculateur de boissons** et intégrer l'IA comme transversale dans l'intro.

1. **01 Rétroplanning intelligent**
2. **02 Budget réel & alertes**
3. **03 Liste invités & RSVP**
4. **04 Plan de table interactif**
5. **05 Coordination Jour J**
6. **06 Calculateur de boissons** — "Calcule précisément les quantités d'alcool et boissons selon ton nombre d'invités, le format de réception et la durée."

Sous-titre de section reformulé : "Un service de wedding planning en ligne avec IA — 6 fonctionnalités pensées ensemble pour t'accompagner du oui au jour J."

## Bonus (sous la grille 6 cartes)

Remplacer les 2 bonus actuels par :

- **BONUS — Carnet d'adresses Mariable** : "Notre sélection de prestataires haut de gamme (lieux, traiteurs, photographes, fleuristes…). Une short-list de confiance."
- Garder un 2e bonus optionnel "Mises à jour à vie" ou "+10 mini-fiches PDF" (à confirmer — par défaut : Mises à jour à vie).

## Hero (HeroV2.tsx — refonte)

- Conserver la vidéo Supabase en background + overlay noir.
- **Layout 1 colonne centrée** (max-w-3xl) ou 2 cols avec un visuel décoratif simple à droite (pas la carte produit).
- Eyebrow : "Service de wedding planning en ligne avec IA"
- H1 serif : "Et si tu oubliais quelque chose ?"
- Sous-titre : "Un service complet pour celles et ceux qui organisent leur mariage eux-mêmes. Accessible depuis ton navigateur — mobile, tablette, ordinateur. Aucun téléchargement."
- CTA primaire : "Découvrir Mariable" (ancre `#planner-included`)
- CTA secondaire : "Voir les témoignages ↓"
- **Aucun prix, aucune mention "2000€" dans le hero.**

## Aperçu Espace Mariable (nouveau composant `EspaceApercu.tsx`)

Section après la bande réassurance, fond `editorial-cream` ou blanc :

- Header centré : "Aperçu de ton espace Mariable"
- Carte centrée (max-w-md) reprenant la liste des 6 fonctionnalités (sans prix, sans tag "accès à vie")
- Petit visuel ou mockup décoratif optionnel

## Section Prix & Valeur (nouveau composant `PricingHighlight.tsx`)

Placée APRÈS testimonials, AVANT FAQ :

- Fond `editorial-beige`
- Titre serif : "29€. Une fois. À vie."
- `59€` barré + `29€` mis en avant
- Liste micro : "Accès immédiat · Paiement unique · Remboursé si pas satisfait·e"
- Note italic : **"vs un wedding planner à partir de 2 000€ "**
- CTA : "Accéder à Mariable — 29€" → `/paiement`

## Blog

Réutiliser `BlogSection` existant (`src/components/home/BlogSection.tsx`) — déjà aligné avec le ton Mariable, vert sage, intitulé "Conseils & inspirations mariage". L'insérer entre FAQ et CTA final.

## Instagram

Ajouter un lien Instagram (`https://www.instagram.com/mariable.fr/` — à confirmer) :

- Dans le CTA final, sous le micro-trust : petite ligne "Suis Mariable sur Instagram →" avec icône `Instagram` de lucide-react.
- Pas de modification du Footer global (hors scope).

## Fichiers à modifier

- `src/components/home/v2/HeroV2.tsx` — refonte (retrait carte produit + prix + phrase 2000€, palette olive)
- `src/components/home/v2/ReassuranceBar.tsx` — palette olive
- `src/components/home/v2/PainPointsSection.tsx` — palette olive
- `src/components/home/v2/IncludedSection.tsx` — carte 06 = Calculateur boissons, bonus = Carnet d'adresses, palette olive
- `src/components/home/v2/DifferentiatorSection.tsx` — palette olive, copy "service" au lieu de "outil"
- `src/components/home/v2/FAQSection.tsx` — palette olive, copy ajustée
- `src/components/home/v2/FinalCTASection.tsx` — palette olive + lien Instagram + copy "service"
- `src/pages/VersionJuin26.tsx` — réordonner sections, importer `EspaceApercu`, `PricingHighlight`, `BlogSection`

## Fichiers à créer

- `src/components/home/v2/EspaceApercu.tsx` — carte aperçu déplacée depuis le hero
- `src/components/home/v2/PricingHighlight.tsx` — bloc prix + comparaison wedding planner

## Hors scope

- Pas de modification du Footer global, pas de migration, pas de backend.
- Tokens `editorial-terracotta` non supprimés (utilisés ailleurs potentiellement).
- Page reste en `noindex`.
- Pas d'i18n EN.