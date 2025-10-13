import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Accommodation {
  id: string;
  user_id: string;
  nom_logement: string;
  type_logement: string;
  nombre_chambres: number;
  capacite_totale: number;
  statut: 'non_reserve' | 'reserve' | 'paye';
  prix_par_nuit: number | null;
  date_arrivee: string | null;
  date_depart: string | null;
  adresse: string | null;
  contact: string | null;
  commentaires: string | null;
  created_at: string;
  updated_at: string;
  guests?: string[];
}

export const useAccommodations = () => {
  return useQuery({
    queryKey: ['accommodations'],
    queryFn: async () => {
      const { data: accommodations, error } = await supabase
        .from('wedding_accommodations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch guests for each accommodation
      const accommodationsWithGuests = await Promise.all(
        accommodations.map(async (acc) => {
          const { data: assignments } = await supabase
            .from('accommodation_assignments')
            .select('guest_name')
            .eq('accommodation_id', acc.id);

          return {
            ...acc,
            guests: assignments?.map((a) => a.guest_name) || [],
          };
        })
      );

      return accommodationsWithGuests as Accommodation[];
    },
  });
};

export const useCreateAccommodation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Accommodation> & { guests?: string[] }) => {
      const { guests, user_id, created_at, updated_at, id, ...rest } = data;
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const insertData: any = {
        nom_logement: rest.nom_logement || '',
        type_logement: rest.type_logement || 'hotel',
        nombre_chambres: rest.nombre_chambres || 1,
        capacite_totale: rest.capacite_totale || 2,
        statut: rest.statut || 'non_reserve',
        user_id: user.user.id,
      };

      if (rest.prix_par_nuit !== undefined) insertData.prix_par_nuit = rest.prix_par_nuit;
      if (rest.date_arrivee) insertData.date_arrivee = rest.date_arrivee;
      if (rest.date_depart) insertData.date_depart = rest.date_depart;
      if (rest.adresse) insertData.adresse = rest.adresse;
      if (rest.contact) insertData.contact = rest.contact;
      if (rest.commentaires) insertData.commentaires = rest.commentaires;

      const { data: accommodation, error } = await supabase
        .from('wedding_accommodations')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // Add guest assignments
      if (guests && guests.length > 0) {
        const assignments = guests.map((guest_name) => ({
          accommodation_id: accommodation.id,
          guest_name,
        }));

        const { error: assignError } = await supabase
          .from('accommodation_assignments')
          .insert(assignments);

        if (assignError) throw assignError;
      }

      return accommodation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      toast.success('Logement créé avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

export const useUpdateAccommodation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Accommodation> & { id: string; guests?: string[] }) => {
      const { guests, user_id, created_at, updated_at, ...rest } = data;

      const updateData: any = {};
      if (rest.nom_logement !== undefined) updateData.nom_logement = rest.nom_logement;
      if (rest.type_logement !== undefined) updateData.type_logement = rest.type_logement;
      if (rest.nombre_chambres !== undefined) updateData.nombre_chambres = rest.nombre_chambres;
      if (rest.capacite_totale !== undefined) updateData.capacite_totale = rest.capacite_totale;
      if (rest.statut !== undefined) updateData.statut = rest.statut;
      if (rest.prix_par_nuit !== undefined) updateData.prix_par_nuit = rest.prix_par_nuit;
      if (rest.date_arrivee !== undefined) updateData.date_arrivee = rest.date_arrivee;
      if (rest.date_depart !== undefined) updateData.date_depart = rest.date_depart;
      if (rest.adresse !== undefined) updateData.adresse = rest.adresse;
      if (rest.contact !== undefined) updateData.contact = rest.contact;
      if (rest.commentaires !== undefined) updateData.commentaires = rest.commentaires;

      const { error } = await supabase
        .from('wedding_accommodations')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Update guest assignments
      if (guests !== undefined) {
        // Delete existing assignments
        await supabase
          .from('accommodation_assignments')
          .delete()
          .eq('accommodation_id', id);

        // Add new assignments
        if (guests.length > 0) {
          const assignments = guests.map((guest_name) => ({
            accommodation_id: id,
            guest_name,
          }));

          const { error: assignError } = await supabase
            .from('accommodation_assignments')
            .insert(assignments);

          if (assignError) throw assignError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      toast.success('Logement mis à jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

export const useDeleteAccommodation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('wedding_accommodations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      toast.success('Logement supprimé');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};
