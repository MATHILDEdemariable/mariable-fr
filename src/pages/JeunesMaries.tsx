import React, { useState, useRef } from 'react';
import SEO from '@/components/SEO';
import { useJeunesMaries } from '@/hooks/useJeunesMaries';
import { JeuneMariesListItem } from '@/components/jeunes-maries/JeuneMariesListItem';
import { JeuneMariesFiltersComponent } from '@/components/jeunes-maries/JeuneMariesFilters';
import { Button } from '@/components/ui/button';
import { UserPlus, Heart, Home, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
const JeunesMariesPage: React.FC = () => {
  const {
    jeunesMaries,
    loading,
    filters,
    setFilters
  } = useJeunesMaries();
  const [showTestimonials, setShowTestimonials] = useState(false);
  const testimonialsRef = useRef<HTMLDivElement>(null);
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
  const handleJoinClub = () => {
    setShowTestimonials(true);
    setTimeout(() => {
      testimonialsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 150);
  };
  return <>
      <SEO title="Le Club by Mariable - Témoignages Exclusifs de Couples" description="Rejoignez le club exclusif des couples mariés et découvrez leurs expériences authentiques, conseils précieux et recommandations de prestataires pour réussir votre grand jour." keywords="club mariés france, témoignages exclusifs mariage, club couples, expériences mariage, conseils organisation mariage" canonical="/jeunes-maries" />
      
      <div className="min-h-screen bg-gradient-subtle">
        {/* Hero Section - Le Club */}
        <section className="relative min-h-screen overflow-hidden">
          <Button asChild variant="outline" className="absolute left-4 top-4 z-10 bg-white/10 backdrop-blur-sm text-primary border-primary/20 hover:bg-white/20">
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
          
          <div className="grid lg:grid-cols-5 min-h-screen">
            {/* Photo Section - Left */}
            <div className="lg:col-span-3 relative">
              <img src="https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/visuels/club%20mariable.png" alt="Couple de mariés - Le Club by Mariable" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20 lg:to-background/50" />
            </div>
            
            {/* Content Section - Right */}
            <div className="lg:col-span-2 flex items-center justify-center bg-background p-8 lg:p-12">
              <div className="max-w-md text-center lg:text-left">
                <div className="mb-8">
                  
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-serif text-foreground mb-6">Rejoignez un club exclusif de mariés</h1>
                
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Découvrez les expériences authentiques, conseils précieux et secrets des couples qui ont vécu leur jour parfait.
                </p>
                
                <Button onClick={handleJoinClub} size="lg" className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-primary-foreground group">
                  <Sparkles className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Rejoindre le club
                </Button>
                
                <p className="text-sm text-muted-foreground/80 mt-4">
                  Accès gratuit et immédiat
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Revealed on demand */}
        {showTestimonials && <div ref={testimonialsRef} className="animate-fade-in bg-background py-16">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-serif text-foreground mb-4">
                  Témoignages du Club
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                  Découvrez les expériences authentiques de nos membres et leurs conseils précieux
                </p>
                
                <div className="flex justify-center lg:justify-end mb-8">
                  <Button asChild size="lg" className="bg-black text-white hover:bg-black/90">
                    <Link to="/jeunes-maries/inscription">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Partager votre expérience
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="mb-8">
                <JeuneMariesFiltersComponent filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />
              </div>

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-lg text-muted-foreground">
                  {loading ? 'Chargement...' : `${jeunesMaries.length} témoignage${jeunesMaries.length > 1 ? 's' : ''} trouvé${jeunesMaries.length > 1 ? 's' : ''}`}
                </p>
              </div>

              {/* Testimonials List */}
              {loading ? <div className="space-y-4">
                  {[...Array(6)].map((_, i) => <div key={i} className="bg-card rounded-lg h-24 animate-pulse border" />)}
                </div> : jeunesMaries.length > 0 ? <div className="space-y-4">
                  {jeunesMaries.map(jeuneMarie => <JeuneMariesListItem key={jeuneMarie.id} jeuneMarie={jeuneMarie} />)}
                </div> : <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Aucun témoignage trouvé
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Essayez de modifier vos critères de recherche ou soyez le premier à partager votre expérience !
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/jeunes-maries/inscription">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Partager votre expérience
                    </Link>
                  </Button>
                </div>}
            </div>
          </div>}
      </div>
    </>;
};
export default JeunesMariesPage;