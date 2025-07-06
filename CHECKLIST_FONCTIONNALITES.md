# Checklist des Fonctionnalités Critiques

## 🚨 CRITIQUE (À tester OBLIGATOIREMENT après chaque modification)

### Navigation Principale
- [ ] Header : Liens vers Dashboard, Sélection, Planning, Blog, À Propos
- [ ] Footer : Logo cliquable vers admin (/admin/dashboard)
- [ ] Footer : Tous les liens fonctionnent
- [ ] Routes principales accessibles (/, /dashboard, /selection, /blog, /admin)

### Authentification
- [ ] Login/Register fonctionnel
- [ ] Redirection après connexion
- [ ] Protection des routes admin
- [ ] Déconnexion fonctionne

### Administration
- [ ] Accès admin via footer (logo M)
- [ ] Dashboard admin accessible (/admin/dashboard)
- [ ] Gestion des prestataires fonctionne
- [ ] Gestion du blog fonctionne

### Fonctionnalités Prestataires
- [ ] Sélection Mariable redirige vers /selection
- [ ] Ajout prestataire personnel fonctionne
- [ ] Modification prestataires personnels (modal d'édition)
- [ ] Changement de statut prestataires
- [ ] Suppression prestataires

## ⚠️ IMPORTANT (À tester si zone modifiée)

### Dashboard Utilisateur
- [ ] Affichage des tâches
- [ ] Calculateur de budget
- [ ] Planning personnel
- [ ] Coordination mariage

### Pages Publiques
- [ ] Page d'accueil complète
- [ ] Blog avec articles
- [ ] À propos et sous-pages
- [ ] Contact et FAQ (/contact/faq)

### Formulaires
- [ ] Contact fonctionne
- [ ] Inscription prestataires
- [ ] Réservation Jour-M

## 📋 SECONDAIRE (À tester périodiquement)

### Performance
- [ ] Temps de chargement acceptable
- [ ] Pas d'erreurs console critiques
- [ ] Images s'affichent correctement

### Mobile
- [ ] Navigation mobile fonctionne
- [ ] Responsive design OK
- [ ] Modals utilisables sur mobile

---

## 📝 PROCÉDURE DE TEST RAPIDE (2-3 minutes)

1. **Navigation** : Cliquer sur tous les liens du header/footer
2. **Admin** : Cliquer sur le logo M dans le footer → doit aller vers admin
3. **Prestataires** : Tester ajout/modification/suppression
4. **Auth** : Tester login si modifié
5. **Console** : Vérifier pas d'erreurs rouges critiques

⚡ **RÈGLE D'OR** : Si vous modifiez un composant, testez AU MINIMUM les fonctionnalités qu'il utilise !