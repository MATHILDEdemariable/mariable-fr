
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Eye, Calendar, Users, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import ReservationDetailModal from '@/components/admin/ReservationDetailModal';
import ReservationMetrics from '@/components/admin/ReservationMetrics';

interface JourMReservation {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  wedding_date: string;
  wedding_location: string;
  guest_count: number;
  budget?: string;
  status: string;
  created_at: string;
  current_organization: string;
  partner_name?: string;
  services_souhaites?: any[];
  specific_needs?: string;
  processed_by?: string;
  processed_at?: string;
  admin_notes?: string;
  contact_jour_j?: any;
  prestataires_reserves?: any;
  uploaded_files?: any[];
  delegation_tasks?: string;
  deroulement_mariage?: string;
  documents_links?: string;
  hear_about_us?: string;
}

const AdminReservationsJourM = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [reservations, setReservations] = useState<JourMReservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<JourMReservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<JourMReservation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReservations();
    }
  }, [isAuthenticated]);

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
  }, [searchTerm, statusFilter, reservations]);

  const fetchReservations = async () => {
    try {
      setIsLoadingData(true);
      const { data, error } = await supabase
        .from('jour_m_reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des réservations:', error);
        toast.error('Erreur lors du chargement des réservations');
        return;
      }

      if (data) {
        // Convertir les données Supabase vers notre interface
        const transformedData: JourMReservation[] = data.map(item => ({
          ...item,
          services_souhaites: Array.isArray(item.services_souhaites) 
            ? item.services_souhaites 
            : (typeof item.services_souhaites === 'string' 
              ? JSON.parse(item.services_souhaites || '[]') 
              : []),
          contact_jour_j: item.contact_jour_j || {},
          prestataires_reserves: item.prestataires_reserves || {},
          uploaded_files: Array.isArray(item.uploaded_files) 
            ? item.uploaded_files 
            : (typeof item.uploaded_files === 'string' 
              ? JSON.parse(item.uploaded_files || '[]') 
              : [])
        }));
        
        setReservations(transformedData);
        setFilteredReservations(transformedData);
      }
    } catch (err) {
      console.error('Erreur:', err);
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoadingData(false);
    }
  };

  const updateReservationStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('jour_m_reservations')
        .update({ 
          status: newStatus,
          processed_at: newStatus !== 'nouveau' ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        toast.error('Erreur lors de la mise à jour du statut');
        return;
      }

      toast.success('Statut mis à jour avec succès');
      fetchReservations();
    } catch (err) {
      console.error('Erreur:', err);
      toast.error('Une erreur est survenue');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nouveau': return 'bg-blue-100 text-blue-800';
      case 'en_cours': return 'bg-orange-100 text-orange-800';
      case 'traite': return 'bg-green-100 text-green-800';
      case 'annule': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const uniqueStatuses = [...new Set(reservations.map(r => r.status))];

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
          <h1 className="text-2xl font-bold text-wedding-black">Réservations Jour-M</h1>
          <p className="text-gray-600 mt-2">
            Gérez les demandes de coordination de mariage.
          </p>
        </div>

        <ReservationMetrics reservations={reservations} />

        <Card>
          <CardHeader>
            <CardTitle>Filtres et recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Rechercher par nom, email ou lieu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Réservations ({filteredReservations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="flex justify-center items-center p-10">
                <p>Chargement des réservations...</p>
              </div>
            ) : filteredReservations.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  {reservations.length === 0 
                    ? 'Aucune réservation trouvée.' 
                    : 'Aucune réservation ne correspond à vos critères de recherche.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Date de mariage</TableHead>
                      <TableHead>Lieu</TableHead>
                      <TableHead>Invités</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Créé le</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {reservation.first_name} {reservation.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {reservation.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(reservation.wedding_date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {reservation.wedding_location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            {reservation.guest_count}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={reservation.status}
                            onValueChange={(value) => updateReservationStatus(reservation.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue>
                                <Badge className={getStatusColor(reservation.status)}>
                                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1).replace('_', ' ')}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nouveau">Nouveau</SelectItem>
                              <SelectItem value="en_cours">En cours</SelectItem>
                              <SelectItem value="traite">Traité</SelectItem>
                              <SelectItem value="annule">Annulé</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {formatDate(reservation.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedReservation && (
          <ReservationDetailModal
            reservation={selectedReservation as any}
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedReservation(null);
            }}
            onUpdate={() => {
              fetchReservations();
              setModalOpen(false);
              setSelectedReservation(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReservationsJourM;
