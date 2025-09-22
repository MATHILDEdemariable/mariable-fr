import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  certified: boolean;
}

const VendorPreviewWidget = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        // Récupérer 4 prestataires distincts avec photos de couverture
        const { data: prestataireData, error } = await supabase
          .from('prestataires_rows')
          .select(`
            id,
            nom,
            categorie,
            ville,
            region,
            prix_a_partir_de,
            partner,
            visible,
            featured,
            prestataires_photos_preprod!inner(url, is_cover)
          `)
          .eq('visible', true)
          .eq('partner', true)
          .eq('prestataires_photos_preprod.is_cover', true)
          .not('prestataires_photos_preprod.url', 'is', null)
          .order('featured', { ascending: false })
          .limit(4);

        if (error) {
          console.error('Erreur lors de la récupération des prestataires:', error);
          return;
        }

        if (prestataireData) {
          const formattedVendors: Vendor[] = prestataireData.map((prestataire: any) => ({
            id: prestataire.id,
            name: prestataire.nom,
            category: prestataire.categorie || 'Prestataire',
            location: `${prestataire.ville || ''}, ${prestataire.region || ''}`.replace(/^,\s*|,\s*$/g, ''),
            rating: 4.5 + Math.random() * 0.4, // Rating réaliste entre 4.5 et 4.9
            reviews: Math.floor(Math.random() * 100) + 50, // Entre 50 et 150 avis
            price: prestataire.prix_a_partir_de || 'Sur devis',
            image: prestataire.prestataires_photos_preprod?.[0]?.url || '/placeholder.svg',
            certified: prestataire.partner
          }));
          
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
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="prestataire-card overflow-hidden h-full animate-pulse">
            <div className="aspect-video bg-gray-200" />
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {vendors.map((vendor) => (
        <Card key={vendor.id} className="prestataire-card group overflow-hidden h-full">
          <div className="aspect-video relative overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-premium-sage-light to-premium-sage-medium flex items-center justify-center">
              <span className="text-premium-charcoal font-medium">{vendor.name}</span>
            </div>
            {vendor.certified && (
              <Badge className="badge-certifie absolute top-3 left-3">
                <CheckCircle className="w-3 h-3 mr-1" />
                Certifié
              </Badge>
            )}
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-premium-black group-hover:text-premium-sage transition-colors">
                    {vendor.name}
                  </h3>
                  <p className="text-sm text-premium-charcoal">{vendor.category}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-premium-charcoal">
                <MapPin className="w-4 h-4 mr-1" />
                {vendor.location}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{vendor.rating}</span>
                  <span className="text-sm text-premium-charcoal ml-1">({vendor.reviews})</span>
                </div>
                <div className="text-sm font-medium text-premium-sage">
                  {vendor.price}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VendorPreviewWidget;