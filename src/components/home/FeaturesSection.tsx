import React from 'react';
import { Lightbulb, Wrench, HeadphonesIcon } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Lightbulb,
      title: "Expertise incluse",
      description: "Les bonnes adresses et les bons outils d'un professionnel."
    },
    {
      icon: Wrench,
      title: "Autonomie complète",
      description: "Organisez tout à votre rythme, selon vos règles."
    },
    {
      icon: HeadphonesIcon,
      title: "Assistance à la demande",
      description: "Service client si vous en avez besoin. Pas de pression, pas de coût inutile."
    }
  ];

  return (
    <section id="features" className="py-8 md:py-12 bg-white">
      <div className="container px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-serif text-editorial-noir mb-2 md:mb-3">
            Le premier organisateur de mariage de poche
          </h2>
          <p className="text-editorial-noir/60 text-xs md:text-sm max-w-2xl mx-auto">
            Un outil en ligne pensé pour les couples qui veulent tout organiser eux-mêmes – sans stress, sans perte de temps, sans galère.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="feature-card p-4 bg-white border border-editorial-noir/10">
              <div className="w-10 h-10 bg-editorial-olive/10 flex items-center justify-center mb-3">
                <feature.icon className="w-5 h-5 text-editorial-olive" />
              </div>
              <h3 className="text-base md:text-lg font-serif text-editorial-noir mb-2">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm text-editorial-noir/60">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
