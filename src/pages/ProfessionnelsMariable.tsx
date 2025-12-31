import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VendorCard from '@/components/vendors/VendorCard';
import { useOptimizedVendors } from '@/hooks/useOptimizedVendors';
import { useDebounce } from 'use-debounce';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, X, ChevronLeft, ChevronRight, Camera, Utensils, Building2, Music, Flower2, Sparkles, Star, Palette, Gift, Car, Users, Calendar, Plus, MessageCircle, CalendarCheck, ArrowRight, LayoutDashboard, HelpCircle } from 'lucide-react';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Database } from '@/integrations/supabase/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CartProvider } from '@/components/cart/CartProvider';
import CartIcon from '@/components/cart/CartIcon';
import CarnetAdressesModal from '@/components/home/CarnetAdressesModal';
import { useQuery } from '@tanstack/react-query';

type PrestataireCategorie = Database['public']['Enums']['prestataire_categorie'];

const CATEGORY_CONFIG: {
  value: PrestataireCategorie | 'Tous';
  label: string;
  icon: React.ReactNode;
}[] = [{
  value: 'Tous',
  label: 'Tous',
  icon: <Sparkles className="w-4 h-4" />
}, {
  value: 'Lieu de réception',
  label: 'Lieux',
  icon: <Building2 className="w-4 h-4" />
}, {
  value: 'Photographe',
  label: 'Photo',
  icon: <Camera className="w-4 h-4" />
}, {
  value: 'Vidéaste',
  label: 'Vidéo',
  icon: <Camera className="w-4 h-4" />
}, {
  value: 'Traiteur',
  label: 'Traiteur',
  icon: <Utensils className="w-4 h-4" />
}, {
  value: 'DJ',
  label: 'DJ',
  icon: <Music className="w-4 h-4" />
}, {
  value: 'Fleuriste',
  label: 'Fleuriste',
  icon: <Flower2 className="w-4 h-4" />
}, {
  value: 'Décoration',
  label: 'Déco',
  icon: <Palette className="w-4 h-4" />
}, {
  value: 'Mise en beauté',
  label: 'Beauté',
  icon: <Star className="w-4 h-4" />
}, {
  value: 'Robe de mariée',
  label: 'Robes',
  icon: <Gift className="w-4 h-4" />
}, {
  value: 'Voiture',
  label: 'Voiture',
  icon: <Car className="w-4 h-4" />
}, {
  value: 'Invités',
  label: 'Invités',
  icon: <Users className="w-4 h-4" />
}, {
  value: 'Coordination',
  label: 'Coordination',
  icon: <Calendar className="w-4 h-4" />
}];

const ITEMS_PER_PAGE = 12;
const REGIONS = ['France entière', 'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne', 'Centre-Val de Loire', 'Corse', 'Grand Est', 'Hauts-de-France', 'Île-de-France', 'Normandie', 'Nouvelle-Aquitaine', 'Occitanie', 'Pays de la Loire', "Provence-Alpes-Côte d'Azur"];

// Editorial Hero Section
const EditorialHeroSection = ({
  onScrollToResults,
  isLoggedIn
}: {
  onScrollToResults: () => void;
  isLoggedIn: boolean;
}) => (
  <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-editorial-cream">
    {/* Subtle background pattern */}
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }} />
    
    <div className="relative z-10 text-center max-w-4xl mx-auto px-6 py-20">
      {/* Editorial badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <span className="inline-block px-4 py-2 text-xs tracking-[0.2em] uppercase text-editorial-gold border border-[hsl(42,56%,52%,0.3)] rounded-full">
          Sélection Mariable
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="font-editorial text-4xl md:text-5xl lg:text-6xl text-editorial-charcoal mb-6 leading-[1.1]"
      >
        L'art de bien
        <br />
        <span className="font-editorial-italic text-editorial-gold">s'entourer</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="editorial-divider"
      />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        Une sélection exigeante de professionnels passionnés, 
        choisis pour leur excellence et leur attention aux détails.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <Button
          size="lg"
          onClick={onScrollToResults}
          className="bg-editorial-charcoal text-white hover:bg-foreground px-10 py-6 text-sm tracking-wide rounded-none border-0 shadow-none"
          style={{ backgroundColor: 'hsl(0, 0%, 15%)' }}
        >
          Explorer la sélection
          <ArrowRight className="ml-3 w-4 h-4" />
        </Button>
        
        {isLoggedIn && (
          <Button
            size="lg"
            variant="outline"
            asChild
            className="px-10 py-6 text-sm tracking-wide rounded-none border-foreground/20 hover:bg-foreground/5"
          >
            <Link to="/dashboard">
              <LayoutDashboard className="mr-2 w-4 h-4" />
              Mes outils
            </Link>
          </Button>
        )}
      </motion.div>
    </div>
  </section>
);

// Editorial quote section
const EditorialQuoteSection = () => (
  <section className="py-16 bg-white">
    <div className="container max-w-4xl mx-auto px-6">
      <motion.blockquote
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="editorial-quote text-center"
      >
        Chaque mariage est une histoire unique. Nous vous aidons à trouver 
        les artisans qui sauront la raconter.
      </motion.blockquote>
    </div>
  </section>
);

// Editorial How It Works
const EditorialHowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Explorez",
      description: "Parcourez notre sélection de professionnels triés sur le volet"
    },
    {
      number: "02",
      title: "Contactez",
      description: "Échangez directement via la plateforme avec vos favoris"
    },
    {
      number: "03",
      title: "Réservez",
      description: "Bénéficiez d'avantages exclusifs Mariable"
    }
  ];

  return (
    <section className="py-20 bg-editorial-warm">
      <div className="container max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-editorial text-3xl md:text-4xl text-editorial-charcoal mb-4">
            Comment ça fonctionne
          </h2>
          <div className="editorial-divider" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <span className="font-editorial text-5xl text-editorial-gold/30 mb-4 block">
                {step.number}
              </span>
              <h3 className="font-editorial text-xl text-editorial-charcoal mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Category Pills Filter - refined
const CategoryPills = ({
  selected,
  onSelect,
  categoryCounts
}: {
  selected: PrestataireCategorie | 'Tous';
  onSelect: (cat: PrestataireCategorie | 'Tous') => void;
  categoryCounts: Record<string, number> | undefined;
}) => {
  const visibleCategories = CATEGORY_CONFIG.filter(cat => 
    cat.value === 'Tous' || (categoryCounts && (categoryCounts[cat.value] ?? 0) > 0)
  );

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-3 pb-4">
        {visibleCategories.map(cat => (
          <button
            key={cat.value}
            onClick={() => onSelect(cat.value)}
            className={`
              inline-flex items-center gap-2 px-5 py-3 text-sm font-medium
              transition-all duration-300 whitespace-nowrap flex-shrink-0 rounded-none border
              ${selected === cat.value 
                ? 'bg-editorial-charcoal text-white border-transparent' 
                : 'bg-transparent border-foreground/10 text-muted-foreground hover:border-foreground/30 hover:text-foreground'}
            `}
            style={selected === cat.value ? { backgroundColor: 'hsl(0, 0%, 15%)' } : {}}
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCarnetModal, setShowCarnetModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { data: categoryCounts } = useQuery({
    queryKey: ['category-counts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('prestataires_rows')
        .select('categorie')
        .eq('visible', true)
        .not('categorie', 'is', null);
      const counts: Record<string, number> = {};
      data?.forEach(p => {
        if (p.categorie) {
          counts[p.categorie] = (counts[p.categorie] || 0) + 1;
        }
      });
      return counts;
    },
    staleTime: 5 * 60 * 1000
  });

  const { data: vendorsData, isLoading } = useOptimizedVendors({
    filters: { search, category, region },
    debouncedSearch,
    initialLimit: 1000
  });

  const vendors = vendorsData?.vendors || [];
  const totalPages = Math.ceil(vendors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVendors = vendors.slice(startIndex, endIndex);

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
    <CartProvider>
      <Helmet>
        <title>Professionnels de Mariage | Sélection Mariable</title>
        <meta name="description" content="Découvrez notre sélection exclusive de prestataires de mariage : lieux de réception, traiteurs, photographes, DJ, fleuristes et plus encore." />
      </Helmet>

      <PremiumHeader />
      <CartIcon />
      
      <main className="min-h-screen bg-white">
        {/* Editorial Hero */}
        <EditorialHeroSection onScrollToResults={scrollToResults} isLoggedIn={isLoggedIn} />

        {/* Editorial Quote */}
        <EditorialQuoteSection />

        {/* How It Works */}
        <EditorialHowItWorks />

        {/* Results Section */}
        <div ref={resultsRef} className="scroll-mt-20 py-20 bg-editorial-cream">
          <div className="container max-w-7xl mx-auto px-6">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-editorial text-3xl md:text-4xl text-editorial-charcoal mb-4">
                Notre sélection
              </h2>
              <div className="editorial-divider" />
            </motion.div>

            {/* Search Bar - refined */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl mx-auto mb-12"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher un prestataire..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-12 pr-12 py-4 text-base rounded-none border-foreground/10 focus:border-foreground/30 bg-white"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Category Pills */}
            <div className="mb-10">
              <CategoryPills selected={category} onSelect={setCategory} categoryCounts={categoryCounts} />
            </div>

            {/* Region Filter & Results count */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
              <div className="flex items-center gap-3">
                <select
                  value={region || 'all'}
                  onChange={e => setRegion(e.target.value === 'all' ? null : e.target.value)}
                  className="px-4 py-2.5 rounded-none border border-foreground/10 bg-white text-sm focus:outline-none focus:border-foreground/30"
                >
                  <option value="all">Toutes les régions</option>
                  {REGIONS.map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-muted-foreground hover:text-foreground rounded-none"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Réinitialiser
                  </Button>
                )}
              </div>

              {!isLoading && (
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{vendors.length}</span> professionnel{vendors.length > 1 ? 's' : ''}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCarnetModal(true)}
                    className="rounded-none border-foreground/20 hover:bg-foreground/5"
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Sélection sur-mesure
                  </Button>
                </div>
              )}
            </div>

            {/* Vendors Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : vendors.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground mb-6">
                  Aucun professionnel trouvé avec ces critères
                </p>
                <Button variant="outline" onClick={handleReset} className="rounded-none">
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12"
                >
                  {currentVendors.map((vendor, index) => (
                    <motion.div
                      key={vendor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      className="editorial-card bg-white"
                    >
                      <VendorCard
                        vendor={vendor}
                        onClick={() => navigate(`/prestataire/${vendor.slug || vendor.id}`)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination - refined */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="rounded-none border-foreground/20"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              className={`rounded-none min-w-[40px] ${currentPage === page ? "" : "border-foreground/20"}`}
                              style={currentPage === page ? { backgroundColor: 'hsl(0, 0%, 15%)' } : {}}
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
                      className="rounded-none border-foreground/20"
                    >
                      <ChevronRight className="h-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <CarnetAdressesModal isOpen={showCarnetModal} onClose={() => setShowCarnetModal(false)} />
    </CartProvider>
  );
};

export default ProfessionnelsMariable;
