#!/bin/bash

# 🔍 Script de vérification rapide pour Mariable
# Utilise ce script comme alternative aux commandes npm

echo "🔍 MARIABLE - VÉRIFICATIONS AUTOMATIQUES"
echo "========================================"

# Vérification des liens
echo ""
echo "1️⃣ Vérification des liens critiques..."
node scripts/verify-links.js

if [ $? -ne 0 ]; then
    echo "❌ Problèmes détectés dans les liens"
    exit 1
fi

# Health check
echo ""
echo "2️⃣ Health check complet..."
node scripts/health-check.js

if [ $? -ne 0 ]; then
    echo "❌ Problèmes détectés dans le health check"
    exit 1
fi

echo ""
echo "✅ TOUS LES TESTS SONT PASSÉS !"
echo "🚀 Application prête"