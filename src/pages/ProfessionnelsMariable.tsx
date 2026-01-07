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

// Hero Section with background image
const HeroSection = ({
  onScrollToResults,
  isLoggedIn
}: {
  onScrollToResults: () => void;
  isLoggedIn: boolean;
}) => <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
    {/* Background Image */}
    <div className="absolute inset-0 bg-cover bg-center" style={{
    backgroundImage: "url('https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/visuels/mariablestore.png')"
  }} />
    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/50" />
    
    <div className="relative z-10 text-center text-white px-4 py-12">
      <motion.h1 initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }} className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">Organisez facilement votre mariage</motion.h1>
      
      <motion.p initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6,
      delay: 0.1
    }} className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white/90">Trouvez des prestataires parmi notre guide & utilisez les outils en ligne pour coordonner le jour-J</motion.p>

      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6,
      delay: 0.2
    }} className="flex flex-wrap justify-center gap-4">
        <Button size="lg" onClick={onScrollToResults} className="bg-editorial-noir text-white hover:bg-editorial-noir/80 px-8 py-6 text-lg rounded-none shadow-lg">
          Explorer les professionnels
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        
        {isLoggedIn && <Button size="lg" variant="outline" asChild className="border-white/70 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-none backdrop-blur-sm">
            <Link to="/dashboard">
              <LayoutDashboard className="mr-2 w-5 h-5" />
              Mes outils
            </Link>
          </Button>}
      </motion.div>
    </div>
  </section>;

// How It Works Section - Compact version with uniform design
const HowItWorksSection = () => {
  const steps = [{
    step: "1",
    icon: <Plus className="w-5 h-5" />,
    title: "Ajoutez au panier",
    description: "Pas trouvé ? Cliquez 'Sélection personnalisée'"
  }, {
    step: "2",
    icon: <MessageCircle className="w-5 h-5" />,
    title: "Contactez via la plateforme",
    description: "Obtenez l'avantage Mariable (remise ou cadeau)"
  }, {
    step: "3",
    icon: <CalendarCheck className="w-5 h-5" />,
    title: "Réservez & envoyez le devis",
    description: "Validez et envoyez pour recevoir l'avantage"
  }];
  return <section className="py-8 bg-white border-y border-border">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, i) => <div key={i} className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 bg-editorial-noir text-white flex items-center justify-center text-base font-bold flex-shrink-0">
                {item.step}
              </div>
              <div className="flex-1 min-h-[60px]">
                <p className="font-semibold text-foreground text-sm mb-1">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
              {i < steps.length - 1 && <ArrowRight className="hidden md:block w-5 h-5 text-editorial-noir/50 flex-shrink-0 mt-2" />}
            </div>)}
        </div>
      </div>
    </section>;
};

// Category Pills Filter
const CategoryPills = ({
  selected,
  onSelect,
  categoryCounts
}: {
  selected: PrestataireCategorie | 'Tous';
  onSelect: (cat: PrestataireCategorie | 'Tous') => void;
  categoryCounts: Record<string, number> | undefined;
}) => {
  // Filter categories to only show those with vendors (or "Tous")
  const visibleCategories = CATEGORY_CONFIG.filter(cat => cat.value === 'Tous' || categoryCounts && (categoryCounts[cat.value] ?? 0) > 0);
  return <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-4">
        {visibleCategories.map(cat => <button key={cat.value} onClick={() => onSelect(cat.value)} className={`
              inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium
              transition-all duration-200 whitespace-nowrap flex-shrink-0
              ${selected === cat.value ? 'bg-editorial-noir text-white shadow-md' : 'bg-white border border-border text-muted-foreground hover:border-editorial-noir/50 hover:text-editorial-noir'}
            `}>
            {cat.icon}
            {cat.label}
          </button>)}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>;
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

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fetch category counts to hide empty categories
  const {
    data: categoryCounts
  } = useQuery({
    queryKey: ['category-counts'],
    queryFn: async () => {
      const {
        data
      } = await supabase.from('prestataires_rows').select('categorie').eq('visible', true).not('categorie', 'is', null);
      const counts: Record<string, number> = {};
      data?.forEach(p => {
        if (p.categorie) {
          counts[p.categorie] = (counts[p.categorie] || 0) + 1;
        }
      });
      return counts;
    },
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });
  const {
    data: vendorsData,
    isLoading
  } = useOptimizedVendors({
    filters: {
      search,
      category,
      region
    },
    debouncedSearch,
    initialLimit: 1000
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
    resultsRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const hasActiveFilters = search || category !== 'Tous' || region;
  return <>
      <Helmet>
        <title>Tous les Professionnels de Mariage | Mariable</title>
        <meta name="description" content="Découvrez notre sélection complète de prestataires de mariage : lieux de réception, traiteurs, photographes, DJ, fleuristes et plus encore. Trouvez les meilleurs professionnels pour votre mariage." />
        <meta name="keywords" content="prestataires mariage, professionnels mariage, lieu réception, traiteur mariage, photographe mariage" />
      </Helmet>

      <PremiumHeader />
      <CartIcon />
      
      <main className="min-h-screen bg-[#efeee9]">
        {/* Hero */}
        <HeroSection onScrollToResults={scrollToResults} isLoggedIn={isLoggedIn} />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Results Section */}
        <div ref={resultsRef} className="scroll-mt-20 py-12">
          <div className="container max-w-7xl mx-auto px-4">
            {/* Search Bar */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input type="text" placeholder="Rechercher une marque ou un prestataire..." value={search} onChange={e => setSearch(e.target.value)} className="pl-12 pr-12 py-6 text-lg border-2 border-border focus:border-editorial-noir bg-white shadow-sm" />
                {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>}
              </div>
            </motion.div>

            {/* Category Pills */}
            <div className="mb-8">
              <CategoryPills selected={category} onSelect={setCategory} categoryCounts={categoryCounts} />
            </div>

            {/* Region Filter (optional - compact) */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <select value={region || 'all'} onChange={e => setRegion(e.target.value === 'all' ? null : e.target.value)} className="px-4 py-2 border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-editorial-noir/20">
                  <option value="all">Toutes les régions</option>
                  {REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                </select>

                {hasActiveFilters && <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4 mr-1" />
                    Réinitialiser
                  </Button>}
              </div>

              {/* Results Counter + Recherche personnalisée */}
              {!isLoading && <div className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{vendors.length}</span> {vendors.length > 1 ? 'professionnels' : 'professionnel'}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setShowCarnetModal(true)} className="text-editorial-noir border-editorial-noir hover:bg-editorial-noir hover:text-white">
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Sélection personnalisée
                  </Button>
                </div>}
            </div>

            {/* Vendors Grid */}
            {isLoading ? <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-editorial-noir" />
              </div> : vendors.length === 0 ? <div className="text-center py-20 bg-white border border-border">
                <div className="w-16 h-16 bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  Aucun professionnel trouvé avec ces critères
                </p>
                <Button variant="outline" onClick={handleReset}>
                  Réinitialiser les filtres
                </Button>
              </div> : <>
                <motion.div initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              duration: 0.3
            }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                  {currentVendors.map((vendor, index) => <motion.div key={vendor.id} initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: index * 0.05,
                duration: 0.3
              }}>
                      <VendorCard vendor={vendor} onClick={() => navigate(`/prestataire/${vendor.slug || vendor.id}`)} />
                    </motion.div>)}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && <div className="flex justify-center items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex gap-1">
                      {Array.from({
                  length: totalPages
                }, (_, i) => i + 1).map(page => {
                  if (page === 1 || page === totalPages || page >= currentPage - 1 && page <= currentPage + 1) {
                    return <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" className={`min-w-[40px] ${currentPage === page ? "bg-editorial-noir hover:bg-editorial-noir/80" : ""}`} onClick={() => setCurrentPage(page)}>
                              {page}
                            </Button>;
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 py-2 text-muted-foreground">...</span>;
                  }
                  return null;
                })}
                    </div>

                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>}
              </>}
          </div>
        </div>
      </main>

      <Footer />
      <CarnetAdressesModal isOpen={showCarnetModal} onClose={() => setShowCarnetModal(false)} />
    </>;
};
export default ProfessionnelsMariable;