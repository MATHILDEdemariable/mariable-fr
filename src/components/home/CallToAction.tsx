
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="bg-wedding-cream py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
          Prêt à commencer l'organisation de votre mariage ?
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-10">
          Rejoignez Mariable dès aujourd'hui et découvrez comment nous pouvons transformer l'organisation de votre mariage en une expérience sereine et mémorable.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
          <Button 
            asChild
            size="lg" 
            className="bg-wedding-beige hover:bg-wedding-beige-dark text-black font-medium shadow-md"
          >
            <Link to="/register">
              Je découvre Mariable
            </Link>
          </Button>
          <Button 
            asChild
            size="lg" 
            variant="outline" 
            className="border-wedding-beige text-black hover:bg-wedding-beige/10"
          >
            <Link to="/paiement">
              Dites oui à la simplicité
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
