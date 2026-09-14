# Catalogue de prix dans le budget

## Ce que vous obtenez

Un troisième onglet **Catalogue** dans `/dashboard/budget`, à côté de « Détail » et « Calcul ».

1. **Catalogue personnel** : vous y créez vos propres lignes de tarifs (catégorie, nom, description, prix, unité : forfait / par personne / par heure / par jour).
2. **Tarifs standards** : un bouton « Charger les tarifs standards » ajoute en un clic les ~55 tarifs du marché français fournis (coordination, lieux, traiteur, photo, vidéo, fleurs, déco, musique, beauté, transport, officiant, papeterie). Confirmation avant insertion, puis message indiquant combien de lignes ont été ajoutées.
3. **Recherche et filtre** par nom/description et par catégorie ; affichage groupé par catégorie avec icône, compteur, prix formaté et unité ; boutons modifier / supprimer sur chaque ligne ; état vide illustré.
4. **Import dans le budget détaillé** : depuis l'onglet « Détail », un bouton « Depuis le catalogue » ouvre une fenêtre où vous choisissez une ou plusieurs lignes du catalogue ; elles sont ajoutées comme postes de budget (catégorie, libellé et budget estimé pré-remplis, tout reste modifiable ensuite). Pour les tarifs « par personne », le nombre d'invités du budget est proposé comme multiplicateur.
5. **Correction demandée** : la ligne d'exemple « Château de mes rêves » (3000 €) est codée en dur dans l'application et réapparaît tant que le budget est vide. Elle est supprimée : un budget neuf démarre avec des catégories vides.

Tout est bilingue FR/EN et adapté mobile.

## Détails techniques

**Base de données** — nouvelle table `public.price_catalog` (id, user_id, category, name, description, base_price, price_unit, created_at, updated_at) avec GRANTs `authenticated` / `service_role`, RLS activée et 4 politiques `auth.uid() = user_id`, plus trigger `updated_at`. Le catalogue est rattaché à l'utilisateur (pas au mariage) : un pro le réutilise sur tous ses mariages.

**Code**
- `src/data/constants.ts` : `VENDOR_CATEGORIES` et `PRICE_UNITS` tels que fournis.
- `src/data/priceCatalogTemplates.ts` : les tarifs standards du tableau fourni.
- `src/hooks/usePriceCatalog.ts` : react-query, clé `['price-catalog']`, `items` (tri category puis name), `createItem`, `updateItem`, `deleteItem`, `loadStandardTemplates`.
- `src/components/dashboard/catalog/` : `PriceCatalogTab.tsx`, `AddCatalogItemDialog.tsx`, `EditCatalogItemDialog.tsx`, `ImportFromCatalogDialog.tsx` (animations framer-motion légères, déjà utilisé dans le projet).
- `src/pages/dashboard/BudgetPage.tsx` : `TabsList` passe à 3 colonnes (`detailed` / `calculator` / `catalog`), synchronisé avec `?tab=`.
- `src/components/dashboard/DetailedBudget.tsx` : suppression de l'item d'exemple dans `DEFAULT_CATEGORIES`, ajout du bouton « Depuis le catalogue » qui insère les postes via la logique d'ajout existante (`budgets_detail`, scope `wedding_id` conservé).
- `src/i18n/locales/{fr,en}/budget.json` : nouveau bloc `catalog`.

Vérification : `bunx tsgo --noEmit` puis contrôle visuel des trois onglets.
