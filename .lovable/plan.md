

## Audit SEO complet : Structure Hn et mots-cles

---

## PARTIE 1 : Diagnostic de la structure des balises Hn

### Page principale "/" (Mariable.tsx) - Page la plus critique

**Hierarchie actuelle :**

```text
<section> (HeroSection)
  <div container>
    <motion.div>
      <motion.div>        
        <h1> "Tout pour un mariage parfait"        -- OK : H1 unique
      </motion.div>
    </motion.div>
  </div>
</section>

<section> (VenuesSection)
  <div container>
    <motion.div>
      <h2> "Lieux & prestataires"                  -- Enfoui dans motion.div
    </motion.div>
    <aside>
      <h3> "Categories"                            -- OK
    </aside>
  </div>
</section>

<section> (PremiumToolsCoordinationSection)
  <div container>
    <div>
      <h2> "Vos outils de planification"           -- Enfoui dans div > div
      <h4> (tool titles x6)                        -- PROBLEME : saut de H2 a H4 (manque H3)
      <h4> "Coordination Jour J" (dans mockup)     -- H4 dans un mockup decoratif
    </div>
  </div>
</section>

<section> (BlogSection)
  <div container>
    <motion.div>
      <h2> "Magazine & inspirations"               -- Enfoui dans motion.div
    </motion.div>
    <h3> (titres articles dynamiques)              -- OK
  </div>
</section>

<section> (TestimonialsSection)
  <div container>
    <motion.div>
      <h2> "Ils ont organise leur mariage..."      -- Enfoui dans motion.div
    </motion.div>
  </div>
</section>

<section> (FAQSection)
  <div container>
    <motion.h2> "Vos questions"                    -- OK : motion directement sur le H2
  </div>
</section>

<section> (FinalCTASection)
  <div container>
    <motion.div>
      <h2> "Rejoignez le club Mariable"            -- Enfoui dans motion.div
    </motion.div>
  </div>
</section>
```

### Problemes identifies sur la homepage

| Probleme | Gravite | Composant |
|----------|---------|-----------|
| H1 enfoui dans 3 niveaux de div + motion.div | Moyenne | HeroSection (Mariable.tsx) |
| H2 enfouis dans motion.div dans div container | Moyenne | VenuesSection, BlogSection, TestimonialsSection, FinalCTASection |
| Saut H2 vers H4 (pas de H3 intermediaire) | Haute | PremiumToolsCoordinationSection |
| H4 utilise pour des titres decoratifs (mockup) | Basse | PremiumToolsCoordinationSection |
| Aucun element `<header>` semantique dans les sections | Moyenne | Tous les composants |

---

### Pages secondaires (Landing, Index)

| Page | Probleme | Composant |
|------|----------|-----------|
| /accueil (LandingCouple) | H1 dans PremiumHeroSection enfoui dans VideoBackground > div > div | PremiumHeroSection |
| /accueil (LandingCouple) | PremiumConciergerie : H3 pour les titres de services (OK) | -- |
| /accueil (LandingCouple) | CarnetAdressesInlineSection : H4 sans H3 parent (saut) | CarnetAdressesInlineSection |
| /coordination-jour-j | 2 balises H1 sur la meme page (ligne 163 et implicite hero) | CoordinationJourJ.tsx |
| /checklist-mariage | Structure correcte : H1 unique, sous-titres en `<p>` | OK |
| /comparatif | Structure correcte : H1 + H2 | OK |

---

### Page /coordination-jour-j : PROBLEME CRITIQUE

```text
2 balises <h1> sur la meme page :
- H1 implicite dans le hero (non visible dans l'extrait, mais potentiellement via composant)
- H1 ligne 163 : "La premiere appli de coordination jour-J"

Cela viole la regle SEO fondamentale : 1 seul H1 par page.
```

---

## PARTIE 2 : Plan de restructuration Hn

### Principe de la correction

Pour chaque composant de section, extraire le bloc titre dans un element `<header>` semantique place comme premier enfant direct de `<section>`, en conservant les animations Framer Motion sur le `<header>` lui-meme.

### Modifications par composant

**1. Mariable.tsx - HeroSection** (priorite haute)

```text
Avant :
<section>
  <div container>
    <motion.div>
      <h1>Tout pour un mariage parfait</h1>
    </motion.div>
  </div>
</section>

Apres :
<section>
  <motion.header className="container ...">
    <h1>Tout pour organiser un mariage parfait</h1>
    <p>Les meilleurs outils d'organisation...</p>
  </motion.header>
  <div container>
    ...CTA...
  </div>
</section>
```

**2. VenuesSection.tsx** (priorite haute)

```text
Avant :
<section>
  <div container>
    <motion.div className="text-center mb-16">
      <h2>Lieux & prestataires</h2>
      <p>Explorez notre selection...</p>
    </motion.div>
    ...contenu...

Apres :
<section>
  <motion.header className="container ... text-center mb-16">
    <h2>Lieux de mariage & prestataires verifies</h2>
    <p>Explorez notre selection...</p>
  </motion.header>
  <div container>
    ...contenu...
```

**3. PremiumToolsCoordinationSection.tsx** (priorite haute)

- Extraire le H2 dans un `<header>` semantique
- Changer les `<h4>` des outils en `<h3>` (correction du saut de hierarchie)
- Le H4 dans le mockup decoratif doit devenir un `<p>` ou `<span>` avec `aria-hidden="true"` (ce n'est pas un vrai titre)

**4. BlogSection.tsx** (priorite moyenne)

- Extraire le H2 dans un `<header>` semantique avec motion
- Les H3 des articles sont corrects

**5. TestimonialsSection (inline dans Mariable.tsx)** (priorite moyenne)

- Extraire le H2 dans un `<header>` semantique

**6. FAQSection (inline dans Mariable.tsx)** (priorite basse)

- Deja correct : `<motion.h2>` est enfant direct de `<div container>`
- Amelioration optionnelle : ajouter un `<header>` semantique

**7. FinalCTASection (inline dans Mariable.tsx)** (priorite basse)

- Extraire le H2 dans un `<header>` semantique

**8. CoordinationJourJ.tsx** (priorite critique)

- Supprimer le 2e H1 (ligne 163) et le remplacer par un H2

**9. CarnetAdressesInlineSection.tsx** (priorite moyenne)

- Les H4 "Selection gratuite" / "Selection premium" devraient etre des H3 (sous le H2 de la section)

**10. PremiumConciergerie.tsx** (LandingCouple)

- Extraire le H2 dans un `<header>` semantique

---

## PARTIE 3 : Diagnostic des mots-cles

### Meta-donnees de la homepage

```text
Titre actuel :
"Mariable - Le Club Prive des Futurs Maries | Professionnels & Prix Preferentiels"
= 79 caracteres (TROP LONG, recommande 50-60 max)

Description actuelle :
"Rejoignez le Club Mariable : acces gratuit aux meilleurs professionnels..."
= 168 caracteres (OK, dans la plage 150-160)
```

### Problemes de mots-cles identifies

| Probleme | Impact | Solution |
|----------|--------|----------|
| Title tag trop long (79 car.) | Haute | Raccourcir a 55-60 caracteres |
| H1 "Tout pour un mariage parfait" ne contient pas le mot-cle principal "organiser" | Haute | Reformuler |
| H2 "Lieux & prestataires" trop generique, pas de mot-cle "mariage" | Haute | "Lieux de mariage & prestataires" |
| H2 "Vos outils de planification" manque "mariage" | Moyenne | "Outils de planification mariage" |
| H2 "Magazine & inspirations" manque "mariage" | Moyenne | "Magazine & inspirations mariage" |
| H2 "Vos questions" ne contient aucun mot-cle | Haute | "Questions frequentes sur le mariage" |
| H2 "Rejoignez le club Mariable" non descriptif pour le SEO | Moyenne | Garder tel quel (CTA, pas contenu) |
| Keyword "organiser mariage" absent du H1 | Haute | Ajouter "organiser" dans le H1 |

### Mots-cles cibles absents du contenu visible

Les mots-cles suivants sont declares dans les meta tags mais absents des Hn visibles :

- "wedding planner digital" (absent de tout Hn)
- "coordination jour-j" (present uniquement dans le mockup en H4)
- "budget mariage" (absent des Hn)
- "checklist mariage" (absent des Hn)

### Recommandations de reformulation des Hn

| Actuel | Propose | Justification |
|--------|---------|---------------|
| Title: "Mariable - Le Club Prive des Futurs Maries \| Professionnels & Prix Preferentiels" | "Organiser son mariage facilement \| Mariable" | 55 car., mot-cle principal en debut |
| H1: "Tout pour un mariage parfait" | "Tout pour organiser un mariage parfait" | Ajout du mot-cle "organiser" |
| H2: "Lieux & prestataires" | "Lieux de mariage & prestataires" | Ajout "mariage" pour la semantique |
| H2: "Vos outils de planification" | "Outils de planification mariage" | Mot-cle "planification mariage" |
| H2: "Magazine & inspirations" | "Conseils & inspirations mariage" | Mot-cle "conseils mariage" + coherence footer |
| H2: "Vos questions" | "Questions frequentes sur l'organisation de mariage" | Mot-cle longue traine + FAQPage schema |
| H2: "Ils ont organise leur mariage avec Mariable" | Garder tel quel | Contient deja "organise" + "mariage" |

---

## PARTIE 4 : Resume des fichiers a modifier

| Fichier | Modifications | Priorite |
|---------|---------------|----------|
| `src/pages/Mariable.tsx` | Title tag raccourci + H1 reformule + Header semantique sur Hero, Testimonials, FAQ, FinalCTA | Critique |
| `src/components/home/VenuesSection.tsx` | Header semantique + H2 reformule | Haute |
| `src/components/home/PremiumToolsCoordinationSection.tsx` | Header semantique + H4 vers H3 + H4 mockup vers span | Haute |
| `src/components/home/BlogSection.tsx` | Header semantique + H2 reformule | Moyenne |
| `src/pages/CoordinationJourJ.tsx` | Supprimer le 2e H1 (le remplacer par H2) | Critique |
| `src/components/home/CarnetAdressesInlineSection.tsx` | H4 vers H3 | Basse |
| `src/components/home/PremiumConciergerie.tsx` | Header semantique | Basse |
| `src/components/home/PremiumTestimonialsSection.tsx` | Header semantique | Basse |
| `src/components/home/PremiumFinalCTASection.tsx` | Header semantique | Basse |

### Ce qui ne sera PAS modifie (principe "si ca marche, n'y touche pas")

- FAQSection dans Mariable.tsx : deja correct avec `motion.h2` directement dans la section
- ChecklistMariage.tsx : structure H1 unique, deja correcte
- Comparatif.tsx : structure H1 + H2 correcte
- Schema.org JSON-LD : deja bien configure
- Pages regionales (MariageProvence, etc.) : structure correcte

