import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Plus, Search, Trash2, Pencil, FileDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AccommodationStats } from '@/components/accommodations/AccommodationStats';
import { AccommodationForm } from '@/components/accommodations/AccommodationForm';
import { AccommodationDetailsModal } from '@/components/accommodations/AccommodationDetailsModal';
import {
  useAccommodations,
  useCreateAccommodation,
  useUpdateAccommodation,
  useDeleteAccommodation,
  Accommodation,
} from '@/hooks/useAccommodations';

const statusMap = {
  non_reserve: { label: 'Non réservé', variant: 'secondary' as const },
  reserve: { label: 'Réservé', variant: 'default' as const },
  paye: { label: 'Payé', variant: 'default' as const },
};

const typeMap: Record<string, string> = {
  hotel: 'Hôtel',
  chambre_hote: "Chambre d'hôte",
  airbnb: 'Airbnb',
  famille: 'Famille',
  autre: 'Autre',
};

export default function AccommodationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);

  const { data: accommodations = [], isLoading } = useAccommodations();
  const createMutation = useCreateAccommodation();
  const updateMutation = useUpdateAccommodation();
  const deleteMutation = useDeleteAccommodation();

  const filteredAccommodations = accommodations.filter(
    (acc) =>
      acc.nom_logement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.adresse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.guests?.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreate = () => {
    setEditingAccommodation(undefined);
    setFormOpen(true);
  };

  const handleEdit = (accommodation: Accommodation) => {
    setEditingAccommodation(accommodation);
    setFormOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (editingAccommodation) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleRowClick = (accommodation: Accommodation) => {
    setSelectedAccommodation(accommodation);
    setDetailsOpen(true);
  };

  const handleExportPDF = () => {
    toast.info('Fonctionnalité d\'export PDF en cours de développement');
  };

  return (
    <>
      <Helmet>
        <title>Gestion des Logements - Mariable</title>
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-wedding-olive">Gestion des Logements</h1>
            <p className="text-muted-foreground mt-1">
              Gérez les hébergements pour vos invités
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportPDF} variant="outline">
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={handleCreate} className="bg-wedding-olive hover:bg-wedding-olive/90">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un logement
            </Button>
          </div>
        </div>

        <AccommodationStats accommodations={accommodations} />

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, adresse ou invité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Chargement...</p>
          ) : filteredAccommodations.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Aucun résultat trouvé' : 'Aucun logement créé'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Chambres</TableHead>
                    <TableHead className="text-center">Capacité</TableHead>
                    <TableHead>Invités</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Prix/nuit</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccommodations.map((accommodation) => (
                    <TableRow 
                      key={accommodation.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(accommodation)}
                    >
                      <TableCell className="font-medium">{accommodation.nom_logement}</TableCell>
                      <TableCell>{typeMap[accommodation.type_logement]}</TableCell>
                      <TableCell className="text-center">{accommodation.nombre_chambres}</TableCell>
                      <TableCell className="text-center">
                        {accommodation.guests?.length || 0} / {accommodation.capacite_totale}
                      </TableCell>
                      <TableCell>
                        {accommodation.guests && accommodation.guests.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {accommodation.guests.slice(0, 2).map((guest, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {guest}
                              </Badge>
                            ))}
                            {accommodation.guests.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{accommodation.guests.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Aucun</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusMap[accommodation.statut as keyof typeof statusMap].variant}
                          className={
                            accommodation.statut === 'paye'
                              ? 'bg-green-600'
                              : accommodation.statut === 'reserve'
                              ? 'bg-blue-600'
                              : ''
                          }
                        >
                          {statusMap[accommodation.statut as keyof typeof statusMap].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {accommodation.prix_par_nuit ? `${accommodation.prix_par_nuit}€` : '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {accommodation.date_arrivee && accommodation.date_depart
                          ? `${new Date(accommodation.date_arrivee).toLocaleDateString('fr-FR')} - ${new Date(accommodation.date_depart).toLocaleDateString('fr-FR')}`
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(accommodation);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(accommodation.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <AccommodationForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        accommodation={editingAccommodation}
      />

      <AccommodationDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        accommodation={selectedAccommodation}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce logement ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
