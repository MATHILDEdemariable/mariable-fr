
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
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center h-full">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 max-w-4xl animate-fade-in">
          Profitez pleinement de votre mariage.
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl animate-fade-in">
          Organisez-le facilement, vous-même.
        </p>
        
        <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <Link to="/register">
            Organisez mieux, profitez plus. <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </VideoBackground>
  );
};

export default HeroSection;
