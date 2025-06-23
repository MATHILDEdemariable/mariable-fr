
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSearchAndFilters from '@/components/blog/BlogSearchAndFilters';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const fetchPublishedBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq('status', 'published')
    .order("order_index", { ascending: true })
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching published blog posts:", error);
    throw new Error(error.message);
  }

  return data || [];
};

const BlogPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['published_blog_posts'],
        queryFn: fetchPublishedBlogPosts,
    });

    // Extraire les catégories et tags disponibles
    const availableCategories = useMemo(() => {
        if (!posts) return [];
        const categories = posts
            .map(post => post.category)
            .filter(Boolean)
            .filter((category, index, arr) => arr.indexOf(category) === index);
        return categories;
    }, [posts]);

    const availableTags = useMemo(() => {
        if (!posts) return [];
        const allTags = posts
            .flatMap(post => {
                // Gérer le type Json[] de Supabase
                if (Array.isArray(post.tags)) {
                    return post.tags.filter(tag => typeof tag === 'string') as string[];
                }
                return [];
            })
            .filter(Boolean)
            .filter((tag, index, arr) => arr.indexOf(tag) === index);
        return allTags;
    }, [posts]);

    // Filtrer les posts selon les critères de recherche
    const filteredPosts = useMemo(() => {
        if (!posts) return [];
        
        return posts.filter(post => {
            // Filtre par terme de recherche
            const matchesSearch = !searchTerm || 
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (post.subtitle && post.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()));
            
            // Filtre par catégorie
            const matchesCategory = !selectedCategory || post.category === selectedCategory;
            
            // Filtre par tag - gérer le type Json[]
            const matchesTag = !selectedTag || 
                (Array.isArray(post.tags) && 
                 post.tags.some(tag => typeof tag === 'string' && tag === selectedTag));
            
            return matchesSearch && matchesCategory && matchesTag;
        });
    }, [posts, searchTerm, selectedCategory, selectedTag]);

    if (isLoading) {
        return <div className="h-screen w-screen flex items-center justify-center">Chargement du blog...</div>
    }

    if (error) {
        return <div className="h-screen w-screen flex items-center justify-center">Erreur de chargement du blog.</div>
    }

    return (
        <>
            <Header />
            <BlogSearchAndFilters
                onSearchChange={setSearchTerm}
                onCategoryFilter={setSelectedCategory}
                onTagFilter={setSelectedTag}
                selectedCategory={selectedCategory}
                selectedTag={selectedTag}
                availableCategories={availableCategories}
                availableTags={availableTags}
                searchTerm={searchTerm}
            />
            <main className="h-screen w-full snap-y snap-mandatory overflow-y-scroll overflow-x-hidden" style={{ paddingTop: '120px' }}>
                {filteredPosts && filteredPosts.length > 0 ? (
                    filteredPosts.map(post => <BlogPostCard key={post.id} post={post} />)
                ) : (
                    <div className="h-screen w-screen flex items-center justify-center snap-start">
                        <div className="text-center">
                            <p className="text-xl mb-4">
                                {searchTerm || selectedCategory || selectedTag 
                                    ? "Aucun article ne correspond à vos critères de recherche." 
                                    : "Aucun article à afficher pour le moment."
                                }
                            </p>
                            {(searchTerm || selectedCategory || selectedTag) && (
                                <Button 
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory(null);
                                        setSelectedTag(null);
                                    }}
                                    variant="outline"
                                >
                                    Effacer les filtres
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
};

export default BlogPage;
