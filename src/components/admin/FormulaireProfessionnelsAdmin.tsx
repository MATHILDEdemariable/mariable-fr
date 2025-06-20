
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
import { Eye, Search, Download } from 'lucide-react';
import { toast } from 'sonner';
import FormulaireProfessionnelDetailModal from './FormulaireProfessionnelDetailModal';

type FormulaireProfessionnel = Database['public']['Tables']['prestataires']['Row'];

const ITEMS_PER_PAGE = 10;

const FormulaireProfessionnelsAdmin = () => {
  const [formulaires, setFormulaires] = useState<FormulaireProfessionnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedFormulaire, setSelectedFormulaire] = useState<FormulaireProfessionnel | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchFormulaires = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('prestataires')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`nom.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,ville.ilike.%${searchTerm}%,categorie.ilike.%${searchTerm}%`);
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
  }, [currentPage, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleViewDetails = (formulaire: FormulaireProfessionnel) => {
    setSelectedFormulaire(formulaire);
    setModalOpen(true);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (formulaire: FormulaireProfessionnel) => {
    if (formulaire.visible) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Actif</Badge>;
    }
    return <Badge variant="secondary">En attente</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par nom, email, ville ou catégorie..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {totalCount} formulaire{totalCount > 1 ? 's' : ''} au total
        </p>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom/Entreprise</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Région</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date de soumission</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : formulaires.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Aucun formulaire trouvé
                </TableCell>
              </TableRow>
            ) : (
              formulaires.map((formulaire) => (
                <TableRow key={formulaire.id}>
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
                    {formatDate(formulaire.created_at)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(formulaire)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(formulaire)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
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

      {/* Detail Modal */}
      <FormulaireProfessionnelDetailModal
        formulaire={selectedFormulaire}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default FormulaireProfessionnelsAdmin;
