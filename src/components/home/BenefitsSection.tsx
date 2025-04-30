
import React from 'react';
import { Calendar, MapPin, Heart } from 'lucide-react';

const BenefitsSection = () => {
  return (
    <section id="features" className="py-8 md:py-12 bg-white">
      <div className="container px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-serif mb-2 md:mb-3">
            Le premier wedding planner digital qui centralise et simplifie les démarches
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-2xl mx-auto">
            Tout en vous laissant la liberté de garder la main sur votre grand jour
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          <div className="feature-card p-4">
            <div className="w-10 h-10 bg-wedding-black/10 rounded-full flex items-center justify-center mb-3">
              <Calendar className="text-wedding-black h-5 w-5" />
            </div>
            <h3 className="text-base md:text-lg font-serif mb-2">Gain de temps</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Une solution qui centralise les démarches pour trouver, comparer, réserver et coordonner les meilleurs prestataires.
            </p>
          </div>
          
          <div className="feature-card p-4">
            <div className="w-10 h-10 bg-wedding-black/10 rounded-full flex items-center justify-center mb-3">
              <MapPin className="text-wedding-black h-5 w-5" />
            </div>
            <h3 className="text-base md:text-lg font-serif mb-2">Recommandations personnalisées</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Accédez à un référencement de professionnels adaptés et reconnus pour leur expertise.
            </p>
          </div>
          
          <div className="feature-card p-4">
            <div className="w-10 h-10 bg-wedding-black/10 rounded-full flex items-center justify-center mb-3">
              <Heart className="text-wedding-black h-5 w-5" />
            </div>
            <h3 className="text-base md:text-lg font-serif mb-2">Sans stress</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Faites nous confiance et utilisez notre outil de planification pour ne rien oublier.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
