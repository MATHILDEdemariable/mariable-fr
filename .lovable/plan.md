## Modifications demandées

### 1. Retirer la section RegionalLinksSection autonome
- `src/pages/VersionJuin26.tsx` : retirer l'import et le `<RegionalLinksSection />` placé entre `BlogSection` et `FinalCTASection`.
- Le composant `src/components/home/v2/RegionalLinksSection.tsx` reste dispo (peut servir ailleurs) mais n'est plus monté sur la home.

### 2. Intégrer les 13 régions dans le bandeau "Carnet d'adresses" (`EspaceApercu.tsx`)
Sous la liste `carnetItems` de la sous-section carnet (après le `</ul>` ligne 187), ajouter un bloc compact :
- petit titre eyebrow "Par région" / "By region"
- grille **3 colonnes** (`grid-cols-3`) en `gap-x-4 gap-y-1.5`
- 13 liens texte minimaliste vers `/mariage-{region}`, taille `text-xs` ou `text-sm`, couleur `editorial-noir/70` hover `editorial-olive`, sans icône (pour rester discret)
- Le tableau REGIONS est dupliqué localement (5 lignes) ou importé depuis `RegionalLinksSection`. Préférence : déclarer la constante directement dans `EspaceApercu` pour éviter une dépendance croisée.
- Utilise les clés `footer.links.{key}` déjà créées dans `common.json` (FR + EN).

Footprint visuel : ~6 lignes de liens compacts, n'alourdit pas la page.

### 3. CTA "S'inscrire gratuitement" sur les 13 pages régionales
Chaque page `MariageXxx.tsx` a déjà :
- un CTA hero (vers `/professionnelsmariable?region=...`)
- une section CTA finale en bas

Ajout : un **second bouton** à côté de l'existant dans la section CTA finale, libellé "Créer mon compte gratuit" → lien vers `/register-gratuit`. Style outline pour ne pas concurrencer le primaire.

Pages concernées (13) :
- MariageProvence, MariageParis, MariageAuvergneRhoneAlpes, MariageNouvelleAquitaine, MariageBretagne, MariageNormandie, MariageOccitanie, MariagePaysLoire, MariageCentreValLoire, MariageHautsFrance, MariageBourgogne, MariageGrandEst, MariageCorse

Pattern d'édition (section finale) :
```tsx
<div className="flex flex-wrap justify-center gap-3">
  <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90">
    <Link to="/professionnelsmariable?region=...">Commencer ma recherche<ArrowRight .../></Link>
  </Button>
  <Button asChild size="lg" variant="outline">
    <Link to="/register-gratuit">Créer mon compte gratuit</Link>
  </Button>
</div>
```

### 4. Protéger `/professionnelsmariable` derrière l'authentification
`src/App.tsx` ligne 314 : wrapper la route avec `<ProtectedRoute>` (déjà importé et utilisé pour `/selection`).
```tsx
<Route path="/professionnelsmariable" element={<ProtectedRoute><ProfessionnelsMariable /></ProtectedRoute>} />
```

Conséquence UX : les CTA "Voir les prestataires" depuis les pages régionales redirigent vers login si l'utilisateur n'est pas connecté (comportement standard de `ProtectedRoute`). C'est cohérent avec la demande — la marketplace devient strictement réservée aux comptes.

### Fichiers modifiés (au total)
- `src/pages/VersionJuin26.tsx` (retrait)
- `src/components/home/v2/EspaceApercu.tsx` (ajout bloc régions 3 cols)
- `src/App.tsx` (1 ligne — ProtectedRoute)
- 13 pages `src/pages/MariageXxx.tsx` (ajout bouton CTA inscription)

Aucun changement de logique métier, aucune migration DB, aucune dépendance ajoutée.
