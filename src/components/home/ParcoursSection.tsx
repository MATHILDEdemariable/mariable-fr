import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, CheckSquare, Smartphone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CarnetAdressesModal from './CarnetAdressesModal';

const ParcoursSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCarnetModalOpen, setIsCarnetModalOpen] = useState(false);
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

  return (
    <>
      <section 
        ref={sectionRef}
        className="py-16 md:py-24 bg-gradient-to-b from-white to-wedding-light relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-wedding-olive/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-wedding-gold/5 rounded-full blur-2xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 
              className={`text-3xl md:text-5xl font-serif text-wedding-dark mb-6 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Votre parcours mariage avec Mariable
            </h2>
            <p 
              className={`text-lg md:text-xl text-gray-700 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              De la recherche de prestataires à la coordination du jour J, nous vous accompagnons à chaque étape
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 - Trouver ses Prestataires */}
            <Card 
              className={`group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 shadow-lg bg-white/90 backdrop-blur-sm transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-wedding-olive to-wedding-olive/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-wedding-dark group-hover:text-wedding-olive transition-colors">
                  Sélection Mariable
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center px-6 pb-8">
                <p className="text-gray-700 mb-8 leading-relaxed">
                  Découvrez les meilleurs prestataires sélectionnés pour vous
                </p>
                <Button 
                  asChild
                  className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white group-hover:shadow-lg transition-all"
                >
                  <Link to="/services/prestataires">
                    Explorer les prestataires <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Card 2 - Organiser */}
            <Card 
              className={`group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 shadow-lg bg-white/90 backdrop-blur-sm transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-wedding-gold to-wedding-gold/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckSquare className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-wedding-dark group-hover:text-wedding-gold transition-colors">
                  Outils Gratuits
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center px-6 pb-8">
                <p className="text-gray-700 mb-8 leading-relaxed">
                  Planifiez chaque détail avec nos outils de gestion
                </p>
                <Button 
                  asChild
                  className="w-full bg-wedding-gold hover:bg-wedding-gold/90 text-white group-hover:shadow-lg transition-all"
                >
                  <Link to="/register">
                    Accéder aux outils <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Card 3 - Coordonner le Jour J */}
            <Card 
              className={`group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 shadow-lg bg-white/90 backdrop-blur-sm transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '700ms' }}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-wedding-olive to-wedding-gold rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-serif text-wedding-dark group-hover:text-wedding-olive transition-colors">
                  Application SANS TÉLÉCHARGEMENT
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center px-6 pb-8">
                <p className="text-gray-700 mb-8 leading-relaxed">
                  Planifier votre journée en 3 clics et partager facilement l'information à vos proches et prestataires
                </p>
                <Button 
                  asChild
                  className="w-full bg-gradient-to-r from-wedding-olive to-wedding-gold hover:from-wedding-olive/90 hover:to-wedding-gold/90 text-white group-hover:shadow-lg transition-all"
                >
                  <Link to="/coordination-jour-j">
                    Voir la démo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <CarnetAdressesModal 
        isOpen={isCarnetModalOpen} 
        onClose={() => setIsCarnetModalOpen(false)} 
      />
    </>
  );
};

export default ParcoursSection;