

# Plan : Fichier Bing + Liste des URLs a indexer

## 1. Copier le fichier BingSiteAuth.xml

Copier le fichier `BingSiteAuth.xml` vers `public/BingSiteAuth.xml` pour qu'il soit accessible a la racine du site (`https://www.mariable.fr/BingSiteAuth.xml`).

**Fichier** : `public/BingSiteAuth.xml` (creation)

---

## 2. Liste complete des URLs a indexer dans Google Search Console

Voici toutes les URLs statiques du sitemap a soumettre une par une dans Google Search Console via "Inspection de l'URL" > "Demander l'indexation" :

### Pages principales (priorite haute)
1. `https://www.mariable.fr/`
2. `https://www.mariable.fr/selection`
3. `https://www.mariable.fr/services/prestataires`
4. `https://www.mariable.fr/prix`
5. `https://www.mariable.fr/checklist-mariage`
6. `https://www.mariable.fr/conseilsmariage`
7. `https://www.mariable.fr/professionnelsmariable`
8. `https://www.mariable.fr/services/budget`
9. `https://www.mariable.fr/detail-coordination-jourm`
10. `https://www.mariable.fr/comparatif`

### Pages outils et guides
11. `https://www.mariable.fr/retroplanning`
12. `https://www.mariable.fr/coordination-jour-j`
13. `https://www.mariable.fr/outils-planning-mariage`
14. `https://www.mariable.fr/planning-personnalise`
15. `https://www.mariable.fr/vibewedding`
16. `https://www.mariable.fr/fonctionnalites`
17. `https://www.mariable.fr/guide-jour-j`
18. `https://www.mariable.fr/guide-debutant`
19. `https://www.mariable.fr/guidecoordinationjour-j`
20. `https://www.mariable.fr/ceremonie-laique`
21. `https://www.mariable.fr/mariage-civil`
22. `https://www.mariable.fr/ceremonie-catholique`
23. `https://www.mariable.fr/content-creator-mariage`
24. `https://www.mariable.fr/to-do-list-mariage`
25. `https://www.mariable.fr/liste-preparatif-mariage`
26. `https://www.mariable.fr/coordinateurs-mariage`
27. `https://www.mariable.fr/jeunes-maries`

### Pages regionales (13 pages)
28. `https://www.mariable.fr/mariage-provence`
29. `https://www.mariable.fr/mariage-paris`
30. `https://www.mariable.fr/mariage-auvergne-rhone-alpes`
31. `https://www.mariable.fr/mariage-nouvelle-aquitaine`
32. `https://www.mariable.fr/mariage-bretagne`
33. `https://www.mariable.fr/mariage-normandie`
34. `https://www.mariable.fr/mariage-occitanie`
35. `https://www.mariable.fr/mariage-pays-de-la-loire`
36. `https://www.mariable.fr/mariage-centre-val-de-loire`
37. `https://www.mariable.fr/mariage-hauts-de-france`
38. `https://www.mariable.fr/mariage-bourgogne-franche-comte`
39. `https://www.mariable.fr/mariage-grand-est`
40. `https://www.mariable.fr/mariage-corse`

### Pages about et partenaires
41. `https://www.mariable.fr/about/histoire`
42. `https://www.mariable.fr/about/charte`
43. `https://www.mariable.fr/about/approche`
44. `https://www.mariable.fr/about/temoignages`
45. `https://www.mariable.fr/partenariat`
46. `https://www.mariable.fr/contact`
47. `https://www.mariable.fr/contact/faq`

### Pages secondaires
48. `https://www.mariable.fr/landing-generale`
49. `https://www.mariable.fr/installer-app`
50. `https://www.mariable.fr/cgv`
51. `https://www.mariable.fr/cgv-couples`
52. `https://www.mariable.fr/sitemap`

### Pages dynamiques (blog + prestataires)
Les articles de blog (`/conseilsmariage/[slug]`) et les fiches prestataires (`/prestataire/[slug]`) seront indexes automatiquement par Google via le sitemap XML. Pas besoin de les soumettre un par un.

---

## Modification technique

| Fichier | Action |
|---|---|
| `public/BingSiteAuth.xml` | Copier le fichier uploade vers la racine public |

