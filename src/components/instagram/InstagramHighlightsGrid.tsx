import { Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInstagramHighlights } from '@/hooks/useInstagramHighlights';
import { cn } from '@/lib/utils';

interface Props {
  context: 'blog' | 'professionnels' | 'homepage';
  title?: string;
  eyebrow?: string;
  limit?: number;
}

const InstagramHighlightsGrid = ({
  context,
  title = 'Sélection Instagram Mariable',
  eyebrow = 'Inspiration',
  limit,
}: Props) => {
  const { data: allHighlights = [], isLoading } = useInstagramHighlights(context);
  const highlights = limit ? allHighlights.slice(0, limit) : allHighlights;

  if (isLoading || highlights.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-editorial-beige/30 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-premium-sage mb-3">{eyebrow}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-editorial-noir">{title}</h2>
          <p className="mt-3 text-sm text-editorial-noir/60 italic">
            Cliquez sur une image pour découvrir le post Instagram
          </p>
        </div>

        <div className={cn(
          "flex gap-4 md:gap-6 pb-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide",
          highlights.length <= 4 ? "md:justify-center" : ""
        )}>
          {highlights.map((h) => (
            <a
              key={h.id}
              href={h.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block min-w-[280px] md:min-w-[320px] aspect-[4/5] overflow-hidden bg-editorial-noir/5 snap-center flex-shrink-0"
            >
              <img
                src={h.image_url}
                alt={h.caption || `Post Instagram ${h.prestataire?.nom || ''}`.trim()}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay with Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-editorial-noir/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <Instagram className="h-6 w-6 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0" />
                
                {h.caption && (
                  <h3 className="font-serif text-lg md:text-xl leading-tight mb-2 drop-shadow-sm">
                    {h.caption}
                  </h3>
                )}
                
                {h.prestataire?.nom && (
                  <p className="text-[10px] uppercase tracking-[0.2em] text-editorial-cream/80">
                    {h.prestataire.nom}
                  </p>
                )}
              </div>

              {h.prestataire?.slug && (
                <Link
                  to={`/prestataire/${h.prestataire.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-4 right-4 bg-white/90 text-editorial-noir text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Voir fiche
                </Link>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramHighlightsGrid;
