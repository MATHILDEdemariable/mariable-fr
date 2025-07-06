# 📦 Scripts NPM Améliorés

## Scripts recommandés à ajouter dans package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build", 
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "echo 'Tests à implémenter'",
    "health": "node scripts/health-check.js",
    "verify-links": "node scripts/verify-links.js", 
    "check-all": "node scripts/verify-links.js && node scripts/health-check.js",
    "pre-deploy": "eslint . && node scripts/verify-links.js && node scripts/health-check.js && vite build"
  }
}
```

## 🚀 Utilisation

### Tests rapides
```bash
# Vérifier les liens critiques
npm run verify-links

# Health check complet  
npm run health

# Tous les tests
npm run check-all
```

### Avant déploiement
```bash
# Test complet + build
npm run pre-deploy
```

### Développement
```bash
# Mode dev habituel
npm run dev

# Build de développement
npm run build:dev
```

## 🎯 Objectifs des Scripts

- **verify-links** : Vérifie que toutes les routes ont leurs composants
- **health** : Diagnostic complet de l'application  
- **check-all** : Combine verification + health check
- **pre-deploy** : Pipeline complète avant mise en production

Ces scripts permettent de détecter rapidement les problèmes après chaque modification.