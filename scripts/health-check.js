#!/usr/bin/env node

/**
 * Script de Health Check complet
 * Vérifie l'état général de l'application Mariable
 */

import fs from 'fs';
import path from 'path';

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
  title: (msg) => console.log(`\n${colors.bright}${colors.magenta}${msg}${colors.reset}`)
};

// Tests de santé
const healthChecks = {
  // 1. Vérification des fichiers critiques
  async checkCriticalFiles() {
    log.title('📁 FICHIERS CRITIQUES');
    
    const criticalFiles = [
      'src/App.tsx',
      'src/main.tsx',
      'src/components/Footer.tsx',
      'src/components/Header.tsx',
      'src/pages/Index.tsx',
      'src/pages/admin/AdminDashboard.tsx',
      'src/components/dashboard/VendorTracking.tsx',
      'src/components/dashboard/EditVendorModal.tsx',
      'package.json',
      'vite.config.ts'
    ];
    
    let missing = [];
    
    criticalFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        log.success(`${file}`);
      } else {
        log.error(`MANQUANT: ${file}`);
        missing.push(file);
      }
    });
    
    return { success: missing.length === 0, missing };
  },

  // 2. Vérification des dépendances
  async checkDependencies() {
    log.title('📦 DÉPENDANCES');
    
    const packagePath = path.join(process.cwd(), 'package.json');
    
    if (!fs.existsSync(packagePath)) {
      log.error('package.json manquant !');
      return { success: false };
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const deps = Object.keys(packageJson.dependencies || {});
    const devDeps = Object.keys(packageJson.devDependencies || {});
    
    log.success(`${deps.length} dépendances de production`);
    log.success(`${devDeps.length} dépendances de développement`);
    
    // Vérifier les dépendances critiques
    const criticalDeps = [
      'react',
      'react-dom', 
      'react-router-dom',
      '@supabase/supabase-js',
      'lucide-react',
      'tailwindcss'
    ];
    
    let missingCritical = [];
    
    criticalDeps.forEach(dep => {
      if (deps.includes(dep)) {
        log.success(`${dep} installé`);
      } else {
        log.error(`DÉPENDANCE CRITIQUE MANQUANTE: ${dep}`);
        missingCritical.push(dep);
      }
    });
    
    return { 
      success: missingCritical.length === 0, 
      totalDeps: deps.length + devDeps.length,
      missingCritical 
    };
  },

  // 3. Vérification des routes admin
  async checkAdminAccess() {
    log.title('🔐 ACCÈS ADMIN');
    
    const adminFiles = [
      'src/pages/admin/AdminDashboard.tsx',
      'src/pages/admin/Prestataires.tsx',
      'src/pages/admin/Blog.tsx',
      'src/pages/admin/FormAdmin.tsx'
    ];
    
    let issues = [];
    
    adminFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        log.success(`${file.split('/').pop()}`);
      } else {
        log.error(`ADMIN MANQUANT: ${file}`);
        issues.push(file);
      }
    });
    
    // Vérifier le lien admin dans Footer
    const footerPath = path.join(process.cwd(), 'src/components/Footer.tsx');
    if (fs.existsSync(footerPath)) {
      const footerContent = fs.readFileSync(footerPath, 'utf8');
      if (footerContent.includes('/admin/dashboard')) {
        log.success('Lien admin présent dans Footer');
      } else {
        log.error('LIEN ADMIN MANQUANT dans Footer');
        issues.push('footer-admin-link');
      }
    }
    
    return { success: issues.length === 0, issues };
  },

  // 4. Vérification des composants de prestataires
  async checkVendorComponents() {
    log.title('🏢 COMPOSANTS PRESTATAIRES');
    
    const vendorFiles = [
      'src/components/dashboard/VendorTracking.tsx',
      'src/components/dashboard/EditVendorModal.tsx',
      'src/components/dashboard/AddVendorDialog.tsx',
      'src/components/VendorCard.tsx'
    ];
    
    let missing = [];
    
    vendorFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        log.success(`${file.split('/').pop()}`);
      } else {
        log.warning(`COMPOSANT MANQUANT: ${file}`);
        missing.push(file);
      }
    });
    
    return { success: missing.length === 0, missing };
  },

  // 5. Vérification de la configuration
  async checkConfiguration() {
    log.title('⚙️ CONFIGURATION');
    
    const configFiles = [
      'tailwind.config.ts',
      'vite.config.ts',
      'tsconfig.json'
    ];
    
    let issues = [];
    
    configFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        log.success(`${file}`);
      } else {
        log.error(`CONFIG MANQUANTE: ${file}`);
        issues.push(file);
      }
    });
    
    return { success: issues.length === 0, issues };
  }
};

// Génération du rapport final
function generateHealthReport(results) {
  log.title('📊 RAPPORT DE SANTÉ');
  
  const checks = Object.keys(results);
  const passed = checks.filter(check => results[check].success).length;
  const failed = checks.length - passed;
  
  console.log(`Tests effectués: ${checks.length}`);
  console.log(`${colors.green}Réussis: ${passed}${colors.reset}`);
  console.log(`${colors.red}Échoués: ${failed}${colors.reset}`);
  
  if (failed > 0) {
    log.warning('\n🚨 PROBLÈMES DÉTECTÉS:');
    
    checks.forEach(check => {
      if (!results[check].success) {
        console.log(`\n${colors.red}❌ ${check}:${colors.reset}`);
        
        if (results[check].missing) {
          results[check].missing.forEach(item => {
            console.log(`   • ${item}`);
          });
        }
        
        if (results[check].issues) {
          results[check].issues.forEach(item => {
            console.log(`   • ${item}`);
          });
        }
      }
    });
  }
  
  // Score de santé
  const healthScore = Math.round((passed / checks.length) * 100);
  
  console.log(`\n${colors.bright}Score de santé: ${healthScore}%${colors.reset}`);
  
  if (healthScore >= 90) {
    log.success('🎉 APPLICATION EN EXCELLENTE SANTÉ !');
    return 0;
  } else if (healthScore >= 70) {
    log.warning('⚠️ Application fonctionnelle mais améliorations possibles');
    return 1;
  } else {
    log.error('🚨 PROBLÈMES CRITIQUES DÉTECTÉS');
    return 2;
  }
}

// Exécution principale
async function main() {
  console.log(`${colors.bright}${colors.magenta}🏥 HEALTH CHECK MARIABLE${colors.reset}`);
  console.log('🔍 Vérification complète de l\'état de l\'application...\n');
  
  const results = {};
  
  // Exécuter tous les checks
  for (const [checkName, checkFunction] of Object.entries(healthChecks)) {
    try {
      results[checkName] = await checkFunction();
    } catch (error) {
      log.error(`Erreur lors du check ${checkName}: ${error.message}`);
      results[checkName] = { success: false, error: error.message };
    }
  }
  
  const exitCode = generateHealthReport(results);
  process.exit(exitCode);
}

main().catch(console.error);