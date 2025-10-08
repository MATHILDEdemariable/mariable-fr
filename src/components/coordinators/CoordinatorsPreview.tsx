
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Users, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Coordinator {
  id: string;
  nom: string;
  ville?: string;
  region?: string;
  prix_a_partir_de?: number;
  description?: string;
  featured?: boolean;
  google_rating?: number;
  google_reviews_count?: number;
  google_business_url?: string;
  photos?: Array<{
    url: string;
    principale: boolean;
  }>;
}

const CoordinatorsPreview: React.FC = () => {
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        console.log('🔄 Fetching coordinators from Supabase...');
        
        // Récupérer les coordinateurs depuis prestataires_rows
        const { data: coordinatorsData, error } = await supabase
          .from('prestataires_rows')
          .select(`
            id,
            nom,
            ville,
            regions,
            prix_a_partir_de,
            description,
            featured,
            visible,
            google_rating,
            google_reviews_count,
            google_business_url
          `)
          .eq('categorie', 'Coordination')
          .eq('visible', true)
          .order('featured', { ascending: false })
          .order('prix_a_partir_de', { ascending: true })
          .limit(3);

        if (error) {
          console.error('❌ Error fetching coordinators:', error);
          return;
        }

        if (coordinatorsData) {
          // Récupérer les photos pour chaque coordinateur
          const coordinatorsWithPhotos = await Promise.all(
            coordinatorsData.map(async (coordinator) => {
              const { data: photos } = await supabase
                .from('prestataires_photos_preprod')
                .select('url, principale')
                .eq('prestataire_id', coordinator.id)
                .order('principale', { ascending: false })
                .limit(1);

              return {
                ...coordinator,
                photos: photos || []
              };
            })
          );

          console.log('✅ Coordinators fetched:', coordinatorsWithPhotos);
          setCoordinators(coordinatorsWithPhotos);
        }
      } catch (error) {
        console.error('❌ Error in fetchCoordinators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinators();
  }, []);

  // Données de fallback si pas assez de coordinateurs dans la base
  const fallbackCoordinators = [
    {
      id: 'fallback-1',
      nom: "Sophie Martin",
      ville: "Paris",
      region: "Île-de-France",
      prix_a_partir_de: 799,
      description: "Spécialisée dans les mariages de luxe et coordination jour-J",
      featured: false,
      photos: []
    },
    {
      id: 'fallback-2', 
      nom: "Emma Dubois",
      ville: "Lyon",
      region: "Rhône-Alpes",
      prix_a_partir_de: 699,
      description: "Experte en mariages champêtres et coordination complète",
      featured: false,
      photos: []
    },
    {
      id: 'fallback-3',
      nom: "Claire Moreau", 
      ville: "Bordeaux",
      region: "Nouvelle-Aquitaine",
      prix_a_partir_de: 749,
      description: "Spécialisée dans les mariages en extérieur",
      featured: false,
      photos: []
    }
  ];

  // Utiliser les données de la base ou les données de fallback
  const displayCoordinators = coordinators.length > 0 ? coordinators : fallbackCoordinators;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
            Nos coordinateurs de mariage
          </h2>
          <p className="text-lg text-gray-700">
            Chargement des coordinateurs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
          Nos coordinateurs de mariage
        </h2>
        <p className="text-lg text-gray-700">
          Découvrez quelques-uns de nos coordinateurs expérimentés pour votre jour J
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayCoordinators.map((coordinator) => (
          <Card key={coordinator.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="p-0">
              <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center overflow-hidden">
                {coordinator.photos && coordinator.photos.length > 0 ? (
                  <img
                    src={coordinator.photos[0].url}
                    alt={coordinator.nom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Users className="h-16 w-16 text-gray-400" />
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{coordinator.nom}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    {coordinator.ville && coordinator.region 
                      ? `${coordinator.ville} & ${coordinator.region}`
                      : coordinator.ville || coordinator.region || 'France'
                    }
                  </div>
                </div>

                {(coordinator.google_rating && coordinator.google_reviews_count) && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{coordinator.google_rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({coordinator.google_reviews_count} avis)</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    Coordination jour-J
                  </Badge>
                  {coordinator.featured && (
                    <Badge variant="secondary" className="text-xs bg-wedding-olive/20 text-wedding-olive">
                      Recommandé
                    </Badge>
                  )}
                </div>

                {coordinator.prix_a_partir_de && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium text-wedding-olive">
                      À partir de {coordinator.prix_a_partir_de}€
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90 text-white">
          <Link to="/coordinateurs-mariage">
            <LinkIcon className="h-4 w-4 mr-2" />
            Voir tous les coordinateurs
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CoordinatorsPreview;
