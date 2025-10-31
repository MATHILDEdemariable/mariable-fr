#!/bin/bash

# ============================================
# Script de backup automatique Mariable
# ============================================
# Ce script crée une sauvegarde complète de la base de données Supabase
# 
# Utilisation : ./scripts/backup-database.sh
# 
# IMPORTANT: Remplacez [PASSWORD] par votre mot de passe postgres

# Configuration
PROJECT_REF="bgidfcqktsttzlwlumtz"
BACKUP_DIR="./backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)

# Créer le dossier de backup s'il n'existe pas
mkdir -p $BACKUP_DIR

echo "🔐 MARIABLE - Backup Base de Données"
echo "========================================"
echo "Projet: $PROJECT_REF"
echo "Date: $DATE"
echo ""

# Exporter toutes les tables
echo "📦 Export en cours..."

# IMPORTANT: Remplacez [PASSWORD] par votre vrai mot de passe postgres
# Vous pouvez le trouver dans les settings de votre projet Supabase
supabase db dump --db-url "postgresql://postgres:[PASSWORD]@db.$PROJECT_REF.supabase.co:5432/postgres" > $BACKUP_DIR/backup_$DATE.sql

if [ $? -eq 0 ]; then
    echo "✅ Backup créé avec succès !"
    echo "📁 Fichier: $BACKUP_DIR/backup_$DATE.sql"
    
    # Afficher la taille du fichier
    FILE_SIZE=$(du -h "$BACKUP_DIR/backup_$DATE.sql" | cut -f1)
    echo "📊 Taille: $FILE_SIZE"
    
    # Garder seulement les 30 derniers backups
    echo ""
    echo "🧹 Nettoyage des anciens backups (garde 30 derniers)..."
    ls -t $BACKUP_DIR/backup_*.sql | tail -n +31 | xargs -r rm
    
    REMAINING=$(ls $BACKUP_DIR/backup_*.sql 2>/dev/null | wc -l)
    echo "📂 Backups restants: $REMAINING"
else
    echo "❌ Erreur lors du backup"
    echo ""
    echo "💡 Vérifiez que:"
    echo "  1. Vous avez remplacé [PASSWORD] par votre mot de passe postgres"
    echo "  2. Le CLI Supabase est installé (npm install -g supabase)"
    echo "  3. Vous avez une connexion internet"
    exit 1
fi

echo ""
echo "✨ Backup terminé !"
