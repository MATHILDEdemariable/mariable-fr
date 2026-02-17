
# Plan d'optimisation SEO + GEO pour Mariable

## Partie A : Optimisations techniques dans Lovable

### 1. Sitemap : ajouter toutes les pages manquantes

**Fichier : `src/pages/Sitemap.tsx`**

Le sitemap actuel ne contient que 30 pages statiques. Il manque de nombreuses routes publiques. Ajouter :

| URL manquante | Priorite | Changefreq |
|---|---|---|
| `/prix` | 0.9 | monthly |
| `/comparatif` | 0.8 | monthly |
| `/retroplanning` | 0.8 | monthly |
| `/partenariat` | 0.7 | monthly |
| `/professionnelsmariable` | 0.9 | weekly |
| `/guide-jour-j` | 0.7 | monthly |
| `/guide-debutant` | 0.7 | monthly |
| `/ceremonie-laique` | 0.7 | monthly |
| `/mariage-civil` | 0.7 | monthly |
| `/ceremonie-catholique` | 0.7 | monthly |
| `/content-creator-mariage` | 0.6 | monthly |
| `/salon-du-mariage-2025` | 0.7 | monthly |
| `/mariage-bretagne` | 0.8 | monthly |
| `/mariage-normandie` | 0.8 | monthly |
| `/mariage-occitanie` | 0.8 | monthly |
| `/mariage-pays-de-la-loire` | 0.8 | monthly |
| `/mariage-centre-val-de-loire` | 0.8 | monthly |
| `/mariage-hauts-de-france` | 0.8 | monthly |
| `/mariage-bourgogne-franche-comte` | 0.8 | monthly |
| `/mariage-grand-est` | 0.8 | monthly |
| `/mariage-corse` | 0.8 | monthly |
| `/vibewedding` | 0.7 | monthly |
| `/installer-app` | 0.5 | yearly |
| `/cgv-couples` | 0.4 | yearly |
| `/landing-generale` | 0.6 | monthly |

Mettre a jour les `lastmod` de toutes les pages existantes a `2026-02-16`.

---

### 2. BreadcrumbList JSON-LD sur toutes les pages cles

**Fichier : `src/components/SEO.tsx`**

Ajouter un schema `BreadcrumbList` automatique base sur le `canonical` prop. Exemple : pour `/mariage-provence`, generer :

```text
Accueil > Mariage en region > Mariage Provence
```

Logique : parser le canonical pour construire le fil d'Ariane automatiquement avec un mapping de noms lisibles.

---

### 3. Ajouter le type `HowTo` dans SEOSchemaEnhanced

**Fichier : `src/components/SEOSchemaEnhanced.tsx`**

Ajouter le support du type `'HowTo'` dans le switch pour pouvoir l'utiliser via le prop `schemas` du composant SEO (actuellement seul ChecklistMariage l'utilise en dur). Cela permettra de l'ajouter facilement sur d'autres pages guides.

---

### 4. Ajouter des FAQ JSON-LD sur les pages strategiques

**Pages concernees** (ajouter le schema FAQ via le prop `schemas` du composant SEO) :

- `/prix` : questions sur les tarifs, gratuit vs premium
- `/comparatif` : questions sur les differences avec les concurrents
- `/fonctionnalites` : questions sur les outils disponibles
- `/checklist-mariage` : questions sur l'organisation
- `/coordination-jour-j` : questions sur le jour J

Pour chaque page, ajouter 3 a 5 questions/reponses pertinentes qui ciblent les requetes conversationnelles des moteurs IA.

---

### 5. robots.txt : retirer /accompagnement du Disallow

**Fichier : `public/robots.txt`**

La page `/accompagnement` est une page publique SEO mais elle est actuellement bloquee dans robots.txt (`Disallow: /accompagnement`). La retirer.

---

## Partie B : Strategie GEO (Generative Engine Optimization)

### Elements deja en place
- JSON-LD `SoftwareApplication` avec prix 0 EUR et 29 EUR (lisible par ChatGPT/Perplexity)
- JSON-LD `LocalBusiness` avec `areaServed: France`
- `FAQPage` schema via SEOSchemaEnhanced (composant pret, peu utilise)
- `HowTo` schema sur la checklist
- `BreadcrumbList` sur les temoignages
- 13 pages regionales avec meta geo-tags
- Balises Open Graph et Twitter Card completes

### Ce qui manque pour rivaliser avec les concurrents cites par ChatGPT

Les sites que ChatGPT recommande (Se-Marier.fr, Bridebook, MariageDeAaZ) ont en commun :
1. Du contenu editorial riche et indexe (articles de blog frequents)
2. Des pages "outil" avec descriptions longues et structurees
3. Des backlinks depuis des sites d'autorite mariage

---

## Partie C : Actions hors Lovable (a faire manuellement)

### Google Search Console
1. Soumettre le sitemap : `https://www.mariable.fr/sitemap.xml`
2. Inspecter manuellement chaque URL strategique (surtout les nouvelles pages regionales)
3. Demander l'indexation des pages non encore indexees

### Bing Webmaster Tools
1. Creer un compte et soumettre le site (Bing alimente les resultats de Copilot et ChatGPT Search)
2. Soumettre le meme sitemap

### Google Business Profile
1. Creer/optimiser la fiche Google Business pour "Mariable" en categorie "Service de planification de mariage"
2. Ajouter des photos, horaires, lien vers le site

### Strategie de backlinks
1. Contacter les blogs mariage FR pour des articles invites ou mentions
2. S'inscrire sur les annuaires mariage (Mariages.net, Zankyou, etc.)
3. Proposer des partenariats croisees avec les prestataires deja references

### Contenu blog (GEO)
1. Publier 1 a 2 articles/semaine sur `/conseilsmariage` avec des titres conversationnels :
   - "Comment organiser son mariage en 2025 ?"
   - "Quel budget prevoir pour un mariage en Provence ?"
   - "Les 10 erreurs a eviter pour son mariage"
2. Chaque article doit contenir un schema `BlogPosting` (deja supporte) et un `FAQPage`
3. Cibler les questions que les gens posent a ChatGPT/Perplexity

### Reseaux sociaux (signal indirect)
1. Partager chaque article blog sur Instagram/Pinterest (signaux sociaux)
2. Encourager les avis Google (alimente le AggregateRating)

---

## Resume des modifications techniques

| Fichier | Modification |
|---|---|
| `src/pages/Sitemap.tsx` | Ajouter 25+ pages manquantes au sitemap |
| `src/components/SEO.tsx` | Ajouter BreadcrumbList JSON-LD automatique |
| `src/components/SEOSchemaEnhanced.tsx` | Ajouter type `HowTo` dans le switch |
| `public/robots.txt` | Retirer `/accompagnement` du Disallow |
| Pages strategiques (prix, comparatif, fonctionnalites, checklist, coordination) | Ajouter schemas FAQ via prop `schemas` |
