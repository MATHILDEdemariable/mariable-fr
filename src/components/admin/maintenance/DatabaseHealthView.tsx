import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Database, AlertCircle, CheckCircle } from 'lucide-react';

interface TableInfo {
  name: string;
  estimatedSize: string;
  category: string;
  status: 'healthy' | 'warning' | 'issue';
  usage: 'core' | 'active' | 'to-clean';
  columns?: number;
  issue?: string;
}

// Inventaire des tables Supabase
const TABLES_INVENTORY: TableInfo[] = [
  // Core tables
  { name: "profiles", estimatedSize: "~150 KB", category: "Core", status: "healthy", usage: "core" },
  { name: "budgets_dashboard", estimatedSize: "~520 KB", category: "Core", status: "healthy", usage: "core" },
  { name: "budgets_detail", estimatedSize: "~320 KB", category: "Core", status: "healthy", usage: "core" },
  { name: "checklist_mariage_manuel", estimatedSize: "~280 KB", category: "Core", status: "healthy", usage: "core" },
  { name: "wedding_coordination", estimatedSize: "~240 KB", category: "Core", status: "healthy", usage: "core" },
  { name: "coordination_planning", estimatedSize: "~180 KB", category: "Core", status: "healthy", usage: "core" },
  { name: "coordination_team", estimatedSize: "~90 KB", category: "Core", status: "healthy", usage: "core" },
  { name: "coordination_documents", estimatedSize: "~120 KB", category: "Core", status: "healthy", usage: "core" },
  
  // Prestataires
  { name: "prestataires_rows", estimatedSize: "~448 KB", category: "Prestataires", status: "warning", usage: "active", columns: 57, issue: "Trop de colonnes (57), refactoriser" },
  { name: "prestataires_photos_preprod", estimatedSize: "~320 KB", category: "Prestataires", status: "healthy", usage: "active" },
  { name: "prestataires_brochures_preprod", estimatedSize: "~180 KB", category: "Prestataires", status: "healthy", usage: "active" },
  { name: "prestataires_meta", estimatedSize: "~45 KB", category: "Prestataires", status: "healthy", usage: "active" },
  { name: "prestataires", estimatedSize: "~280 KB", category: "Prestataires", status: "healthy", usage: "active" },
  { name: "prestataires_photos", estimatedSize: "~210 KB", category: "Prestataires", status: "healthy", usage: "active" },
  { name: "prestataires_brochures", estimatedSize: "~120 KB", category: "Prestataires", status: "healthy", usage: "active" },
  
  // Blog & Content
  { name: "blog_posts", estimatedSize: "~384 KB", category: "Content", status: "healthy", usage: "core" },
  { name: "jeunes_maries", estimatedSize: "~160 KB", category: "Content", status: "healthy", usage: "active" },
  
  // Planning
  { name: "planning_questions", estimatedSize: "~95 KB", category: "Planning", status: "healthy", usage: "active" },
  { name: "planning_reponses_utilisateur", estimatedSize: "~140 KB", category: "Planning", status: "healthy", usage: "active" },
  { name: "generated_planning", estimatedSize: "~110 KB", category: "Planning", status: "healthy", usage: "active" },
  { name: "planning_avant_jour_j", estimatedSize: "~220 KB", category: "Planning", status: "healthy", usage: "active" },
  { name: "planning_apres_jour_j", estimatedSize: "~185 KB", category: "Planning", status: "healthy", usage: "active" },
  
  // Jour M
  { name: "jour_m_reservations", estimatedSize: "~275 KB", category: "Jour M", status: "healthy", usage: "core" },
  { name: "pense_bete", estimatedSize: "~65 KB", category: "Jour M", status: "healthy", usage: "active" },
  
  // Share tokens
  { name: "dashboard_share_tokens", estimatedSize: "~35 KB", category: "Sharing", status: "healthy", usage: "active" },
  { name: "planning_share_tokens", estimatedSize: "~28 KB", category: "Sharing", status: "healthy", usage: "active" },
  { name: "avant_jour_j_share_tokens", estimatedSize: "~22 KB", category: "Sharing", status: "healthy", usage: "active" },
  { name: "apres_jour_j_share_tokens", estimatedSize: "~18 KB", category: "Sharing", status: "healthy", usage: "active" },
  
  // AI & Analytics
  { name: "ai_wedding_conversations", estimatedSize: "~200 KB", category: "AI", status: "healthy", usage: "active" },
  { name: "ai_usage_tracking", estimatedSize: "~85 KB", category: "AI", status: "healthy", usage: "active" },
  { name: "performance_metrics", estimatedSize: "~50 KB", category: "Analytics", status: "healthy", usage: "active" },
  
  // Admin
  { name: "admin_users", estimatedSize: "~8 KB", category: "Admin", status: "healthy", usage: "core" },
  { name: "admin_access_tokens", estimatedSize: "~12 KB", category: "Admin", status: "healthy", usage: "core" },
  
  // Payment & Premium
  { name: "paiement_accompagnement", estimatedSize: "~95 KB", category: "Payment", status: "healthy", usage: "active" },
  
  // Contacts & Requests
  { name: "partnership_requests", estimatedSize: "~45 KB", category: "Requests", status: "healthy", usage: "active" },
  { name: "carnet_adresses_requests", estimatedSize: "~68 KB", category: "Requests", status: "issue", usage: "to-clean", issue: "Fonctionnalité abandonnée ?" },
  { name: "devis_professionnels", estimatedSize: "~42 KB", category: "Requests", status: "healthy", usage: "active" },
  
  // Quiz (UTILISÉ - NE PAS SUPPRIMER)
  { name: "quiz_questions", estimatedSize: "~25 KB", category: "Quiz", status: "healthy", usage: "active" },
  { name: "quiz_scoring", estimatedSize: "~18 KB", category: "Quiz", status: "healthy", usage: "active" },
  
  // Potentially obsolete
  { name: "projects", estimatedSize: "~95 KB", category: "Legacy", status: "warning", usage: "to-clean", issue: "Redondant avec wedding_coordination ?" },
];

const DatabaseHealthView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'core' | 'active' | 'to-clean'>('all');

  const filteredTables = TABLES_INVENTORY.filter(table => {
    if (filter === 'all') return true;
    return table.usage === filter;
  });

  const stats = {
    total: TABLES_INVENTORY.length,
    core: TABLES_INVENTORY.filter(t => t.usage === 'core').length,
    active: TABLES_INVENTORY.filter(t => t.usage === 'active').length,
    toClean: TABLES_INVENTORY.filter(t => t.usage === 'to-clean').length,
    issues: TABLES_INVENTORY.filter(t => t.status === 'issue').length,
    warnings: TABLES_INVENTORY.filter(t => t.status === 'warning').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'issue':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-500">✅ Sain</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">⚠️ Attention</Badge>;
      case 'issue':
        return <Badge variant="destructive">❌ Problème</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <div>
              <p className="text-sm text-muted-foreground">Total Tables</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-green-500 border-2">
          <p className="text-sm text-muted-foreground">Core</p>
          <p className="text-2xl font-bold text-green-600">{stats.core}</p>
        </Card>
        <Card className="p-4 border-yellow-500 border-2">
          <p className="text-sm text-muted-foreground">Avertissements</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.warnings}</p>
        </Card>
        <Card className="p-4 border-red-500 border-2">
          <p className="text-sm text-muted-foreground">Problèmes</p>
          <p className="text-2xl font-bold text-red-600">{stats.issues}</p>
        </Card>
      </div>

      {/* Table principale */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tables Supabase ({filteredTables.length})</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Toutes
              </Button>
              <Button 
                variant={filter === 'core' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('core')}
              >
                Core
              </Button>
              <Button 
                variant={filter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('active')}
              >
                Actives
              </Button>
              <Button 
                variant={filter === 'to-clean' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('to-clean')}
              >
                À nettoyer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Taille estimée</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Remarques</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTables.map(table => (
                  <TableRow key={table.name}>
                    <TableCell className="font-medium">{table.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{table.category}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{table.estimatedSize}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(table.status)}
                        {getStatusBadge(table.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {table.columns && (
                        <Badge variant="secondary" className="mr-2">
                          {table.columns} colonnes
                        </Badge>
                      )}
                      {table.issue && (
                        <span className="text-muted-foreground">{table.issue}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Problèmes identifiés */}
      <Card className="border-red-500 border-2 bg-red-50">
        <CardHeader>
          <CardTitle>🚨 Problèmes identifiés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm">prestataires_rows (57 colonnes)</h4>
            <p className="text-sm text-muted-foreground">
              Trop de colonnes rend la table difficile à maintenir et impacte les performances.
              <br />
              <strong>Action :</strong> Refactoriser en 3 tables normalisées (base, meta, seo)
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">✅ Nettoyage effectué</h4>
            <p className="text-sm text-muted-foreground">
              Tables supprimées : vibe_wedding_conversations, payment_audit
              <br />
              <strong>Restant à vérifier :</strong> projects (possiblement redondant)
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">Impact économie attendue</h4>
            <p className="text-sm text-muted-foreground">
              Nettoyage tables : <strong>~20-30% réduction taille DB</strong>
              <br />
              Performance queries : <strong>+30% après refactoring prestataires_rows</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      <Card className="border-blue-500">
        <CardHeader>
          <CardTitle>💡 Recommandations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            • <strong>✅ Complété</strong> : Tables obsolètes supprimées (vibe_wedding_conversations, payment_audit)
          </p>
          <p className="text-sm">
            • <strong>Priorité 1</strong> : Refactoriser prestataires_rows en 3 tables normalisées
          </p>
          <p className="text-sm">
            • <strong>Priorité 2</strong> : Vérifier utilisation de la table projects
          </p>
          <p className="text-sm">
            • <strong>Monitoring</strong> : Ajouter alertes sur croissance anormale des tables
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseHealthView;
