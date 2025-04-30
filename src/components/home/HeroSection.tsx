
import React from 'react';
import { Sparkles } from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center">
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
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 font-serif">
            Organisez le mariage <span className="text-wedding-cream">dont vous rêvez</span>
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
