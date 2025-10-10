import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import VendorCardHomepage from './VendorCardHomepage';

interface Vendor {
  id: string;
  nom: string;
  categorie: string;
  ville?: string;
  region?: string;
  prix_a_partir_de?: number;
  description_courte?: string;
  description?: string;
  photo_url?: string;
  partner?: boolean;
  featured?: boolean;
  slug?: string;
  note?: number;
  nombre_avis?: number;
}

const VendorPreviewWidget = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        // Récupérer prestataires partenaires visibles
        const { data: prestataireData, error } = await supabase
          .from('prestataires_rows')
          .select(`
            id,
            nom,
            categorie,
            ville,
            regions,
            prix_a_partir_de,
            description_courte,
            description,
            partner,
            visible,
            featured,
            slug,
            prestataires_photos_preprod!prestataires_photos_preprod_prestataire_id_fkey (
              url,
              ordre
            )
          `)
          .eq('visible', true)
          .eq('partner', true)
          .order('featured', { ascending: false })
          .limit(4);

        if (error) {
          console.error('Erreur lors de la récupération des prestataires:', error);
          return;
        }

        console.log('📊 Données brutes récupérées:', prestataireData);

        if (prestataireData) {
          const formattedVendors: Vendor[] = prestataireData.map((prestataire: any) => {
            const photos = prestataire.prestataires_photos_preprod || [];
            const mainPhoto = photos.sort((a: any, b: any) => (a.ordre || 999) - (b.ordre || 999))[0];
            
            return {
              id: prestataire.id,
              nom: prestataire.nom,
              categorie: prestataire.categorie,
              ville: prestataire.ville,
              region: prestataire.regions,
              prix_a_partir_de: prestataire.prix_a_partir_de,
              description_courte: prestataire.description_courte,
              description: prestataire.description,
              photo_url: mainPhoto?.url,
              partner: prestataire.partner || false,
              featured: prestataire.featured || false,
              slug: prestataire.slug,
              note: 4.8,
              nombre_avis: Math.floor(Math.random() * 100) + 50
            };
          });
          
          setVendors(formattedVendors);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des prestataires:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="w-full aspect-video rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {vendors.map((vendor) => (
        <VendorCardHomepage key={vendor.id} vendor={vendor} />
      ))}
    </div>
  );
};

export default VendorPreviewWidget;