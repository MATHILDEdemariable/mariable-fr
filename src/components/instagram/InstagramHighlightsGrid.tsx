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
          "flex gap-3 md:gap-4 pb-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide",
          highlights.length <= 4 ? "md:justify-center" : ""
        )}>
          {highlights.map((h) => (
            <a
              key={h.id}
              href={h.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-[180px] md:w-[220px] flex-shrink-0 snap-center"
            >
              <div className="relative aspect-square overflow-hidden bg-editorial-noir/5">
                <img
                  src={h.image_url}
                  alt={h.caption || `Post Instagram ${h.prestataire?.nom || ''}`.trim()}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-editorial-noir/0 group-hover:bg-editorial-noir/20 transition-colors flex items-center justify-center">
                  <Instagram className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                </div>
              </div>

              {h.caption && (
                <h3 className="mt-3 font-serif text-[13px] md:text-sm leading-snug text-editorial-noir line-clamp-2">
                  {h.caption}
                </h3>
              )}

              {h.prestataire?.slug ? (
                <Link
                  to={`/prestataire/${h.prestataire.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 inline-block text-[10px] uppercase tracking-[0.2em] text-premium-sage hover:underline"
                >
                  {h.prestataire.nom}
                </Link>
              ) : h.prestataire?.nom ? (
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-editorial-noir/50">
                  {h.prestataire.nom}
                </p>
              ) : null}
            </a>
          ))}

        </div>
      </div>
    </section>
  );
};

export default InstagramHighlightsGrid;
