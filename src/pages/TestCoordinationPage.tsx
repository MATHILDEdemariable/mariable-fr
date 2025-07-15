import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, Heart } from 'lucide-react';
import MockCoordinatorCard from '@/components/test/MockCoordinatorCard';
import SEO from '@/components/SEO';

// Mock data for coordinators
const MOCK_COORDINATORS = [
  {
    id: 'coord-1',
    nom: 'Sophie Delacroix',
    description: 'Spécialisée dans les mariages de luxe, Sophie vous accompagne avec élégance et raffinement. Plus de 8 ans d\'expérience dans l\'organisation d\'événements exceptionnels.',
    ville: 'Lyon',
    region: 'Auvergne-Rhône-Alpes',
    prix_a_partir_de: 2500,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop&crop=face',
    specialites: ['Mariages de luxe', 'Châteaux', 'Décoration florale'],
    rating: 4.9
  },
  {
    id: 'coord-2',
    nom: 'Marie Dubois',
    description: 'Passionnée par les mariages authentiques et champêtres, Marie crée des événements sur-mesure qui vous ressemblent. Coordination complète et jour J inclus.',
    ville: 'Bordeaux',
    region: 'Nouvelle-Aquitaine',
    prix_a_partir_de: 1800,
    image: 'https://images.unsplash.com/photo-1594736797933-d0bdb6d95b78?w=400&h=300&fit=crop&crop=face',
    specialites: ['Mariages champêtres', 'Domaines viticoles', 'Éco-responsable'],
    rating: 4.8
  },
  {
    id: 'coord-3',
    nom: 'Émilie Moreau',
    description: 'Coordinatrice créative spécialisée dans les mariages bohèmes et alternatifs. Émilie transforme vos rêves les plus fous en réalité avec originalité et style.',
    ville: 'Paris',
    region: 'Île-de-France',
    prix_a_partir_de: 3200,
    image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=300&fit=crop&crop=face',
    specialites: ['Mariages bohèmes', 'Lieux atypiques', 'Design créatif'],
    rating: 4.7
  },
  {
    id: 'coord-4',
    nom: 'Charlotte Rousseau',
    description: 'Expert en mariages intimes et élégants, Charlotte privilégie l\'authenticité et l\'émotion. Chaque détail est pensé pour créer des souvenirs inoubliables.',
    ville: 'Nantes',
    region: 'Pays de la Loire',
    prix_a_partir_de: 2100,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop&crop=face',
    specialites: ['Mariages intimes', 'Bord de mer', 'Photographie'],
    rating: 4.9
  }
];

const TestCoordinationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCoordinator, setSelectedCoordinator] = useState<any>(null);

  const handleCoordinatorClick = (coordinator: any) => {
    // Dans un vrai contexte, cela naviguerait vers une page de détails
    setSelectedCoordinator(coordinator);
    // Pour le test, on redirige vers la page de réservation
    navigate('/reservation-jour-m');
  };

  return (
    <div className="min-h-screen bg-wedding-cream">
      <SEO 
        title="Coordination Mariable - Nos coordinatrices expertes"
        description="Découvrez nos coordinatrices de mariage expertes. Organisation complète, coordination jour J et accompagnement personnalisé pour votre mariage."
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
          <span className="text-wedding-olive font-medium">Coordination Mariable</span>
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
              <Calendar className="h-6 w-6 text-wedding-olive" />
              <h1 className="text-3xl md:text-4xl font-serif text-wedding-olive">
                Coordination Mariable
              </h1>
            </div>
            <p className="text-muted-foreground">
              Nos coordinatrices expertes vous accompagnent pour créer le mariage de vos rêves
            </p>
          </div>
        </div>

        {/* Service Description */}
        <div className="bg-white rounded-lg p-8 mb-12 border border-wedding-olive/10">
          <div className="flex items-start gap-4 mb-6">
            <Heart className="h-8 w-8 text-wedding-olive mt-1" />
            <div>
              <h2 className="text-2xl font-serif text-wedding-olive mb-4">
                Un accompagnement sur-mesure
              </h2>
              <div className="prose prose-wedding max-w-none">
                <p className="text-muted-foreground mb-4">
                  Nos coordinatrices Mariable vous accompagnent dans chaque étape de l'organisation de votre mariage. 
                  De la conception à la réalisation, nous nous occupons de tous les détails pour que vous puissiez 
                  profiter pleinement de votre jour J.
                </p>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <h3 className="font-semibold text-wedding-olive mb-2">Organisation complète</h3>
                    <p className="text-muted-foreground">Planification, recherche de prestataires, négociation des contrats</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-wedding-olive mb-2">Coordination jour J</h3>
                    <p className="text-muted-foreground">Supervision de l'événement pour une journée sans stress</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-wedding-olive mb-2">Suivi personnalisé</h3>
                    <p className="text-muted-foreground">Accompagnement sur-mesure selon vos besoins et budget</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('/reservation-jour-m')}
              className="bg-wedding-olive hover:bg-wedding-olive/90"
            >
              Demander un devis gratuit
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/demo-jour-m')}
              className="border-wedding-olive text-wedding-olive hover:bg-wedding-olive/10"
            >
              Voir une démo
            </Button>
          </div>
        </div>

        {/* Coordinators Grid */}
        <div>
          <h2 className="text-2xl font-serif text-wedding-olive mb-6">
            Nos coordinatrices expertes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MOCK_COORDINATORS.map((coordinator) => (
              <MockCoordinatorCard
                key={coordinator.id}
                coordinator={coordinator}
                onClick={handleCoordinatorClick}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-wedding-olive/10 to-wedding-olive/5 rounded-lg p-8">
          <h3 className="text-xl font-serif text-wedding-olive mb-4">
            Prêt(e) à organiser votre mariage ?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Nos coordinatrices sont là pour vous accompagner. Demandez votre devis personnalisé 
            et découvrez comment nous pouvons transformer votre rêve en réalité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/reservation-jour-m')}
              className="bg-wedding-olive hover:bg-wedding-olive/90"
            >
              Commencer mon projet
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/nous-contacter')}
              className="border-wedding-olive text-wedding-olive hover:bg-wedding-olive/10"
            >
              Poser une question
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCoordinationPage;