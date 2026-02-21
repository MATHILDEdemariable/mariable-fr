

# Audit SEO/GEO + Performance + Favicon

---

## 1. Audit meta descriptions - Pages avec problemes

### Pages SANS aucune meta description (critique)

| Page | Fichier | Probleme |
|---|---|---|
| `/contact` | `src/pages/contact/NousContacter.tsx` | Aucun `<Helmet>` ni `<SEO>` - pas de title, pas de meta description |
| `/about/approche` | `src/pages/about/Approche.tsx` | Utilise `ServiceTemplate` qui ne genere aucune balise `<Helmet>` |
| `/about/histoire` | `src/pages/about/Histoire.tsx` | Idem - pas de meta description |
| `/about/temoignages` | `src/pages/about/Temoignages.tsx` | Idem - pas de meta description |
| `/retroplanning` | `src/pages/WeddingRetroplanning.tsx` | Aucun `<Helmet>` ni `<SEO>` |

Ces 5 pages heritent uniquement de la meta description par defaut du `index.html` ("L'organisation mariage facile...") ce qui est tres mauvais pour le SEO car Google voit du contenu duplique.

### Pages avec meta description mais sans canonical (mineur)

| Page | Fichier |
|---|---|
| `/content-creator-mariage` | `src/pages/ContentCreatorMariage.tsx` |
| `/ceremonie-laique` | `src/pages/CeremoniePublic.tsx` |
| `/mariage-civil` | `src/pages/MairieCivilPublic.tsx` |
| `/ceremonie-catholique` | `src/pages/CeremonieCatholiquePublic.tsx` |
| `/installer-app` | `src/pages/InstallAppPublic.tsx` |
| `/partenariat` | `src/pages/Partenariat.tsx` |
| `/outils-planning-mariage` | `src/pages/OutilsPlanningMariage.tsx` |
| `/guide-jour-j` | `src/pages/GuideDuJourJ.tsx` |
| `/guide-debutant` | `src/pages/GuideDebutant.tsx` |

### Pages OK (meta description + canonical presents)

`/` (Mariable.tsx), `/accueil`, `/prix`, `/comparatif`, `/conseilsmariage`, `/checklist-mariage`, `/coordination-jour-j`, `/fonctionnalites`, `/contact/faq`, `/professionnels`, `/professionnelsmariable`, `/jeunes-maries`, `/coordinateurs-mariage`, `/cgv-couples`, toutes les 13 pages regionales, `/selection` (VibeWedding).

### Probleme meta description dans `index.html`

La description fallback dans `index.html` (ligne 8) est trop courte : "L'organisation mariage facile. Outils, prestataires et conseils pour planifier votre grand jour." (95 caracteres). Ideal = 150-160 caracteres.

---

## 2. Performance mobile (6.81s LCP)

### Causes identifiees dans le code

**a) Preload video sur la homepage (GROS impact)**
- `index.html` ligne 20 : `<link rel="preload" as="video" ...>` force le navigateur a telecharger une video MP4 lourde AVANT le rendu de la page
- C'est la cause n.1 du LCP lent. Le preload video bloque les autres ressources critiques

**b) Scripts tiers charges trop tot**
- Meta Pixel (Facebook) est charge de facon synchrone dans le `<head>` (lignes 57-68)
- Il bloque le First Contentful Paint

**c) Google Fonts non optimisees**
- `preconnect` vers Google Fonts est present, mais les fonts elles-memes ne sont pas preloadees
- Si Playfair Display est utilisee dans le hero, elle retarde le LCP

**d) Composants SEO-critical trop nombreux**
- 15+ pages sont importees directement (non lazy) dans `App.tsx` (lignes 14-34)
- Cela augmente le bundle initial significativement

### Actions correctives proposees

| Action | Impact | Fichier |
|---|---|---|
| Supprimer `<link rel="preload" as="video">` | Fort | `index.html` |
| Deplacer Meta Pixel en lazy (apres 3s comme GTM) | Moyen | `index.html` |
| Reduire les imports directs dans App.tsx (garder uniquement `/` et `/accueil`) | Moyen | `src/App.tsx` |
| Ajouter `fetchpriority="high"` sur l'image hero si applicable | Faible | Composant hero |
| Ajouter `loading="lazy"` sur toutes les images sous le fold | Faible | Divers |

---

## 3. Favicon - Comment le changer

Le favicon actuel (`/favicon.ico`, `/favicon-16x16.png`, `/favicon-32x32.png`, `/apple-touch-icon.png`) est le favicon Lovable par defaut. Les fichiers n'existent PAS dans le dossier `public/` (pas de `favicon-16x16.png` ni `favicon-32x32.png` ni `apple-touch-icon.png` visibles).

### Ce qu'il faut faire

Vous devez me fournir votre logo Mariable en tant qu'image (PNG ou SVG) et je genererai toutes les tailles de favicon necessaires. Vous pouvez aussi utiliser un outil comme [RealFaviconGenerator.net](https://realfavicongenerator.net/) :

1. Allez sur https://realfavicongenerator.net/
2. Uploadez le logo Mariable (`logo-mariable-clean.png` qui est deja dans `public/`)
3. Telechargez le pack genere (favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, android-chrome-192x192.png, android-chrome-512x512.png)
4. Envoyez-moi ces fichiers et je les integrerai dans le projet

Alternativement, dites-moi "utilise le logo Mariable existant" et je copierai `public/logo-mariable-clean.png` comme favicon (qualite moindre car la conversion PNG > ICO sans outil est limitee).

---

## 4. Checklist actions hors Lovable pour le referencement

### Priorite 1 - Indispensable

- [ ] **Google Search Console** : Soumettre `https://www.mariable.fr/sitemap.xml` dans la section Sitemaps
- [ ] **Google Search Console** : Inspecter et demander l'indexation de chaque page strategique une par une (commencer par `/`, `/prix`, `/checklist-mariage`, `/coordination-jour-j`, les 13 pages regionales)
- [ ] **Bing Webmaster Tools** : Creer un compte sur https://www.bing.com/webmasters et soumettre le site + sitemap (Bing alimente Copilot et une partie des resultats ChatGPT)
- [ ] **Google Business Profile** : Creer une fiche Google Business "Mariable" en categorie "Service de planification de mariage" avec lien vers le site, logo, description

### Priorite 2 - Important

- [ ] **Backlinks** : S'inscrire sur Mariages.net, Zankyou, et les annuaires mariage FR pour obtenir des liens retour
- [ ] **Contenu blog** : Publier 1 a 2 articles/semaine sur `/conseilsmariage` avec des titres conversationnels ("Comment organiser son mariage ?", "Quel budget pour un mariage en Provence ?")
- [ ] **Google Search Console** : Verifier les Core Web Vitals (LCP, CLS, INP) dans le rapport "Experience de page"
- [ ] **Schema Markup Validator** : Tester chaque page strategique sur https://validator.schema.org/ pour verifier les JSON-LD

### Priorite 3 - Bonus GEO (moteurs IA)

- [ ] **Bing Chat / Copilot** : Verifier si Mariable apparait en reponse a "organiser son mariage en France" sur Bing Chat
- [ ] **ChatGPT** : Tester regulierement les requetes clefs pour voir si Mariable remonte
- [ ] **Perplexity.ai** : Idem
- [ ] **Pinterest** : Creer un compte business Pinterest et partager les articles blog (fort signal pour le mariage)
- [ ] **Instagram** : Publier regulierement avec liens vers le site (signaux sociaux)
- [ ] **Avis Google** : Encourager les couples a laisser un avis Google sur la fiche Business

---

## Plan d'implementation technique (dans Lovable)

### Tache 1 : Ajouter les meta descriptions manquantes

| Fichier | Action |
|---|---|
| `src/pages/contact/NousContacter.tsx` | Ajouter `<Helmet>` avec title + meta description + canonical |
| `src/pages/about/Approche.tsx` | Ajouter `<Helmet>` avec title + meta description + canonical |
| `src/pages/about/Histoire.tsx` | Idem |
| `src/pages/about/Temoignages.tsx` | Idem |
| `src/pages/WeddingRetroplanning.tsx` | Ajouter `<Helmet>` avec title + meta description + canonical |
| `src/pages/CeremoniePublic.tsx` | Ajouter canonical `/ceremonie-laique` |
| `src/pages/MairieCivilPublic.tsx` | Ajouter canonical `/mariage-civil` |
| `src/pages/CeremonieCatholiquePublic.tsx` | Ajouter canonical `/ceremonie-catholique` |
| `src/pages/ContentCreatorMariage.tsx` | Ajouter canonical `/content-creator-mariage` |
| `src/pages/Partenariat.tsx` | Ajouter canonical `/partenariat` |
| `src/pages/OutilsPlanningMariage.tsx` | Ajouter canonical |
| `src/pages/GuideDuJourJ.tsx` | Ajouter canonical |
| `src/pages/GuideDebutant.tsx` | Ajouter canonical |
| `src/pages/InstallAppPublic.tsx` | Ajouter canonical |

### Tache 2 : Optimiser la performance mobile

| Fichier | Action |
|---|---|
| `index.html` | Supprimer la ligne `<link rel="preload" as="video" ...>` |
| `index.html` | Deplacer le script Meta Pixel dans le bloc `loadAnalytics()` (lazy apres 3s) |
| `index.html` | Mettre a jour la meta description fallback (150-160 car.) |
| `src/App.tsx` | Passer les pages regionales et autres en lazy loading (garder seulement `Mariable` et `LandingCouple` en import direct) |

### Tache 3 : Favicon

En attente de l'image fournie par l'utilisateur, ou utilisation de `public/logo-mariable-clean.png` existant.

