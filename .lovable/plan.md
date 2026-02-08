

## Plan d'implementation - Freemium & Optimisations

---

## 1. Systeme de limitations Freemium

### 1.1 Limitation Budget (3 lignes par categorie)

**Fichier a modifier : `src/components/dashboard/DetailedBudget.tsx`**

Ajouter une limite de 3 items par categorie pour les utilisateurs non-premium :

- Modifier `handleAddItem` pour verifier le nombre d'items existants
- Si `category.items.length >= 3` et `!isPremium` : afficher le modal Premium au lieu d'ajouter
- Afficher un bandeau "Debloquez l'ajout illimite avec Premium" sous les categories limitees

### 1.2 Limitation requetes IA (1x max par fonctionnalite)

**Table existante : `ai_usage_tracking`**

Structure disponible :
- `user_id` : UUID de l'utilisateur
- `prompts_used_today` : Nombre de prompts utilises
- `total_prompts` : Total cumule

**Nouveau hook a creer : `src/hooks/useAiUsageLimit.ts`**

Fonctionnement :
- Verifier si l'utilisateur a deja utilise l'IA pour cette fonctionnalite specifique
- Si oui et non-premium : bloquer et afficher modal Premium
- Si premium : autoriser sans limite

**Fonctionnalites concernees :**

| Fonctionnalite | Fichier | Limite Free |
|----------------|---------|-------------|
| Checklist IA | `ChecklistIntelligente.tsx` | 1 generation max |
| Moodboard | `MoodboardPage.tsx` | 1 generation max |
| Retroplanning | `WeddingRetroplanningEmbed.tsx` | 1 generation max |

**Modifications par fichier :**

1. `src/components/dashboard/ChecklistIntelligente.tsx`
   - Importer `useAiUsageLimit`
   - Avant `generateChecklist()` : verifier si deja genere
   - Si `hasUsedAi('checklist')` et `!isPremium` : modal Premium

2. `src/pages/dashboard/MoodboardPage.tsx`
   - Meme logique avant `analyzeColors()`
   - Verifier `hasUsedAi('moodboard')`

3. `src/pages/dashboard/WeddingRetroplanningEmbed.tsx`
   - Avant `handleGenerate()`
   - Verifier `hasUsedAi('retroplanning')`

### 1.3 Export PDF payant (Seating Plan, Budget, Suivi)

**Fichiers a modifier :**

1. `src/components/seating-plan/ExportPDFButton.tsx`
   - Ajouter `usePremiumAction` hook
   - Encapsuler `handleExport` dans `executeAction()`
   - Ajouter icone Lock si non-premium

2. `src/components/dashboard/DetailedBudget.tsx`
   - Encapsuler `handleExportPDF` et `handleExportCSV` dans `executeAction()`
   - Ajouter icones Lock

3. `src/pages/dashboard/VendorTrackingPage.tsx`
   - Ajouter bouton "Exporter PDF" protege par `usePremiumAction`

---

## 2. Modification Stripe : 29€ paiement unique

### 2.1 Edge Function create-checkout-session

**Fichier : `supabase/functions/create-checkout-session/index.ts`**

Modifications :
- Remplacer `mode: 'subscription'` par `mode: 'payment'`
- Remplacer `price: 'price_1SNGa5KHghqBzkgjhnsKDqtU'` par `price: 'price_1SyYn8KHghqBzkgj249P8325'`
- Supprimer `subscription_data` (non applicable en mode payment)

```text
Avant :
  mode: 'subscription',
  price: 'price_1SNGa5KHghqBzkgjhnsKDqtU',
  subscription_data: { ... }

Apres :
  mode: 'payment',
  price: 'price_1SyYn8KHghqBzkgj249P8325',
```

### 2.2 Webhook Stripe

**Fichier : `supabase/functions/stripe-webhook/index.ts`**

Le webhook est deja configure pour gerer `checkout.session.completed` correctement.
Verification necessaire :
- Le handler met a jour `subscription_type: 'premium'` sans date d'expiration (`subscription_expires_at: null`)
- Compatible avec paiement unique car la logique est sur le statut `payment_status: 'paid'`

Aucune modification requise si le prix Stripe `price_1SyYn8KHghqBzkgj249P8325` est bien configure.

### 2.3 Composant StripeButton

**Fichier : `src/components/premium/StripeButton.tsx`**

Modifications du texte affiche :
- Remplacer "9,9€/mois" par "29€ une seule fois"
- Remplacer "S'abonner maintenant" par "Acceder au Premium"
- Supprimer le texte sur l'annulation (non applicable)

### 2.4 Modal Premium

**Fichier : `src/components/premium/PremiumModal.tsx`**

Nouveau contenu du modal :

```text
Titre : Envie d'aller plus loin ?

Le compte Premium a 29€ debloque :

- Export illimite de vos PDF personnalises
- Acces complet aux checklists et guides
- Utilisation IA sans limite pour les checklist, retroplanning, moodboard
```

---

## 3. Amelioration PDF Plan de Table

### 3.1 Refonte du service d'export

**Fichier a refactoriser : `src/components/seating-plan/ExportPDFButton.tsx`**

Structure actuelle : jsPDF texte simple
Objectif : Style similaire aux autres PDFs (budget, ceremonie) avec branding Mariable

**Nouveau design :**

Page 1 - Vue d'ensemble :
- Header avec logo Mariable et couleur `#7F9474`
- Titre "Plan de Table" en police serif
- Date et lieu de l'evenement
- Encadre avec statistiques (nombre d'invites, tables, taux de remplissage)
- Ligne de separation

Pages suivantes - Detail par table :
- Chaque table sur une section
- Nom de table en gras avec badge couleur
- Liste des invites avec indicateurs (VIP, restrictions alimentaires)
- Notes eventuelles

### 3.2 Export visuel de la disposition

**Nouveau composant optionnel : `src/components/seating-plan/ExportVisualPDFButton.tsx`**

Utiliser `html2canvas` pour capturer le `SeatingPlanVisual` et l'exporter en PDF.

**Implementation :**
- Capture du canvas visual avec `html2canvas`
- Export en PDF A4 paysage pour meilleure lisibilite
- Ajout du header Mariable et footer

---

## Resume des fichiers

### A creer (2 fichiers)

| Fichier | Description |
|---------|-------------|
| `src/hooks/useAiUsageLimit.ts` | Hook pour tracker et limiter l'usage IA par fonctionnalite |
| `src/components/seating-plan/ExportVisualPDFButton.tsx` | Export visuel du plan de table |

### A modifier (11 fichiers)

| Fichier | Modifications |
|---------|---------------|
| `supabase/functions/create-checkout-session/index.ts` | Mode payment + nouveau price ID |
| `src/components/premium/StripeButton.tsx` | Texte 29€ + nouveau libelle |
| `src/components/premium/PremiumModal.tsx` | Nouveau contenu marketing |
| `src/components/dashboard/DetailedBudget.tsx` | Limite 3 items + export payant |
| `src/components/dashboard/ChecklistIntelligente.tsx` | Limite 1 generation IA |
| `src/pages/dashboard/MoodboardPage.tsx` | Limite 1 generation IA |
| `src/pages/dashboard/WeddingRetroplanningEmbed.tsx` | Limite 1 generation IA |
| `src/components/seating-plan/ExportPDFButton.tsx` | Redesign + paywall |
| `src/pages/dashboard/VendorTrackingPage.tsx` | Ajout export PDF payant |
| `src/pages/SeatingPlan.tsx` | Ajout bouton export visuel |

---

## Ordre d'implementation recommande

1. **Stripe 29€** - Changement critique, impact business direct
2. **Modal Premium** - Mise a jour du message marketing
3. **Limitations IA** - Hook + integration dans les 3 composants
4. **Limitation Budget** - Logique simple a ajouter
5. **PDF Plan de table** - Ameliorations visuelles

---

## Details techniques

### Hook useAiUsageLimit

```text
Fonctions exposees :
- hasUsedFeature(featureName: string): boolean
- recordUsage(featureName: string): Promise<void>
- canUseFeature(featureName: string): boolean (combine isPremium + hasUsed)

Stockage :
- Table ai_usage_tracking existante
- Ajout colonne feature_name si necessaire
- OU utilisation d'un JSON dans la colonne existante
```

### Logique de verification Premium

Le hook `useUserProfile` retourne deja `isPremium: boolean`.
La verification est basee sur :
- `subscription_type === 'premium'`
- `subscription_expires_at` null ou dans le futur

Avec le changement vers paiement unique, `subscription_expires_at` restera null (acces permanent).

