
import React from 'react';
import { Calendar, MapPin, Heart } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section id="features" className="py-8 md:py-12 bg-white">
      <div className="container px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-serif mb-2 md:mb-3">
            Transformez l'organisation du mariage en une expérience simple, rapide & agréable
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-2xl mx-auto">
            Gardez la main sur votre grand jour
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          <div className="feature-card p-4">
            <div className="w-10 h-10 bg-wedding-light border border-wedding-olive-border rounded-full flex items-center justify-center mb-3">
              <Calendar className="text-gray-700 h-5 w-5" />
            </div>
            <h3 className="text-base md:text-lg font-serif mb-2">Gain de temps</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Une solution qui centralise les démarches pour trouver, comparer, réserver et coordonner les meilleurs prestataires.
            </p>
          </div>
          
          <div className="feature-card p-4">
            <div className="w-10 h-10 bg-wedding-light border border-wedding-olive-border rounded-full flex items-center justify-center mb-3">
              <MapPin className="text-gray-700 h-5 w-5" />
            </div>
            <h3 className="text-base md:text-lg font-serif mb-2">Garantie des bons choix de prestataires</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Des experts triés sur le volet pour votre sérénité
            </p>
          </div>
          
          <div className="feature-card p-4">
            <div className="w-10 h-10 bg-wedding-light border border-wedding-olive-border rounded-full flex items-center justify-center mb-3">
              <Heart className="text-gray-700 h-5 w-5" />
            </div>
            <h3 className="text-base md:text-lg font-serif mb-2">Réduction de la charge mentale</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Gérez tout au même endroit, sans stress ni oubli
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
