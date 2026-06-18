import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { AccommodationTutorial } from '@/components/accommodations/AccommodationTutorial';
import {
  useAccommodations,
  useCreateAccommodation,
  useUpdateAccommodation,
  useDeleteAccommodation,
  Accommodation,
} from '@/hooks/useAccommodations';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';

export default function AccommodationsPage() {
  const { t, i18n } = useTranslation('weddingDay');
  const dateLocale = i18n.language.startsWith('en') ? 'en-US' : 'fr-FR';

  const statusVariant: Record<string, 'secondary' | 'default'> = {
    non_reserve: 'secondary',
    reserve: 'default',
    paye: 'default',
  };

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

  const {
    executeAction,
    showPremiumModal,
    closePremiumModal
  } = usePremiumAction({
    feature: t('accommodations.premiumFeature'),
    description: t('accommodations.premiumDescription')
  });

  const filteredAccommodations = accommodations.filter(
    (acc) =>
      acc.nom_logement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.adresse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.guests?.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreate = () => {
    executeAction(() => {
      setEditingAccommodation(undefined);
      setFormOpen(true);
    });
  };

  const handleEdit = (accommodation: Accommodation) => {
    executeAction(() => {
      setEditingAccommodation(accommodation);
      setFormOpen(true);
    });
  };

  const handleSubmit = (data: any) => {
    if (editingAccommodation) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = () => {
    executeAction(() => {
      if (deleteId) {
        deleteMutation.mutate(deleteId);
        setDeleteId(null);
      }
    });
  };

  const handleRowClick = (accommodation: Accommodation) => {
    setSelectedAccommodation(accommodation);
    setDetailsOpen(true);
  };

  const handleExportPDF = () => {
    toast.info(t('accommodations.exportTodo'));
  };

  return (
    <>
      <Helmet>
        <title>{t('accommodations.pageTitle')}</title>
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-wedding-olive">{t('accommodations.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('accommodations.subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportPDF} variant="outline">
              <FileDown className="w-4 h-4 mr-2" />
              {t('accommodations.exportPdf')}
            </Button>
            <Button onClick={handleCreate} className="bg-wedding-olive hover:bg-wedding-olive/90">
              <Plus className="w-4 h-4 mr-2" />
              {t('accommodations.add')}
            </Button>
          </div>
        </div>

        <AccommodationTutorial />

        <AccommodationStats accommodations={accommodations} />

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('accommodations.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">{t('accommodations.loading')}</p>
          ) : filteredAccommodations.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              {searchTerm ? t('accommodations.noResults') : t('accommodations.empty')}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('accommodations.colName')}</TableHead>
                    <TableHead>{t('accommodations.colType')}</TableHead>
                    <TableHead className="text-center">{t('accommodations.colRooms')}</TableHead>
                    <TableHead className="text-center">{t('accommodations.colCapacity')}</TableHead>
                    <TableHead>{t('accommodations.colGuests')}</TableHead>
                    <TableHead>{t('accommodations.colStatus')}</TableHead>
                    <TableHead>{t('accommodations.colPricePerNight')}</TableHead>
                    <TableHead>{t('accommodations.colDates')}</TableHead>
                    <TableHead className="text-right">{t('accommodations.colActions')}</TableHead>
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
                      <TableCell>{t(`accommodations.type.${accommodation.type_logement}`)}</TableCell>
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
                          <span className="text-muted-foreground text-sm">{t('accommodations.none')}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusVariant[accommodation.statut] || 'secondary'}
                          className={
                            accommodation.statut === 'paye'
                              ? 'bg-green-600'
                              : accommodation.statut === 'reserve'
                              ? 'bg-blue-600'
                              : ''
                          }
                        >
                          {t(`accommodations.status.${accommodation.statut}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {accommodation.prix_par_nuit ? `${accommodation.prix_par_nuit}€` : '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {accommodation.date_arrivee && accommodation.date_depart
                          ? `${new Date(accommodation.date_arrivee).toLocaleDateString(dateLocale)} - ${new Date(accommodation.date_depart).toLocaleDateString(dateLocale)}`
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
            <AlertDialogTitle>{t('accommodations.confirmDeleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('accommodations.confirmDeleteDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('accommodations.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {t('accommodations.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={closePremiumModal}
        feature={t('accommodations.premiumFeature')}
        description={t('accommodations.premiumDescription')}
      />
    </>
  );
}
