import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock, ChevronLeft } from 'lucide-react';

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
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['published_blog_posts'],
        queryFn: fetchPublishedBlogPosts,
    });

    // Generate Schema.org structured data for blog
    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Conseils Mariage - Mariable",
        "description": "Découvrez nos conseils d'experts pour organiser votre mariage. Outils, planning, budget, prestataires - tout pour réussir votre jour J.",
        "url": "https://www.mariable.fr/conseilsmariage",
        "publisher": {
            "@type": "Organization",
            "name": "Mariable",
            "url": "https://www.mariable.fr"
        },
        "blogPost": posts?.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.meta_description || post.title,
            "url": `https://www.mariable.fr/conseilsmariage/${post.slug}`,
            "datePublished": post.published_at,
            "dateModified": post.updated_at,
            "author": {
                "@type": "Organization",
                "name": "Mariable"
            }
        })) || []
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getReadingTime = (content: string) => {
        if (!content) return 2;
        const wordsPerMinute = 200;
        const wordCount = content.split(' ').length;
        return Math.ceil(wordCount / wordsPerMinute);
    };

    if (isLoading) {
        return (
            <>
                <PremiumHeader />
                <div className="min-h-screen flex items-center justify-center">
                    <p>Chargement du blog...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <PremiumHeader />
                <div className="min-h-screen flex items-center justify-center">
                    <p>Erreur de chargement du blog.</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <SEO 
                title="Conseils mariage - Mariable"
                description="Découvrez nos conseils d'experts pour organiser votre mariage. Outils, planning, budget, prestataires - tout pour réussir votre jour J."
                keywords="conseils mariage, blog mariage, organisation mariage, planning mariage, budget mariage, prestataires mariage, coordination jour j"
                canonical="/conseilsmariage"
            >
                <script type="application/ld+json">
                    {JSON.stringify(blogSchema)}
                </script>
            </SEO>
            
            <PremiumHeader />
            
            <main className="min-h-screen bg-gradient-to-b from-white to-wedding-cream/20">
                {/* Hero Section */}
                <section className="py-20 px-4">
                    <div className="container mx-auto max-w-4xl text-center">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/')}
                            className="mb-6 hover:bg-wedding-olive/10"
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Retour à l'accueil
                        </Button>
                        <h1 className="text-4xl md:text-5xl font-serif mb-6 text-wedding-black">
                            Conseils pour votre mariage
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            Découvrez nos conseils d'experts pour organiser votre mariage parfait
                        </p>
                        
                        {/* Filtre par catégorie */}
                        <div className="max-w-xs mx-auto">
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrer par catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les catégories</SelectItem>
                                    <SelectItem value="Planning">Planning</SelectItem>
                                    <SelectItem value="Budget">Budget</SelectItem>
                                    <SelectItem value="Prestataires">Prestataires</SelectItem>
                                    <SelectItem value="Décoration">Décoration</SelectItem>
                                    <SelectItem value="Tenue">Tenue</SelectItem>
                                    <SelectItem value="Réception">Réception</SelectItem>
                                    <SelectItem value="Coordination">Coordination</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </section>

                {/* Blog Posts Grid */}
                <section className="py-12 px-4">
                    <div className="container mx-auto max-w-6xl">
                        {posts && posts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {posts
                                        .filter(post => selectedCategory === 'all' || post.category === selectedCategory)
                                        .map(post => (
                                        <Card 
                                            key={post.id} 
                                            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white border-wedding-olive/10"
                                            onClick={() => navigate(`/conseilsmariage/${post.slug}`)}
                                        >
                                            {post.background_image_url && (
                                                <div className="aspect-video overflow-hidden rounded-t-lg">
                                                    <img 
                                                        src={post.background_image_url} 
                                                        alt={post.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {post.featured && (
                                                        <Badge variant="secondary" className="bg-wedding-olive text-white">
                                                            Featured
                                                        </Badge>
                                                    )}
                                                    {post.category && (
                                                        <Badge variant="outline" className="border-wedding-olive/30 text-wedding-olive">
                                                            {post.category}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <CardTitle className="font-serif text-xl text-wedding-black line-clamp-2">
                                                    {post.title}
                                                </CardTitle>
                                                {post.subtitle && (
                                                    <p className="text-muted-foreground text-sm line-clamp-2">
                                                        {post.subtitle}
                                                    </p>
                                                )}
                                            </CardHeader>
                                            
                                            <CardContent className="pt-0">
                                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {formatDate(post.published_at || post.created_at)}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            {getReadingTime(post.content || '')} min
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full border-wedding-olive text-wedding-olive hover:bg-wedding-olive hover:text-white"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/conseilsmariage/${post.slug}`);
                                                    }}
                                                >
                                                    Lire l'article
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                
                                {/* Message si aucun article dans la catégorie sélectionnée */}
                                {posts.filter(post => selectedCategory === 'all' || post.category === selectedCategory).length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground">Aucun article trouvé dans cette catégorie.</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-lg text-muted-foreground">
                                    Aucun article à afficher pour le moment.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Newsletter CTA */}
                <section className="py-12 px-4 bg-wedding-olive/5">
                    <div className="container mx-auto max-w-4xl text-center">
                        <h2 className="text-2xl md:text-3xl font-serif mb-6 text-wedding-black">
                            Restez informés
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Recevez nos derniers conseils et astuces pour organiser votre mariage parfait.
                        </p>
                        <Button 
                            onClick={() => navigate('/register')}
                            className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-8 py-3"
                        >
                            Rejoindre la communauté
                        </Button>
                    </div>
                </section>
            </main>
            
            <Footer />
        </>
    );
};

export default BlogPage;