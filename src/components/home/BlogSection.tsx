import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const BlogSection = () => {
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['homepage-blog'],
    queryFn: async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, slug, category, meta_description, subtitle, background_image_url')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);
      return data || [];
    }
  });

  return (
    <section className="py-16 md:py-24 px-4 md:px-10 bg-white">
      <div className="container max-w-6xl mx-auto">
        {/* Titre centré */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir">
            Conseils & inspirations mariage
          </h2>
        </motion.header>

        {/* Grid 3 colonnes */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#E8E8E8] to-[#D0D0D0] mb-4" />
                <div className="h-3 bg-[#E8E8E8] rounded w-20 mb-2" />
                <div className="h-5 bg-[#E8E8E8] rounded w-full mb-2" />
                <div className="h-4 bg-[#E8E8E8] rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onClick={() => navigate(`/conseilsmariage/${post.slug}`)}
                className="cursor-pointer group"
              >
                {/* Image 4:3 avec placeholder gradient */}
                <div className="aspect-[4/3] bg-gradient-to-br from-[#E8E8E8] to-[#D0D0D0] overflow-hidden mb-4">
                  {post.background_image_url && (
                    <img
                      src={post.background_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>

                {/* Catégorie */}
                {post.category && (
                  <span className="text-xs uppercase tracking-widest text-[#3D5A3D] font-medium">
                    {post.category}
                  </span>
                )}

                {/* Titre */}
                <h3 className="font-serif text-xl text-[#0F0F0F] mt-2 mb-2 group-hover:text-[#3D5A3D] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-[#666666] font-sans line-clamp-2">
                  {post.meta_description || post.subtitle}
                </p>
              </motion.article>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => navigate('/conseilsmariage')}
            className="border-[#0F0F0F] text-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white px-8 py-5 text-sm uppercase tracking-widest rounded-none"
          >
            Voir tous les articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
