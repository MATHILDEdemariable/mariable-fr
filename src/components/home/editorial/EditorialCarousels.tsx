import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useSelectionLock } from './SelectionLockModal';

interface VendorCard {
  id: string;
  nom: string;
  ville: string | null;
  regions: any;
  categorie: string | null;
  slug: string | null;
  photo?: string;
  description?: string | null;
}

const CAROUSEL_CATEGORIES: { key: string; label: string; category?: string; regionKey?: string; styleKey?: string }[] = [
  { key: 'region', label: 'Par région' },
  { key: 'envie', label: 'Par envie' },
  { key: 'categorie', label: 'Par catégorie' },
];

async function fetchVendorsByCategory(category: string, limit: number): Promise<VendorCard[]> {
  const { data, error } = await supabase
    .from('prestataires_rows')
    .select('id, nom, ville, regions, categorie, slug, description, partner, featured, prestataires_photos_preprod(url, principale, is_cover, ordre)')
    .eq('visible', true)
    .eq('categorie', category)
    .limit(24);

  if (error) {
    console.error('[EditorialCarousels] fetch error', category, error);
    return [];
  }

  const mapped = (data ?? []).map((row: any) => {
    const photos = row.prestataires_photos_preprod ?? [];
    const cover =
      photos.find((p: any) => p.is_cover)?.url ||
      photos.find((p: any) => p.principale)?.url ||
      photos[0]?.url;
    return {
      id: row.id,
      nom: row.nom,
      ville: row.ville,
      regions: row.regions,
      categorie: row.categorie,
      slug: row.slug,
      description: row.description,
      photo: cover,
      _priority: row.partner ? 2 : row.featured ? 1 : 0,
    };
  });

  return mapped
    .sort((a: any, b: any) => b._priority - a._priority)
    .slice(0, limit);
}

async function fetchMixedSelection(): Promise<VendorCard[]> {
  const [lieux, traiteurs, photographes] = await Promise.all([
    fetchVendorsByCategory('Lieu de réception', 6),
    fetchVendorsByCategory('Traiteur', 3),
    fetchVendorsByCategory('Photographe', 3),
  ]);
  return [...lieux, ...traiteurs, ...photographes];
}


const Carousel: React.FC<{ label: string; items: VendorCard[]; loading: boolean }> = ({
  label,
  items,
  loading,
}) => {
  const { t } = useTranslation('refonteJuillet');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { requestAccess } = useSelectionLock();

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  return (
    <div className="mb-16 md:mb-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-6 border-t border-white/25 pt-6">
          <p className="text-xs tracking-[0.25em] uppercase text-white/80">{label}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 border border-white/40 hover:border-white hover:bg-white hover:text-wedding-olive text-white transition-colors flex items-center justify-center"
              aria-label={t('carousels.prev')}
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.25} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 border border-white/40 hover:border-white hover:bg-white hover:text-wedding-olive text-white transition-colors flex items-center justify-center"
              aria-label={t('carousels.next')}
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.25} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 md:gap-6 px-4 md:px-8 pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-none w-[260px] md:w-[300px] snap-start">
              <div className="aspect-[4/5] w-full bg-white/10 animate-pulse" />
              <div className="h-4 w-3/4 bg-white/10 mt-3" />
            </div>
          ))}

        {!loading &&
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => requestAccess()}
              className="flex-none w-[260px] md:w-[300px] snap-start text-left group"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/10">
                {item.photo ? (
                  <img
                    src={item.photo}
                    alt={item.nom}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50 text-xs uppercase tracking-widest">
                    Sans image
                  </div>
                )}
              </div>
              <div className="mt-3">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/60">
                  {item.categorie ?? '—'}
                  {item.ville ? ` · ${item.ville}` : ''}
                </p>
                <p className="font-serif text-lg text-white mt-1 leading-snug group-hover:italic transition-all">
                  {item.nom}
                </p>
                <span className="inline-block mt-2 text-xs uppercase tracking-widest text-white/85 underline underline-offset-4 group-hover:text-white">
                  {t('carousels.discover')}
                </span>
              </div>
            </button>
          ))}
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-6 text-right">
        <button
          onClick={() => requestAccess('/professionnelsmariable')}
          className="text-xs tracking-[0.2em] uppercase text-white hover:opacity-80 underline underline-offset-4"
        >
          {t('carousels.viewAll')}
        </button>
      </div>
    </div>
  );
};

const EditorialCarousels: React.FC = () => {
  const { t } = useTranslation('refonteJuillet');
  const region = useQuery({ queryKey: ['editorial-vendors', 'region'], queryFn: () => fetchVendors('region'), staleTime: 5 * 60 * 1000 });

  return (
    <section className="bg-wedding-olive pt-16 pb-8">
      <Carousel label={t('carousels.label')} items={region.data ?? []} loading={region.isLoading} />
    </section>
  );
};

export default EditorialCarousels;
