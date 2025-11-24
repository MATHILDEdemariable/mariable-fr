import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VideoBackground from '@/components/VideoBackground';

const PremiumHeroSection = () => {
  const navigate = useNavigate();

  return <VideoBackground videoUrl="https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos//freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4" className="h-screen flex items-center justify-center">
      <div className="relative z-20 text-center max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-white mb-6 leading-tight md:text-4xl lg:text-5xl drop-shadow-lg">
          Le plus beau jour de votre vie.
          <br />
          Sans charge mentale.
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 font-light leading-relaxed drop-shadow-md">
          Trouvez vos prestataires • Organisez tout • Profitez du Jour-J
        </p>
        
        <div className="flex justify-center mb-6">
          <Button 
            size="lg" 
            onClick={() => navigate('/register')}
            className="bg-premium-sage hover:bg-premium-sage-medium text-white px-12 py-6 text-lg font-semibold shadow-2xl hover:shadow-premium-sage/50 transform hover:scale-105 transition-all duration-300"
          >
            Créer mon compte gratuit <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        <p className="text-white/80 text-sm drop-shadow">
          ✓ Gratuit • ✓ Sans engagement • ✓ En 2 minutes
        </p>
      </div>
    </VideoBackground>;
};
export default PremiumHeroSection;