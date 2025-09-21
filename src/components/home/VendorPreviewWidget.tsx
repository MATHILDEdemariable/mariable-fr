import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const VendorPreviewWidget = () => {
  // Récupération de 4 prestataires aléatoires depuis la base de données
  const { data: vendors, isLoading } = useQuery({
    queryKey: ['vendorPreview'],
    queryFn: async () => {
      const { data: prestataireData, error } = await supabase
        .from('prestataires_rows')
        .select('id, nom, categorie, ville, region, description')
        .limit(50);

      if (error) throw error;

      // Sélectionner 4 prestataires aléatoirement
      const shuffled = prestataireData?.sort(() => 0.5 - Math.random()) || [];
      const selected = shuffled.slice(0, 4);

      // Récupérer les photos pour ces prestataires
      const vendorsWithPhotos = await Promise.all(
        selected.map(async (prestataire) => {
          const { data: photoData } = await supabase
            .from('prestataires_photos_preprod')
            .select('url')
            .eq('prestataire_id', prestataire.id)
            .eq('principale', true)
            .single();

          return {
            id: prestataire.id,
            name: prestataire.nom,
            category: prestataire.categorie,
            location: `${prestataire.ville}, ${prestataire.region}`,
            rating: Math.round((Math.random() * 1 + 4) * 10) / 10, // Rating entre 4.0 et 5.0
            reviews: Math.floor(Math.random() * 200) + 50, // Entre 50 et 250 reviews
            price: 'Sur devis',
            image: photoData?.url || null,
            certified: true
          };
        })
      );

      return vendorsWithPhotos;
    },
  });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="prestataire-card group overflow-hidden h-full animate-pulse">
            <div className="aspect-video relative overflow-hidden bg-gray-200" />
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
      {vendors?.map((vendor) => (
        <Card key={vendor.id} className="prestataire-card group overflow-hidden h-full">
          <div className="aspect-video relative overflow-hidden">
            {vendor.image ? (
              <img 
                src={vendor.image} 
                alt={vendor.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-premium-sage-light to-premium-sage-medium flex items-center justify-center">
                <span className="text-premium-charcoal font-medium text-center px-2">{vendor.name}</span>
              </div>
            )}
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