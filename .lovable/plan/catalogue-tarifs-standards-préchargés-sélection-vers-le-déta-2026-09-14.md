# Catalogue : tarifs standards préchargés + sélection vers le détail

## Ce qui change

1. **Plus rien à charger** : les ~55 tarifs standards du marché français s'affichent directement dans l'onglet Catalogue, pour tout le monde, sans bouton « Charger les tarifs standards » (ce bouton disparaît). Ils sont en lecture seule (pas de modification / suppression) et portent une petite étiquette « Standard ».

2. **Sélection puis ajout au budget** : chaque ligne du catalogue a une case à cocher. Une barre d'action apparaît en bas dès qu'au moins une ligne est cochée : « Ajouter au budget (N) ». Le clic crée une ligne par élément dans l'onglet Détail (catégorie, libellé et budget estimé pré-remplis, tout reste modifiable). Pour les tarifs « par personne », le montant est multiplié par le nombre d'invités du budget.

3. **« Ajouter un élément » réservé aux pros** : le bouton d'ajout d'un tarif personnel (et les actions modifier / supprimer) n'est visible que pour les comptes professionnels, avec un badge « Pro » à côté du bouton. Les couples voient uniquement le catalogue standard et la sélection vers le budget.

4. Le bouton « Catalogue » de l'onglet Détail reste, et propose lui aussi les tarifs standards (plus rien n'est vide au premier usage).

Tout reste bilingue FR/EN et adapté mobile.

## Détails techniques

- `src/hooks/usePriceCatalog.ts` : `items` devient la fusion des `PRICE_CATALOG_TEMPLATES` (mappés en items virtuels `id: 'std-<index>'`, `is_standard: true`) et des lignes `price_catalog` de l'utilisateur (`is_standard: false`). `loadStandardTemplates` est supprimé. `createItem` / `updateItem` / `deleteItem` inchangés (ne s'appliquent qu'aux lignes réelles).
- `src/components/dashboard/catalog/PriceCatalogTab.tsx` : suppression du bouton « Charger les tarifs standards » et de son handler ; `useUserProfile().isProAccount` conditionne le bouton « Ajouter un élément » (avec badge Pro) et les boutons édition/suppression, eux-mêmes masqués sur les items standards ; ajout d'un état `selectedIds`, d'une `Checkbox` par ligne et d'une barre d'action sticky en bas.
- Ajout au budget depuis l'onglet Catalogue : réutilisation de la logique d'insertion déjà écrite pour l'import (`budgets_detail`, scope `wedding_id`). Extraction de cette logique dans `src/components/dashboard/catalog/useCatalogToBudget.ts` (une fonction, pas de refacto plus large) utilisée par `PriceCatalogTab` et par `DetailedBudget`. Le nombre d'invités vient de `budgets_dashboard.guests_count`.
- `ImportFromCatalogDialog.tsx` : inchangé fonctionnellement, il bénéficie automatiquement des tarifs standards via le hook.
- `src/i18n/locales/{fr,en}/budget.json` : suppression du bloc `catalog.templates`, ajout de `catalog.standardBadge`, `catalog.proOnly`, `catalog.selection.addToBudget`, `catalog.selection.clear`.
- Vérification : `bunx tsgo --noEmit` puis contrôle visuel des onglets Catalogue et Détail.
