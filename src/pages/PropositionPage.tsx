import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PropositionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: customPage, isLoading, error } = useQuery({
    queryKey: ['proposition-page', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Slug manquant');
      
      const { data, error } = await supabase
        .from('custom_pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !customPage) {
    return (
      <>
        <Helmet>
          <title>Proposition non trouvée | Mariable</title>
        </Helmet>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-lg text-gray-600 mb-8">Proposition non trouvée</p>
              <a 
                href="/" 
                className="bg-wedding-olive text-white px-6 py-3 rounded-lg hover:bg-wedding-olive/90 transition-colors"
              >
                Retour à l'accueil
              </a>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{customPage.title} | Mariable</title>
        {customPage.description && (
          <meta name="description" content={customPage.description} />
        )}
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              {customPage.title}
            </h1>
            {customPage.description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {customPage.description}
              </p>
            )}
          </div>

          <div className="w-full">
            <div 
              className="iframe-container"
              dangerouslySetInnerHTML={{ __html: customPage.iframe_code }}
            />
          </div>
        </main>

        <Footer />
      </div>

      <style>{`
        .iframe-container iframe {
          width: 100% !important;
          min-height: 600px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background: transparent;
        }
        
        @media (max-width: 768px) {
          .iframe-container iframe {
            min-height: 400px !important;
          }
        }
      `}</style>
    </>
  );
};

export default PropositionPage;