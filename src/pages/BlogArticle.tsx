
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // PostgREST error for "exact one row" violation
        console.warn(`No blog post found for slug: ${slug}`);
        return null;
    }
    console.error('Error fetching blog post:', error);
    throw new Error(error.message);
  }

  return data;
};

const BlogArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog_post', slug],
    queryFn: () => fetchBlogPostBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center">Chargement de l'article...</div>;
  }

  if (error || !post) {
    return (
        <>
            <PremiumHeader />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-20 px-4">
                <h1 className="text-4xl font-bold mb-4">Article non trouvé</h1>
                <p className="text-xl mb-8">Désolé, l'article que vous cherchez n'existe pas ou a été déplacé.</p>
                <Link to="/conseilsmariage">
                    <Button>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour au blog
                    </Button>
                </Link>
            </main>
            <Footer />
        </>
    );
  }
  
  const h1Title = post.h1_title || post.title;
  const metaTitle = post.meta_title || post.title;
  const metaDescription = post.meta_description || post.subtitle;

  return (
    <>
      <SEO 
        title={metaTitle}
        description={metaDescription || undefined}
        image={post.background_image_url || undefined}
        canonical={`/conseilsmariage/${post.slug}`}
      >
        <script type="application/ld+json">{`
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": "${h1Title}",
              "name": "${metaTitle}",
              "description": "${metaDescription || ''}",
              "image": "${post.background_image_url || ''}",
              "datePublished": "${post.published_at || new Date().toISOString()}",
              "dateModified": "${post.updated_at || new Date().toISOString()}",
              "author": {
                "@type": "Organization",
                "name": "Mariable"
              },
               "publisher": {
                "@type": "Organization",
                "name": "Mariable",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.mariable.fr/lovable-uploads/c1b39e22-fe32-4dc7-8f94-fbb929ae43fa.png"
                }
              }
            }
        `}</script>
      </SEO>
      <PremiumHeader />
      <main className="flex-grow bg-gray-50/50">
        <article className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
            {post.background_image_url && (
                <div className="mb-8">
                    <img 
                        src={post.background_image_url} 
                        alt={h1Title}
                        className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
                    />
                </div>
            )}
            <div className="mb-8 text-center bg-white p-8 rounded-lg shadow-sm">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{h1Title}</h1>
                {post.subtitle && <p className="text-xl md:text-2xl text-gray-600">{post.subtitle}</p>}
                {post.published_at && <p className="text-sm text-gray-500 mt-4">Publié le {new Date(post.published_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
            </div>

            <div 
                className="bg-white p-8 rounded-lg shadow-sm prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-12 text-center">
                <Link to="/conseilsmariage">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour à tous les articles
                    </Button>
                </Link>
            </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default BlogArticlePage;
