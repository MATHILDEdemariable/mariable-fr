## Objectif

Étendre le toggle FR/EN aux modules dashboard restants. Suite à la traduction de /dashboard (accueil), /checklist-mariage, /budget et /ceremonie, finaliser les pages encore figées en français.

## Périmètre

### Pages prioritaires (mentionnées)
1. **/dashboard/rsvp** — `RSVPManagement.tsx`, `RSVPTabs.tsx`, `RSVPResponses.tsx` : onglets, formulaires de configuration, colonnes des réponses, statuts (confirmé/refusé/en attente), boutons d'export, modales d'envoi, toasts
2. **/dashboard/documents** — `DocumentsPage.tsx` + `DocumentsSection.tsx` : titres, états vides, boutons upload/download, libellés de catégories
3. **/dashboard/apres-jour-j** — `ApresJourJPage.tsx` : sections éditoriales (remerciements, photos, démarches admin), checklists, boutons PDF
4. **/dashboard/mairie-civile** — `MairieCivilPage.tsx` : étapes du dossier civil, documents requis, contenu éditorial, PDF
5. **/dashboard/retroplanning** — `PlanningPage.tsx` (ou équivalent rétroplanning) + composants enfants : timeline, génération IA, édition d'étapes, toasts

### Pages secondaires à inclure pour cohérence
- **/dashboard/avant-jour-j** (`AvantJourJPage.tsx`) — symétrique à apres-jour-j
- **/dashboard/coordination** & **/coordinateurs** (`CoordinationPage.tsx`, `CoordinatorsPage.tsx`) — planning Jour-J
- **/dashboard/accommodations** (`AccommodationsPage.tsx`) — gestion logements
- **/dashboard/moodboard** (`MoodboardPage.tsx`) — UI outil moodboard
- **/dashboard/panier**, **/wishlist**, **/messages**, **/vendor-tracking**, **/vendor-selection** — modules prestataires
- **/dashboard/drinks** (`DrinksCalculatorPage.tsx`) — calculatrice boissons
- **/dashboard/qr-code** (`QRCodeGenerator.tsx`) — liste de mariage
- **/dashboard/assistant**, **/guides**, **/help**, **/install-app** — bonus

## Approche

**Phasage en 2 vagues** pour limiter la taille du diff :

### Vague 1 — Pages explicitement demandées
RSVP, Documents, Après-jour-J, Mairie-Civile, Retroplanning.
- Nouveau namespace **`weddingDay`** (regroupe RSVP, retroplanning, après/avant jour-J, mairie, coordination) ou namespaces séparés si volume > 200 clés.
- Pattern identique aux pages déjà traduites : `useTranslation('<ns>')`, remplacement littéraux par `t()`, listes éditoriales via `t('key', { returnObjects: true })`.
- Dates : `date-fns` avec locale dynamique.
- PDF exports : titres et en-têtes traduits selon `i18n.language`.

### Vague 2 — Cohérence dashboard complet
Coordination, accommodations, moodboard, panier, messages, vendor-tracking/selection, drinks, qr-code, assistant, guides, help, install-app, avant-jour-j.
- Namespaces : réutiliser `dashboard` pour chrome court, créer `vendors`, `tools` au besoin.

## Détails techniques

- **Fichiers JSON** : créer/étendre `src/i18n/locales/{fr,en}/<ns>.json`
- **Enregistrement** : ajouter chaque nouveau namespace dans `src/i18n/index.ts` (imports + `resources` + `ns: [...]`)
- **DB content** : titres d'étapes personnalisés, commentaires utilisateur, items ajoutés manuellement → restent dans la langue d'origine (règle existante)
- **PDF templates** : header/footer/labels traduits, contenu DB inchangé
- **Toasts & validations** : passer par `t()` y compris messages d'erreur

## Estimation

- Vague 1 : ~200-300 clés (RSVP ~80, retroplanning ~60, documents ~30, mairie ~70, après-jour-J ~60)
- Vague 2 : ~250-350 clés
- **Total : ~500-650 clés**, sans modification de logique métier

## Validation

1. Build sans erreur
2. Toggle EN sur chaque page listée → tous les libellés chrome en anglais (titres, boutons, colonnes, toasts, modales)
3. Dates localisées (`mardi 16 juin` → `Tuesday, June 16`)
4. Toggle FR remet tout en français
5. Contenu DB inchangé dans les deux langues
6. PDF exports : en-têtes traduits selon langue active

## Question

Confirmes-tu :
- (a) **Vague 1 seulement** (5 pages demandées) — livraison rapide, focus
- (b) **Vague 1 + Vague 2** (dashboard 100% bilingue) — couverture complète, diff plus large

Par défaut je pars sur **(b)** pour éliminer tout résidu français lors du toggle EN.
