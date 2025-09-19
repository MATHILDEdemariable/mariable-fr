import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CarnetAdressesModal from './CarnetAdressesModal';

const ThreeStepsSection = () => {
  const [isCarnetModalOpen, setIsCarnetModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
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
        className="py-20 md:py-32 bg-wedding-light relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-wedding-olive/20"></div>
          <div className="absolute top-40 right-20 w-20 h-20 rounded-full bg-wedding-gold/20"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full bg-wedding-olive/30"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl md:text-6xl font-serif mb-6 text-wedding-olive">
              Organisez votre mariage sans charge mentale
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              3 étapes simples pour un mariage parfait avec notre expertise premium ✨
            </p>
          </div>

          {/* Premium Cards Layout */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* CARD 1 - Préparation */}
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Card className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 bg-white border border-wedding-olive/20 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-wedding-olive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-wedding-olive"></div>
                
                <CardContent className="p-8 relative h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-wedding-olive flex items-center justify-center shadow-lg">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="px-4 py-1 rounded-full bg-wedding-cream border border-wedding-olive/20">
                      <span className="text-wedding-olive font-medium text-sm">1 - Préparation</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-serif mb-4 text-foreground group-hover:text-wedding-olive transition-colors">
                    Carnet d'adresses premium
                  </h3>
                  
                  <div className="relative mb-6 p-6 rounded-2xl bg-wedding-cream/50 border border-wedding-olive/10">
                    <div className="flex flex-wrap gap-2">
                      <div className="px-3 py-1 bg-wedding-olive text-white text-xs rounded-full">Châteaux</div>
                      <div className="px-3 py-1 bg-wedding-gold text-white text-xs rounded-full">Photographes</div>
                      <div className="px-3 py-1 bg-wedding-olive/70 text-white text-xs rounded-full">Traiteurs</div>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      Sélection vérifiée par nos experts 💎
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-grow">
                    Recevez notre carnet exclusif avec les meilleurs prestataires sélectionnés selon votre région et budget
                  </p>
                  
                  <Button 
                    onClick={() => setIsCarnetModalOpen(true)}
                    className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white group-hover:scale-105 transition-all duration-300"
                  >
                    Recevoir le carnet <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* CARD 2 - Organisation */}
            <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Card className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 bg-white border border-wedding-gold/20 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-wedding-gold"></div>
                
                <CardContent className="p-8 relative h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-wedding-gold flex items-center justify-center shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="px-4 py-1 rounded-full bg-wedding-cream border border-wedding-gold/20">
                      <span className="text-wedding-gold font-medium text-sm">2 - Organisation</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-serif mb-4 text-foreground group-hover:text-wedding-gold transition-colors">
                    Tableau de bord gratuit
                  </h3>
                  
                  <div className="relative mb-6 p-6 rounded-2xl bg-wedding-cream/30 border border-wedding-gold/10">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                        <div className="w-2 h-2 bg-wedding-gold rounded-full animate-pulse"></div>
                        <span className="text-xs text-muted-foreground">Checklist IA</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                        <div className="w-2 h-2 bg-wedding-olive rounded-full animate-pulse delay-100"></div>
                        <span className="text-xs text-muted-foreground">Budget Smart</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                        <div className="w-2 h-2 bg-wedding-gold rounded-full animate-pulse delay-200"></div>
                        <span className="text-xs text-muted-foreground">Invités Pro</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                        <div className="w-2 h-2 bg-wedding-olive rounded-full animate-pulse delay-300"></div>
                        <span className="text-xs text-muted-foreground">Suivi 360°</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-grow">
                    Accédez gratuitement à votre espace personnel avec tous les outils pour organiser votre mariage
                  </p>
                  
                  <Button asChild className="w-full bg-wedding-gold hover:bg-wedding-gold/90 text-white group-hover:scale-105 transition-all duration-300">
                    <Link to="/register">
                      Créer mon compte gratuit <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* CARD 3 - Coordination Jour J */}
            <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Card className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 bg-white border-2 border-wedding-olive h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-wedding-olive/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-wedding-olive to-wedding-gold"></div>
                
                <CardContent className="p-8 relative h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-wedding-olive flex items-center justify-center shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="px-4 py-1 rounded-full bg-wedding-olive text-white border border-wedding-olive/20">
                      <span className="font-medium text-sm">3 - Coordination Jour J</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-serif mb-4 text-foreground group-hover:text-wedding-olive transition-colors">
                    App sans téléchargement
                  </h3>
                  
                  <div className="relative mb-6 p-6 rounded-2xl bg-wedding-olive/10 border border-wedding-olive/20">
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted-foreground font-medium">Coordination Live</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-wedding-olive rounded-full animate-pulse delay-100"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-6 h-1 bg-wedding-olive rounded-full"></div>
                          <span className="text-muted-foreground">15:30 - Arrivée photographe</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-4 h-1 bg-wedding-gold rounded-full"></div>
                          <span className="text-muted-foreground">16:00 - Préparation mariés</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-grow">
                    Coordonnez votre équipe en temps réel sans app à télécharger. Innovation 100% web
                  </p>
                  
                  <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white group-hover:scale-105 transition-all duration-300">
                    <Link to="/coordination-jour-j">
                      Découvrir l'outil Jour J <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

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

export default ThreeStepsSection;