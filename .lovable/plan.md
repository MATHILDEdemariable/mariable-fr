# Budget détaillé : prix par personne × nombre d'invités

## Ce que vous obtenez

Dans l'onglet **Détail** de `/dashboard/budget`, chaque ligne gagne deux informations :

- **Prix unitaire (€)** : le prix d'une part (ou le prix forfaitaire).
- **Nb pers.** : le nombre de personnes concernées par cette ligne.

Le **Budget estimé** se calcule automatiquement : prix unitaire × nb pers.

- À l'import depuis le catalogue, un tarif « par personne » (typiquement Traiteur & Boissons) arrive avec le prix unitaire du catalogue et le nombre d'invités du budget. Changez le nombre d'invités sur la ligne : le total se recalcule tout de suite.
- Un tarif au forfait arrive avec Nb pers. = 1, donc estimé = prix.
- **Saisie en dur toujours possible** : si vous tapez directement un montant dans « Budget estimé », il est conservé tel quel (le prix unitaire est réajusté en conséquence) et rien ne l'écrase.
- Les lignes déjà existantes gardent leur montant : elles s'affichent avec Nb pers. = 1 et le prix unitaire égal au montant actuel.

Sur mobile, les deux nouveaux champs restent accessibles dans le tableau qui défile horizontalement. Tout est traduit FR/EN.

## Détails techniques

**Base de données** — migration sur `public.budgets_detail` :
- `quantity integer NOT NULL DEFAULT 1`
- `unit_price numeric NOT NULL DEFAULT 0`
- backfill : `unit_price = estimated`, `quantity = 1` sur les lignes existantes.
Pas de changement de RLS ni de grants (table déjà en place).

**Code — `src/components/dashboard/DetailedBudget.tsx`**
- `BudgetItem` et `BudgetDetailDB` : ajout de `quantity` et `unit_price` ; chargement, sauvegarde (`saveBudgetItemMutation`), sérialisation `breakdown` et export PDF/CSV inclus.
- `handleItemChange` : `quantity` ou `unit_price` modifié → `estimated = unit_price × quantity` ; `estimated` saisi directement → `unit_price = estimated / max(quantity, 1)` (pas d'écrasement de la saisie).
- `handleAddItem` : nouvelle ligne avec `quantity: 1`, `unit_price: 0`.
- `handleImportFromCatalog` : `unit_price = item.base_price`, `quantity = selection.quantity`, `estimated = amount` ; suppression du suffixe `(xN)` dans le libellé, devenu inutile.
- `handleImportFromCart` : `unit_price = itemPrice`, `quantity = 1`.
- Tableau : deux `<th>` (`detailed.columns.unitPrice`, `detailed.columns.quantity`) avant « Budget estimé », et les deux `Input` numériques correspondants par ligne (`min=1` pour la quantité).

**i18n** — `src/i18n/locales/{fr,en}/budget.json` : `detailed.columns.unitPrice` (« Prix unitaire (€) » / « Unit price (€) »), `detailed.columns.quantity` (« Nb pers. » / « Qty »).

Vérification : `bunx tsgo --noEmit`, puis contrôle visuel d'un import catalogue Traiteur et d'une saisie manuelle.
