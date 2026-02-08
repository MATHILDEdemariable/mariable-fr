
## Plan d'implementation - 4 corrections

---

## 1. Limitation du stockage de documents (2 max pour free)

### Fichiers a modifier

**`src/components/documents/DocumentUploader.tsx`**

Ajouter une verification avant l'upload :
- Importer `useUserProfile` pour verifier `isPremium`
- Compter les documents existants via query React Query
- Si `documentsCount >= 2` et `!isPremium` : afficher le modal Premium au lieu d'uploader
- Afficher un bandeau informatif indiquant la limite

**Modifications :**

```text
1. Importer usePremiumAction et PremiumModal
2. Ajouter une query pour compter les documents existants
3. Dans handleUpload() : verifier la limite avant upload
4. Si limite atteinte et non-premium : afficher le modal
5. Ajouter un indicateur visuel de la limite (ex: "2/2 documents")
```

**`src/pages/dashboard/DocumentsPage.tsx`**

Ajouter un bandeau premium si limite atteinte :
- Afficher le nombre de documents / limite
- Message "Passez au premium pour un stockage illimite"

---

## 2. Correction du Moodboard (Edge Function error)

### Diagnostic

L'edge function fonctionne correctement (test reussi avec statut 200). L'erreur que l'utilisateur voit est due a un probleme de logique dans `MoodboardPage.tsx` :

**Probleme identifie :**

Dans le fichier, quand `canUseFeature('moodboard')` retourne `false`, le code appelle `executeAction(() => {})` avec une fonction vide, ce qui affiche le modal mais ne fait rien d'autre. Cependant, l'erreur "Edge Function returned a non-2xx status code" indique que l'edge function est quand meme appelee malgre la verification.

Le probleme reel est une **erreur temporaire de l'API gateway** (503/502) comme visible dans les logs fournis. La fonction a deja une gestion de ces erreurs (ajoutee precedemment), mais le message d'erreur n'est pas remonte correctement au frontend.

### Solution

**`src/hooks/useMoodboard.ts`** - Ligne 95-97

Ameliorer la gestion d'erreur pour afficher le message exact de l'edge function :

```text
Avant :
  if (error) {
    throw new Error(error.message);
  }

Apres :
  if (error) {
    // Si c'est une erreur JSON avec un message personnalise
    const errorMessage = error.message || "Erreur lors de l'analyse";
    throw new Error(errorMessage);
  }
```

**`src/pages/dashboard/MoodboardPage.tsx`** - Ligne 68-73

Corriger la logique de verification pour eviter d'appeler une fonction vide :

```text
Avant :
  if (!canUseFeature('moodboard')) {
    executeAction(() => {});
    return;
  }

Apres :
  if (!canUseFeature('moodboard')) {
    // Afficher directement le modal Premium sans passer par executeAction
    // qui attend une action a executer
    setShowPremiumDirectly(true);
    return;
  }
```

Ou plus simple, utiliser directement le state du modal premium.

---

## 3. Modification FAQ Accueil

### 3.1 Modifier la question existante

**Fichiers a modifier :**
- `src/pages/contact/FAQ.tsx` - Ligne 23-25
- `src/pages/Mariable.tsx` - Ligne 157-159

**Nouveau texte pour "Mariable est-il vraiment gratuit ?"**

```text
"Oui, de nombreuses fonctionnalites sont 100% gratuites : tableau de bord, 
checklist, calculateur de budget, gestion des invites, plan de table, et 
coordination jour J. Mariable propose egalement des fonctionnalites premium 
a decouvrir pour aller plus loin dans l'organisation de votre mariage."
```

### 3.2 Ajouter une nouvelle question

**Nouvelle question :** "Que comprend le premium et quel est le prix ?"

**Reponse :**

```text
"Le compte Premium Mariable est disponible a 29€ (paiement unique, acces a vie). 
Il comprend :
- Export illimite de vos PDF personnalises (budget, plan de table, 
  checklist ceremonies, moodboard, suivi prestataires)
- Acces complet aux checklists et guides 
- Utilisation IA sans limite pour les checklist, retroplanning et moodboard
- Stockage illimite de documents
- Plus de 3 lignes par categorie de budget

Sans Premium, vous beneficiez d'1 generation IA par outil et de 2 documents 
stockables."
```

### Fichiers a modifier

| Fichier | Lignes | Action |
|---------|--------|--------|
| `src/pages/contact/FAQ.tsx` | 22-25 | Modifier reponse + ajouter nouvelle question apres |
| `src/pages/Mariable.tsx` | 156-159 | Modifier reponse + ajouter nouvelle question apres |

---

## 4. Section "Que se passe-t-il apres votre candidature ?" sur /partenariat

### Emplacement

Ajouter cette section **apres** le formulaire (section `#formulaire-inscription`), donc entre les lignes 625 et 626.

### Contenu de la section

**Structure en 3 etapes avec icones et badges colores :**

```text
Etape 1 : Validation de votre profil (48-72h)
- SIRET actif et en regle
- Assurance professionnelle valide (RC Pro)
- Coherence avec la ligne editoriale Mariable
- Avis Google recents et positifs (min 4/5 etoiles)

Etape 2 : Activation de votre partenariat
- Lien de paiement securise
- Acces aux guidelines partenaires

Etape 3 : Mise en ligne (sous 10 jours max)
- Publication de votre fiche complete
- Post Instagram dedie
- Guide digital partenaire
```

### Implementation

**`src/pages/Partenariat.tsx`** - Ajouter apres ligne 624 (apres la fermeture de `</div>` du formulaire)

```text
<section className="py-16 px-4 bg-editorial-beige/30">
  <div className="container mx-auto max-w-4xl">
    <h2>Que se passe-t-il apres votre candidature ?</h2>
    
    <div className="grid md:grid-cols-3 gap-6">
      <!-- Etape 1 -->
      <div className="bg-white p-6">
        <span className="badge">48-72h</span>
        <h3>Validation de votre profil</h3>
        <ul>
          <li>SIRET actif et en regle</li>
          <li>Assurance professionnelle valide (RC Pro)</li>
          <li>Coherence avec la ligne editoriale Mariable</li>
          <li>Avis Google recents et positifs (min 4/5)</li>
        </ul>
      </div>
      
      <!-- Etape 2 -->
      <div className="bg-white p-6">
        <span className="badge">Apres validation</span>
        <h3>Activation de votre partenariat</h3>
        <ul>
          <li>Lien de paiement securise</li>
          <li>Acces aux guidelines partenaires</li>
        </ul>
      </div>
      
      <!-- Etape 3 -->
      <div className="bg-white p-6">
        <span className="badge">Sous 10 jours</span>
        <h3>Mise en ligne</h3>
        <ul>
          <li>Publication de votre fiche complete</li>
          <li>Post Instagram dedie</li>
          <li>Guide digital partenaire</li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

---

## Resume des fichiers

### A modifier (6 fichiers)

| Fichier | Modifications |
|---------|---------------|
| `src/components/documents/DocumentUploader.tsx` | Ajouter limite 2 documents + modal premium |
| `src/pages/dashboard/DocumentsPage.tsx` | Afficher indicateur de limite |
| `src/hooks/useMoodboard.ts` | Ameliorer gestion erreur edge function |
| `src/pages/dashboard/MoodboardPage.tsx` | Corriger logique canUseFeature |
| `src/pages/contact/FAQ.tsx` | Modifier FAQ + ajouter question premium |
| `src/pages/Mariable.tsx` | Modifier FAQ + ajouter question premium |
| `src/pages/Partenariat.tsx` | Ajouter section etapes apres candidature |

---

## Ordre d'implementation recommande

1. **Moodboard** - Correction critique, fonctionnalite cassee
2. **FAQ** - Modifications textuelles simples
3. **Documents** - Limite de stockage
4. **Partenariat** - Nouvelle section

