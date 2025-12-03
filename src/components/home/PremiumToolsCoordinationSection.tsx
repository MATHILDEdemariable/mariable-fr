import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckSquare, Calculator, Users, Home, FileText, Smartphone, Wifi, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumToolsCoordinationSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tools = [
    {
      icon: CheckSquare,
      title: "Checklist intelligente",
      description: "Planning personnalisé selon votre style",
    },
    {
      icon: Calculator,
      title: "Gestion budget",
      description: "Suivez vos dépenses en temps réel",
    },
    {
      icon: Users,
      title: "RSVP & plan de table",
      description: "Organisez vos invités facilement",
    },
    {
      icon: Home,
      title: "Gestion hébergements",
      description: "Réservez pour vos invités",
    },
    {
      icon: FileText,
      title: "Stockage documents",
      description: "Centralisez tous vos documents",
    },
    {
      icon: Smartphone,
      title: "Coordination Jour J",
      description: "Application mobile pour le grand jour",
    },
  ];

  const coordinationFeatures = [
    {
      icon: Smartphone,
      title: "Application mobile sans téléchargement",
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
      description: "Chaque intervenant sait quoi faire"
    },
    {
      icon: Clock,
      title: "Planning automatisé",
      description: "Timing parfait pour chaque moment"
    }
  ];

  return (
    <section className="py-24 bg-premium-base">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-premium-sage-very-light text-premium-sage border-premium-sage-light">
            Inclus gratuitement
          </Badge>
          <h2 className="text-4xl font-bold text-premium-black mb-6 md:text-5xl">
            Vos outils de planification
            <br />
            <span className="text-premium-sage">& coordination Jour J</span>
          </h2>
          <p className="text-xl text-premium-charcoal max-w-3xl mx-auto">
            Tout ce dont vous avez besoin pour organiser votre mariage et coordonner le jour J
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Tools Grid */}
          <div>
            <h3 className="text-2xl font-bold text-premium-black mb-6">
              Outils de planification
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {tools.map((tool, index) => (
                <Card
                  key={index}
                  className="group bg-white shadow-lg border-premium-light hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-r from-premium-sage to-premium-sage-medium flex-shrink-0">
                        <tool.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-premium-black text-sm mb-1">
                          {tool.title}
                        </h4>
                        <p className="text-premium-charcoal text-xs">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Créer compte */}
            <div className="mt-8">
              <Link to="/register">
                <Button size="lg" className="btn-primary text-white px-8 py-4 text-lg font-semibold ripple w-full">
                  Créer mon compte gratuit <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Phone Mockup Coordination */}
          <div className="relative">
            <h3 className="text-2xl font-bold text-premium-black mb-6">
              Coordination Jour J
            </h3>
            
            <div className="app-mockup relative max-w-sm mx-auto mb-8">
              {/* Phone mockup */}
              <div className="bg-premium-black rounded-[3rem] p-2 shadow-2xl">
                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Screen content */}
                  <div className="relative h-[500px]">
                    {/* Status bar */}
                    <div className="flex justify-between items-center p-4 text-xs text-premium-charcoal">
                      <span>9:41</span>
                      <span>🔋 100%</span>
                    </div>
                    
                    {/* App header */}
                    <div className="bg-gradient-to-r from-premium-sage via-premium-sage-medium to-premium-sage-light text-white p-4">
                      <h4 className="font-bold text-lg">Coordination Jour J</h4>
                      <p className="text-white/80 text-sm">Votre mariage</p>
                    </div>
                    
                    {/* Timeline */}
                    <div className="p-4 space-y-3">
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
                          <p className="text-xs text-gray-600">Préparation</p>
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
                    
                    {/* Live notification */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white border border-premium-light rounded-lg p-3 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <p className="text-xs text-premium-charcoal">
                            <strong>Photographe:</strong> En position
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

            {/* Features list */}
            <div className="space-y-4">
              {coordinationFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-r from-premium-sage to-premium-sage-medium rounded-lg flex-shrink-0">
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-premium-black text-sm">
                      {feature.title}
                    </h4>
                    <p className="text-premium-charcoal text-xs">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Demo button */}
            <Button 
              variant="outline"
              className="mt-6 w-full border-2 border-premium-sage text-premium-sage hover:bg-premium-sage hover:text-white"
              onClick={() => setIsModalOpen(true)}
            >
              Voir la démo
            </Button>
          </div>
        </div>
      </div>

      {/* Modal vidéo Loom */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Démonstration de la coordination Jour J</DialogTitle>
          </DialogHeader>
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              src="https://www.loom.com/embed/a0d0d52de99d4af59d67604f01c8af14?sid=1287e7e4-8318-484d-a5e1-006028e2464b"
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allowFullScreen
              title="Démonstration coordination Jour J"
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PremiumToolsCoordinationSection;