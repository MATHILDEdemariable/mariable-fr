import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VideoBackground from '@/components/VideoBackground';

const PremiumHeroSection = () => {
  const navigate = useNavigate();
  const [weddingDate, setWeddingDate] = useState('');

  const handleGetStarted = () => {
    if (weddingDate) {
      navigate(`/register?date=${weddingDate}`);
    } else {
      navigate('/register');
    }
  };

  return (
    <VideoBackground 
      videoUrl="https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos/freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4" 
      className="h-screen flex items-center justify-center"
    >
      {/* Overlay noir plus prononcé pour effet éditorial */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      
      <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
        {/* Titre principal en serif */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-6 leading-tight tracking-tight">
          La façon simple d'organiser
          <br />
          <em className="font-normal">votre mariage</em>
        </h1>
        
        {/* Sous-titre épuré */}
        <p className="text-lg md:text-xl text-white/80 mb-12 font-light">
          Outils gratuits & recommandations personnalisées
        </p>
        
        {/* Input date + CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 max-w-xl mx-auto">
          <div className="relative w-full sm:w-auto">
            <input
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              placeholder="Date de votre mariage"
              className="w-full sm:w-64 px-6 py-4 bg-white/95 text-editorial-noir border-0 rounded-none focus:outline-none focus:ring-2 focus:ring-editorial-olive text-center font-sans placeholder:text-gray-500"
            />
          </div>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="w-full sm:w-auto bg-editorial-olive text-white hover:bg-editorial-noir px-10 py-6 text-base font-medium rounded-none shadow-none transition-colors"
          >
            Commencer <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {/* Lien connexion */}
        <p className="text-white/70 text-sm">
          Déjà un compte ?{' '}
          <button 
            onClick={() => navigate('/login')} 
            className="underline hover:text-white transition-colors"
          >
            Se connecter
          </button>
        </p>
      </div>
    </VideoBackground>
  );
};

export default PremiumHeroSection;
