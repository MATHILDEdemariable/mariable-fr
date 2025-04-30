
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CallToActionSection = () => {
  return (
    <section id="contact" className="py-8 md:py-12 bg-white text-wedding-black">
      <div className="container text-center px-4">
        <h2 className="text-base md:text-lg font-serif mb-3 md:mb-4">
          Prêt à révolutionner l'organisation de votre mariage ?
        </h2>
        <Button 
          size="lg" 
          className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
          asChild
        >
          <Link to="/register">
            Oui je le veux <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CallToActionSection;
