
# Plan — Compléter la traduction EN du dashboard

Objectif: rendre le toggle FR/EN 100% fonctionnel sur les modules signalés.

## Modules à traiter

### 1. Checklist intelligente (image 1)
- `src/components/dashboard/ChecklistIntelligente.tsx`: titre "Check-list intelligente", description, placeholder textarea, label "Décrivez votre mariage…", bouton "Générer ma checklist".
- Edge function `generate-checklist-ai`: passer `language` (fr|en) depuis le client, adapter le system prompt pour générer la checklist dans la langue active.

### 2. Project timeline — détail par mois (image 2)
- Les tâches affichées proviennent de la table `wedding_retroplanning` (générées par IA en français).
- Edge function `generate-wedding-retroplanning`: ajouter paramètre `language`, system prompt bilingue (FR ou EN), périodes (`12-9 months before`, etc.), tâches et milestones générés dans la langue active.
- Côté client (`WeddingRetroplanningEmbed.tsx`): passer `i18n.language` à l'appel `supabase.functions.invoke`.
- Note: les rétroplannings déjà sauvegardés en FR resteront en FR (contenu DB). Ajout d'un bouton "Regénérer" si nécessaire — sinon ils peuvent supprimer et regénérer.

### 3. Budget calculator (image 3)
- `src/components/dashboard/BudgetCalculator.tsx`: "Choisissez votre méthode de calcul", "Sélectionnez la méthode…", "Je connais mon budget", "Je ne connais pas mon budget", descriptions, étapes suivantes du wizard.
- `src/components/dashboard/BudgetSummary.tsx`: textes restants.

### 4. Drinks calculator (image 4)
- `src/components/drinks/DrinksCalculator.tsx`: "Calculatrice boissons : quantité et budget", "Nombre d'invités", "Moments de consommation", labels Champagne/Vin/Alcool, "Gamme de boissons", "Abordable/Premium/Luxe", "Recommandations de service", tout le bloc de recommandations (Apéritif, Repas, Dessert, Soirée), résultats calculés.
- `src/components/drinks/DrinksCalculatorExport.tsx`: PDF export FR→EN selon langue.
- `src/components/dashboard/DrinksCalculatorWidget.tsx`: "Calculateur de Boissons", "Imprimer".
- `src/pages/dashboard/DrinksCalculatorPage.tsx`: Helmet title/description.

### 5. Guide d'utilisation Accommodations (image 5)
- `src/components/accommodations/AccommodationTutorial.tsx`: "Guide d'utilisation", titres des 4 sections (Comment ajouter un logement, assigner des invités, gérer statuts, conseils) et leur contenu déplié.

### 6. Documents — uploader (image 6)
- `src/components/documents/DocumentUploader.tsx`: "Uploader un document", "Analyse IA Premium activée", "Type de document", options select (Devis, Contrat, Facture, Autre), "Nom du prestataire (optionnel)", placeholder "Ex: Château de Versailles", "Catégorie (optionnel)", placeholder "Ex: Lieu de réception", "Fichier (PDF, Word…)", "Choisir un fichier / Aucun fichier choisi" (limité par navigateur — laisser tel quel), bouton "Uploader", toasts d'erreur/succès.

## Implémentation

- Tout via le namespace existant `weddingDay` (clés ajoutées sous `checklistAI.*`, `timeline.*`, `budgetCalc.*`, `drinks.*`, `accommodationGuide.*`, `documentUploader.*`).
- `useTranslation('weddingDay')` + remplacement des chaînes en dur.
- Listes éditoriales (recommandations boissons, guide accommodations): `t('...', { returnObjects: true })`.
- Edge functions (`generate-checklist-ai`, `generate-wedding-retroplanning`): ajout param `language`, branche système prompt FR/EN. Aucun changement de schéma DB.
- Aucun refactor de logique métier — seules les chaînes d'affichage et les prompts IA changent.

## Hors scope

- Re-traduction du contenu DB déjà stocké (checklist/rétroplanning sauvegardés en FR). L'utilisateur peut regénérer en EN.
