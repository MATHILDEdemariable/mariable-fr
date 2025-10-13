import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accommodation } from '@/hooks/useAccommodations';

const formSchema = z.object({
  nom_logement: z.string().min(1, 'Le nom est requis'),
  type_logement: z.string().min(1, 'Le type est requis'),
  nombre_chambres: z.number().min(1, 'Au moins 1 chambre'),
  capacite_totale: z.number().min(1, 'Au moins 1 personne'),
  statut: z.enum(['non_reserve', 'reserve', 'paye']),
  prix_par_nuit: z.number().optional().nullable(),
  date_arrivee: z.string().optional().nullable(),
  date_depart: z.string().optional().nullable(),
  adresse: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  commentaires: z.string().optional().nullable(),
  guests: z.string().optional(),
});

interface AccommodationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  accommodation?: Accommodation;
}

export const AccommodationForm = ({
  open,
  onOpenChange,
  onSubmit,
  accommodation,
}: AccommodationFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: accommodation
      ? {
          ...accommodation,
          guests: accommodation.guests?.join(', ') || '',
        }
      : {
          nom_logement: '',
          type_logement: 'hotel',
          nombre_chambres: 1,
          capacite_totale: 2,
          statut: 'non_reserve',
          prix_par_nuit: null,
          date_arrivee: null,
          date_depart: null,
          adresse: null,
          contact: null,
          commentaires: null,
          guests: '',
        },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const guestsArray = data.guests
      ?.split(',')
      .map((g) => g.trim())
      .filter(Boolean) || [];

    const submitData = {
      ...data,
      guests: guestsArray,
    };

    if (accommodation) {
      onSubmit({ id: accommodation.id, ...submitData });
    } else {
      onSubmit(submitData);
    }
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {accommodation ? 'Modifier le logement' : 'Ajouter un logement'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nom_logement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du logement *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Hôtel du Château" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type_logement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de logement *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hotel">Hôtel</SelectItem>
                        <SelectItem value="chambre_hote">Chambre d'hôte</SelectItem>
                        <SelectItem value="airbnb">Airbnb</SelectItem>
                        <SelectItem value="famille">Famille</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nombre_chambres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de chambres *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacite_totale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacité totale *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="statut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="non_reserve">Non réservé</SelectItem>
                        <SelectItem value="reserve">Réservé</SelectItem>
                        <SelectItem value="paye">Payé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prix_par_nuit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix par nuit (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_arrivee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'arrivée</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_depart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de départ</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invités assignés (séparés par des virgules)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Marie Dupont, Jean Martin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Rue de la Paix, Paris" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Tél, email" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="commentaires"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaires</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes supplémentaires..."
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {accommodation ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
