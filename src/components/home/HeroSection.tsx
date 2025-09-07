import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoBackground from '@/components/VideoBackground';
const HeroSection = () => {
  return <VideoBackground videoUrl="https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos//freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4" className="h-[65vh] flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-3 md:mb-4 animate-fade-in max-w-sm md:max-w-2xl mx-auto leading-tight">
            ✨ Le plus beau jour de votre vie. Sans charge mentale.
          </h1>
          
          <h2 className="text-base md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto animate-fade-in">
            Avec Mariable, arrivez à votre mariage comme un invité.
          </h2>
          
          <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full md:w-auto">
            <Link to="/register">
              👉 Créer mon compte gratuit <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </VideoBackground>;
};
export default HeroSection;