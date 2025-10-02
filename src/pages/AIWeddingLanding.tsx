import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ConversationInterface from '@/components/ai-wedding/ConversationInterface';
import { Link } from 'react-router-dom';

const AIWeddingLanding: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Organisez votre mariage avec l'IA | Mariable</title>
        <meta 
          name="description" 
          content="Décrivez votre projet de mariage et recevez instantanément un plan personnalisé avec budget, planning et suggestions de prestataires." 
        />
        <meta 
          name="keywords" 
          content="wedding planner IA, organisation mariage en ligne, planning mariage automatique, budget mariage, conseils mariage"
        />
      </Helmet>

      <div className="min-h-screen bg-white">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-serif text-wedding-olive">
                Mariable
              </Link>
              <nav className="hidden md:flex gap-6 text-sm">
                <Link to="/landing1.0" className="text-gray-600 hover:text-wedding-olive">
                  Version classique
                </Link>
                <Link to="/selection" className="text-gray-600 hover:text-wedding-olive">
                  Prestataires
                </Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-wedding-olive">
                  Mes outils
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="text-sm text-gray-600 hover:text-wedding-olive"
              >
                Connexion
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-wedding-olive text-white rounded-lg text-sm hover:bg-wedding-olive/90"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </header>

        <main className="pt-16 h-screen">
          <ConversationInterface />
        </main>
      </div>
    </>
  );
};

export default AIWeddingLanding;