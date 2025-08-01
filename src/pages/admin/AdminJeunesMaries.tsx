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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Heart, 
  Mail, 
  Calendar, 
  RefreshCw, 
  AlertTriangle,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Eye,
  Trash2,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { JeuneMarie } from '@/types/jeunes-maries';
import { JeuneMariesFormViewer } from '@/components/admin/JeuneMariesFormViewer';

const AdminJeunesMaries = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [jeunesMaries, setJeunesMaries] = useState<JeuneMarie[]>([]);
  const [filteredJeunesMaries, setFilteredJeunesMaries] = useState<JeuneMarie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJeuneMarie, setSelectedJeuneMarie] = useState<JeuneMarie | null>(null);
  const [isFormViewerOpen, setIsFormViewerOpen] = useState(false);
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchJeunesMaries();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = jeunesMaries;

    if (searchTerm) {
      filtered = filtered.filter(jm => 
        jm.nom_complet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jm.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jm.lieu_mariage?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(jm => jm.status_moderation === statusFilter);
    }

    setFilteredJeunesMaries(filtered);
  }, [searchTerm, statusFilter, jeunesMaries]);


  const fetchJeunesMaries = async () => {
    try {
      setIsLoadingData(true);
      setError(null);
      
      console.log('🚀 Début de la récupération des témoignages jeunes mariés...');
      
      const { data, error } = await supabase
        .from('jeunes_maries')
        .select('*')
        .order('date_soumission', { ascending: false });

      if (error) throw error;
      
      console.log(`✅ ${data.length} témoignages réels récupérés avec succès`);
      
      const allTestimonials = data as JeuneMarie[];
      
      setJeunesMaries(allTestimonials);
      setFilteredJeunesMaries(allTestimonials);
      
      if (allTestimonials.length === 0) {
        toast.error('Aucun témoignage trouvé');
      } else {
        toast.success(`${allTestimonials.length} témoignages chargés avec succès`);
      }
      
    } catch (err) {
      console.error('❌ Erreur complète:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors du chargement des témoignages: ${errorMessage}`);
      
      toast.error('Erreur lors du chargement des témoignages');
    } finally {
      setIsLoadingData(false);
    }
  };

  const updateJeuneMarie = async (id: string, updates: Partial<JeuneMarie>) => {
    try {
      const { error } = await supabase
        .from('jeunes_maries')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Mettre à jour l'état local
      setJeunesMaries(prev => 
        prev.map(jm => jm.id === id ? { ...jm, ...updates } : jm)
      );
      
      toast.success('Témoignage mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const approveJeuneMarie = (id: string) => {
    updateJeuneMarie(id, { 
      status_moderation: 'approuve', 
      visible: true,
      date_approbation: new Date().toISOString()
    });
  };

  const rejectJeuneMarie = (id: string) => {
    updateJeuneMarie(id, { 
      status_moderation: 'rejete', 
      visible: false 
    });
  };

  const deleteJeuneMarie = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ? Cette action est irréversible.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('jeunes_maries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Mettre à jour l'état local
      setJeunesMaries(prev => prev.filter(jm => jm.id !== id));
      setFilteredJeunesMaries(prev => prev.filter(jm => jm.id !== id));
      
      toast.success('Témoignage supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
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

  const openFormViewer = (jeuneMarie: JeuneMarie) => {
    setSelectedJeuneMarie(jeuneMarie);
    setIsFormViewerOpen(true);
  };

  const closeFormViewer = () => {
    setIsFormViewerOpen(false);
    setSelectedJeuneMarie(null);
  };

  const getRecentSubmissions = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return jeunesMaries.filter(jm => new Date(jm.date_soumission) >= weekAgo).length;
  };

  const getStatusBadge = (status: string, visible: boolean) => {
    switch (status) {
      case 'approuve':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approuvé
          </Badge>
        );
      case 'rejete':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejeté
          </Badge>
        );
      default:
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
    }
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
          <h1 className="text-2xl font-bold text-wedding-black">Jeunes Mariés</h1>
          <p className="text-gray-600 mt-2">
            Gérez les témoignages et expériences partagées par les jeunes mariés.
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
                onClick={fetchJeunesMaries}
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
              <CardTitle className="text-sm font-medium">Total Témoignages</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-wedding-olive">{jeunesMaries.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nouveaux (7j)</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{getRecentSubmissions()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {jeunesMaries.filter(jm => jm.status_moderation === 'en_attente').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approuvés</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {jeunesMaries.filter(jm => jm.status_moderation === 'approuve').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Information
            </CardTitle>
            <CardDescription>
              Gestion des témoignages de jeunes mariés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Les témoignages d'exemple sont maintenant intégrés directement dans le système. 
              Seuls les vrais témoignages soumis par les utilisateurs apparaissent ici pour modération.
            </p>
          </CardContent>
        </Card>

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
                  placeholder="Rechercher par nom, email ou lieu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="approuve">Approuvé</option>
                <option value="rejete">Rejeté</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des témoignages */}
        <Card>
          <CardHeader>
            <CardTitle>
              Témoignages Jeunes Mariés ({filteredJeunesMaries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="flex justify-center items-center p-10">
                <p>Chargement des témoignages...</p>
              </div>
            ) : filteredJeunesMaries.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  {jeunesMaries.length === 0 
                    ? 'Aucun témoignage trouvé.' 
                    : 'Aucun témoignage ne correspond à vos critères de recherche.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Couple</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Mariage</TableHead>
                      <TableHead>Soumission</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJeunesMaries.map((jm) => (
                      <TableRow key={jm.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{jm.nom_complet}</span>
                            </div>
                            {jm.accept_email_contact && (
                              <span className="text-xs text-green-600 mt-1">✓ Contact autorisé</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-xs">{jm.email}</span>
                            </div>
                            {jm.telephone && (
                              <span className="text-xs text-gray-500">{jm.telephone}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{jm.lieu_mariage}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDate(jm.date_mariage)}
                            </span>
                            {jm.nombre_invites && (
                              <div className="flex items-center gap-1 mt-1">
                                <Users className="h-3 w-3 text-gray-400" />
                                <span className="text-xs">{jm.nombre_invites} invités</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{formatDate(jm.date_soumission)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(jm.status_moderation, jm.visible)}
                        </TableCell>
                         <TableCell>
                           <div className="flex gap-2">
                             {jm.status_moderation === 'en_attente' && !jm.id.startsWith('fake-') && (
                               <>
                                 <Button
                                   size="sm"
                                   variant="outline"
                                   onClick={() => approveJeuneMarie(jm.id)}
                                   className="text-green-600 border-green-600 hover:bg-green-50"
                                 >
                                   <CheckCircle className="h-3 w-3" />
                                 </Button>
                                 <Button
                                   size="sm"
                                   variant="outline"
                                   onClick={() => rejectJeuneMarie(jm.id)}
                                   className="text-red-600 border-red-600 hover:bg-red-50"
                                 >
                                   <XCircle className="h-3 w-3" />
                                 </Button>
                               </>
                             )}
                              {jm.status_moderation === 'en_attente' ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openFormViewer(jm)}
                                  title="Voir le formulaire"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/jeunes-maries/${jm.slug}`)}
                                  title="Voir la fiche publique"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              )}
                             {!jm.id.startsWith('fake-') && (
                               <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => deleteJeuneMarie(jm.id)}
                                 className="text-red-600 border-red-600 hover:bg-red-50"
                               >
                                 <Trash2 className="h-3 w-3" />
                               </Button>
                             )}
                           </div>
                         </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Viewer Modal */}
        <JeuneMariesFormViewer
          isOpen={isFormViewerOpen}
          onClose={closeFormViewer}
          jeuneMarie={selectedJeuneMarie}
          onApprove={(id) => {
            approveJeuneMarie(id);
            closeFormViewer();
          }}
          onReject={(id) => {
            rejectJeuneMarie(id);
            closeFormViewer();
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminJeunesMaries;