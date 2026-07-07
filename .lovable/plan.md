## Objectif

Repositionner **/guides** comme une vraie **marketplace e-books** (achat en haut, filtres par thème), en gardant le contenu SEO en support — pas en obstacle. Laisser **/outils-planning-mariage** comme page descriptive de l'appli.

## Positionnement des 2 pages (clarifier les rôles)

| Page | Intention | KPI |
|---|---|---|
| `/outils-planning-mariage` | SEO + démo appli → **création de compte** | Signups |
| `/guides` | SEO + marketplace ebooks → **achat guide** ou **Premium 29€** | Ventes PDF / Premium |

## Nouvelle structure de /guides (ordre)

```
1. HERO éditorial court
   ├── H1 : "Guides & e-books mariage à télécharger"
   ├── Sous-titre : "Checklists, rétroplannings, guides prestataires… dès 4€"
   └── 2 CTA : [Voir les guides] (scroll) · [Tout débloquer 29€ Premium]

2. MARKETPLACE (juste sous le hero — plus tout en bas)
   ├── Barre de filtres par thème (pills)
   │    Tous · Cérémonie · Organisation · Jour-J · Prestataires · Mariée · Témoins
   ├── Grille cards ebooks (existante, réutilisée)
   ├── Tri prix / pages (secondaire)
   └── Bandeau "Tous inclus dans Premium 29€ à vie"

3. BLOC CONVERSION Premium
   └── Card sombre "29€ à vie · plus rentable dès 4 guides" (existant, déplacé)

4. CONTENU SEO condensé (garde le jus SEO, sans détailler l'appli)
   ├── Intro 2 paragraphes courts
   ├── Sommaire ancré
   ├── 6 sections H2 long tail (checklist, rétroplanning, budget, prestataires, invités, jour J)
   │   → chaque section CTA vers **le guide correspondant** (pas vers l'appli)
   └── FAQ (garde le FAQPage JSON-LD)

5. Footer
```

**Différence clé vs actuel** : la grille d'ebooks est **en position 2** (visible sans scroll long), pas en position 5.

## Filtres marketplace

Ajouter un champ `theme` dans `src/data/guides.ts` :

```ts
theme: 'ceremonie' | 'organisation' | 'jour-j' | 'prestataires' | 'mariee' | 'temoins'
```

Mapping proposé :
- Checklist Civil → `ceremonie`
- Checklist Cérémonie → `ceremonie`
- Guide témoins → `temoins`
- Guide planning Jour-J → `jour-j`
- Checklist photo Jour-J → `jour-j`
- Guide mariée → `mariee`
- Guide Organisation complète → `organisation`
- Guide prestataires → `prestataires`

Filtre = simple `useState` + `.filter()`, aucune dépendance.

## SEO

- **Conservé** : `<title>`, meta description, canonical, JSON-LD (Article + BreadcrumbList + FAQPage), les 6 H2 long tail, la FAQ.
- **Ajouté** : JSON-LD `ItemList` (produits ebooks) + `Product` pour chaque guide (name, offers.price, offers.priceCurrency).
- **Recentré** : les CTA des sections SEO pointent désormais vers `#ebooks` ou l'ebook thématique, plus vers `/dashboard/*` (ça, c'est le job de /outils-planning-mariage).

## /outils-planning-mariage

Aucune refonte demandée. On vérifie juste que le maillage interne est cohérent :
- Depuis `/guides` : lien texte discret "Vous cherchez plutôt les outils gratuits ? → /outils-planning-mariage"
- Depuis `/outils-planning-mariage` : lien "Guides PDF à télécharger → /guides"

## Détails techniques

Fichiers touchés :
- `src/data/guides.ts` — ajouter `theme` + type `GuideTheme`
- `src/pages/GuidesShop.tsx` — réorganisation des sections (ordre) + composant filtres inline + JSON-LD Product/ItemList
- Rien d'autre. Aucun nouveau fichier, aucun package.

Approche : **simple** (règle #1 projet) — 1 `useState` pour le filtre actif, `.filter()` inline, pas de nouveau composant, pas de refacto de la card ebook.

## Hors scope (à confirmer si tu veux)

- Vrai paiement Stripe/Paddle sur les ebooks (aujourd'hui la modale dit "bientôt disponible")
- Pages produit dédiées `/guides/[slug]` (utile SEO long terme, mais lourd — à faire dans un 2e temps)
