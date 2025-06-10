
import React from 'react';

const FeaturesSection = () => {
  return (
    <section id="features" className="py-8 md:py-12 bg-white">
      <div className="container px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-serif mb-2 md:mb-3">
            Le premier wedding planner de poche
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-2xl mx-auto">
            Un outil en ligne pensé pour les couples qui veulent tout organiser eux-mêmes – sans stress, sans perte de temps, sans galère.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          <div className="feature-card p-4">
            <div className="w-10 h-10 bg-wedding-black/10 rounded-full flex items-center justify-center mb-3">
              <span className="text-lg">🧠</span>
            </div>
            <h3 className="text-base md:text-lg font-serif mb-2">Expertise incluse</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Les bonnes adresses et les bons outils d'un professionnel.
            </p>
          </div>
          
          <div className="feature-card p-4">
            <div className="w-10 h-10 bg-wedding-black/10 rounded-full flex items-center justify-center mb-3">
              <span className="text-lg">🛠️</span>
            </div>
            <h3 className="text-base md:text-lg font-serif mb-2">Autonomie complète</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Organisez tout à votre rythme, selon vos règles.
            </p>
          </div>
          
          <div className="feature-card p-4">
            <div className="w-10 h-10 bg-wedding-black/10 rounded-full flex items-center justify-center mb-3">
              <span className="text-lg">🤝</span>
            </div>
            <h3 className="text-base md:text-lg font-serif mb-2">Assistance à la demande</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Service client si vous en avez besoin. Pas de pression, pas de coût inutile.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
