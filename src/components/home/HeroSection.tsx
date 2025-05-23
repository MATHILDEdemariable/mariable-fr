
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative bg-wedding-cream/20 overflow-hidden">
      <div className="container mx-auto px-4 py-20 md:py-28 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-wedding-olive mb-6 max-w-4xl">
          Dites oui à un mariage sans stress avec <span className="bg-clip-text text-transparent bg-gradient-to-r from-wedding-olive to-wedding-olive/80">Mariable</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl">
          avec une solution complète
        </p>
        
        <div className="mb-12">
          <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90">
            <Link to="/register">
              Découvrir <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-gray-500 max-w-xl mx-auto">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-wedding-olive">+500</span>
            <span>Prestataires référencés</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-wedding-olive">200+</span>
            <span>Mariages organisés</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-wedding-olive">92%</span>
            <span>Clients satisfaits</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
