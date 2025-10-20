import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Euro, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  Download,
  Send
} from 'lucide-react';

const ProDashboardMockup = () => {
  // Données mockées
  const stats = {
    totalRevenue: 45800,
    pendingPayments: 12500,
    completedProjects: 8,
    activeClients: 12
  };

  const recentInvoices = [
    { id: 'F-2025-003', client: 'Sophie & Marc', amount: 3500, status: 'paid', date: '2025-10-15', type: 'Accompte 2' },
    { id: 'F-2025-002', client: 'Emma & Lucas', amount: 2800, status: 'pending', date: '2025-10-20', type: 'Solde' },
    { id: 'F-2025-001', client: 'Julie & Thomas', amount: 1500, status: 'overdue', date: '2025-10-10', type: 'Accompte 1' },
    { id: 'D-2025-012', client: 'Marie & Paul', amount: 4200, status: 'sent', date: '2025-10-18', type: 'Devis' }
  ];

  const upcomingPayments = [
    { client: 'Emma & Lucas', amount: 2800, dueDate: '2025-11-15', type: 'Accompte 3' },
    { client: 'Claire & Antoine', amount: 3200, dueDate: '2025-11-20', type: 'Accompte 2' },
    { client: 'Léa & Alexandre', amount: 1800, dueDate: '2025-11-25', type: 'Solde' }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: 'Payé', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      pending: { label: 'En attente', variant: 'secondary' as const, icon: Clock, color: 'text-orange-600' },
      overdue: { label: 'En retard', variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' },
      sent: { label: 'Envoyé', variant: 'outline' as const, icon: Send, color: 'text-blue-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard Professionnel</h1>
              <p className="text-sm text-muted-foreground">Gérez vos devis, factures et paiements en un clin d'œil</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Nouveau devis
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Chiffre d'affaires</p>
                <p className="text-3xl font-bold">{stats.totalRevenue.toLocaleString('fr-FR')}€</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+12% ce mois</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Euro className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Paiements en attente</p>
                <p className="text-3xl font-bold">{stats.pendingPayments.toLocaleString('fr-FR')}€</p>
                <p className="text-sm text-muted-foreground mt-2">3 factures</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Projets complétés</p>
                <p className="text-3xl font-bold">{stats.completedProjects}</p>
                <p className="text-sm text-muted-foreground mt-2">Cette année</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Clients actifs</p>
                <p className="text-3xl font-bold">{stats.activeClients}</p>
                <p className="text-sm text-muted-foreground mt-2">En cours</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Invoices */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Factures récentes</h2>
              <Button variant="ghost" size="sm">Voir tout</Button>
            </div>
            
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{invoice.client}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">{invoice.id}</p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">{invoice.type}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-semibold">{invoice.amount.toLocaleString('fr-FR')}€</p>
                      <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    </div>
                    {getStatusBadge(invoice.status)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Payments */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Échéances à venir</h2>
            </div>
            
            <div className="space-y-4">
              {upcomingPayments.map((payment, index) => (
                <div key={index} className="p-4 border-l-4 border-primary bg-muted/30 rounded">
                  <p className="font-semibold mb-1">{payment.client}</p>
                  <p className="text-sm text-muted-foreground mb-2">{payment.type}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-primary">{payment.amount.toLocaleString('fr-FR')}€</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {payment.dueDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-4" variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Envoyer rappels automatiques
            </Button>
          </Card>
        </div>

        {/* Revenue Chart Placeholder */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Évolution du chiffre d'affaires</h2>
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Graphique d'évolution du CA (à venir)</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ProDashboardMockup;
