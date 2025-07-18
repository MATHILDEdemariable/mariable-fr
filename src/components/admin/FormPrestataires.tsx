import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Prestataire } from './types';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from 'sonner';
import { Toaster } from "@/components/ui/toaster"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DEFAULT_PRESTATAIRE } from './form-parts/constants';
import PrestataireCRMFilters from './PrestataireCRMFilters';

const FormPrestataires = () => {
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [filteredPrestataires, setFilteredPrestataires] = useState<Prestataire[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
  statusCrm: '',
  search: '',
  category: '',
  region: '',
  sourceInscription: '' // Nouveau filtre
});

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [prestataireToDelete, setPrestataireToDelete] = useState<Prestataire | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [prestataireToView, setPrestataireToView] = useState<Prestataire | null>(null);

  const queryClient = useQueryClient();

  const { data: statusCrmOptions, isLoading: isLoadingStatusCrm } = useQuery({
    queryKey: ['statusCrmOptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('status_crm')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        console.error('Erreur lors du chargement des status CRM:', error);
        toast.error('Erreur lors du chargement des status CRM');
        return [];
      }
      return data;
    },
  });

  const { mutate: updateStatusCrm, isLoading: isUpdatingStatusCrm } = useMutation(
    async ({ id, statusCrm }: { id: string, statusCrm: string }) => {
      const { error } = await supabase
        .from('prestataires_rows')
        .update({ status_crm: statusCrm })
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['prestataires']);
        toast.success('Statut CRM mis à jour avec succès');
      },
      onError: (error: any) => {
        console.error('Erreur lors de la mise à jour du statut CRM:', error);
        toast.error('Erreur lors de la mise à jour du statut CRM');
      },
    }
  );

  const handleFilterChange = (key: string, value: string) => {
  console.log(`🔍 Filter changed: ${key} = ${value}`);
  setFilters(prev => ({
    ...prev,
    [key]: value
  }));
};

const handleResetFilters = () => {
  console.log('🔄 Resetting all filters');
  setFilters({
    statusCrm: '',
    search: '',
    category: '',
    region: '',
    sourceInscription: ''
  });
};

  const fetchPrestataires = async () => {
    try {
      setIsLoadingData(true);
      const { data, error } = await supabase
        .from('prestataires_rows')
        .select('*')
        .order('nom', { ascending: true });

      if (error) {
        console.error('Erreur lors du chargement des prestataires:', error);
        toast.error('Erreur lors du chargement des prestataires');
        return;
      }

      if (data) {
        setPrestataires(data);
        setFilteredPrestataires(data);
      } else {
        setPrestataires([]);
        setFilteredPrestataires([]);
      }
    } catch (err) {
      console.error('Erreur:', err);
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchPrestataires();
  }, []);

  useEffect(() => {
  console.log('🔍 Filters changed, applying:', filters);
  
  let filtered = prestataires;

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.nom?.toLowerCase().includes(searchLower) ||
      p.email?.toLowerCase().includes(searchLower) ||
      p.ville?.toLowerCase().includes(searchLower)
    );
  }

  if (filters.statusCrm) {
    filtered = filtered.filter(p => p.status_crm === filters.statusCrm);
  }

  if (filters.category) {
    filtered = filtered.filter(p => p.categorie === filters.category);
  }

  if (filters.region) {
    filtered = filtered.filter(p => p.region === filters.region);
  }

  // Nouveau filtre pour la source d'inscription
  if (filters.sourceInscription) {
    filtered = filtered.filter(p => p.source_inscription === filters.sourceInscription);
  }

  console.log(`📊 Filtered results: ${filtered.length}/${prestataires.length}`);
  setFilteredPrestataires(filtered);
}, [filters, prestataires]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prestataires_rows')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la suppression du prestataire:', error);
        toast.error('Erreur lors de la suppression du prestataire');
        return;
      }

      toast.success('Prestataire supprimé avec succès');
      fetchPrestataires();
    } catch (err) {
      console.error('Erreur:', err);
      toast.error('Une erreur est survenue');
    } finally {
      setIsDeleteModalOpen(false);
      setPrestataireToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <Toaster />

      <PrestataireCRMFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Liste des prestataires ({filteredPrestataires.length})</CardTitle>
          <Button asChild>
            <Link to="/admin/prestataires/ajouter" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingData ? (
            <div className="flex justify-center items-center p-10">
              <p>Chargement des prestataires...</p>
            </div>
          ) : filteredPrestataires.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Aucun prestataire trouvé.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Région</TableHead>
                    <TableHead>Statut CRM</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrestataires.map((prestataire) => (
                    <TableRow key={prestataire.id}>
                      <TableCell>{prestataire.nom}</TableCell>
                      <TableCell>{prestataire.categorie}</TableCell>
                      <TableCell>{prestataire.ville}</TableCell>
                      <TableCell>{prestataire.region}</TableCell>
                      <TableCell>
                        {statusCrmOptions && statusCrmOptions.length > 0 ? (
                          <Select
                            value={prestataire.status_crm || ''}
                            onValueChange={(value) => {
                              if (prestataire.id) {
                                updateStatusCrm({ id: prestataire.id, statusCrm: value });
                              }
                            }}
                            disabled={isUpdatingStatusCrm}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Sélectionner un statut" />
                            </SelectTrigger>
                            <SelectContent>
                              {statusCrmOptions.map((status) => (
                                <SelectItem key={status.id} value={status.id}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          'Chargement des statuts...'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setPrestataireToView(prestataire);
                              setIsDetailsModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" asChild>
                            <Link to={`/admin/prestataires/modifier/${prestataire.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              setPrestataireToDelete(prestataire);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && prestataireToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
            <p>Êtes-vous sûr de vouloir supprimer le prestataire "{prestataireToDelete.nom}" ?</p>
            <div className="mt-6 flex justify-end gap-4">
              <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(prestataireToDelete.id)}>
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && prestataireToView && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl">
            <h2 className="text-lg font-semibold mb-4">Détails du prestataire</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Nom:</strong> {prestataireToView.nom}</p>
                <p><strong>Catégorie:</strong> {prestataireToView.categorie}</p>
                <p><strong>Ville:</strong> {prestataireToView.ville}</p>
                <p><strong>Région:</strong> {prestataireToView.region}</p>
                <p><strong>Email:</strong> {prestataireToView.email}</p>
                <p><strong>Téléphone:</strong> {prestataireToView.telephone}</p>
                <p><strong>Site Web:</strong> {prestataireToView.site_web}</p>
              </div>
              <div>
                <p><strong>SIRET:</strong> {prestataireToView.siret}</p>
                <p><strong>Assurance:</strong> {prestataireToView.assurance_nom}</p>
                <p><strong>Prix minimum:</strong> {prestataireToView.prix_minimum} €</p>
                <p><strong>Status CRM:</strong> {prestataireToView.status_crm}</p>
                <p><strong>Source Inscription:</strong> {prestataireToView.source_inscription}</p>
                <p><strong>Description:</strong> {prestataireToView.description}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="ghost" onClick={() => setIsDetailsModalOpen(false)}>
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPrestataires;
