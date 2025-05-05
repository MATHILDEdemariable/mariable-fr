
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleConnexionClick = () => {
    navigate('/register');
  };

  return (
    <section id="contact" className="py-8 md:py-12 bg-white text-wedding-black">
      <div className="container text-center px-4">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-serif mb-3 md:mb-4">
          Prêt à révolutionner l'organisation de votre mariage ?
        </h2>
        <Button 
          size={isMobile ? "default" : "lg"} 
          className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-6 py-6 text-lg font-medium w-full sm:w-auto"
          onClick={handleConnexionClick}
        >
          Oui je le veux
        </Button>
      </div>
    </section>
  );
};

export default CallToAction;
