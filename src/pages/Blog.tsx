
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSearchAndFilters from '@/components/blog/BlogSearchAndFilters';

const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error(error.message);
  }

  return data || [];
};

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['blog_posts'],
    queryFn: fetchBlogPosts,
  });

  // Extract unique categories and tags
  const { availableCategories, availableTags } = useMemo(() => {
    if (!posts) return { availableCategories: [], availableTags: [] };

    const categories = new Set<string>();
    const tags = new Set<string>();

    posts.forEach(post => {
      if (post.category) {
        categories.add(post.category);
      }
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          if (typeof tag === 'string') {
            tags.add(tag);
          }
        });
      }
    });

    return {
      availableCategories: Array.from(categories).sort(),
      availableTags: Array.from(tags).sort()
    };
  }, [posts]);

  // Filter posts based on selected filters
  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    return posts.filter(post => {
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      const matchesTag = !selectedTag || (
        post.tags && 
        Array.isArray(post.tags) && 
        post.tags.some(tag => typeof tag === 'string' && tag === selectedTag)
      );

      return matchesCategory && matchesTag;
    });
  }, [posts, selectedCategory, selectedTag]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEO 
          title="Blog - Mariable"
          description="Découvrez nos conseils et inspirations pour votre mariage"
        />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Erreur de chargement</h1>
            <p className="text-muted-foreground">Impossible de charger les articles du blog.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Blog - Mariable"
        description="Découvrez nos conseils et inspirations pour votre mariage"
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-wedding-light via-white to-wedding-sage/20 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-wedding-olive mb-6">
              Blog Mariable
            </h1>
            <p className="text-lg text-wedding-dark/80 max-w-2xl mx-auto">
              Découvrez nos conseils d'experts, inspirations et tendances pour organiser le mariage de vos rêves
            </p>
          </div>
        </section>

        {/* Filtres */}
        <BlogSearchAndFilters
          onCategoryFilter={setSelectedCategory}
          onTagFilter={setSelectedTag}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          availableCategories={availableCategories}
          availableTags={availableTags}
        />

        {/* Articles */}
        <section className="py-12 pt-32">
          <div className="max-w-6xl mx-auto px-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-olive mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Chargement des articles...</p>
                </div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">
                  {selectedCategory || selectedTag ? 'Aucun article trouvé' : 'Aucun article publié'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {selectedCategory || selectedTag 
                    ? 'Essayez de modifier vos filtres pour voir plus d\'articles.'
                    : 'Revenez bientôt pour découvrir nos premiers articles !'
                  }
                </p>
                {(selectedCategory || selectedTag) && (
                  <div className="flex gap-2 justify-center">
                    {selectedCategory && (
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="px-4 py-2 bg-wedding-olive text-white rounded-md hover:bg-wedding-olive/90 transition-colors"
                      >
                        Effacer le filtre catégorie
                      </button>
                    )}
                    {selectedTag && (
                      <button
                        onClick={() => setSelectedTag(null)}
                        className="px-4 py-2 bg-wedding-olive text-white rounded-md hover:bg-wedding-olive/90 transition-colors"
                      >
                        Effacer le filtre thème
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
