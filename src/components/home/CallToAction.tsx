
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="bg-wedding-cream py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-wedding-olive mb-4">
          Prêt à commencer l'organisation de votre mariage ?
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-10">
          Rejoignez Mariable dès aujourd'hui et découvrez comment nous pouvons transformer l'organisation de votre mariage en une expérience sereine et mémorable.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
          <Button 
            asChild
            size="lg" 
            className="bg-wedding-olive hover:bg-wedding-olive/80 text-white font-medium shadow-md"
          >
            <Link to="/register">
              Créer un compte dès maintenant
            </Link>
          </Button>
          <Button 
            asChild
            size="lg" 
            variant="outline" 
            className="border-wedding-olive text-wedding-olive hover:bg-wedding-olive/10"
          >
            <Link to="/contact/nous-contacter">
              Discuter avec un conseiller
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
