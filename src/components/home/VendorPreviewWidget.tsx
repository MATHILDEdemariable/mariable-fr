import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, CheckCircle, Euro } from 'lucide-react';
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
        // Récupérer 4 prestataires partenaires avec photos
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
            prestataires_photos_preprod(url, is_cover)
          `)
          .eq('visible', true)
          .eq('partner', true)
          .not('prestataires_photos_preprod.url', 'is', null)
          .order('featured', { ascending: false })
          .limit(4);

        if (error) {
          console.error('Erreur lors de la récupération des prestataires:', error);
          return;
        }

        if (prestataireData) {
          const formattedVendors: Vendor[] = prestataireData.map((prestataire: any) => {
            // Remplacer "Kywwie Films" par les vraies données du "Domaine de la Fontaine"
            if (prestataire.nom === 'Kywwie Films') {
              return {
                id: '47bfcf77-a2a0-4936-988c-08570ef1714f',
                name: 'Domaine de la Fontaine',
                category: 'Lieu de réception',
                location: 'Orléans, Centre-Val de Loire',
                rating: parseFloat((4.5 + Math.random() * 0.4).toFixed(1)),
                reviews: Math.floor(Math.random() * 100) + 50,
                price: 'À partir de 3600€',
                image: 'https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/photos/47bfcf77-a2a0-4936-988c-08570ef1714f/carousel/c805b382-65fa-4e35-98d2-e7a53da8b320.jpg',
                certified: true
              };
            }
            
            // Remplacer "Studio CRDC" par "Manoir de Kerangosquer" 
            let displayName = prestataire.nom;
            if (displayName === 'studio CRDC') {
              displayName = 'Manoir de Kerangosquer';
            }

            return {
              id: prestataire.id,
              name: displayName,
              category: prestataire.categorie || 'Prestataire',
              location: `${prestataire.ville || ''}, ${prestataire.region || ''}`.replace(/^,\s*|,\s*$/g, ''),
              rating: parseFloat((4.5 + Math.random() * 0.4).toFixed(1)), // Rating arrondi à 1 décimale
              reviews: Math.floor(Math.random() * 100) + 50, // Entre 50 et 150 avis
              price: prestataire.prix_a_partir_de ? `À partir de ${prestataire.prix_a_partir_de}€` : 'Sur devis',
              image: prestataire.prestataires_photos_preprod?.find((photo: any) => photo.is_cover)?.url || 
                      prestataire.prestataires_photos_preprod?.[0]?.url || 
                      '/placeholder.svg',
              certified: prestataire.partner
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
        <Link to="/register" key={vendor.id}>
          <Card className="prestataire-card group overflow-hidden h-full cursor-pointer">
            <div className="aspect-video relative overflow-hidden">
              <img
                src={vendor.image}
                alt={vendor.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
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
                      <span className="text-sm font-medium">{vendor.rating.toFixed(1)}</span>
                      <span className="text-sm text-premium-charcoal ml-1">({vendor.reviews})</span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-premium-sage">
                      <Euro className="w-4 h-4 mr-1" />
                      {vendor.price}
                    </div>
                  </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default VendorPreviewWidget;