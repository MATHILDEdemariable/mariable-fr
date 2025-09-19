import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TestimonialsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      rating: 5,
      text: "Grâce à Mariable, nous avons pu organiser notre mariage sans stress. Les outils sont géniaux et l'accompagnement personnalisé nous a beaucoup aidés.",
      name: "Camille & Julien",
      location: "Mariage en Bourgogne, Juin 2025",
      delay: "300ms"
    },
    {
      rating: 5,
      text: "L'application Jour-J de Mariable est un vrai game-changer ! Tous nos prestataires et témoins savaient exactement quoi faire et quand. Parfait !",
      name: "Laura & Maxime", 
      location: "Mariage à Marseille, Juillet 2025",
      delay: "500ms"
    },
    {
      rating: 5,
      text: "Service client au top ! Mathilde répond rapidement et donne de précieux conseils. Notre budget a été maîtrisé grâce à leur suivi.",
      name: "Emma & Pierre",
      location: "MARIAGE A VENIR - MAI 2026",
      delay: "700ms"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-wedding-light to-white relative"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 
            className={`text-3xl md:text-5xl font-serif text-wedding-dark mb-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Prêt(e) à vivre une expérience unique pour votre mariage?
          </h2>
          <p 
            className={`text-lg md:text-xl text-gray-700 mb-6 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Plusieurs couples nous ont déjà fait confiance
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className={`bg-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border-0 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: testimonial.delay }}
            >
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </div>
                <div className="border-t pt-6">
                  <p className="font-semibold text-wedding-dark text-lg">{testimonial.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Final */}
        <div 
          className={`text-center transition-all duration-1000 delay-900 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Button 
            asChild 
            size="lg" 
            className="bg-wedding-olive hover:bg-wedding-olive/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-6 text-lg"
          >
            <Link to="/register">
              Créer mon compte gratuit <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;