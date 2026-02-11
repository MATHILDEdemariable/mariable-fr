import React from 'react';
import { ArrowRight } from 'lucide-react';

const PremiumConciergerie = () => {
  const scrollToForm = () => {
    const element = document.getElementById('carnet-adresses-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTools = () => {
    const element = document.getElementById('premium-tools-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
      title: "Sélection de prestataires",
      subtitle: "Recevez une liste personnalisée",
      cta: "DÉCOUVRIR",
      ctaAction: scrollToForm,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop",
      title: "Outils de planification",
      subtitle: "Checklist, budget, RSVP",
      cta: "VOIR LES OUTILS",
      ctaAction: scrollToTools,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=400&fit=crop",
      title: "Coordination Jour J",
      subtitle: "Application mobile incluse",
      cta: "EN SAVOIR PLUS",
      ctaAction: scrollToTools,
    },
  ];

  return (
    <section className="py-24 bg-editorial-beige">
      <div className="container mx-auto px-4">
        {/* Titre éditorial */}
        <header className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-editorial-noir mb-4 font-normal">
            Nos outils de planification <em>gratuits</em>
          </h2>
          <p className="text-editorial-noir/70 text-lg max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour organiser votre mariage sereinement
          </p>
        </header>

        {/* Carrousel horizontal style éditorial */}
        <div className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {services.map((service) => (
            <div 
              key={service.id}
              className="flex-shrink-0 w-[320px] md:w-[400px] snap-start group cursor-pointer"
              onClick={service.ctaAction}
            >
              {/* Image container */}
              <div className="relative overflow-hidden mb-6">
                <img 
                  src={service.image}
                  alt={service.title}
                  className="w-full h-[280px] md:h-[320px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              
              {/* Texte */}
              <div className="text-center">
                <h3 className="font-serif text-xl md:text-2xl text-editorial-noir mb-2 font-normal">
                  {service.title}
                </h3>
                <p className="text-editorial-noir/60 text-sm mb-4">
                  {service.subtitle}
                </p>
                {/* CTA bouton vert rectangulaire */}
                <button className="bg-editorial-olive hover:bg-editorial-noir text-white px-8 py-3 text-xs tracking-widest uppercase transition-colors rounded-none">
                  {service.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumConciergerie;
