
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoBackground from '@/components/VideoBackground';

const HeroSection = () => {
  return (
    <VideoBackground 
      youtubeId="M35zhoLNWMI" 
      className="min-h-screen flex items-center"
    >
      <div className="container mx-auto px-4 py-16 md:py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 max-w-4xl animate-fade-in">
          Profitez pleinement de votre mariage.
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl animate-fade-in">
          Organisez-le facilement, vous-même.
        </p>
        
        <div className="mb-10">
          <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <Link to="/register">
              Organisez mieux, profitez plus. <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-white/80 max-w-xl mx-auto">
          <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
            <span className="text-3xl font-bold text-white">+500</span>
            <span>Prestataires référencés</span>
          </div>
          
          <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
            <span className="text-3xl font-bold text-white">200+</span>
            <span>Mariages organisés</span>
          </div>
          
          <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
            <span className="text-3xl font-bold text-white">92%</span>
            <span>Clients satisfaits</span>
          </div>
        </div>
      </div>
    </VideoBackground>
  );
};

export default HeroSection;
