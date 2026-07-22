import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

interface BlogItem {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  meta_description: string | null;
  subtitle: string | null;
  background_image_url: string | null;
}

const BlogCarouselEditorial: React.FC = () => {
  const { t } = useTranslation('refonteJuillet');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['refontejuillet-blog-carousel'],
    queryFn: async (): Promise<BlogItem[]> => {
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, slug, category, meta_description, subtitle, background_image_url')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(8);
      return (data ?? []) as BlogItem[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  return (
    <section className="bg-wedding-olive pt-16 pb-16 md:pb-20">
      <div className="mb-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-6 border-t border-white/25 pt-6">
            <p className="text-xs tracking-[0.25em] uppercase text-white/80">
              {t('blog.eyebrow')}
            </p>
            <div className="hidden md:flex items-center gap-2">
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
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-none w-[85vw] md:w-[300px] snap-start">
                <div className="aspect-[4/5] w-full bg-white/10 animate-pulse" />
                <div className="h-4 w-3/4 bg-white/10 mt-3" />
              </div>
            ))}

          {!isLoading &&
            posts?.map((post) => (
              <Link
                key={post.id}
                to={`/conseilsmariage/${post.slug}`}
                className="flex-none w-[85vw] md:w-[300px] snap-start text-left group"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/10">
                  {post.background_image_url ? (
                    <img
                      src={post.background_image_url}
                      alt={post.title}
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
                  {post.category && (
                    <p className="text-[10px] tracking-[0.2em] uppercase text-white/60">
                      {post.category}
                    </p>
                  )}
                  <p className="font-serif text-lg text-white mt-1 leading-snug group-hover:italic transition-all line-clamp-2">
                    {post.title}
                  </p>
                  <p className="text-sm text-white/75 mt-2 line-clamp-2">
                    {post.meta_description || post.subtitle}
                  </p>
                  <span className="inline-block mt-3 text-xs uppercase tracking-widest text-white/85 underline underline-offset-4 group-hover:text-white">
                    {t('blog.discover')}
                  </span>
                </div>
              </Link>
            ))}
        </div>

        <div className="container mx-auto px-4 md:px-8 mt-6 text-right">
          <Link
            to="/conseilsmariage"
            className="text-xs tracking-[0.2em] uppercase text-white hover:opacity-80 underline underline-offset-4"
          >
            {t('eshop.viewAll').replace('guides', 'articles')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogCarouselEditorial;
