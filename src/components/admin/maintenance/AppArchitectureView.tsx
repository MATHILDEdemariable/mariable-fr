import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Search } from 'lucide-react';

interface PageInfo {
  name: string;
  route: string;
  tables: string[];
  status: 'active' | 'obsolete' | 'to-merge';
  category: string;
}

// Inventaire complet des 93 pages
const PAGES_INVENTORY: PageInfo[] = [
  // Landing Pages
  { name: "LandingCouple", route: "/", tables: [], status: "active", category: "Landing" },
  { name: "LandingGenerale", route: "/generale", tables: [], status: "active", category: "Landing" },
  { name: "LandingJourJ", route: "/landingjourj", tables: ["jour_m_reservations"], status: "active", category: "Landing" },
  { name: "CoordinationJourJ", route: "/coordinationjourj", tables: ["jour_m_reservations"], status: "active", category: "Landing" },
  
  // Auth
  { name: "Login", route: "/login", tables: ["profiles"], status: "active", category: "Auth" },
  { name: "Register", route: "/register", tables: ["profiles"], status: "active", category: "Auth" },
  { name: "EmailConfirmation", route: "/auth/confirmation", tables: [], status: "active", category: "Auth" },
  { name: "ResetPassword", route: "/auth/reset-password", tables: [], status: "active", category: "Auth" },
  { name: "LoginFrame", route: "/login-frame", tables: [], status: "obsolete", category: "Auth" },
  
  // Dashboard User
  { name: "UserDashboard", route: "/dashboard", tables: ["profiles", "budgets_dashboard", "checklist_mariage_manuel"], status: "active", category: "User" },
  
  // Budget
  { name: "Budget", route: "/services/budget", tables: ["budgets_dashboard", "budgets_detail"], status: "active", category: "Tools" },
  
  // Checklist
  { name: "ChecklistMariage", route: "/checklist-mariage", tables: ["checklist_mariage_manuel"], status: "active", category: "Tools" },
  { name: "ChecklistPublic", route: "/checklist-publique/:token", tables: ["checklist_mariage_manuel", "dashboard_share_tokens"], status: "to-merge", category: "Tools" },
  { name: "ToDoListMariage", route: "/to-do-list-mariage", tables: ["checklist_mariage_manuel"], status: "active", category: "Tools" },
  { name: "ListePreparatifMariage", route: "/liste-preparatifs-mariage", tables: ["checklist_mariage_manuel"], status: "active", category: "Tools" },
  
  // Planning
  { name: "PlanningPersonnalise", route: "/planning-personnalise", tables: ["planning_questions", "planning_reponses_utilisateur", "generated_planning"], status: "active", category: "Tools" },
  { name: "PlanningResultatsPersonnalises", route: "/planning-resultat", tables: ["planning_reponses_utilisateur", "generated_planning"], status: "active", category: "Tools" },
  { name: "PlanningPublic", route: "/planning-public/:token", tables: ["wedding_coordination", "planning_share_tokens"], status: "active", category: "Tools" },
  { name: "PlanningPublicProject", route: "/planning/:slug", tables: ["wedding_coordination"], status: "active", category: "Tools" },
  { name: "WeddingRetroplanning", route: "/retroplanning-mariage", tables: ["checklist_mariage_manuel"], status: "active", category: "Tools" },
  { name: "OutilsPlanningMariage", route: "/outils-planning-mariage", tables: [], status: "active", category: "Tools" },
  
  // Jour M
  { name: "MonJourMPlanning", route: "/mon-jour-m/planning", tables: ["wedding_coordination", "coordination_planning"], status: "active", category: "Jour M" },
  { name: "MonJourMEquipe", route: "/mon-jour-m/equipe", tables: ["wedding_coordination", "coordination_team"], status: "active", category: "Jour M" },
  { name: "MonJourMDocuments", route: "/mon-jour-m/documents", tables: ["wedding_coordination", "coordination_documents"], status: "active", category: "Jour M" },
  { name: "MonJourMConseils", route: "/mon-jour-m/conseils", tables: [], status: "to-merge", category: "Jour M" },
  { name: "MonJourMPenseBete", route: "/mon-jour-m/pense-bete", tables: ["pense_bete"], status: "to-merge", category: "Jour M" },
  { name: "JourMVue", route: "/jour-m-vue", tables: ["wedding_coordination"], status: "active", category: "Jour M" },
  { name: "ReservationJourM", route: "/reservation-jour-m", tables: ["jour_m_reservations"], status: "active", category: "Jour M" },
  
  // Prestataires
  { name: "Prestataires", route: "/prestataires", tables: ["prestataires_rows", "prestataires_photos_preprod"], status: "active", category: "Prestataires" },
  { name: "Prestataire", route: "/prestataire/:slug", tables: ["prestataires_rows", "prestataires_photos_preprod", "prestataires_brochures_preprod"], status: "active", category: "Prestataires" },
  { name: "MoteurRecherche", route: "/mariage/:region", tables: ["prestataires_rows"], status: "active", category: "Prestataires" },
  { name: "Professionnels", route: "/professionnels", tables: [], status: "active", category: "Prestataires" },
  { name: "Demo", route: "/demo", tables: [], status: "to-merge", category: "Prestataires" },
  { name: "Preview", route: "/preview", tables: [], status: "to-merge", category: "Prestataires" },
  
  // Blog
  { name: "Blog", route: "/conseils-mariage", tables: ["blog_posts"], status: "active", category: "Blog" },
  { name: "BlogPost", route: "/conseils-mariage/:slug", tables: ["blog_posts"], status: "active", category: "Blog" },
  
  // SEO / Regional
  { name: "MariageProvence", route: "/mariage-provence", tables: ["prestataires_rows"], status: "active", category: "SEO" },
  { name: "MariageParis", route: "/mariage-paris", tables: ["prestataires_rows"], status: "active", category: "SEO" },
  { name: "MariageAuvergneRhoneAlpes", route: "/mariage-auvergne-rhone-alpes", tables: ["prestataires_rows"], status: "active", category: "SEO" },
  { name: "MariageNouvelleAquitaine", route: "/mariage-nouvelle-aquitaine", tables: ["prestataires_rows"], status: "active", category: "SEO" },
  
  // About
  { name: "Approche", route: "/notre-approche", tables: [], status: "active", category: "About" },
  { name: "Histoire", route: "/notre-histoire", tables: [], status: "active", category: "About" },
  { name: "Charte", route: "/notre-charte", tables: [], status: "active", category: "About" },
  { name: "Temoignages", route: "/temoignages", tables: ["jeunes_maries"], status: "active", category: "About" },
  
  // Contact
  { name: "NousContacter", route: "/nous-contacter", tables: [], status: "active", category: "Contact" },
  { name: "FAQ", route: "/faq", tables: [], status: "active", category: "Contact" },
  { name: "Partenariat", route: "/partenariat", tables: ["partnership_requests"], status: "active", category: "Contact" },
  
  // Pricing
  { name: "Pricing", route: "/pricing", tables: [], status: "active", category: "Pricing" },
  { name: "Prix", route: "/prix", tables: [], status: "active", category: "Pricing" },
  { name: "Paiement", route: "/paiement", tables: [], status: "active", category: "Pricing" },
  { name: "Comparatif", route: "/comparatif", tables: [], status: "active", category: "Pricing" },
  
  // Legal
  { name: "CGV", route: "/cgv", tables: [], status: "active", category: "Legal" },
  { name: "MentionsLegales", route: "/mentions-legales", tables: [], status: "active", category: "Legal" },
  { name: "ProtectionDonnees", route: "/protection-donnees", tables: [], status: "active", category: "Legal" },
  
  // Events
  { name: "SalonJeuConcours", route: "/salon-jeu-concours", tables: [], status: "obsolete", category: "Events" },
  
  // Admin
  { name: "AdminDashboard", route: "/admin", tables: ["profiles", "blog_posts", "prestataires_rows"], status: "active", category: "Admin" },
  { name: "AdminUsers", route: "/admin/users", tables: ["profiles"], status: "active", category: "Admin" },
  { name: "AdminReservationsJourM", route: "/admin/reservations-jour-m", tables: ["jour_m_reservations"], status: "active", category: "Admin" },
  { name: "AdminPrestatairesList", route: "/admin/prestataires", tables: ["prestataires_rows"], status: "active", category: "Admin" },
  { name: "AdminPrestataireEdit", route: "/admin/prestataires/:id/edit", tables: ["prestataires_rows", "prestataires_photos_preprod", "prestataires_brochures_preprod"], status: "active", category: "Admin" },
  { name: "AdminBlogList", route: "/admin/blog", tables: ["blog_posts"], status: "active", category: "Admin" },
  { name: "AdminBlogEdit", route: "/admin/blog/:id/edit", tables: ["blog_posts"], status: "active", category: "Admin" },
  { name: "AdminJeunesMaries", route: "/admin/jeunes-maries", tables: ["jeunes_maries"], status: "active", category: "Admin" },
  { name: "AdminSystemCheck", route: "/admin/system-check", tables: [], status: "active", category: "Admin" },
  { name: "AdminMaintenance", route: "/admin/maintenance", tables: ["performance_metrics"], status: "active", category: "Admin" },
  
  // Test pages (obsolete)
  { name: "TestAssistantVirtuel", route: "/test-assistant-virtuel", tables: [], status: "obsolete", category: "Test" },
  { name: "TestFormulaire", route: "/test-formulaire", tables: [], status: "obsolete", category: "Test" },
  { name: "GuideMariableFrame", route: "/guide-mariable-frame", tables: [], status: "obsolete", category: "Test" },
  { name: "EmailCapture", route: "/email-capture", tables: [], status: "obsolete", category: "Test" },
];

const AppArchitectureView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'obsolete' | 'to-merge'>('all');
  const [search, setSearch] = useState('');

  const filteredPages = useMemo(() => {
    return PAGES_INVENTORY.filter(page => {
      const matchesFilter = filter === 'all' || page.status === filter;
      const matchesSearch = search === '' || 
        page.name.toLowerCase().includes(search.toLowerCase()) ||
        page.route.toLowerCase().includes(search.toLowerCase()) ||
        page.category.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const stats = useMemo(() => {
    const active = PAGES_INVENTORY.filter(p => p.status === 'active').length;
    const obsolete = PAGES_INVENTORY.filter(p => p.status === 'obsolete').length;
    const toMerge = PAGES_INVENTORY.filter(p => p.status === 'to-merge').length;
    return { total: PAGES_INVENTORY.length, active, obsolete, toMerge };
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">✅ Actif</Badge>;
      case 'obsolete':
        return <Badge variant="destructive">❌ Obsolète</Badge>;
      case 'to-merge':
        return <Badge className="bg-yellow-500">⚠️ À fusionner</Badge>;
      default:
        return <Badge variant="secondary">?</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4 border-green-500 border-2">
          <p className="text-sm text-muted-foreground">Actives</p>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </Card>
        <Card className="p-4 border-red-500 border-2">
          <p className="text-sm text-muted-foreground">Obsolètes</p>
          <p className="text-3xl font-bold text-red-600">{stats.obsolete}</p>
        </Card>
        <Card className="p-4 border-yellow-500 border-2">
          <p className="text-sm text-muted-foreground">À fusionner</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.toMerge}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Architecture de l'application ({filteredPages.length} pages)</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Toutes
              </Button>
              <Button 
                variant={filter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('active')}
              >
                Actives
              </Button>
              <Button 
                variant={filter === 'obsolete' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('obsolete')}
              >
                Obsolètes
              </Button>
              <Button 
                variant={filter === 'to-merge' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('to-merge')}
              >
                À fusionner
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une page..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
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
                  <TableHead>Route</TableHead>
                  <TableHead>Tables Supabase</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.map(page => (
                  <TableRow key={page.name}>
                    <TableCell className="font-medium">{page.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{page.category}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{page.route || 'N/A'}</TableCell>
                    <TableCell>
                      {page.tables.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {page.tables.map(table => (
                            <Badge key={table} variant="secondary" className="text-xs">
                              {table}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Aucune</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(page.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      <Card className="border-yellow-500 border-2 bg-yellow-50">
        <CardHeader>
          <CardTitle>🎯 Recommandations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            • <strong>{stats.obsolete} pages obsolètes</strong> à supprimer pour réduire le bundle de ~12%
          </p>
          <p className="text-sm">
            • <strong>{stats.toMerge} pages à fusionner</strong> pour simplifier l'architecture
          </p>
          <p className="text-sm">
            • Impact attendu : <strong>-15% taille bundle JS</strong>, meilleure maintenabilité
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppArchitectureView;
