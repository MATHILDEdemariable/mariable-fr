# Finir la traduction : rétroplanning, liste photos, espace pro

## Constat (vérifié dans le code)

Trois cas différents, et ils ne se règlent pas de la même façon :

1. **Espace pro** (`/pro`, boutons « Mes mariages » et « Passer Pro Premium — 149 €/an ») : textes écrits en dur dans le code. Correction directe.
2. **Rétroplanning** : l'écran affiche des périodes écrites en dur (« 12-9 mois »… déjà partiellement anglaises) et surtout des tâches **générées par l'IA en français puis enregistrées** dans la base. Le bouton FR/EN ne peut pas les retraduire tout seul.
3. **Liste photos du Jour-M** : l'ossature est traduite, mais les lignes visibles sont celles **déjà enregistrées en français** lors de la première création de la liste.

## Ce que je vais faire

### 1. Espace pro entièrement bilingue
- Menu de gauche : Espace pro, Mes mariages, Mes informations, Mon offre, Paramètres, Déconnexion.
- Barre du haut : Accueil, Mes mariages, Sélection prestataires, « Passer Pro Premium — 149 €/an » (« Upgrade to Pro Premium — €149/year »).
- Barre « Mariage en cours », fenêtre Pro Premium (titre, phrase d'intro, bouton Fermer) et fenêtre de modification d'un mariage.

### 2. Rétroplanning
- Toute l'interface passe en anglais : titres, périodes (« 12-9 months », « 2 weeks », « Wedding week », « Wedding day »), légendes, boutons, messages de confirmation et d'erreur, export de la check-list.
- La génération du rétroplanning se fait désormais **dans la langue choisie** : un rétroplanning créé en anglais sort en anglais.
- Pour un rétroplanning déjà enregistré en français, un bandeau propose « Regenerate this timeline in English » — rien n'est écrasé sans clic de votre part.

### 3. Liste photos du Jour-M
- Les titres de la liste standard (Premier regard, Sortie de cérémonie, Échange des alliances, Famille des mariés…) s'affichent en anglais quand la langue est EN, même si la liste a été enregistrée en français.
- Les lignes que vous avez ajoutées vous-même restent telles quelles.
- Même logique pour le titre, le compteur, les boutons et l'export PDF.

### 4. Vérification
Passage FR→EN sur `/pro`, `/dashboard/mon-mariage/retroplanning` et `/mon-jour-m/documents` avec captures, plus contrôle technique du code.

## Détails techniques

- `ProSidebar.tsx`, `DashboardLayout.tsx` (barre pro + version mobile), `WeddingContextBar.tsx`, `ProPremiumModal.tsx`, `ModifierMariageDialog.tsx` → namespace `pro` (clés ajoutées dans `fr/pro.json` et `en/pro.json`).
- `WeddingRetroplanning.tsx` / `WeddingRetroplanningEmbed.tsx` : `TIMELINE_PERIODS` avec clés i18n au lieu de libellés en dur ; tous les `toast(...)` et libellés passés dans un namespace `retroplanning`.
- Edge function `generate-wedding-retroplanning` : nouveau paramètre `language` (`fr`/`en`) injecté dans le prompt ; la colonne existante `wedding_retroplanning` reçoit une colonne `language` pour savoir si le contenu stocké correspond à la langue affichée (migration légère, défaut `fr`).
- Liste photos : table de correspondance FR→EN des intitulés du modèle standard dans `en/monJourM.json`, appliquée à l'affichage dans `PhotoListTemplate.tsx` / `PhotoListReadOnly.tsx` avec repli sur le texte stocké (donc aucune perte pour les entrées personnalisées). Aucune écriture en base.
- Vérification : `bunx tsgo --noEmit` + passage Playwright FR/EN sur les trois écrans.
