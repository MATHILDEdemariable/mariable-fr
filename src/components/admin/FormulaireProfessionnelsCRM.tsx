
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Search, Mail, Phone, Filter, Plus, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import FormulaireProfessionnelDetailModal from './FormulaireProfessionnelDetailModal';
import TimelineModal from './TimelineModal';
import ContactModal from './ContactModal';
import { 
  validateAndCastStatus,
  validateAndCastRegion,
  validateAndCastCategorie,
  validStatusValues,
  validRegionValues,
  validCategorieValues
} from './crmValidation';

type FormulaireProfessionnel = Database['public']['Tables']['prestataires']['Row'];
type PrestataireCrmStatus = Database['public']['Enums']['prestataire_status'];

const ITEMS_PER_PAGE = 15;

const statusOptions: { value: PrestataireCrmStatus; label: string; color: string }[] = [
  { value: 'acquisition', label: 'Acquisition', color: 'bg-blue-100 text-blue-800' },
  { value: 'verification', label: 'Vérification', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'a_valider', label: 'À valider', color: 'bg-orange-100 text-orange-800' },
  { value: 'valide', label: 'Validé', color: 'bg-green-100 text-green-800' },
  { value: 'en_attente', label: 'En attente', color: 'bg-purple-100 text-purple-800' },
  { value: 'actif', label: 'Actif', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'inactif', label: 'Inactif', color: 'bg-gray-100 text-gray-800' },
  { value: 'blackliste', label: 'Blacklisté', color: 'bg-red-100 text-red-800' },
  { value: 'exclu', label: 'Exclu', color: 'bg-red-200 text-red-900' },
];

const FormulaireProfessionnelsCRM = () => {
  const [formulaires, setFormulaires] = useState<FormulaireProfessionnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('');
  const [categorieFilter, setCategorieFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedFormulaire, setSelectedFormulaire] = useState<FormulaireProfessionnel | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<FormulaireProfessionnel>>({});

  const fetchFormulaires = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('prestataires')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`nom.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,ville.ilike.%${searchTerm}%`);
      }

      if (statusFilter) {
        const validatedStatus = validateAndCastStatus(statusFilter);
        if (validatedStatus) {
          query = query.eq('status_crm', validatedStatus);
        }
      }

      if (regionFilter) {
        const validatedRegion = validateAndCastRegion(regionFilter);
        if (validatedRegion) {
          query = query.eq('region', validatedRegion);
        }
      }

      if (categorieFilter) {
        const validatedCategorie = validateAndCastCategorie(categorieFilter);
        if (validatedCategorie) {
          query = query.eq('categorie', validatedCategorie);
        }
      }

      const { data, error, count } = await query
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (error) {
        console.error('Erreur lors du chargement des formulaires:', error);
        toast.error('Erreur lors du chargement des formulaires');
        return;
      }

      setFormulaires(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des formulaires:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormulaires();
  }, [currentPage, searchTerm, statusFilter, regionFilter, categorieFilter]);

  const handleEdit = (formulaire: FormulaireProfessionnel) => {
    setEditingId(formulaire.id);
    setEditValues({
      status_crm: formulaire.status_crm,
      commentaires_internes: formulaire.commentaires_internes,
    });
  };

  const handleSave = async (id: string) => {
    try {
      // Valider les données avant la sauvegarde
      const updateData: Partial<FormulaireProfessionnel> = {};
      
      if (editValues.status_crm) {
        const validatedStatus = validateAndCastStatus(editValues.status_crm);
        if (validatedStatus) {
          updateData.status_crm = validatedStatus;
        } else {
          toast.error('Statut CRM invalide');
          return;
        }
      }
      
      if (editValues.commentaires_internes !== undefined) {
        updateData.commentaires_internes = editValues.commentaires_internes;
      }

      const { error } = await supabase
        .from('prestataires')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast.success('Formulaire mis à jour avec succès');
      setEditingId(null);
      fetchFormulaires();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleViewDetails = (formulaire: FormulaireProfessionnel) => {
    setSelectedFormulaire(formulaire);
    setModalOpen(true);
  };

  const handleViewTimeline = (formulaire: FormulaireProfessionnel) => {
    setSelectedFormulaire(formulaire);
    setTimelineModalOpen(true);
  };

  const handleContact = (formulaire?: FormulaireProfessionnel) => {
    if (formulaire) {
      setSelectedFormulaire(formulaire);
      setSelectedIds([formulaire.id]);
    }
    setContactModalOpen(true);
  };

  const handleBulkContact = () => {
    if (selectedIds.length === 0) {
      toast.error('Veuillez sélectionner au moins un prestataire');
      return;
    }
    setContactModalOpen(true);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(prevId => prevId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === formulaires.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(formulaires.map(f => f.id));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setRegionFilter('');
    setCategorieFilter('');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: PrestataireCrmStatus | null) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    if (!statusOption) return <Badge variant="secondary">Non défini</Badge>;
    
    return (
      <Badge className={statusOption.color}>
        {statusOption.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les statuts</SelectItem>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par région" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les régions</SelectItem>
            {validRegionValues.map(region => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={categorieFilter} onValueChange={setCategorieFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les catégories</SelectItem>
            {validCategorieValues.map(categorie => (
              <SelectItem key={categorie} value={categorie}>
                {categorie}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions en masse */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            {totalCount} formulaire{totalCount > 1 ? 's' : ''} au total
            {selectedIds.length > 0 && ` • ${selectedIds.length} sélectionné${selectedIds.length > 1 ? 's' : ''}`}
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <Filter className="h-4 w-4 mr-1" />
            Effacer les filtres
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBulkContact}
            disabled={selectedIds.length === 0}
          >
            <Mail className="h-4 w-4 mr-1" />
            Contact en masse ({selectedIds.length})
          </Button>
        </div>
      </div>

      {/* Table CRM */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === formulaires.length && formulaires.length > 0}
                  onCheckedChange={selectAll}
                />
              </TableHead>
              <TableHead>Nom/Entreprise</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Région</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Statut CRM</TableHead>
              <TableHead>Date d'entrée</TableHead>
              <TableHead>Dernier contact</TableHead>
              <TableHead>Commentaires</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : formulaires.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  Aucun formulaire trouvé
                </TableCell>
              </TableRow>
            ) : (
              formulaires.map((formulaire) => (
                <TableRow key={formulaire.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(formulaire.id)}
                      onCheckedChange={() => toggleSelection(formulaire.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {formulaire.nom}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {formulaire.categorie}
                    </Badge>
                  </TableCell>
                  <TableCell>{formulaire.region}</TableCell>
                  <TableCell>{formulaire.email}</TableCell>
                  <TableCell>
                    {editingId === formulaire.id ? (
                      <Select 
                        value={editValues.status_crm || formulaire.status_crm || 'acquisition'} 
                        onValueChange={(value) => {
                          const validatedStatus = validateAndCastStatus(value);
                          if (validatedStatus) {
                            setEditValues({...editValues, status_crm: validatedStatus});
                          }
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      getStatusBadge(formulaire.status_crm)
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDate(formulaire.created_at)}
                  </TableCell>
                  <TableCell>
                    {formatDate(formulaire.date_derniere_contact)}
                  </TableCell>
                  <TableCell className="max-w-48">
                    {editingId === formulaire.id ? (
                      <Input
                        value={editValues.commentaires_internes || ''}
                        onChange={(e) => setEditValues({...editValues, commentaires_internes: e.target.value})}
                        placeholder="Commentaires internes..."
                        className="text-xs"
                      />
                    ) : (
                      <div className="text-xs text-gray-600 truncate" title={formulaire.commentaires_internes || ''}>
                        {formulaire.commentaires_internes || 'Aucun commentaire'}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {editingId === formulaire.id ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSave(formulaire.id)}
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(formulaire)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(formulaire)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTimeline(formulaire)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContact(formulaire)}
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                  className="cursor-pointer"
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Modals */}
      <FormulaireProfessionnelDetailModal
        formulaire={selectedFormulaire}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <TimelineModal
        formulaire={selectedFormulaire}
        open={timelineModalOpen}
        onOpenChange={setTimelineModalOpen}
        onUpdate={fetchFormulaires}
      />

      <ContactModal
        formulaires={selectedIds.length > 0 ? formulaires.filter(f => selectedIds.includes(f.id)) : []}
        open={contactModalOpen}
        onOpenChange={setContactModalOpen}
        onSuccess={() => {
          setSelectedIds([]);
          fetchFormulaires();
        }}
      />
    </div>
  );
};

export default FormulaireProfessionnelsCRM;
