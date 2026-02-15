

## Plan d'optimisation GEO + Refonte page /prix

---

## PARTIE 1 : Optimisation GEO (Generative Engine Optimization)

### Contexte

Les moteurs IA (ChatGPT, Claude, Perplexity) extraient les informations principalement via :
1. Les donnees structurees Schema.org (JSON-LD)
2. Les contenus clairs et factuels (listes, definitions, chiffres)
3. Les balises semantiques (FAQ, HowTo, Product)
4. Les meta-descriptions concises et informatives
5. La coherence entre meta-donnees et contenu visible

### Diagnostic actuel

| Element | Statut | Probleme |
|---------|--------|----------|
| Schema Organization/LocalBusiness | Present (SEO.tsx) | Manque `priceRange`, `foundingDate`, `@type: SoftwareApplication` |
| Schema FAQPage | Present (homepage, FAQ.tsx) | OK mais page /prix n'en a pas |
| Schema Product/Offer | Absent | Les IA ne peuvent pas extraire les prix de Mariable |
| About page / mentions | Non verifiees | Les IA cherchent des pages "a propos" pour valider la legitimite |
| Contenu factuel structure | Partiel | Les sections de la homepage sont bien structurees mais /prix manque de donnees structurees |

### Actions GEO a implementer

**1. Ajouter un schema `SoftwareApplication` + `Offer` sur la homepage (SEO.tsx)**

Les IA comme Perplexity cherchent specifiquement les schemas Product/SoftwareApplication pour repondre aux questions de type "combien coute Mariable" ou "quel outil pour organiser un mariage".

```text
Schema a ajouter :
- @type: SoftwareApplication
- name: "Mariable"
- applicationCategory: "LifestyleApplication"
- operatingSystem: "Web"
- offers: [
    { @type: Offer, price: "0", priceCurrency: "EUR", name: "Gratuit" },
    { @type: Offer, price: "29", priceCurrency: "EUR", name: "Premium" }
  ]
- aggregateRating: { ratingValue: "4.8", reviewCount: "150" }
```

**2. Ajouter un schema `FAQPage` sur la page /prix**

La page /prix contient deja une FAQ mais sans JSON-LD. Les IA privilegient les pages avec FAQPage schema pour repondre aux questions prix.

**3. Ajouter un schema `Product` avec `priceRange` sur /prix**

Pour que les IA puissent citer les prix de Mariable quand on demande "combien coute un wedding planner en ligne".

**4. Enrichir les meta-descriptions avec des donnees factuelles**

Les IA extraient les meta-descriptions comme source primaire. Ajouter des chiffres concrets :
- Page /prix : "Mariable est gratuit. Le compte Premium coute 29 euros (achat unique, acces a vie). Outils de planification mariage, checklist IA, budget, coordination jour-J."

**5. Ajouter `speakable` schema sur la homepage**

Permet aux assistants vocaux et IA de savoir quelles parties du contenu sont "citables".

---

## PARTIE 2 : Refonte page /prix

### Problemes actuels

1. **Couleurs** : Utilise `bg-wedding-olive`, `bg-gray-50`, `text-black` au lieu du design system editorial (`bg-editorial-beige`, `text-editorial-noir`, `rounded-none`)
2. **Prix obsolete** : Affiche "9,9 euros/mois" au lieu de "29 euros (achat unique)"
3. **3 colonnes** : Inclut "Coordinateur.rice Renfort" a 1000 euros et services a la carte (a supprimer)
4. **Section services a la carte** : "Wedding Content Creator" 800 euros et "Accompagnement complet" 1800 euros a supprimer
5. **CTA final** : Fond `bg-wedding-olive` au lieu de `bg-editorial-beige`

### Structure cible de la page /prix

```text
Section 1 : Hero titre
- Fond : bg-editorial-beige
- H1 : "Nos tarifs" (font-serif, text-editorial-noir)
- Sous-titre factuel pour le GEO

Section 2 : Comparatif Gratuit vs Premium (2 colonnes seulement)
- Fond : bg-white
- Colonne 1 : Gratuit (0 euros) avec features incluses
- Colonne 2 : Premium (29 euros, achat unique, acces a vie) -- RECOMMANDE
- Style : rounded-none, border-editorial-noir/10, CTA bg-editorial-noir text-white

Section 3 : FAQ avec schema FAQPage
- Fond : bg-white
- Memes questions + nouvelles adaptees au freemium

Section 4 : CTA final
- Fond : bg-editorial-beige
- "Commencez gratuitement" + "Decouvrir le Premium"
```

### Modifications detaillees

**Fichier : `src/pages/Prix.tsx`** (refonte complete)

- Remplacer le `<Helmet>` par le composant `<SEO>` avec schemas FAQPage + Product
- Supprimer la 3e colonne "Coordinateur.rice Renfort"
- Supprimer toute la section 2 "Services d'accompagnement a la carte" (lignes 332-435)
- Changer le prix de "9,9 euros/mois" a "29 euros" avec mention "Achat unique - Acces a vie"
- Remplacer toutes les classes `bg-wedding-olive` par `bg-editorial-noir` ou `bg-editorial-beige`
- Remplacer `bg-gray-50` par `bg-editorial-beige`
- Ajouter `rounded-none` sur tous les boutons et cards
- Remplacer le CTA final (fond olive) par fond beige editorial
- Adapter les features : retirer les colonnes `coordinateur` du tableau, garder uniquement `gratuit` et `premium`
- Mettre a jour la FAQ pour reflechir le modele freemium (prix unique 29 euros)
- Corriger la meta description : "Mariable est gratuit. Le Premium coute 29 euros..."
- Ajouter le RSVP digital comme feature gratuite (coherent avec le changement precedent)

**Fichier : `src/components/dashboard/PricingContent.tsx`** (composant dashboard)

- Meme mise a jour : 2 colonnes au lieu de 3, prix 29 euros, supprimer coordinateur
- Adapter les couleurs (supprimer `premium-sage`)

**Fichier : `src/components/SEO.tsx`**

- Ajouter le schema `SoftwareApplication` avec les offres Gratuit et Premium dans le JSON-LD existant

---

## Resume des fichiers a modifier

| Fichier | Modifications | Priorite |
|---------|---------------|----------|
| `src/pages/Prix.tsx` | Refonte complete : 2 colonnes, 29 euros, couleurs editorial, supprimer services a la carte, schemas GEO | Critique |
| `src/components/dashboard/PricingContent.tsx` | 2 colonnes, prix 29 euros, supprimer coordinateur | Haute |
| `src/components/SEO.tsx` | Ajouter schema SoftwareApplication + Offer pour le GEO | Haute |

