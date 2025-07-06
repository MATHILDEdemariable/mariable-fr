# 🔄 ROUTINE DE TESTS APRÈS MODIFICATIONS

## 📋 Guide Rapide par Type de Modification

### 🚨 AVANT CHAQUE MODIFICATION
```bash
# Sauvegarder l'état actuel
git add . && git commit -m "Sauvegarde avant modification"

# Vérifier l'état de santé
npm run health
```

---

## 🔧 APRÈS MODIFICATION DE NAVIGATION (Header/Footer/Routes)

### Tests Obligatoires (2-3 minutes)
1. **Vérification automatique** :
   ```bash
   npm run verify-links
   ```

2. **Tests manuels** :
   - [ ] Cliquer sur TOUS les liens du header
   - [ ] Cliquer sur TOUS les liens du footer 
   - [ ] **CRITIQUE** : Cliquer sur le logo M (footer) → doit aller vers `/admin/dashboard`
   - [ ] Vérifier qu'aucun lien ne donne 404

3. **Routes critiques à tester manuellement** :
   - [ ] `/` (accueil)
   - [ ] `/admin/dashboard` (admin)
   - [ ] `/dashboard` (utilisateur)
   - [ ] `/selection` (prestataires)
   - [ ] `/blog` (blog)

---

## 🏢 APRÈS MODIFICATION DES PRESTATAIRES

### Tests Obligatoires (3-4 minutes)
1. **Composants prestataires** :
   - [ ] Aller sur `/dashboard` → section "Mes prestataires"
   - [ ] Cliquer "Sélection Mariable" → doit aller vers `/selection`
   - [ ] Cliquer "Sélection personnelle" → modal doit s'ouvrir
   - [ ] Ajouter un prestataire personnel → doit fonctionner
   - [ ] Modifier un prestataire personnel → modal édition doit s'ouvrir
   - [ ] Changer le statut d'un prestataire → dropdown doit fonctionner

2. **Vérification base de données** :
   - [ ] Les modifications sont bien sauvegardées
   - [ ] Pas d'erreurs dans la console navigateur

---

## 🔐 APRÈS MODIFICATION D'AUTHENTIFICATION

### Tests Obligatoires (4-5 minutes)
1. **Cycle complet auth** :
   - [ ] Aller sur `/login`
   - [ ] Se connecter avec un compte existant
   - [ ] Vérifier redirection vers `/dashboard`
   - [ ] Se déconnecter
   - [ ] Vérifier redirection vers `/`

2. **Protection des routes** :
   - [ ] Essayer d'accéder à `/admin/dashboard` sans être connecté
   - [ ] Vérifier que l'accès admin fonctionne pour les admins

---

## 🎨 APRÈS MODIFICATION D'UI/STYLES

### Tests Obligatoires (2-3 minutes)
1. **Responsive** :
   - [ ] Tester sur mobile (DevTools)
   - [ ] Tester sur tablet (DevTools)
   - [ ] Vérifier que rien n'est cassé visuellement

2. **Fonctionnalités** :
   - [ ] Les boutons fonctionnent encore
   - [ ] Les modals s'ouvrent/ferment
   - [ ] Les formulaires sont utilisables

---

## 📊 APRÈS MODIFICATION ADMIN

### Tests Obligatoires (3-4 minutes)
1. **Accès admin** :
   - [ ] Footer : Logo M cliquable vers admin ✓
   - [ ] Se connecter en tant qu'admin
   - [ ] Vérifier toutes les sections admin :
     - [ ] Dashboard admin
     - [ ] Prestataires
     - [ ] Blog
     - [ ] Formulaires

2. **Gestion prestataires admin** :
   - [ ] Ajouter/modifier/supprimer prestataire
   - [ ] Upload de photos fonctionne
   - [ ] Changement de statut fonctionne

---

## 🤖 SCRIPTS D'AUTOMATISATION

### Vérification rapide (1 minute)
```bash
npm run check-all
```

### Health Check complet (30 secondes)
```bash
npm run health
```

### Avant déploiement (2-3 minutes)
```bash
npm run pre-deploy
```

---

## 🚨 CHECKLIST CRITIQUE UNIVERSELLE

**À faire après CHAQUE modification, sans exception :**

1. **Navigation** (30 secondes) :
   - [ ] Header fonctionne
   - [ ] Footer fonctionne
   - [ ] Logo M (footer) → admin

2. **Console** (10 secondes) :
   - [ ] F12 → Console → Pas d'erreurs rouges critiques

3. **Fonctionnalité modifiée** (1-2 minutes) :
   - [ ] La fonctionnalité que vous avez modifiée fonctionne
   - [ ] Les fonctionnalités liées fonctionnent encore

---

## 🎯 RÈGLES D'OR

1. **JAMAIS** pousser en production sans tests
2. **TOUJOURS** tester la fonctionnalité modifiée + celles liées
3. **TOUJOURS** vérifier l'accès admin (logo M du footer)
4. **TOUJOURS** vérifier la console pour les erreurs
5. En cas de doute → `npm run health`

---

## 🚦 INDICATEURS DE PROBLÈME

### 🔴 STOPPER IMMÉDIATEMENT si :
- Logo M (footer) ne va pas vers admin
- Erreurs rouges dans la console
- 404 sur les routes principales
- Impossible de se connecter en admin

### 🟡 ATTENTION si :
- Warnings jaunes dans la console
- Tests automatiques échouent
- Performance dégradée
- Responsive cassé

### 🟢 BON si :
- `npm run health` → Score > 90%
- Pas d'erreurs console
- Navigation fluide
- Fonctionnalités testées OK

---

💡 **ASTUCE** : Gardez un onglet admin ouvert pendant le développement pour vérifier rapidement l'accès !