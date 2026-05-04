## Objectif
Ajouter une traduction FR/EN du site avec un toggle de langue, en commençant par les pages publiques clés (`/`, `/professionnelsmariable`, `/prix`) puis le dashboard et ses modules.

## Faisabilité
Oui, c'est tout à fait possible. Aucun système i18n n'est actuellement installé dans le projet (pas de `react-i18next`, pas de fichiers de traduction). Il faut donc partir de zéro.

⚠️ **Point d'attention important** : le site contient **plus de 200 pages/composants** avec du texte français codé en dur partout (titres, descriptions, boutons, FAQ, formulaires, emails, SEO meta, schémas JSON-LD, contenus blog, etc.). Une traduction **complète** représente un travail colossal (plusieurs milliers de chaînes). Je propose donc une approche **progressive et pragmatique**.

## Approche recommandée : progressive en 3 phases

### Phase 1 — Infrastructure i18n (fondation technique)
- Installer `react-i18next` + `i18next` + `i18next-browser-languagedetector`
- Créer la structure de fichiers de traduction :
  ```
  src/i18n/
    ├── index.ts              (config)
    ├── locales/
    │   ├── fr/
    │   │   ├── common.json   (header, footer, boutons génériques)
    │   │   ├── home.json
    │   │   ├── pricing.json
    │   │   ├── professionnels.json
    │   │   └── dashboard.json
    │   └── en/
    │       └── (mêmes fichiers)
  ```
- Créer un composant `LanguageToggle` (FR/EN) à intégrer dans le `PremiumHeader` et le header dashboard
- Persister le choix dans `localStorage` + détection automatique du navigateur
- Mettre à jour l'attribut `<html lang="">` dynamiquement
- Ajouter les balises SEO `hreflang` dans le composant `SEO.tsx`

### Phase 2 — Pages publiques prioritaires
Traduction complète de :
1. **`/` (Index.tsx)** — tous les composants `Premium*Section` (Hero, Process, Marketplace, Tools, Coordination, Testimonials, FinalCTA) + `PremiumHeader` + `Footer`
2. **`/professionnelsmariable`** (`ProfessionnelsMariable.tsx`)
3. **`/prix`** (`Prix.tsx` + `Pricing.tsx`)
4. SEO meta tags (titles, descriptions) traduits pour ces pages

### Phase 3 — Dashboard et modules
Le dashboard contient ~30 modules (checklist, budget, planning, seating-plan, RSVP, moodboard, documents, etc.). Traduction de :
- Sidebar / navigation dashboard
- `UserDashboard.tsx`
- Chaque module un par un (à prioriser ensemble)
- ⚠️ Les **données utilisateur** (noms d'invités, tâches custom, notes) restent dans la langue saisie — seule l'**UI** est traduite.

## Hors périmètre (à confirmer)
Éléments qui resteront en français sauf demande explicite ultérieure :
- Articles de blog (contenu rédactionnel volumineux)
- Pages SEO régionales (`/mariage-paris`, `/mariage-bretagne`...)
- Emails transactionnels (edge functions Supabase)
- Pages admin
- Contenu généré par l'IA (chatbot, assistant) — nécessiterait d'adapter les prompts
- CGV / mentions légales (juridique FR)
- Données BDD (descriptions prestataires, etc.)

## Détails techniques

**Exemple d'usage dans un composant :**
```tsx
import { useTranslation } from 'react-i18next';

const PremiumHeroSection = () => {
  const { t } = useTranslation('home');
  return <h1>{t('hero.title')}</h1>;
};
```

**Structure JSON :**
```json
// src/i18n/locales/fr/home.json
{
  "hero": {
    "title": "L'organisation mariage facile",
    "cta": "Commencer"
  }
}
```

**Toggle UI :** bouton compact `FR | EN` dans le header, accessible (aria-label), avec persistance `localStorage`.

## Questions avant de démarrer
1. **Périmètre Phase 1** : OK pour démarrer uniquement par l'infrastructure + les 3 pages (`/`, `/professionnelsmariable`, `/prix`) dans un premier temps, puis livrer le dashboard dans un second message ? (recommandé pour éviter une seule livraison massive et risquée)
2. **Qualité des traductions EN** : je génère les traductions anglaises moi-même (qualité correcte mais à relire), ou tu préfères fournir un glossaire / faire relire par un traducteur ?
3. **Blog & pages régionales** : on les laisse en FR uniquement ?
