import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import VideoBackground from '@/components/VideoBackground';
const PremiumHeroSection = () => {
  const handleDiscover = () => {
    const processSection = document.querySelector('#premium-process-section');
    if (processSection) {
      processSection.scrollIntoView({
        behavior: 'smooth'
      });
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
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 font-light leading-relaxed">Avec le premier wedding planner digital</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" onClick={handleDiscover} className="btn-primary text-white px-8 py-4 text-lg font-semibold ripple">
            Découvrir <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button size="lg" onClick={() => window.open('/register', '_self')} className="bg-white text-premium-black hover:bg-white/90 px-8 py-4 text-lg font-semibold ripple">
            <Play className="mr-2 h-5 w-5" />
            Organiser
          </Button>
        </div>

      </div>
    </VideoBackground>;
};
export default PremiumHeroSection;