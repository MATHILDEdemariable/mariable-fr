
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

/**
 * Construit un schema FAQPage à partir du HTML de l'article.
 * On récupère chaque titre (h2/h3) qui se termine par « ? » et le texte
 * qui le suit jusqu'au titre suivant. Retourne null si moins de 2 paires.
 */
const buildFaqSchema = (html: string | null | undefined) => {
  if (!html || typeof window === 'undefined') return null;
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h2, h3'));
    const entries: Array<{ question: string; answer: string }> = [];

    headings.forEach((heading) => {
      const question = (heading.textContent || '').trim();
      if (!question.endsWith('?') || question.length < 10) return;

      const answerParts: string[] = [];
      let node = heading.nextElementSibling;
      while (node && !/^H[1-3]$/.test(node.tagName)) {
        const text = (node.textContent || '').trim();
        if (text) answerParts.push(text);
        node = node.nextElementSibling;
      }

      const answer = answerParts.join(' ').replace(/\s+/g, ' ').trim();
      if (answer.length > 40) {
        entries.push({ question, answer: answer.slice(0, 900) });
      }
    });

    if (entries.length < 2) return null;

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: entries.map((entry) => ({
        "@type": "Question",
        name: entry.question,
        acceptedAnswer: { "@type": "Answer", text: entry.answer },
      })),
    };
  } catch (error) {
    console.error('❌ buildFaqSchema failed:', error);
    return null;
  }
};


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

const fetchRelatedPosts = async (currentSlug: string): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }

  return data || [];
};

const BlogArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog_post', slug],
    queryFn: () => fetchBlogPostBySlug(slug!),
    enabled: !!slug,
  });

  const { data: relatedPosts = [] } = useQuery({
    queryKey: ['related_posts', slug],
    queryFn: () => fetchRelatedPosts(slug!),
    enabled: !!slug && !!post,
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

  const articleLang = (post as any).language || 'fr';
  const isEnglish = articleLang === 'en';

  const canonicalUrl = `https://www.mariable.fr/conseilsmariage/${post.slug}`;

  // Schema Article complet (JSON.stringify évite toute casse liée aux guillemets du contenu)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: h1Title,
    name: metaTitle,
    description: metaDescription || '',
    image: post.background_image_url || undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    inLanguage: isEnglish ? 'en' : 'fr-FR',
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    author: { "@type": "Organization", name: "Mariable", url: "https://www.mariable.fr" },
    publisher: {
      "@type": "Organization",
      name: "Mariable",
      logo: {
        "@type": "ImageObject",
        url: "https://www.mariable.fr/lovable-uploads/c1b39e22-fe32-4dc7-8f94-fbb929ae43fa.png",
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.mariable.fr" },
      { "@type": "ListItem", position: 2, name: "Conseils mariage", item: "https://www.mariable.fr/conseilsmariage" },
      { "@type": "ListItem", position: 3, name: h1Title, item: canonicalUrl },
    ],
  };

  // FAQPage généré depuis les titres interrogatifs de l'article (h2/h3 finissant par « ? »)
  const faqSchema = buildFaqSchema(post.content);

  // CTA contextuel choisi selon le sujet de l'article
  const contextualCta = (() => {
    const haystack = `${post.slug} ${post.title}`.toLowerCase();
    if (haystack.includes('budget') || haystack.includes('prix') || haystack.includes('coût')) {
      return {
        title: 'Estimez le budget de votre mariage',
        description: 'Utilisez le calculateur de budget Mariable pour répartir vos postes de dépenses et suivre vos devis.',
        label: 'Ouvrir le calculateur',
        href: '/services/budget',
      };
    }
    if (haystack.includes('checklist') || haystack.includes('planning') || haystack.includes('retroplanning') || haystack.includes('organiser')) {
      return {
        title: 'Votre checklist de mariage personnalisée',
        description: 'Générez un rétroplanning adapté à votre date et cochez vos préparatifs étape par étape.',
        label: 'Voir la checklist',
        href: '/checklist-mariage',
      };
    }
    if (haystack.includes('jour-j') || haystack.includes('jour j') || haystack.includes('coordination') || haystack.includes('témoin')) {
      return {
        title: 'Préparez le déroulé de votre jour J',
        description: 'Construisez votre planning heure par heure et partagez-le avec vos témoins et prestataires.',
        label: 'Créer mon planning jour J',
        href: '/coordination-jour-j',
      };
    }
    return {
      title: 'Trouvez vos prestataires de mariage',
      description: 'Lieux de réception, traiteurs, photographes : découvrez la sélection éditoriale de Mariable.',
      label: 'Explorer la sélection',
      href: '/selection',
    };
  })();



  return (
    <>
      {isEnglish && (
        <Helmet>
          <html lang="en" />
          <meta name="language" content="en" />
          <meta property="og:locale" content="en_US" />
        </Helmet>
      )}
      <SEO 
        title={metaTitle}
        description={metaDescription || undefined}
        image={post.background_image_url || undefined}
        canonical={`/conseilsmariage/${post.slug}`}
        ogType="article"
      >
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && (
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        )}
      </SEO>
      <PremiumHeader />
      <main className="flex-grow bg-gray-50/50 page-content">
        <article className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
            <div className="mb-6">
                <Link to="/conseilsmariage">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour aux articles
                    </Button>
                </Link>
            </div>

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

            <div className="bg-white p-8 rounded-lg shadow-sm">
                {post.custom_styles && (
                    <style dangerouslySetInnerHTML={{ __html: post.custom_styles }} />
                )}
                <div 
                    className={post.custom_styles ? "" : "prose prose-lg max-w-none"}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>

            {/* CTA contextuel : convertit le trafic éditorial vers l'outil correspondant */}
            <aside className="mt-10 bg-editorial-beige border border-wedding-olive/20 p-8 text-center">
                <p className="text-sm uppercase tracking-widest text-wedding-olive mb-3">
                    Passez à l'action
                </p>
                <h2 className="text-2xl font-serif text-editorial-noir mb-3">
                    {contextualCta.title}
                </h2>
                <p className="text-editorial-noir/70 max-w-xl mx-auto mb-6">
                    {contextualCta.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to={contextualCta.href}>
                        <Button className="rounded-none bg-wedding-olive hover:bg-wedding-olive/90 text-white uppercase tracking-wide">
                            {contextualCta.label}
                        </Button>
                    </Link>
                    <Link to="/register-gratuit">
                        <Button
                            variant="outline"
                            className="rounded-none border-editorial-noir text-editorial-noir uppercase tracking-wide"
                        >
                            Créer un compte gratuit
                        </Button>
                    </Link>
                </div>
            </aside>



            {relatedPosts.length > 0 && (
                <div className="mt-12 bg-white p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Autres articles qui pourraient vous intéresser</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {relatedPosts.map((relatedPost) => (
                            <Link 
                                key={relatedPost.id}
                                to={`/conseilsmariage/${relatedPost.slug}`}
                                className="group"
                            >
                                <div className="overflow-hidden rounded-lg border border-gray-200 transition-all hover:shadow-md">
                                    {relatedPost.background_image_url && (
                                        <div className="aspect-video overflow-hidden">
                                            <img 
                                                src={relatedPost.background_image_url} 
                                                alt={relatedPost.title}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                                            {relatedPost.title}
                                        </h3>
                                        {relatedPost.subtitle && (
                                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                                {relatedPost.subtitle}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </article>
      </main>
      <Footer />
    </>
  );
};

export default BlogArticlePage;
