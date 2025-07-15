import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, MapPin, Users } from 'lucide-react';
import ServiceGrid from '@/components/test/ServiceGrid';
import SEO from '@/components/SEO';

const REGION_NAMES = {
  'auvergne-rhone-alpes': 'Auvergne-Rhône-Alpes',
  'bourgogne-franche-comte': 'Bourgogne-Franche-Comté',
  'bretagne': 'Bretagne',
  'centre-val-de-loire': 'Centre-Val de Loire',
  'corse': 'Corse',
  'grand-est': 'Grand Est',
  'hauts-de-france': 'Hauts-de-France',
  'ile-de-france': 'Île-de-France',
  'normandie': 'Normandie',
  'nouvelle-aquitaine': 'Nouvelle-Aquitaine',
  'occitanie': 'Occitanie',
  'pays-de-la-loire': 'Pays de la Loire',
  'provence-alpes-cote-azur': 'Provence-Alpes-Côte d\'Azur'
};

const TestRegionServicePage: React.FC = () => {
  const { region } = useParams<{ region: string }>();
  const navigate = useNavigate();

  const regionName = region ? REGION_NAMES[region as keyof typeof REGION_NAMES] : '';
  
  if (!region || !regionName) {
    return (
      <div className="min-h-screen bg-wedding-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-wedding-olive mb-4">Région non trouvée</h1>
          <Button onClick={() => navigate('/test-selection')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wedding-cream">
      <SEO 
        title={`Prestataires de mariage en ${regionName} - Version Test`}
        description={`Découvrez les meilleurs prestataires de mariage en ${regionName} : lieux de réception, traiteurs, photographes et plus encore.`}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button 
            onClick={() => navigate('/test-selection')}
            className="hover:text-wedding-olive transition-colors"
          >
            Mariage
          </button>
          <span>›</span>
          <span className="text-wedding-olive font-medium">{regionName}</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/test-selection')}
            className="hover:bg-wedding-olive/10"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="h-6 w-6 text-wedding-olive" />
              <h1 className="text-3xl md:text-4xl font-serif text-wedding-olive">
                Mariage en {regionName}
              </h1>
            </div>
            <p className="text-muted-foreground">
              Découvrez tous les prestataires disponibles dans votre région
            </p>
          </div>
        </div>

        {/* Lieux de mariage Section */}
        <div className="mb-12">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-wedding-olive/20 bg-gradient-to-r from-wedding-olive/5 to-transparent"
            onClick={() => navigate(`/test-mariage-lieu-${region}`)}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-wedding-olive/10">
                    <MapPin className="h-8 w-8 text-wedding-olive" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif text-wedding-olive mb-2">
                      Lieux de mariage
                    </h2>
                    <p className="text-muted-foreground">
                      Châteaux, domaines, salles de réception...
                    </p>
                  </div>
                </div>
                <Button 
                  className="bg-wedding-olive hover:bg-wedding-olive/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/test-mariage-lieu-${region}`);
                  }}
                >
                  Voir les lieux
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prestataires Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-wedding-olive" />
            <h2 className="text-2xl font-serif text-wedding-olive">
              Prestataires
            </h2>
          </div>
          
          <ServiceGrid region={region} />
        </div>

        {/* Navigation */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Vous ne trouvez pas ce que vous cherchez ?
          </p>
          <Button 
            variant="outline"
            onClick={() => navigate('/selection')}
            className="border-wedding-olive text-wedding-olive hover:bg-wedding-olive/10"
          >
            Utiliser le moteur de recherche complet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestRegionServicePage;