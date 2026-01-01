import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumTestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah & Thomas",
      location: "Provence",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      text: "Mariable a transformé notre organisation de mariage. La sélection de prestataires était exceptionnelle.",
    },
    {
      id: 2,
      name: "Julie & Marc",
      location: "Paris",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      text: "La coordination le jour J était parfaite. Nous avons pu profiter pleinement de notre journée.",
    },
    {
      id: 3,
      name: "Emma & Pierre",
      location: "Lyon",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      text: "Les prestataires recommandés par Mariable étaient tous formidables. Exactement ce que nous cherchions.",
    },
  ];

  return (
    <section className="py-24 bg-editorial-beige">
      <div className="container mx-auto px-4">
        {/* Titre éditorial */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-editorial-noir mb-4 font-normal">
            Ils ont vécu <em>l'expérience Mariable</em>
          </h2>
          <p className="text-editorial-noir/70 text-lg max-w-2xl mx-auto">
            Découvrez les témoignages de couples qui ont fait confiance à notre plateforme
          </p>
        </div>

        {/* Grille de témoignages style magazine */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="bg-white p-8 border border-gray-200 hover:border-editorial-olive/30 transition-colors"
            >
              {/* Citation */}
              <blockquote className="font-serif text-lg md:text-xl text-editorial-noir leading-relaxed mb-8 italic">
                "{testimonial.text}"
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-12 h-12 rounded-full object-cover grayscale"
                />
                <div>
                  <p className="font-medium text-editorial-noir text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-editorial-noir/60 text-xs uppercase tracking-wide">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-editorial-olive hover:bg-editorial-noir text-white px-12 py-6 text-base font-medium rounded-none"
            >
              Créer mon compte gratuit <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-editorial-noir/60 mt-4">
            Gratuit • Sans engagement • En 2 minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default PremiumTestimonialsSection;
