import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VendorCard from '@/components/vendors/VendorCard';
import { useOptimizedVendors } from '@/hooks/useOptimizedVendors';
import { useDebounce } from 'use-debounce';
import { 
  Loader2, Search, X, ChevronLeft, ChevronRight, 
  Camera, Utensils, Building2, Music, Flower2, 
  Sparkles, Star, Palette, Gift, Car, Users, Calendar,
  CheckCircle, Percent, ListChecks, ArrowRight
} from 'lucide-react';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Database } from '@/integrations/supabase/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type PrestataireCategorie = Database['public']['Enums']['prestataire_categorie'];

const CATEGORY_CONFIG: { value: PrestataireCategorie | 'Tous'; label: string; icon: React.ReactNode }[] = [
  { value: 'Tous', label: 'Tous', icon: <Sparkles className="w-4 h-4" /> },
  { value: 'Lieu de réception', label: 'Lieux', icon: <Building2 className="w-4 h-4" /> },
  { value: 'Photographe', label: 'Photo', icon: <Camera className="w-4 h-4" /> },
  { value: 'Vidéaste', label: 'Vidéo', icon: <Camera className="w-4 h-4" /> },
  { value: 'Traiteur', label: 'Traiteur', icon: <Utensils className="w-4 h-4" /> },
  { value: 'DJ', label: 'DJ', icon: <Music className="w-4 h-4" /> },
  { value: 'Fleuriste', label: 'Fleuriste', icon: <Flower2 className="w-4 h-4" /> },
  { value: 'Décoration', label: 'Déco', icon: <Palette className="w-4 h-4" /> },
  { value: 'Mise en beauté', label: 'Beauté', icon: <Star className="w-4 h-4" /> },
  { value: 'Robe de mariée', label: 'Robes', icon: <Gift className="w-4 h-4" /> },
  { value: 'Voiture', label: 'Voiture', icon: <Car className="w-4 h-4" /> },
  { value: 'Invités', label: 'Invités', icon: <Users className="w-4 h-4" /> },
  { value: 'Coordination', label: 'Coordination', icon: <Calendar className="w-4 h-4" /> },
];

const ITEMS_PER_PAGE = 12;

const REGIONS = [
  'France entière',
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Hauts-de-France',
  'Île-de-France',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Pays de la Loire',
  "Provence-Alpes-Côte d'Azur"
];

// Hero Section
const HeroSection = ({ onScrollToResults }: { onScrollToResults: () => void }) => (
  <section className="relative py-16 md:py-24 bg-gradient-to-br from-premium-sage/10 via-background to-premium-cream/30 overflow-hidden">
    {/* Decorative elements */}
    <div className="absolute top-20 left-10 w-32 h-32 bg-premium-sage/5 rounded-full blur-3xl" />
    <div className="absolute bottom-10 right-10 w-40 h-40 bg-premium-cream/40 rounded-full blur-3xl" />
    
    <div className="container max-w-6xl mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-premium-sage/10 border border-premium-sage/20 rounded-full px-4 py-2 mb-6"
        >
          <Sparkles className="w-4 h-4 text-premium-sage" />
          <span className="text-premium-sage-dark text-sm font-medium">Professionnels vérifiés</span>
        </motion.div>

        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
          Trouvez vos prestataires
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Des professionnels triés sur le volet pour créer le mariage de vos rêves
        </p>

        <Button 
          size="lg"
          onClick={onScrollToResults}
          className="bg-premium-sage hover:bg-premium-sage-dark text-white px-8 py-6 text-lg rounded-full shadow-lg"
        >
          Explorer les professionnels
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  </section>
);

// Club Advantages Section
const ClubAdvantagesSection = () => {
  const advantages = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Professionnels vérifiés",
      description: "Tous nos prestataires sont sélectionnés pour leur qualité"
    },
    {
      icon: <Percent className="w-6 h-6" />,
      title: "Prix préférentiels",
      description: "Bénéficiez de réductions exclusives Club Mariable"
    },
    {
      icon: <ListChecks className="w-6 h-6" />,
      title: "Outils gratuits",
      description: "Checklist, budget, plan de table et coordination Jour-J"
    }
  ];

  return (
    <section className="py-12 bg-white border-y border-border">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
            Avantages exclusifs Club Mariable
          </h2>
          <p className="text-muted-foreground">
            Rejoignez le club et profitez de tous les avantages
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {advantages.map((advantage, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex items-start gap-4 p-6 bg-premium-sage-very-light/50 rounded-2xl border border-premium-sage/10"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-premium-sage/10 rounded-xl flex items-center justify-center text-premium-sage">
                {advantage.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{advantage.title}</h3>
                <p className="text-sm text-muted-foreground">{advantage.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            className="border-premium-sage text-premium-sage hover:bg-premium-sage/10 rounded-full px-6"
            onClick={() => window.location.href = '/'}
          >
            En savoir plus sur le Club
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

// Category Pills Filter
const CategoryPills = ({ 
  selected, 
  onSelect 
}: { 
  selected: PrestataireCategorie | 'Tous'; 
  onSelect: (cat: PrestataireCategorie | 'Tous') => void;
}) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-4">
        {CATEGORY_CONFIG.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onSelect(cat.value)}
            className={`
              inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
              transition-all duration-200 whitespace-nowrap flex-shrink-0
              ${selected === cat.value 
                ? 'bg-premium-sage text-white shadow-md' 
                : 'bg-white border border-border text-muted-foreground hover:border-premium-sage/50 hover:text-premium-sage'
              }
            `}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
};

const ProfessionnelsMariable = () => {
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PrestataireCategorie | 'Tous'>('Tous');
  const [region, setRegion] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data: vendorsData, isLoading } = useOptimizedVendors({
    filters: {
      search,
      category,
      region,
    },
    debouncedSearch,
    initialLimit: 1000,
  });

  const vendors = vendorsData?.vendors || [];
  const totalPages = Math.ceil(vendors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVendors = vendors.slice(startIndex, endIndex);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, category, region]);

  const handleReset = () => {
    setSearch('');
    setCategory('Tous');
    setRegion(null);
  };

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const hasActiveFilters = search || category !== 'Tous' || region;

  return (
    <>
      <Helmet>
        <title>Tous les Professionnels de Mariage | Mariable</title>
        <meta 
          name="description" 
          content="Découvrez notre sélection complète de prestataires de mariage : lieux de réception, traiteurs, photographes, DJ, fleuristes et plus encore. Trouvez les meilleurs professionnels pour votre mariage." 
        />
        <meta name="keywords" content="prestataires mariage, professionnels mariage, lieu réception, traiteur mariage, photographe mariage" />
      </Helmet>

      <PremiumHeader />
      
      <main className="min-h-screen bg-[#efeee9]">
        {/* Hero */}
        <HeroSection onScrollToResults={scrollToResults} />

        {/* Club Advantages */}
        <ClubAdvantagesSection />

        {/* Results Section */}
        <div ref={resultsRef} className="scroll-mt-20 py-12">
          <div className="container max-w-7xl mx-auto px-4">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher une marque ou un prestataire..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 pr-12 py-6 text-lg rounded-full border-2 border-border focus:border-premium-sage bg-white shadow-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Category Pills */}
            <div className="mb-8">
              <CategoryPills selected={category} onSelect={setCategory} />
            </div>

            {/* Region Filter (optional - compact) */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <select
                  value={region || 'all'}
                  onChange={(e) => setRegion(e.target.value === 'all' ? null : e.target.value)}
                  className="px-4 py-2 rounded-full border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-premium-sage/20"
                >
                  <option value="all">Toutes les régions</option>
                  {REGIONS.map((reg) => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleReset}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Réinitialiser
                  </Button>
                )}
              </div>

              {/* Results Counter */}
              {!isLoading && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{vendors.length}</span> {vendors.length > 1 ? 'professionnels' : 'professionnel'}
                </p>
              )}
            </div>

            {/* Vendors Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-premium-sage" />
              </div>
            ) : vendors.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-border">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  Aucun professionnel trouvé avec ces critères
                </p>
                <Button variant="outline" onClick={handleReset} className="rounded-full">
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10"
                >
                  {currentVendors.map((vendor, index) => (
                    <motion.div
                      key={vendor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <VendorCard
                        vendor={vendor}
                        onClick={() => navigate(`/prestataire/${vendor.slug || vendor.id}`)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="rounded-full"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              className={`rounded-full min-w-[40px] ${currentPage === page ? "bg-premium-sage hover:bg-premium-sage-dark" : ""}`}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="px-2 py-2 text-muted-foreground">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-full"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProfessionnelsMariable;
