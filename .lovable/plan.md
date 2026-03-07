# Export PDF Budget - Budget reel uniquement + One-pager professionnel

## Modifications

### Fichier : `src/services/budgetExportService.ts`

1- supprimer le header ''budget estimé'' avant le tableau détaillé

 **2-Refonte visuelle one-pager professionnel** avec palette vert sauge `#63745a` + noir :

- Header : fond `#63745a`, titre "Mariable" en blanc, sous-titre "Budget de Mariage"
- Encadre principal : 3 blocs cote a cote (Budget Total, Acomptes Verses, Reste a Payer) avec fond leger sauge
- Tableau : header `#63745a` blanc, lignes zebrees subtiles, categories avec bordure gauche sauge
- Texte principal en noir `#1a1a1a`, texte secondaire en gris fonce
- Police plus compacte (font-size reduit) pour tenir sur une page A4
- Footer discret : date + mariable.fr

**3. Optimisation one-pager** :

- Reduire les paddings/margins
- Font-size items : 11px, categories : 12px
- Supprimer la colonne "Commentaire" pour gagner de la place (ou la garder tres compacte)
- Pas de page-break : tout doit tenir sur 1 page

### Aucun autre fichier modifie

Le composant `DetailedBudget.tsx` appelle deja `exportBudgetToPDF` avec toutes les donnees — seul le service de rendu PDF change.