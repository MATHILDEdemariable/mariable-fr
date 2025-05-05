
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-12 md:py-20 bg-wedding-cream/40">
      <div className="container px-4 text-center">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif mb-4 md:mb-6 max-w-4xl mx-auto">
          Des outils pour réinventer l'organisation de votre mariage
        </h1>
        <p className="text-xs md:text-sm max-w-2xl mx-auto mb-8 md:mb-10">
          Avec Mariable, vos préparatifs deviennent une expérience fluide, agréable & sans stress
        </p>
        
        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/test-formulaire')}
            className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-6 py-6 text-lg font-medium rounded-lg w-full sm:w-auto"
          >
            Découvrez votre style de mariage
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
