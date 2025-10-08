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
import { 
  Search, 
  User, 
  Mail, 
  Calendar, 
  RefreshCw, 
  AlertTriangle,
  Building,
  MapPin,
  Euro,
  Phone,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type Prestataire = Database['public']['Tables']['prestataires_rows']['Row'];

const AdminProfessionalRegistrations = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [professionals, setProfessionals] = useState<Prestataire[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Prestataire[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfessionals();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = professionals;

    if (searchTerm) {
      filtered = filtered.filter(prof => 
        prof.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.ville?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(prof => prof.categorie === categoryFilter);
    }

    setFilteredProfessionals(filtered);
  }, [searchTerm, categoryFilter, professionals]);

  const fetchProfessionals = async () => {
    try {
      setIsLoadingData(true);
      setError(null);
      
      console.log('🚀 Début de la récupération des inscriptions professionnelles...');
      
      // Récupérer uniquement les prestataires inscrits via le formulaire
      const { data, error } = await supabase
        .from('prestataires_rows')
        .select('*')
        .eq('source_inscription', 'formulaire')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log(`✅ ${data.length} inscriptions professionnelles récupérées avec succès`);
      
      setProfessionals(data);
      setFilteredProfessionals(data);
      
      if (data.length === 0) {
        toast.error('Aucune inscription professionnelle trouvée');
      } else {
        toast.success(`${data.length} inscriptions chargées avec succès`);
      }
      
    } catch (err) {
      console.error('❌ Erreur complète:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors du chargement des inscriptions: ${errorMessage}`);
      
      toast.error('Erreur lors du chargement des inscriptions');
    } finally {
      setIsLoadingData(false);
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

  const getRecentRegistrations = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return professionals.filter(prof => new Date(prof.created_at) >= weekAgo).length;
  };

  const getUniqueCategories = () => {
    const categories = professionals
      .map(prof => prof.categorie)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return categories;
  };

  const getCategoryBadgeColor = (category: string | null) => {
    const colors: Record<string, string> = {
      'Lieu de réception': 'bg-blue-100 text-blue-800',
      'Traiteur': 'bg-green-100 text-green-800',
      'Photographe': 'bg-purple-100 text-purple-800',
      'Vidéaste': 'bg-pink-100 text-pink-800',
      'Coordination': 'bg-orange-100 text-orange-800',
      'DJ': 'bg-yellow-100 text-yellow-800',
      'Fleuriste': 'bg-green-100 text-green-800',
      'Robe de mariée': 'bg-pink-100 text-pink-800',
      'Décoration': 'bg-indigo-100 text-indigo-800',
      'Mise en beauté': 'bg-red-100 text-red-800',
      'Voiture': 'bg-gray-100 text-gray-800',
      'Invités': 'bg-cyan-100 text-cyan-800',
      'Cocktail': 'bg-pink-100 text-pink-800',
      'Foodtruck': 'bg-orange-100 text-orange-800',
    };
    return colors[category || ''] || 'bg-gray-100 text-gray-800';
  };

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
          <h1 className="text-2xl font-bold text-wedding-black">Inscriptions Professionnels</h1>
          <p className="text-gray-600 mt-2">
            Gérez les demandes d'inscription des professionnels via le formulaire de candidature.
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
                onClick={fetchProfessionals}
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
              <CardTitle className="text-sm font-medium">Total Inscriptions</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-wedding-olive">{professionals.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nouvelles (7j)</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{getRecentRegistrations()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {professionals.filter(p => !p.visible).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Catégories</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{getUniqueCategories().length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <CardTitle>Recherche et Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Rechercher par nom, email ou ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">Toutes les catégories</option>
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des inscriptions */}
        <Card>
          <CardHeader>
            <CardTitle>
              Inscriptions Professionnelles ({filteredProfessionals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="flex justify-center items-center p-10">
                <p>Chargement des inscriptions...</p>
              </div>
            ) : filteredProfessionals.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  {professionals.length === 0 
                    ? 'Aucune inscription trouvée.' 
                    : 'Aucune inscription ne correspond à vos critères de recherche.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entreprise</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfessionals.map((prof) => (
                      <TableRow key={prof.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{prof.nom}</span>
                            </div>
                            {prof.siret && (
                              <span className="text-xs text-gray-500 mt-1">SIRET: {prof.siret}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {prof.categorie && (
                            <Badge className={getCategoryBadgeColor(prof.categorie)}>
                              {prof.categorie}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {prof.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span className="text-xs">{prof.email}</span>
                              </div>
                            )}
                            {prof.telephone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span className="text-xs">{prof.telephone}</span>
                              </div>
                            )}
                            {prof.site_web && (
                              <div className="flex items-center gap-1">
                                <Globe className="h-3 w-3 text-gray-400" />
                                <span className="text-xs truncate max-w-32">{prof.site_web}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <div className="flex flex-col">
                              {prof.ville && <span className="text-sm">{prof.ville}</span>}
                              {(prof.regions as any)?.length > 0 && (
                                <span className="text-xs text-gray-500">{(prof.regions as any).join(', ')}</span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {prof.prix_minimum && (
                            <div className="flex items-center gap-1">
                              <Euro className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{prof.prix_minimum}€</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{formatDate(prof.created_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={prof.visible 
                              ? "text-green-600 border-green-600" 
                              : "text-orange-600 border-orange-600"
                            }
                          >
                            {prof.visible ? 'Publié' : 'En attente'}
                          </Badge>
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

export default AdminProfessionalRegistrations;