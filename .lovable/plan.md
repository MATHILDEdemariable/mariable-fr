## Fix toggle FR/EN sur la home (`/` = VersionJuin26)

### Diagnostic
La home rend 10 sections v2 (`HeroV2`, `ReassuranceBar`, `PainPointsSection`, `EspaceApercu`, `IncludedSection`, `FreemiumSection`, `DifferentiatorSection`, `PremiumTestimonialsSection`, `PricingHighlight`, `FAQSection`, `BlogSection`, `FinalCTASection`). **Aucune** n'utilise `useTranslation` — tous les textes sont hardcodés en français. Le toggle change bien `i18n.language` (le `<html lang>` bascule), mais comme aucun composant ne lit la traduction, rien ne change visuellement. Les clés v2 n'existent pas non plus dans `home.json`.

### Plan

**1. Étendre les fichiers de traduction** `src/i18n/locales/{fr,en}/home.json`
Ajouter une section par composant v2 :
- `heroV2` (titre, sous-titre, CTAs, badge)
- `reassuranceBar` (3-4 items)
- `painPoints` (titre + liste)
- `espaceApercu` (titre, sous-titre, features)
- `included` (titre + items)
- `freemium` (titre, free vs premium)
- `differentiator` (titre + items)
- `pricingHighlight` (titre, prix, features, CTA)
- `faq` (titre + questions/réponses)
- `finalCTA` (titre, sous-titre, CTA)
- `testimonials` (titre seulement si hardcodé dans `PremiumTestimonialsSection`)
- `blog` (titre section)

**2. Câbler `useTranslation('home')` dans chaque composant v2**
Pour chacun des 10 fichiers `src/components/home/v2/*.tsx` + `PremiumTestimonialsSection` + `BlogSection` :
- Ajouter `const { t } = useTranslation('home')`
- Remplacer chaque chaîne FR par `t('section.key')`
- Pour les listes (ex. FAQ, pain points, reassurance items), utiliser `t('section.items', { returnObjects: true }) as Array<...>` typé

**3. Helmet SEO bilingue** (optionnel, recommandé)
Dans `VersionJuin26.tsx`, lire `i18n.language` pour servir title/description FR ou EN via `t('seo.title')` / `t('seo.description')` (clés déjà présentes dans `home.json`).

**4. Vérification**
- Toggler FR→EN sur `/` : chaque section doit basculer
- Recharger en EN : persistance via `localStorage` (`mariable_lang`)
- `<html lang>` cohérent

### Hors scope
- Header/Footer : déjà câblés en Phase 1 d'après la mémoire (à vérifier rapidement — si pas le cas, je l'inclus)
- Autres pages publiques (`/selection`, `/accueil`, etc.) — pas demandé ici
- Traduction des articles de blog (contenu DB)

### Questions

1. **Périmètre EN** : tu veux que je traduise **toutes** les sections de la home v2, ou seulement le top (Hero + Reassurance + PainPoints + FinalCTA) en restant FR ailleurs pour cette itération ?
2. **Helmet bilingue** : je rends title/description dynamiques selon la langue, ou je garde FR uniquement pour l'instant (SEO principal FR) ?
