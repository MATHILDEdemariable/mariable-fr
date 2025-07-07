import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, CreditCard, Calendar, RefreshCw, AlertTriangle, Euro, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaiementAccompagnement {
  id: string;
  email: string;
  nom_complet: string;
  telephone_whatsapp: string;
  date_mariage: string;
  statut: string;
  montant: number;
  devise: string;
  stripe_payment_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
  notes: string | null;
}

const AdminPaiements = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [paiements, setPaiements] = useState<PaiementAccompagnement[]>([]);
  const [filteredPaiements, setFilteredPaiements] = useState<PaiementAccompagnement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPaiements();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = paiements;

    if (searchTerm) {
      filtered = filtered.filter(paiement => 
        paiement.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paiement.nom_complet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paiement.telephone_whatsapp.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(paiement => paiement.statut === statusFilter);
    }

    setFilteredPaiements(filtered);
  }, [searchTerm, statusFilter, paiements]);

  const fetchPaiements = async () => {
    try {
      setIsLoadingData(true);
      setError(null);
      
      console.log('🚀 Récupération des paiements d\'accompagnement...');
      
      const { data, error } = await supabase
        .from('paiement_accompagnement')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Erreur lors de la récupération des paiements:', error);
        throw error;
      }
      
      console.log(`✅ ${data?.length || 0} paiements récupérés avec succès`);
      
      setPaiements(data || []);
      setFilteredPaiements(data || []);
      
      if (!data || data.length === 0) {
        toast.error('Aucun paiement trouvé dans la base de données');
      } else {
        toast.success(`${data.length} paiements chargés avec succès`);
      }
      
    } catch (err) {
      console.error('❌ Erreur complète:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors du chargement des paiements: ${errorMessage}`);
      
      toast.error('Erreur lors du chargement des paiements');
    } finally {
      setIsLoadingData(false);
    }
  };

  const updateStatut = async (id: string, newStatut: string) => {
    try {
      const { error } = await supabase
        .from('paiement_accompagnement')
        .update({ statut: newStatut })
        .eq('id', id);

      if (error) throw error;

      setPaiements(prev => prev.map(p => 
        p.id === id ? { ...p, statut: newStatut } : p
      ));
      
      toast.success('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatWeddingDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'payé':
        return 'default';
      case 'en_attente':
        return 'secondary';
      case 'échoué':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'payé':
        return 'text-green-600';
      case 'en_attente':
        return 'text-yellow-600';
      case 'échoué':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatsData = () => {
    const total = paiements.length;
    const paye = paiements.filter(p => p.statut === 'payé').length;
    const enAttente = paiements.filter(p => p.statut === 'en_attente').length;
    const totalMontant = paiements
      .filter(p => p.statut === 'payé')
      .reduce((sum, p) => sum + (p.montant || 0), 0);

    return { total, paye, enAttente, totalMontant };
  };

  const stats = getStatsData();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p>Chargement...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-wedding-black">Paiements Accompagnement</h1>
          <p className="text-gray-600 mt-2">
            Gérez les souscriptions à l'accompagnement Mariable et suivez les paiements.
          </p>
        </div>

        {/* Alerte d'erreur */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchPaiements}
                disabled={isLoadingData}
                className="ml-4"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingData ? 'animate-spin' : ''}`} />
                Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paiements</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-wedding-olive">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payés</CardTitle>
              <Badge variant="outline" className="text-green-600 border-green-600">✓</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.paye}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">⏳</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.enAttente}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalMontant.toFixed(2)}€</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Rechercher par nom, email ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="payé">Payé</SelectItem>
                  <SelectItem value="échoué">Échoué</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des paiements */}
        <Card>
          <CardHeader>
            <CardTitle>
              Paiements d'Accompagnement ({filteredPaiements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="flex justify-center items-center p-10">
                <p>Chargement des paiements...</p>
              </div>
            ) : filteredPaiements.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  {paiements.length === 0 
                    ? 'Aucun paiement trouvé.' 
                    : 'Aucun paiement ne correspond à vos critères de recherche.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Date Mariage</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date Souscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPaiements.map((paiement) => (
                      <TableRow key={paiement.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                              {paiement.nom_complet}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              {paiement.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-gray-400" />
                              {paiement.telephone_whatsapp}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatWeddingDate(paiement.date_mariage)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Euro className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{paiement.montant}</span>
                            <span className="text-sm text-gray-500">{paiement.devise}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={getStatusBadgeVariant(paiement.statut)}
                            className={getStatusColor(paiement.statut)}
                          >
                            {paiement.statut}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(paiement.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={paiement.statut} 
                            onValueChange={(value) => updateStatut(paiement.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en_attente">En attente</SelectItem>
                              <SelectItem value="payé">Payé</SelectItem>
                              <SelectItem value="échoué">Échoué</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPaiements;