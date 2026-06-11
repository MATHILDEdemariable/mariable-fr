## Plan d'implémentation SEO/GEO — mariable.fr

Intégration de l'audit du 9 juin 2026. Domaine canonique : `https://www.mariable.fr`. Routes obsolètes confirmées exclues : `/mariable`, `/accueilclubmariable`, `/accueilprofessionnels`.

---

### Sprint 0 — Findings scanner (immédiat, < 1h)

**0.1 Sitemap** — `supabase/functions/generate-sitemap/index.ts` + `public/sitemap.xml`
- Retirer entrée stale : `/services/prestataires`
- Ajouter : `/accueil`, `/domainedelafontaine` (après vérif qu'elles sont publiques & indexables)
- Vérifier inclusion blog + jeunes-mariés + régions (déjà dynamique)
- Redéployer edge function

**0.2 robots.txt** — confirmer `Sitemap: https://www.mariable.fr/sitemap.xml`

**0.3 Google Search Console**
- Connecter via `standard_connectors--connect` (`google_search_console`)
- Vérifier propriété `https://www.mariable.fr/` (META déjà en place)
- Soumettre le sitemap

---

### Sprint 1 — Fondations (P1, semaines 1-2)

**1.1 Nettoyage indexation**
- Ajouter `<meta robots="noindex">` via Helmet sur : `/planning-public/*`, `/checklist-public/*`, `/exemplesite`, `/preview`, `/demo*`, `/severine-et-olivier`
- Audit canonicals : supprimer doublons `index.html` vs Helmet (déjà mémo : Helmet-only)

**1.2 Refonte 13 pages régionales** (`MariageProvence.tsx`, etc.)
- Passer chacune à 800-1200 mots : H1 unique + 4-5 H2 (lieux, traiteurs, photographes, saisonnalité, budget)
- 3-5 prestataires liés depuis marketplace
- FAQ régionale 3-4 Q + JSON-LD FAQPage
- Garder LocalBusiness JSON-LD existant

**1.3 Top 4 pages trafic — optimisation**
| Page | Action |
|---|---|
| `/checklist-mariage` | Enrichir à 1500 mots + HowTo schema + TOC ancrée |
| `/services/budget` | Section "Comment calculer" + chiffres moyens |
| `/mariage-paris` | Guide lieux + prestataires + saisonnalité |
| Article témoins | `dateModified` 2026 + section "Rôle légal vs symbolique" |

---

### Sprint 2 — Maillage & autorité (P1/P2, semaines 3-4)

**2.1 Maillage**
- Page hub `/outils-mariage` regroupant checklist + budget + plan de table + RSVP + moodboard
- Footer simplifié 4 colonnes thématiques
- BreadcrumbList JSON-LD + breadcrumbs visibles sur pages > niveau 1

**2.2 Pages stratégiques (GEO P1)**
- `/a-propos` éditorial : histoire, fondatrice, chiffres, mission
- `/chiffres-cles` : "X couples", "Y prestataires", "Z€ budget moyen"
- `/presse` : mentions médias
- `/faq` enrichie + FAQPage JSON-LD

**2.3 E-shop `/guides`**
- JSON-LD Product par guide
- Meta description transactionnelle ("PDF — 4€ — Téléchargement immédiat")

---

### Sprint 3 — Contenu & GEO (P2, continu)

**3.1 Blog** — cadence 2 articles/mois, 1500+ mots, ciblage questions ("comment choisir photographe", "combien coûte mariage 100 personnes"). Schema BlogPosting + `author`/`datePublished`/`dateModified` systématiques.

**3.2 GEO**
- Enrichir `public/llms.txt` : sections Chiffres clés, Méthodologie sélection, Tarification (gratuit vs 29€)
- Créer `public/humans.txt`
- Créer page `/methodologie` (citée par IA)

**3.3 Backlinks** — audit Semrush du profil de liens (à demander), cibles presse mariage + partenariats.

---

### Sprint 4 — Technique avancée (P3, semaine 9+)

- Monitoring Core Web Vitals via GSC
- Préparer hreflang FR/EN quand `/en` publié (i18n Phase 1 déjà en cours)
- Audit `alt` images manquants + lazy-loading systématique
- Si > 500 URLs : sitemap segmenté (sitemap-blog.xml, sitemap-pages.xml, sitemap-prestataires.xml)

---

### Quick wins cette semaine

1. `dateModified` → 2026 sur `/conseilsmariage/temoins-de-mariage…` (27 % du trafic)
2. FAQPage JSON-LD sur `/contact/faq`
3. Enrichir `/checklist-mariage` à 1500 mots + HowTo schema
4. Page `/chiffres-cles` + enrichir `/about/histoire`
5. Noindex sur pages publiques privées

---

### KPI cibles 6 mois

| Métrique | Actuel | Cible |
|---|---|---|
| Mots-clés organiques FR | 107 | 400+ |
| Trafic organique | 29/mo | 500+/mo |
| Pages générant du trafic | 4 | 15+ |
| Position moyenne top-10 | ~10 | top 5 |

---

### Ordre d'exécution

```
Jour 0    → Sprint 0 (findings scanner)
S1-2      → Sprint 1 (fondations + régions + top 4)
S3-4      → Sprint 2 (maillage + pages stratégiques)
S5-8      → Sprint 3 (blog + GEO)
S9+       → Sprint 4 (technique avancée)
```

### Hors scope
- Pas de refacto du mécanisme sitemap (edge function + statique conservés)
- Pas de migration React Helmet → autre lib
- Routes obsolètes `/mariable`, `/accueilclubmariable`, `/accueilprofessionnels` : nettoyage code séparé si souhaité

### Question avant build
Par où on commence ? Sprint 0 seul (correctif immédiat) ou Sprint 0 + quick wins de la semaine ?
