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
        className="py-20 md:py-32 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--burgundy-light)) 50%, hsl(var(--turquoise-light)) 100%)'
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-[hsl(var(--burgundy-deep))] to-[hsl(var(--burgundy-glow))]"></div>
          <div className="absolute top-40 right-20 w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--violet-vivid))] to-[hsl(var(--violet-glow))]"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--turquoise-bright))] to-[hsl(var(--turquoise-glow))]"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl md:text-6xl font-serif mb-6">
              <span className="bg-gradient-to-r from-[hsl(var(--burgundy-deep))] via-[hsl(var(--violet-vivid))] to-[hsl(var(--turquoise-bright))] bg-clip-text text-transparent">
                3 étapes magiques
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Notre approche moderne et technologique pour créer votre mariage de rêve ✨
            </p>
          </div>

          {/* Staggered Cards Layout */}
          <div className="space-y-8 max-w-6xl mx-auto">
            
            {/* CARD 1 - Préparation (Left aligned) */}
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
              <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 max-w-md bg-white/95 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--burgundy-deep))] via-[hsl(var(--burgundy-glow))] to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--burgundy-deep))] to-[hsl(var(--burgundy-glow))]"></div>
                
                <CardContent className="p-8 relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--burgundy-deep))] to-[hsl(var(--burgundy-glow))] flex items-center justify-center shadow-lg">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="px-4 py-1 rounded-full bg-[hsl(var(--burgundy-light))] border border-[hsl(var(--burgundy-deep))/20]">
                      <span className="text-[hsl(var(--burgundy-deep))] font-medium text-sm">1 - Préparation</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-serif mb-4 text-foreground group-hover:text-[hsl(var(--burgundy-deep))] transition-colors">
                    Carnet d'adresses exclusif
                  </h3>
                  
                  {/* Creative visual element instead of mockup */}
                  <div className="relative mb-6 p-6 rounded-2xl bg-gradient-to-br from-[hsl(var(--burgundy-light))] to-white/50 border border-[hsl(var(--burgundy-deep))/10]">
                    <div className="flex flex-wrap gap-2">
                      <div className="px-3 py-1 bg-[hsl(var(--burgundy-deep))] text-white text-xs rounded-full">Châteaux</div>
                      <div className="px-3 py-1 bg-[hsl(var(--burgundy-glow))] text-white text-xs rounded-full">Photographes</div>
                      <div className="px-3 py-1 bg-[hsl(var(--burgundy-deep))]/70 text-white text-xs rounded-full">Traiteurs</div>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      Sélection premium par nos experts 💎
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    Recommandations personnalisées par région et budget, sélectionnées avec amour par nos experts
                  </p>
                  
                  <Button 
                    onClick={() => setIsCarnetModalOpen(true)}
                    className="w-full bg-gradient-to-r from-[hsl(var(--burgundy-deep))] to-[hsl(var(--burgundy-glow))] hover:shadow-[var(--shadow-burgundy)] text-white border-0 group-hover:scale-105 transition-all duration-300"
                  >
                    Recevoir le carnet <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* CARD 2 - Organisation (Right aligned) */}
            <div className={`flex justify-center md:justify-end transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}>
              <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 max-w-md bg-white/95 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--violet-vivid))] via-[hsl(var(--violet-glow))] to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--violet-vivid))] to-[hsl(var(--violet-glow))]"></div>
                
                <CardContent className="p-8 relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--violet-vivid))] to-[hsl(var(--violet-glow))] flex items-center justify-center shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="px-4 py-1 rounded-full bg-[hsl(var(--violet-light))] border border-[hsl(var(--violet-vivid))/20]">
                      <span className="text-[hsl(var(--violet-vivid))] font-medium text-sm">2 - Organisation</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-serif mb-4 text-foreground group-hover:text-[hsl(var(--violet-vivid))] transition-colors">
                    Outils magiques gratuits
                  </h3>
                  
                  {/* Dynamic visual representation */}
                  <div className="relative mb-6 p-6 rounded-2xl bg-gradient-to-br from-[hsl(var(--violet-light))] to-white/50 border border-[hsl(var(--violet-vivid))/10]">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                        <div className="w-2 h-2 bg-[hsl(var(--violet-vivid))] rounded-full animate-pulse"></div>
                        <span className="text-xs text-muted-foreground">Checklist IA</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                        <div className="w-2 h-2 bg-[hsl(var(--violet-glow))] rounded-full animate-pulse delay-100"></div>
                        <span className="text-xs text-muted-foreground">Budget Smart</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                        <div className="w-2 h-2 bg-[hsl(var(--violet-vivid))] rounded-full animate-pulse delay-200"></div>
                        <span className="text-xs text-muted-foreground">Invités Pro</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                        <div className="w-2 h-2 bg-[hsl(var(--violet-glow))] rounded-full animate-pulse delay-300"></div>
                        <span className="text-xs text-muted-foreground">Suivi 360°</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    Une suite d'outils intelligents pour organiser votre mariage comme une pro ✨
                  </p>
                  
                  <Button asChild className="w-full bg-gradient-to-r from-[hsl(var(--violet-vivid))] to-[hsl(var(--violet-glow))] hover:shadow-[var(--shadow-violet)] text-white border-0 group-hover:scale-105 transition-all duration-300">
                    <Link to="/register">
                      Créer mon compte gratuit <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* CARD 3 - Jour J (Center aligned) */}
            <div className={`flex justify-center transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
              <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 max-w-md bg-white/95 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--turquoise-bright))] via-[hsl(var(--turquoise-glow))] to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--turquoise-bright))] to-[hsl(var(--turquoise-glow))]"></div>
                
                <CardContent className="p-8 relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--turquoise-bright))] to-[hsl(var(--turquoise-glow))] flex items-center justify-center shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="px-4 py-1 rounded-full bg-[hsl(var(--turquoise-light))] border border-[hsl(var(--turquoise-bright))/20]">
                      <span className="text-[hsl(var(--turquoise-bright))] font-medium text-sm">3 - Jour J</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-serif mb-4 text-foreground group-hover:text-[hsl(var(--turquoise-bright))] transition-colors">
                    App révolutionnaire
                  </h3>
                  
                  {/* Futuristic coordination visual */}
                  <div className="relative mb-6 p-6 rounded-2xl bg-gradient-to-br from-[hsl(var(--turquoise-light))] to-white/50 border border-[hsl(var(--turquoise-bright))/10]">
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted-foreground">Coordination Live</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-[hsl(var(--turquoise-bright))] rounded-full animate-pulse delay-100"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-6 h-1 bg-[hsl(var(--turquoise-bright))] rounded-full"></div>
                          <span className="text-muted-foreground">15:30 - Arrivée photographe</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-4 h-1 bg-[hsl(var(--turquoise-glow))] rounded-full"></div>
                          <span className="text-muted-foreground">16:00 - Préparation mariés</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    Coordonnez votre équipe en temps réel avec notre app nouvelle génération 🚀
                  </p>
                  
                  <Button asChild className="w-full bg-gradient-to-r from-[hsl(var(--turquoise-bright))] to-[hsl(var(--turquoise-glow))] hover:shadow-[var(--shadow-turquoise)] text-white border-0 group-hover:scale-105 transition-all duration-300">
                    <Link to="/coordination-jour-j">
                      Découvrir l'app Jour J <ArrowRight className="w-4 h-4 ml-2" />
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