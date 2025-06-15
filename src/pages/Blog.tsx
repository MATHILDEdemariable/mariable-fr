
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';
import BlogPostCard from '@/components/blog/BlogPostCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['published_blog_posts'],
        queryFn: fetchPublishedBlogPosts,
    });

    if (isLoading) {
        return <div className="h-screen w-screen flex items-center justify-center">Chargement du blog...</div>
    }

    if (error) {
        return <div className="h-screen w-screen flex items-center justify-center">Erreur de chargement du blog.</div>
    }

    return (
        <>
            <Header />
            <main className="h-screen w-full snap-y snap-mandatory overflow-y-scroll overflow-x-hidden">
                {posts && posts.length > 0 ? (
                    posts.map(post => <BlogPostCard key={post.id} post={post} />)
                ) : (
                    <div className="h-screen w-screen flex items-center justify-center snap-start">
                        <p>Aucun article à afficher pour le moment.</p>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
};

export default BlogPage;
