
# Ajustements `/versionjuin26` — ton premium, moins commercial

## 1. HeroV2 — recentrer le message

- **H1 serif (gros)** : "Le premier wedding planner de poche"
- **Sous-titre** : "Pour les futurs mariés qui organisent eux-mêmes."
- **Eyebrow** conservé : "WEDDING PLANNING NOUVELLE GENERATION"
- **Un seul CTA** : "Découvrir Mariable" → ancre `#planner-included` (suppression du bouton "Voir les témoignages")
- La phrase **"Et si tu oubliais quelque chose ?"** quitte le hero (réutilisée dans PainPoints / CTA final, voir §5 et §6)

## 2. Réordonner les sections

Nouvel ordre dans `VersionJuin26.tsx` :

```
Hero
ReassuranceBar
PainPointsSection            ← "Organiser un mariage, c'est un second job"
EspaceApercu (refonte)       ← descendu sous PainPoints, nouveau layout 2 col
IncludedSection
DifferentiatorSection
PremiumTestimonialsSection   ← forcer fond blanc (override)
PricingHighlight (refonte)
FAQSection
BlogSection
FinalCTASection
```

## 3. EspaceApercu — refonte 2 colonnes avec visuel iPad

Reprendre le **visuel iPad/iPhone "Coordination Jour J"** de la page d'accueil actuelle (présent dans `PremiumConciergerie.tsx` — repartir de ce mockup mobile : header vert sage "Coordination Jour J / Votre mariage", 3 cards horaires 14:00 Arrivée invités / 15:30 Cérémonie / 17:00 Cocktail, badge "Photographe : En position").

- **Layout** : 2 colonnes desktop, stacked mobile
  - **Gauche** : mockup mobile (extrait/duplication du composant existant de `PremiumConciergerie.tsx`)
  - **Droite** : titre serif "Aperçu de ton espace Mariable" + liste 6 fonctionnalités avec check vert sage, sans prix
- Fond **blanc** (pas beige)

## 4. PremiumTestimonialsSection — fond blanc

Ce composant utilise par défaut un fond beige/cream. Sur cette page seulement, l'envelopper dans un wrapper qui force `bg-white` (via `<div className="bg-white [&_section]:!bg-white">` ou un override ciblé) sans toucher le composant global.

## 5. DifferentiatorSection — adoucir + corriger le copy

- **Fond** : passer du `bg-editorial-noir` à `bg-editorial-cream` (ou blanc), texte foncé. Garder uniquement un accent vert sage.
- **Colonne Mariable — réécrire les puces** :
  - "Guides, conseils et modèles pré-paramétrés boostés à l'IA"
  - "Pensé comme un wedding planner professionnel — pas un assistant générique"
  - "Tout centralisé, partout, tout le temps"
  - "29€, une fois, à vie — tu gardes le contrôle"
- **Ajouter une ligne comparaison ChatGPT** (sous la grille, italic discret) :
  > "ChatGPT répond à tes questions. Mariable, lui, est déjà paramétré comme un wedding planner — chaque outil, chaque modèle, chaque étape a été pensé pour coordonner ton mariage. Un service de travail, pas un assistant."
- Retirer toute mention "IA qui répond à tes questions".

## 6. PricingHighlight — éviter la répétition

- **Titre** actuel : "29€. Une fois. À vie." → remplacer par : **"Un investissement unique."**
- Garder le prix `29€` (avec `59€` barré) **mais sans répéter "Une fois. À vie."** dans le titre. Le micro-trust en dessous garde "Paiement unique · Accès à vie · Remboursé si pas satisfait·e".
- Garder la comparaison wedding planner 2000€.

## 7. FinalCTASection — nouvelle accroche

- Remplacer le titre actuel ("Tu n'oublieras rien" ou équivalent) par :
  - **H2** : "Et si tu oubliais quelque chose ?"
  - **Sous-titre / CTA** : "Crée ton compte Mariable dès maintenant"
- Conserver le lien Instagram déjà présent.

## Fichiers touchés

- `src/components/home/v2/HeroV2.tsx` — nouveau H1/sous-titre, 1 seul CTA
- `src/components/home/v2/EspaceApercu.tsx` — refonte 2 colonnes + mockup iPad/mobile repris de `PremiumConciergerie.tsx`
- `src/components/home/v2/DifferentiatorSection.tsx` — fond clair, copy IA corrigé, paragraphe ChatGPT
- `src/components/home/v2/PricingHighlight.tsx` — titre reformulé sans répétition
- `src/components/home/v2/FinalCTASection.tsx` — nouvelle accroche
- `src/pages/VersionJuin26.tsx` — réordonner sections + wrapper bg-white autour de `PremiumTestimonialsSection`

## Hors scope

- Pas de modif du `PremiumConciergerie.tsx` original (on duplique le mockup visuel dans `EspaceApercu`).
- Pas de modif du footer global ni des tokens design.
- Page reste `noindex`.
