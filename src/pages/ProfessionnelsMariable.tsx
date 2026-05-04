import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VendorCard from '@/components/vendors/VendorCard';
import { useOptimizedVendors } from '@/hooks/useOptimizedVendors';
import { useDebounce } from 'use-debounce';
import { Loader2, Search, X, ChevronLeft, ChevronRight, Camera, Utensils, Building2, Music, Flower2, Sparkles, Star, Palette, Gift, Car, Users, Calendar, ArrowDown } from 'lucide-react';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Database } from '@/integrations/supabase/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import CartIcon from '@/components/cart/CartIcon';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type PrestataireCategorie = Database['public']['Enums']['prestataire_categorie'];

const CATEGORY_CONFIG: { value: PrestataireCategorie | 'Tous'; labelKey: string; icon: React.ReactNode }[] = [
  { value: 'Tous', labelKey: 'Tous', icon: <Sparkles className="w-4 h-4" /> },
  { value: 'Lieu de réception', labelKey: 'Lieux', icon: <Building2 className="w-4 h-4" /> },
  { value: 'Photographe', labelKey: 'Photo', icon: <Camera className="w-4 h-4" /> },
  { value: 'Vidéaste', labelKey: 'Vidéo', icon: <Camera className="w-4 h-4" /> },
  { value: 'Traiteur', labelKey: 'Traiteur', icon: <Utensils className="w-4 h-4" /> },
  { value: 'DJ', labelKey: 'DJ', icon: <Music className="w-4 h-4" /> },
  { value: 'Fleuriste', labelKey: 'Fleuriste', icon: <Flower2 className="w-4 h-4" /> },
  { value: 'Décoration', labelKey: 'Déco', icon: <Palette className="w-4 h-4" /> },
  { value: 'Mise en beauté', labelKey: 'Beauté', icon: <Star className="w-4 h-4" /> },
  { value: 'Robe de mariée', labelKey: 'Robes', icon: <Gift className="w-4 h-4" /> },
  { value: 'Voiture', labelKey: 'Voiture', icon: <Car className="w-4 h-4" /> },
  { value: 'Invités', labelKey: 'Invités', icon: <Users className="w-4 h-4" /> },
  { value: 'Coordination', labelKey: 'Coordination', icon: <Calendar className="w-4 h-4" /> },
];

const ITEMS_PER_PAGE = 12;
const REGIONS = ['France entière', 'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne', 'Centre-Val de Loire', 'Corse', 'Grand Est', 'Hauts-de-France', 'Île-de-France', 'Normandie', 'Nouvelle-Aquitaine', 'Occitanie', 'Pays de la Loire', "Provence-Alpes-Côte d'Azur"];

// Editorial Hero — magazine style
const EditorialHero = ({ onScrollToResults }: { onScrollToResults: () => void }) => {
  const { t } = useTranslation('professionals');
  return (
  <section className="relative bg-editorial-beige/40 pt-12 pb-16 md:pt-20 md:pb-24 px-4 overflow-hidden">
    <div className="container max-w-5xl mx-auto text-center relative z-10">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-block text-xs uppercase tracking-[0.3em] text-premium-sage mb-6"
      >
        {t('hero.eyebrow')}
      </motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-serif text-4xl md:text-5xl lg:text-6xl text-editorial-noir leading-tight mb-6"
      >
        {t('hero.titleLine1')}<br />
        <em className="italic font-serif text-premium-sage">{t('hero.titleLine2')}</em>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-sans text-base md:text-lg text-editorial-noir/70 max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        {t('hero.subtitle')}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-center"
      >
        <button
          onClick={onScrollToResults}
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-editorial-noir border-b border-editorial-noir/40 pb-1 hover:border-editorial-noir transition-colors"
        >
          {t('hero.ctaSelection')}
          <ArrowDown className="w-4 h-4" />
        </button>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-premium-sage border-b border-premium-sage/40 pb-1 hover:border-premium-sage transition-colors"
        >
          {t('hero.ctaTools')}
        </Link>
      </motion.div>
    </div>
  </section>
  );
};



// Editorial Category Pills (underline style)
const CategoryPills = ({
  selected,
  onSelect,
  categoryCounts,
}: {
  selected: PrestataireCategorie | 'Tous';
  onSelect: (cat: PrestataireCategorie | 'Tous') => void;
  categoryCounts: Record<string, number> | undefined;
}) => {
  const { t } = useTranslation('professionals');
  const visibleCategories = CATEGORY_CONFIG.filter((cat) => cat.value === 'Tous' || (categoryCounts && (categoryCounts[cat.value] ?? 0) > 0));
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-1 md:gap-2 pb-4 justify-start md:justify-center">
        {visibleCategories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onSelect(cat.value)}
            className={`
              inline-flex items-center gap-2 px-3 md:px-5 py-3 text-xs md:text-sm uppercase tracking-wider
              transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2
              ${selected === cat.value
                ? 'border-premium-sage text-editorial-noir font-medium'
                : 'border-transparent text-editorial-noir/50 hover:text-editorial-noir hover:border-editorial-noir/20'}
            `}
          >
            {cat.icon}
            {t(`categories.${cat.labelKey}`)}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
};

const ProfessionnelsMariable = () => {
  const { t } = useTranslation('professionals');
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PrestataireCategorie | 'Tous'>('Tous');
  const [region, setRegion] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data: categoryCounts } = useQuery({
    queryKey: ['category-counts'],
    queryFn: async () => {
      const { data } = await supabase.from('prestataires_rows').select('categorie').eq('visible', true).not('categorie', 'is', null);
      const counts: Record<string, number> = {};
      data?.forEach((p) => {
        if (p.categorie) counts[p.categorie] = (counts[p.categorie] || 0) + 1;
      });
      return counts;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: vendorsData, isLoading } = useOptimizedVendors({
    filters: { search, category, region },
    debouncedSearch,
    initialLimit: 1000,
  });

  const vendors = vendorsData?.vendors || [];
  const totalPages = Math.ceil(vendors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentVendors = vendors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, category, region]);

  const handleReset = () => {
    setSearch('');
    setCategory('Tous');
    setRegion(null);
  };

  const scrollToResults = () => resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  const hasActiveFilters = search || category !== 'Tous' || region;

  return (
    <>
      <Helmet>
        <title>{t('seo.title')}</title>
        <meta name="description" content={t('seo.description')} />
        <meta name="keywords" content={t('seo.keywords')} />
      </Helmet>

      <PremiumHeader />
      <CartIcon />

      <main className="min-h-screen bg-white pt-16 md:pt-20">
        <EditorialHero onScrollToResults={scrollToResults} />
        

        {/* Results Section */}
        <div ref={resultsRef} className="scroll-mt-24 py-16 md:py-20 bg-white">
          <div className="container max-w-7xl mx-auto px-4">
            {/* Editorial section header */}
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.3em] text-premium-sage mb-3">{t('guide.eyebrow')}</p>
              <h2 className="font-serif text-3xl md:text-4xl text-editorial-noir">
                {t('guide.title')}
              </h2>
            </div>

            {/* Category Pills */}
            <div className="mb-8 border-b border-editorial-noir/10">
              <CategoryPills selected={category} onSelect={setCategory} categoryCounts={categoryCounts} />
            </div>

            {/* Search + Region row */}
            <div className="flex flex-col md:flex-row gap-3 mb-10 max-w-4xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-editorial-noir/40" />
                <Input
                  type="text"
                  placeholder={t('guide.searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-11 pr-10 py-5 text-sm bg-editorial-beige/30 border-0 border-b border-editorial-noir/20 focus:border-editorial-noir rounded-none focus-visible:ring-0"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-editorial-noir/50 hover:text-editorial-noir">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <select
                value={region || 'all'}
                onChange={(e) => setRegion(e.target.value === 'all' ? null : e.target.value)}
                className="px-4 py-3 bg-editorial-beige/30 border-0 border-b border-editorial-noir/20 text-sm focus:outline-none focus:border-editorial-noir rounded-none"
              >
                <option value="all">{t('guide.allRegions')}</option>
                {REGIONS.map((reg) => <option key={reg} value={reg}>{reg}</option>)}
              </select>
            </div>

            {/* Counter + reset */}
            {!isLoading && (
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-editorial-noir/10">
                <p className="text-sm text-editorial-noir/60 italic font-serif">
                  {vendors.length > 1
                    ? t('guide.countOther', { count: vendors.length })
                    : t('guide.countOne', { count: vendors.length })}
                </p>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs uppercase tracking-wider text-editorial-noir/60 hover:text-editorial-noir">
                    <X className="h-3 w-3 mr-1" />
                    {t('guide.reset')}
                  </Button>
                )}
              </div>
            )}

            {/* Vendors Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-premium-sage" />
              </div>
            ) : vendors.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-xl text-editorial-noir/70 italic mb-6">
                  {t('guide.emptyTitle')}
                </p>
                <Button variant="outline" onClick={handleReset} className="rounded-none border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white">
                  {t('guide.resetFilters')}
                </Button>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16"
                >
                  {currentVendors.map((vendor, index) => (
                    <motion.div
                      key={vendor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.3 }}
                    >
                      <VendorCard vendor={vendor} onClick={() => navigate(`/prestataire/${vendor.slug || vendor.id}`)} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-8 border-t border-editorial-noir/10">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="rounded-none border-editorial-noir/20">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? 'default' : 'outline'}
                              size="sm"
                              className={`min-w-[40px] rounded-none ${currentPage === page ? 'bg-editorial-noir hover:bg-editorial-noir/90' : 'border-editorial-noir/20'}`}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          );
                        }
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="px-2 py-2 text-editorial-noir/40">…</span>;
                        }
                        return null;
                      })}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="rounded-none border-editorial-noir/20">
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
