import React from 'react';
import SEO from '@/components/SEO';
import { useJeunesMaries } from '@/hooks/useJeunesMaries';
import { JeuneMariesCard } from '@/components/jeunes-maries/JeuneMariesCard';
import { JeuneMariesFiltersComponent } from '@/components/jeunes-maries/JeuneMariesFilters';
import { Button } from '@/components/ui/button';
import { UserPlus, Heart, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
const JeunesMariesPage: React.FC = () => {
  const {
    jeunesMaries,
    loading,
    filters,
    setFilters
  } = useJeunesMaries();
  const handleFilterChange = (key: keyof typeof filters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const handleResetFilters = () => {
    setFilters({
      search: '',
      region: 'toutes',
      budget: 'tous',
      note: 0
    });
  };
  return <>
      <SEO title="Témoignages de Jeunes Mariés - Mariable" description="Découvrez les expériences authentiques de couples qui ont organisé leur mariage. Conseils, recommandations et inspiration pour votre grand jour." keywords="témoignages mariage, expérience jeunes mariés, conseils mariage, inspiration mariage" />
      
      <div className="min-h-screen bg-gradient-subtle">
        {/* Hero Section */}
        <section className="bg-wedding-olive text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center relative">
              <Button asChild variant="outline" className="absolute left-0 top-0 bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
              <div className="flex justify-center mb-4">
                <Heart className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif mb-4">
                Témoignages de Jeunes Mariés
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Découvrez les expériences authentiques de couples qui ont organisé leur mariage
              </p>
              <p className="text-lg text-white/80 mb-8">Rejoignez la communauté et acceptez d'être contactés par des futurs mariés</p>
              <Button asChild size="lg" variant="secondary" className="bg-white text-wedding-olive hover:bg-white/90">
                <Link to="/jeunes-maries/inscription">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Partager votre expérience
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Filters */}
          <div className="mb-8">
            <JeuneMariesFiltersComponent filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-lg text-gray-600">
              {loading ? 'Chargement...' : `${jeunesMaries.length} témoignage${jeunesMaries.length > 1 ? 's' : ''} trouvé${jeunesMaries.length > 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Grid */}
          {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-lg shadow-sm h-96 animate-pulse" />)}
            </div> : jeunesMaries.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jeunesMaries.map(jeuneMarie => <JeuneMariesCard key={jeuneMarie.id} jeuneMarie={jeuneMarie} />)}
            </div> : <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Aucun témoignage trouvé
              </h3>
              <p className="text-gray-500 mb-6">
                Essayez de modifier vos critères de recherche ou soyez le premier à partager votre expérience !
              </p>
              <Button asChild variant="outline">
                <Link to="/jeunes-maries/inscription">
                  Partager votre expérience
                </Link>
              </Button>
            </div>}
        </div>
      </div>
    </>;
};
export default JeunesMariesPage;