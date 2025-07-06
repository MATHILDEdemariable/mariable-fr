#!/usr/bin/env node

/**
 * Script de vérification des liens critiques
 * Vérifie que toutes les routes définies dans App.tsx ont des composants correspondants
 */

import fs from 'fs';
import path from 'path';

// Couleurs pour l'affichage console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.magenta}${msg}${colors.reset}\n`)
};

// Routes critiques extraites d'App.tsx
const criticalRoutes = [
  // Routes principales
  { path: '/', component: 'Index', file: 'src/pages/Index.tsx' },
  { path: '/dashboard', component: 'UserDashboard', file: 'src/pages/dashboard/UserDashboard.tsx' },
  { path: '/selection', component: 'MoteurRecherche', file: 'src/pages/MoteurRecherche.tsx' },
  { path: '/blog', component: 'Blog', file: 'src/pages/Blog.tsx' },
  
  // Auth
  { path: '/login', component: 'Login', file: 'src/pages/auth/Login.tsx' },
  { path: '/register', component: 'Register', file: 'src/pages/auth/Register.tsx' },
  
  // Admin (CRITIQUE!)
  { path: '/admin/dashboard', component: 'AdminDashboard', file: 'src/pages/admin/AdminDashboard.tsx' },
  { path: '/admin/prestataires', component: 'AdminPrestataires', file: 'src/pages/admin/Prestataires.tsx' },
  
  // À propos
  { path: '/about/histoire', component: 'Histoire', file: 'src/pages/about/Histoire.tsx' },
  { path: '/about/approche', component: 'Approche', file: 'src/pages/about/Approche.tsx' },
  { path: '/about/charte', component: 'Charte', file: 'src/pages/about/Charte.tsx' },
  
  // Contact
  { path: '/contact', component: 'Contact', file: 'src/pages/contact/NousContacter.tsx' },
  { path: '/contact/faq', component: 'FAQ', file: 'src/pages/contact/FAQ.tsx' },
  
  // Légal
  { path: '/mentions-legales', component: 'MentionsLegales', file: 'src/pages/MentionsLegales.tsx' },
  { path: '/cgv', component: 'CGV', file: 'src/pages/CGV.tsx' }
];

// Liens critiques du Footer/Header à vérifier
const criticalLinks = [
  // Footer liens
  '/dashboard',
  '/checklist-mariage', 
  '/planning-personnalise',
  '/selection',
  '/mon-jour-m',
  '/services/budget',
  '/about/histoire',
  '/about/approche', 
  '/about/charte',
  '/contact',
  '/mentions-legales',
  '/cgv',
  // Header liens (à compléter selon Header.tsx)
  '/blog',
  '/admin/dashboard' // CRITIQUE - accès admin
];

function verifyRouteFiles() {
  log.title('🔍 VÉRIFICATION DES FICHIERS DE ROUTES');
  
  let allGood = true;
  let missingFiles = [];
  
  criticalRoutes.forEach(route => {
    const filePath = path.join(process.cwd(), route.file);
    
    if (fs.existsSync(filePath)) {
      log.success(`Route ${route.path} → ${route.component} ✓`);
    } else {
      log.error(`Route ${route.path} → FICHIER MANQUANT: ${route.file}`);
      missingFiles.push(route);
      allGood = false;
    }
  });
  
  if (allGood) {
    log.success('Tous les fichiers de routes existent !');
  } else {
    log.error(`${missingFiles.length} fichier(s) manquant(s) pour les routes critiques`);
  }
  
  return { success: allGood, missingFiles };
}

function extractLinksFromComponents() {
  log.title('🔗 EXTRACTION DES LIENS DEPUIS LES COMPOSANTS');
  
  const components = [
    'src/components/Footer.tsx',
    'src/components/Header.tsx',
    'src/components/HeaderDropdown.tsx'
  ];
  
  let foundLinks = [];
  
  components.forEach(componentPath => {
    const fullPath = path.join(process.cwd(), componentPath);
    
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Regex pour trouver les liens React Router
      const linkRegex = /to="([^"]+)"/g;
      let match;
      
      while ((match = linkRegex.exec(content)) !== null) {
        const link = match[1];
        if (!foundLinks.includes(link)) {
          foundLinks.push(link);
        }
      }
      
      log.info(`${componentPath}: ${foundLinks.filter(link => content.includes(`to="${link}"`)).length} liens trouvés`);
    } else {
      log.warning(`Composant non trouvé: ${componentPath}`);
    }
  });
  
  return foundLinks;
}

function checkAppRoutes() {
  log.title('📋 VÉRIFICATION APP.TSX');
  
  const appPath = path.join(process.cwd(), 'src/App.tsx');
  
  if (!fs.existsSync(appPath)) {
    log.error('App.tsx non trouvé !');
    return false;
  }
  
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  // Vérifier que les routes critiques sont présentes
  let missingRoutes = [];
  
  criticalRoutes.forEach(route => {
    const routePattern = `path="${route.path}"`;
    if (appContent.includes(routePattern)) {
      log.success(`Route ${route.path} présente dans App.tsx`);
    } else {
      log.error(`Route MANQUANTE dans App.tsx: ${route.path}`);
      missingRoutes.push(route.path);
    }
  });
  
  return missingRoutes.length === 0;
}

function generateReport(results) {
  log.title('📊 RAPPORT DE VÉRIFICATION');
  
  console.log(`Routes vérifiées: ${criticalRoutes.length}`);
  console.log(`Fichiers manquants: ${results.verifyFiles.missingFiles.length}`);
  console.log(`App.tsx valide: ${results.appRoutes ? 'Oui' : 'Non'}`);
  
  if (results.verifyFiles.missingFiles.length > 0) {
    log.warning('\n🚨 FICHIERS MANQUANTS:');
    results.verifyFiles.missingFiles.forEach(route => {
      console.log(`   • ${route.path} → ${route.file}`);
    });
  }
  
  const overallSuccess = results.verifyFiles.success && results.appRoutes;
  
  if (overallSuccess) {
    log.success('\n🎉 TOUS LES TESTS SONT PASSÉS !');
    return 0;
  } else {
    log.error('\n❌ PROBLÈMES DÉTECTÉS - Vérifiez les erreurs ci-dessus');
    return 1;
  }
}

// Exécution principale
async function main() {
  console.log(`${colors.bright}${colors.magenta}🔍 VÉRIFICATEUR DE LIENS CRITIQUES${colors.reset}`);
  console.log('📍 Vérification des routes et composants essentiels...\n');
  
  const results = {
    verifyFiles: verifyRouteFiles(),
    appRoutes: checkAppRoutes(),
    extractedLinks: extractLinksFromComponents()
  };
  
  const exitCode = generateReport(results);
  process.exit(exitCode);
}

main().catch(console.error);