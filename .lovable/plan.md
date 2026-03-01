

# 3 corrections : CTA coordination, SEO homepage, meta descriptions

## 1. Page Coordination Jour J : modifier la derniere section CTA

**Fichier : `src/pages/CoordinationJourJ.tsx` (lignes 300-315)**

Remplacer la section CTA finale :
- **h2** : "Organisez vous-meme le jour J et faites-le bien" (au lieu de "Reservez votre coordination Mon Jour J")
- **Paragraphe** : "Mariable vous donne tous les outils pour coordonner votre mariage comme un pro, sans wedding planner."
- **Bouton** : "Creer un compte" avec lien vers `/register` (au lieu de "Reserver maintenant" vers `/reservation-jour-m`)

## 2. SEO homepage : structure semantique et mots-cles

**Fichier : `src/pages/Mariable.tsx`**

Problemes identifies :
- Le `<h1>` est bien unique dans le hero - OK
- Le `<SEO>` component est present avec title, description, canonical, keywords - OK
- Les sections utilisent `<h2>` via les composants enfants (VenuesSection, PremiumTools, Blog, Testimonials, FAQ, FinalCTA) - structure correcte
- **Probleme** : le CTA "Creer mon compte gratuit" dans PremiumToolsCoordinationSection utilise `bg-editorial-noir` au lieu de `bg-editorial-olive` (manque du plan precedent)

Corrections :
- `src/components/home/PremiumToolsCoordinationSection.tsx` ligne 83 : changer `bg-editorial-noir hover:bg-editorial-noir/80` en `bg-editorial-olive hover:bg-editorial-olive/90`
- `src/components/home/BlogSection.tsx` ligne 101 : changer le bouton "Voir tous les articles" `border-[#0F0F0F] text-[#0F0F0F] hover:bg-[#0F0F0F]` en `border-editorial-olive text-editorial-olive hover:bg-editorial-olive hover:text-white` pour coherence CTA vert

## 3. Meta descriptions pour Budget et Calculatrice Boissons

L'objectif est que Google affiche des sitelinks vers ces pages avec des descriptions claires.

**Fichier : `src/pages/services/Budget.tsx` (ligne 863)**
- Modifier le title SEO : "Calculateur Budget Mariage Gratuit | Mariable" (< 60 car.)
- Modifier la description : "Calculez le budget de votre mariage gratuitement. Estimation par region, nombre d'invites et saison. Repartition detaillee par poste." (< 160 car.)

**Fichier : `src/pages/dashboard/DrinksCalculatorPage.tsx`**
- Modifier le title Helmet : "Calculateur Quantite Boissons Mariage | Mariable"
- Modifier la meta description : "Estimez les quantites de boissons pour votre mariage : vin, champagne, soft. Calcul par nombre d'invites, moments et duree de reception."

**Fichier : `src/components/SEO.tsx` - breadcrumbMapping**
- Ajouter `'services/budget': 'Calculateur Budget'` dans le mapping des breadcrumbs (pour le schema BreadcrumbList)

## Resume des fichiers modifies

| Fichier | Modification |
|---|---|
| `src/pages/CoordinationJourJ.tsx` | CTA final : nouveau texte + bouton "Creer un compte" |
| `src/components/home/PremiumToolsCoordinationSection.tsx` | CTA noir -> vert olive |
| `src/components/home/BlogSection.tsx` | Bouton "Voir tous les articles" en vert |
| `src/pages/services/Budget.tsx` | Title + meta description optimises SEO |
| `src/pages/dashboard/DrinksCalculatorPage.tsx` | Title + meta description optimises SEO |
| `src/components/SEO.tsx` | Ajout breadcrumb pour services/budget |

