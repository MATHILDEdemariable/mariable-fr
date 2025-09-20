import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Wifi, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumCoordinationSection = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Application mobile",
      description: "Interface intuitive accessible partout"
    },
    {
      icon: Wifi,
      title: "Synchronisation temps réel",
      description: "Toute l'équipe connectée instantanément"
    },
    {
      icon: Users,
      title: "Coordination équipe",
      description: "Chaque intervenant sait exactement quoi faire"
    },
    {
      icon: Clock,
      title: "Planning automatisé",
      description: "Timing parfait pour chaque moment"
    }
  ];

  return (
    <section className="py-24 bg-premium-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-premium-sage-very-light text-premium-sage border-premium-sage-light">
            Notre innovation
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-premium-black mb-6">
            L'appli en ligne
            <br />
            <span className="bg-gradient-to-r from-premium-sage via-premium-sage-medium to-premium-sage-light bg-clip-text text-transparent">
              qui change tout
            </span>
          </h2>
          <p className="text-xl text-premium-charcoal max-w-3xl mx-auto">
            Première coordination qui unit digital et humain
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Mockup Application */}
          <div className="relative order-2 lg:order-1">
            <div className="app-mockup relative max-w-sm mx-auto">
              {/* Phone mockup */}
              <div className="bg-premium-black rounded-[3rem] p-2 shadow-2xl">
                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Screen content */}
                  <div className="relative h-[600px]">
                    {/* Status bar */}
                    <div className="flex justify-between items-center p-4 text-xs text-premium-charcoal">
                      <span>9:41</span>
                      <span>🔋 100%</span>
                    </div>
                    
                    {/* App header */}
                    <div className="bg-gradient-to-r from-premium-sage via-premium-sage-medium to-premium-sage-light text-white p-4">
                      <h3 className="font-bold text-lg">Coordination Jour J</h3>
                      <p className="text-white/80 text-sm">Mariage de Sarah & Thomas</p>
                    </div>
                    
                    {/* Timeline */}
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-semibold text-sm">14:00 - Arrivée invités</p>
                          <p className="text-xs text-gray-600">En cours ✓</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-semibold text-sm">15:30 - Cérémonie</p>
                          <p className="text-xs text-gray-600">Préparation en cours</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <div>
                          <p className="font-semibold text-sm">17:00 - Cocktail</p>
                          <p className="text-xs text-gray-600">À venir</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Live notifications */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white border border-premium-light rounded-lg p-3 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <p className="text-xs text-premium-charcoal">
                            <strong>Photographe:</strong> En position pour la cérémonie
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
                <Wifi className="h-6 w-6 text-premium-sage-medium" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg">
                <Users className="h-6 w-6 text-premium-sage" />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-8 order-1 lg:order-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 section-reveal stagger-item">
                <div className="p-3 bg-gradient-to-r from-premium-sage via-premium-sage-medium to-premium-sage-light rounded-xl flex-shrink-0">
                  <feature.icon className="feature-icon h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-premium-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-premium-charcoal">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/coordination-jour-j">
            <Button 
              size="lg"
              className="btn-primary text-white px-12 py-4 text-lg font-semibold ripple"
            >
              Découvrir la coordination
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PremiumCoordinationSection;