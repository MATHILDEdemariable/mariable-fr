import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Heart } from 'lucide-react';
import RegionGrid from '@/components/test/RegionGrid';
import SEO from '@/components/SEO';

const TestVendorSelectionHub: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-wedding-cream">
      <SEO 
        title="Trouvez vos prestataires de mariage - Version Test"
        description="Découvrez les meilleurs prestataires de mariage par région : lieux, traiteurs, photographes et plus encore."
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-wedding-olive mb-4">
            Trouvez vos prestataires de mariage
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les meilleurs professionnels de votre région pour créer le mariage de vos rêves
          </p>
        </div>

        {/* Coordination Mariable Section */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-wedding-olive/10 to-wedding-olive/5 border-wedding-olive/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="h-8 w-8 text-wedding-olive" />
                    <h2 className="text-2xl font-serif text-wedding-olive">
                      Coordination Mariable
                    </h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Nos coordinatrices expertes vous accompagnent dans l'organisation complète de votre mariage. 
                    De la conception à la réalisation, nous nous occupons de tout pour que vous puissiez profiter pleinement de votre jour J.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Heart className="h-4 w-4 text-wedding-olive" />
                    <span>Service premium • Accompagnement personnalisé • Coordination jour J</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={() => navigate('/test-coordination')}
                    className="bg-wedding-olive hover:bg-wedding-olive/90"
                  >
                    Découvrir nos coordinatrices
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/reservation-jour-m')}
                    className="border-wedding-olive text-wedding-olive hover:bg-wedding-olive/10"
                  >
                    Demander un devis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regions Section */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-wedding-olive mb-4">
              Choisissez votre région
            </h2>
            <p className="text-muted-foreground">
              Sélectionnez votre région pour découvrir les prestataires disponibles près de chez vous
            </p>
          </div>

          <RegionGrid />
        </div>

        {/* Navigation vers la version actuelle */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Version test • Vous pouvez aussi accéder à 
          </p>
          <Button 
            variant="outline"
            onClick={() => navigate('/selection')}
            className="border-wedding-olive text-wedding-olive hover:bg-wedding-olive/10"
          >
            la version actuelle du moteur de recherche
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestVendorSelectionHub;