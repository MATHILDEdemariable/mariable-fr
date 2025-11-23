import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VideoBackground from '@/components/VideoBackground';
const PremiumHeroSection = () => {
  const navigate = useNavigate();
  const handleDiscover = () => {
    navigate('/register');
  };
  const scrollToCarnetSection = () => {
    const carnetSection = document.querySelector('#carnet-adresses-section');
    if (carnetSection) {
      carnetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return <VideoBackground videoUrl="https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos//freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4" className="h-screen flex items-center justify-center">
      <div className="hero-overlay absolute inset-0 z-10" />
      
      <div className="relative z-20 text-center max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-white mb-6 leading-tight md:text-4xl lg:text-5xl">
          Le plus beau jour de votre vie.
          <br />
          Sans charge mentale.
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 font-light leading-relaxed">
          Trouvez vos prestataires • Organisez tout • Profitez du Jour-J
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            onClick={scrollToCarnetSection} 
            className="btn-primary px-8 py-4 text-lg ripple font-semibold text-slate-50"
          >
            Recevez votre sélection gratuite <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => {
              const processSection = document.querySelector('#three-steps-section');
              if (processSection) {
                processSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
          >
            Voir comment ça marche
          </Button>
        </div>

      </div>
    </VideoBackground>;
};
export default PremiumHeroSection;