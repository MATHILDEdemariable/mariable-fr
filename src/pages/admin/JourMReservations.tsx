
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Eye, Download, Filter, Users, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import JourMReservationDetail from '@/components/admin/JourMReservationDetail';
import { Json } from '@/integrations/supabase/types';

interface JourMReservation {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  partner_name?: string;
  wedding_date: string;
  wedding_location: string;
  guest_count: number;
  budget?: string;
  current_organization: string;
  deroulement_mariage?: string;
  delegation_tasks?: string;
  specific_needs?: string;
  hear_about_us?: string;
  documents_links?: string;
  uploaded_files?: Json;
  prestataires_reserves?: Json;
  contact_jour_j?: Json;
  services_souhaites?: Json;
  status: string;
  admin_notes?: string;
  processed_at?: string;
  processed_by?: string;
  created_at: string;
  updated_at: string;
}

const JourMReservations = () => {
  const [reservations, setReservations] = useState<JourMReservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<JourMReservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<JourMReservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Check admin authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (adminUser) {
          setIsAuthenticated(true);
          loadReservations();
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple password check - in production use proper auth
      setIsAuthenticated(true);
      loadReservations();
    } else {
      toast({
        title: "Accès refusé",
        description: "Mot de passe incorrect",
        variant: "destructive",
      });
    }
  };

  const loadReservations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('jour_m_reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData = data?.map(row => ({
        ...row,
        uploaded_files: row.uploaded_files as Json,
        prestataires_reserves: row.prestataires_reserves as Json,
        contact_jour_j: row.contact_jour_j as Json,
        services_souhaites: row.services_souhaites as Json,
      })) || [];
      
      setReservations(typedData);
      setFilteredReservations(typedData);
    } catch (error) {
      console.error('Error loading reservations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateReservationStatus = async (id: string, status: string, notes?: string) => {
    try {
      const updateData: any = {
        status,
        processed_at: new Date().toISOString(),
        processed_by: 'Admin'
      };
      
      if (notes !== undefined) {
        updateData.admin_notes = notes;
      }

      const { error } = await supabase
        .from('jour_m_reservations')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Statut mis à jour avec succès",
      });

      loadReservations();
      if (selectedReservation && selectedReservation.id === id) {
        setSelectedReservation({
          ...selectedReservation,
          ...updateData
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  // Filter reservations based on search and status
  useEffect(() => {
    let filtered = reservations;

    if (searchTerm) {
      filtered = filtered.filter(res => 
        res.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.wedding_location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(res => res.status === statusFilter);
    }

    setFilteredReservations(filtered);
  }, [reservations, searchTerm, statusFilter]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'nouveau': return 'destructive';
      case 'en_cours': return 'secondary';
      case 'traite': return 'default';
      case 'archive': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'nouveau': return 'Nouveau';
      case 'en_cours': return 'En cours';
      case 'traite': return 'Traité';
      case 'archive': return 'Archivé';
      default: return status;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Accès Admin - Réservations Jour M</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    total: reservations.length,
    nouveau: reservations.filter(r => r.status === 'nouveau').length,
    en_cours: reservations.filter(r => r.status === 'en_cours').length,
    traite: reservations.filter(r => r.status === 'traite').length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Admin - Réservations Jour M | Mariable</title>
      </Helmet>
      
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion des réservations Jour M
            </h1>
            <p className="text-gray-600">
              Gérez et suivez toutes les demandes de coordination Jour M
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nouveaux</p>
                    <p className="text-2xl font-bold text-red-600">{stats.nouveau}</p>
                  </div>
                  <Badge variant="destructive" className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                    !
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">En cours</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.en_cours}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Traités</p>
                    <p className="text-2xl font-bold text-green-600">{stats.traite}</p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher par nom, email ou lieu..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="nouveau">Nouveaux</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="traite">Traités</SelectItem>
                      <SelectItem value="archive">Archivés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reservations Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Demandes de réservation ({filteredReservations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p>Chargement des réservations...</p>
                </div>
              ) : filteredReservations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucune réservation trouvée</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Statut</th>
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-left p-3 font-medium">Couple</th>
                        <th className="text-left p-3 font-medium">Contact</th>
                        <th className="text-left p-3 font-medium">Mariage</th>
                        <th className="text-left p-3 font-medium">Invités</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.map((reservation) => (
                        <tr key={reservation.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <Badge variant={getStatusBadgeVariant(reservation.status)}>
                              {getStatusLabel(reservation.status)}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {new Date(reservation.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">
                                {reservation.first_name} {reservation.last_name}
                              </p>
                              {reservation.partner_name && (
                                <p className="text-sm text-gray-600">
                                  & {reservation.partner_name}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">
                                  {reservation.email}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3" />
                                <span>{reservation.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="text-sm font-medium">
                                {new Date(reservation.wedding_date).toLocaleDateString('fr-FR')}
                              </p>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-[120px]">
                                  {reservation.wedding_location}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <span className="font-medium">{reservation.guest_count}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedReservation(reservation)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {reservation.status === 'nouveau' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateReservationStatus(reservation.id, 'en_cours')}
                                >
                                  Traiter
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />

      {/* Detail Modal */}
      {selectedReservation && (
        <JourMReservationDetail
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onStatusUpdate={updateReservationStatus}
        />
      )}
    </div>
  );
};

export default JourMReservations;
