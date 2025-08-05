import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';

const CustomPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: customPage, isLoading, error } = useQuery({
    queryKey: ['custom-page', slug],
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
          <title>Page non trouvée | Mariable</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-lg text-gray-600 mb-8">Page non trouvée</p>
            <a 
              href="/" 
              className="bg-wedding-olive text-white px-6 py-3 rounded-lg hover:bg-wedding-olive/90 transition-colors"
            >
              Retour à l'accueil
            </a>
          </div>
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

      <div className="min-h-screen bg-background">
        {/* Header simple */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" className="text-xl font-serif font-bold text-wedding-olive">
              Mariable
            </a>
            <h1 className="text-lg font-medium">{customPage.title}</h1>
          </div>
        </header>

        {/* Contenu principal avec iframe */}
        <main className="container mx-auto px-4 py-8">
          {customPage.description && (
            <div className="mb-6">
              <p className="text-muted-foreground text-center">{customPage.description}</p>
            </div>
          )}

          {/* Container pour l'iframe avec styles responsives */}
          <div className="w-full">
            <div 
              className="iframe-container"
              dangerouslySetInnerHTML={{ __html: customPage.iframe_code }}
            />
          </div>
        </main>

        {/* Footer simple */}
        <footer className="border-t mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>© 2024 Mariable - Tous droits réservés</p>
          </div>
        </footer>
      </div>

      <style>{`
        .iframe-container iframe {
          width: 100% !important;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background: transparent;
        }
        
        @media (max-width: 768px) {
          .iframe-container iframe {
            height: 400px !important;
          }
        }
      `}</style>
    </>
  );
};

export default CustomPage;