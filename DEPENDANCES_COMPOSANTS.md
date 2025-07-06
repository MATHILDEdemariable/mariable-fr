# Documentation des Dépendances entre Composants

## 🔗 Composants Critiques Interconnectés

### Footer.tsx
**Impact** : Navigation globale, accès admin
**Dépendances** :
- Routes App.tsx (tous les liens)
- Admin access (/admin/dashboard)
**⚠️ Points de faillure** :
- Changement de routes sans mise à jour des liens
- Suppression accidentelle du lien admin

### App.tsx (Router)
**Impact** : Toute la navigation
**Dépendances** :
- Tous les composants de pages
- Routes d'authentification
**⚠️ Points de faillure** :
- Modification de route sans mise à jour des liens
- Suppression de routes critiques

### VendorTracking.tsx
**Impact** : Gestion des prestataires
**Dépendances** :
- EditVendorModal.tsx
- VendorCard.tsx
- Supabase (vendors_tracking_preprod)
**⚠️ Points de faillure** :
- Changements de schéma DB sans adaptation
- Modal d'édition cassé = fonctionnalité bloquée

### Header.tsx / HeaderDropdown.tsx
**Impact** : Navigation principale
**Dépendances** :
- Auth context
- Routes App.tsx
**⚠️ Points de faillure** :
- Auth changes cassent dropdown
- Liens morts si routes modifiées

## 🚨 Zones à Risque Élevé

### 1. Navigation (Header/Footer)
- **Symptôme** : Liens 404, boutons qui ne font rien
- **Cause** : Routes changées sans mise à jour des liens
- **Prévention** : Vérifier tous les liens après modification de routes

### 2. Authentification
- **Symptôme** : Impossible de se connecter, redirections infinies
- **Cause** : Changements auth context, routes protégées
- **Prévention** : Tester login/logout après modifs auth

### 3. Administration
- **Symptôme** : Accès admin perdu, fonctionnalités admin cassées
- **Cause** : Lien admin supprimé, routes admin modifiées
- **Prévention** : Toujours maintenir un accès admin visible

### 4. Modals/Dialogs
- **Symptôme** : Boutons ne s'ouvrent pas, modals vides
- **Cause** : Props manquantes, état mal géré
- **Prévention** : Tester ouverture/fermeture après modifs

## 📋 Checklist Avant/Après Modification

### Avant de modifier un composant :
- [ ] Identifier ses dépendances (voir ci-dessus)
- [ ] Noter les fonctionnalités qui pourraient être impactées
- [ ] Préparer les tests à faire après

### Après modification :
- [ ] Tester le composant modifié
- [ ] Tester TOUS ses composants dépendants
- [ ] Vérifier les liens/routes si navigation modifiée
- [ ] Test rapide des fonctionnalités critiques (voir CHECKLIST_FONCTIONNALITES.md)

## 🔧 Outils de Diagnostic Rapide

### Erreurs de Navigation
```bash
# Vérifier que toutes les routes existent
grep -r "to=\"/" src/components/
```

### Erreurs de Compilation
- Ouvrir la console navigateur (F12)
- Chercher erreurs rouges
- Vérifier la compilation Vite

### Test Liens Footer/Header
- Clic droit → "Ouvrir dans un nouvel onglet" sur chaque lien
- Vérifier qu'aucun ne donne 404

---

💡 **RÈGLE** : Plus un composant a de dépendances, plus il faut être prudent en le modifiant !