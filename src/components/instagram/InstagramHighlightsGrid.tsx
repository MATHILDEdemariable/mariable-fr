import { Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInstagramHighlights } from '@/hooks/useInstagramHighlights';

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
}: Props) => {
  const { data: highlights = [], isLoading } = useInstagramHighlights(context);

  if (isLoading || highlights.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-editorial-beige/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-premium-sage mb-3">{eyebrow}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-editorial-noir">{title}</h2>
          <p className="mt-3 text-sm text-editorial-noir/60 italic">
            Cliquez sur une image pour découvrir le post Instagram
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
          {highlights.map((h) => (
            <a
              key={h.id}
              href={h.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden bg-editorial-noir/5"
            >
              <img
                src={h.image_url}
                alt={h.caption || `Post Instagram ${h.prestataire?.nom || ''}`.trim()}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-editorial-noir/0 group-hover:bg-editorial-noir/40 transition-colors flex items-center justify-center">
                <Instagram className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {h.prestataire?.slug && (
                <Link
                  to={`/prestataire/${h.prestataire.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-0 left-0 right-0 bg-white/90 text-editorial-noir text-[10px] uppercase tracking-wider py-1.5 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity truncate"
                >
                  {h.prestataire.nom}
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
