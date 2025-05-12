
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/search/SearchBar';

// Composant pour l'effet typing du titre principal avec une meilleure finition visuelle
const TypingEffect = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 75); // Vitesse de l'animation ajustée pour une meilleure lecture
      
      return () => clearTimeout(timer);
    } else {
      // Animation terminée, on supprime le curseur après un délai
      const finishTimer = setTimeout(() => {
        setIsTypingComplete(true);
      }, 500);
      
      return () => clearTimeout(finishTimer);
    }
  }, [currentIndex, text]);

  return (
    <span className={`inline-block ${isTypingComplete ? 'typing-complete' : 'border-r-2 border-wedding-cream animate-pulse'}`}>
      {displayedText}
    </span>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-[40vh] sm:min-h-[30vh] flex items-center">
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <img
          src="/lovable-uploads/977ff726-5f78-4cbc-bf10-dbf0bbd10ab7.png"
          alt="Couple de mariés célébrant leur union"
          className="absolute min-w-full min-h-full object-cover"
          style={{ objectPosition: "center center" }}
        />
        <div className="absolute inset-0 bg-wedding-black/40 backdrop-blur-[2px]"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-6 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-7 md:mb-8 font-serif pb-8">
            <TypingEffect text="Organisez le mariage parfait, simplement" />
          </h1>
          <p className="text-white/90 text-sm md:text-base mb-6 md:mb-8 max-w-2xl mx-auto">
            Trouvez les meilleurs prestataires
          </p>
          
          <div className="max-w-4xl mx-auto">
            <SearchBar />
            <div className="flex justify-center mt-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-wedding-cream/20 backdrop-blur-sm rounded-full">
                <Sparkles size={16} className="text-wedding-cream" />
                <span className="text-wedding-cream text-xs md:text-sm">
                  Nouveauté 2025 – MariableGPT, l'Intelligence amoureuse - <a 
                    href="https://chatgpt.com/g/g-67b5d482dd208191ae458763db0bb08c-mathilde-de-mariable" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="underline hover:text-white transition-colors"
                  >
                    voir une démo
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
