
# Mockup nouvelle homepage — route `/versionjuin26`

## Objectif
Créer une **page mockup** accessible sur `/versionjuin26` qui propose une refonte orientée vente du planner Mariable 29€. La homepage actuelle `/` reste intacte. Parcours émotionnel : anxiété → soulagement → confiance → achat. Ton éditorial premium.

**Vocabulaire imposé** : ne jamais utiliser les mots "kit" ni "guide". On parle de "planner Mariable", "outil", "Mariable", "le planner", "ton espace Mariable".

## Structure de la page (ordre)

```
PremiumHeader (réutilisé)
1. HERO 2 colonnes — vidéo de fond conservée
2. BANDE RÉASSURANCE — fond noir éditorial, 4 items
3. PAIN POINTS — "Tu te reconnais ?" — 2 colonnes
4. CE QUI EST INCLUS — 6 cartes outils + rangée bonus
5. DIFFÉRENCIATEUR — "Pas un tableur Excel" — fond noir
6. PremiumTestimonialsSection (réutilisé tel quel)
7. FAQ — 6 questions, grille 2 colonnes
8. CTA FINAL — fond crème, accent terracotta
Footer (réutilisé)
```

Pas de section marketplace / carnet d'adresses.

## HERO — détails
- Vidéo Supabase existante en background (`freepik__wideangle…mp4`) + overlay sombre.
- Grid 2 col desktop / 1 col mobile, `min-h-screen`, contenu centré.
- **Gauche** : eyebrow "Le planner Mariable" · H1 serif "Et si tu oubliais quelque chose ?" · sous-titre 3 lignes · CTA principal "Accéder au planner — 29€" (→ `/paiement`) · micro-note "Les wedding planners facturent 2 000€. Toi, tu l'as pour 29€."
- **Droite** : carte mockup `bg-editorial-beige/95 backdrop-blur` listant les 6 outils inclus + prix `29€` avec `59€` barré, tag "Accès à vie".

## Sections de copie

**2. Réassurance** (fond `editorial-noir`, texte crème, séparateurs ronds terracotta) :
`Outil web — aucune installation · Ordi, tablette, mobile · Accès à vie · Mis à jour en continu`

**3. Pain points** : intro gauche + 5 items à droite avec puces cercle terracotta. Animation fadeUp stagger 100ms via IntersectionObserver natif (pas de lib externe).

**4. Ce qui est inclus** : header "Le planner dans le détail." + grille 3 cols (desktop) / 1 (mobile). 6 cartes (01-06) avec numéro, tag catégorie, titre, description, valeur estimée. Hover : fond noir / texte crème. Rangée bonus 2 colonnes fond `#E8D9BF` :
- BONUS 1 — "+10 mini-fiches PDF"
- BONUS 2 — copie à confirmer pendant l'implémentation (placeholder "Accès prioritaire aux mises à jour")

**5. Différenciateur** : titre "Pas un tableur Excel. Un outil en ligne facile et 100% personnalisable." + 2 colonnes (Autres ✕ / Mariable ✓) + note italic centrée.

**7. FAQ** : 6 Q/R via `Collapsible`, grille 2 col desktop, accordion mobile.

**8. CTA final** : H2 serif "Tu n'oublieras rien. Promis." · sous-titre "Accès immédiat. 29€. Une fois." · CTA "Accéder à mon compte Mariable →" · micro-trust "Remboursé si pas satisfait·e · Aucune installation · Accès à vie".

## Fichiers à créer
- `src/pages/VersionJuin26.tsx` — page mockup, route `/versionjuin26`
- `src/components/home/v2/HeroV2.tsx`
- `src/components/home/v2/ReassuranceBar.tsx`
- `src/components/home/v2/PainPointsSection.tsx`
- `src/components/home/v2/IncludedSection.tsx` (cartes 01-06 + bonus)
- `src/components/home/v2/DifferentiatorSection.tsx`
- `src/components/home/v2/FAQSection.tsx`
- `src/components/home/v2/FinalCTASection.tsx`

Copies hardcodées en français dans les composants pour cette version mockup (pas d'i18n — c'est une page de test, on itérera la copie avant d'industrialiser).

## Modifications fichiers existants
- `src/App.tsx` — ajouter `<Route path="/versionjuin26" element={<VersionJuin26 />} />` (lazy import).
- `tailwind.config.ts` + `src/index.css` — ajouter tokens HSL `--editorial-terracotta` (~#C4654A) et `--editorial-gold-light` (~#E8D9BF), exposés en classes `bg-editorial-terracotta`, `text-editorial-terracotta`, `bg-editorial-gold-light`. Aucune classe couleur custom dans les composants.

## Design tokens & règles
- Typo : `font-serif` (Playfair) pour H1/H2/H3, sans-serif body.
- `rounded-none` partout (boutons, cartes, inputs).
- Animations : `animate-fade-in` existant + observer natif pour stagger pain points.
- Responsive : mobile-first, breakpoint `md:` pour 2 colonnes.

## CTA — destinations
- Hero + CTA final → `/paiement`
- "Voir ce qu'il y a dans le planner ↓" (pain points) → ancre `#planner-included`

## SEO
- `<title>` : "Mariable — Le planner mariage en ligne (mockup juin)"
- `noindex` (page mockup) via `<meta name="robots" content="noindex">` dans SEO.

## Hors scope
- Aucune modification de `/` (Index.tsx) ni des autres pages.
- Pas de backend, pas de migration, pas de paiement.
- Pas de marketplace / carnet d'adresses.
- Pas d'i18n EN pour cette version mockup.
- Pas d'image générée (vidéo existante + mockups HTML/CSS).
