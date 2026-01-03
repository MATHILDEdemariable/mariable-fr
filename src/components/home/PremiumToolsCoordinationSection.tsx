import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckSquare, Calculator, Users, Search, FileText, Smartphone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumToolsCoordinationSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tools = [
    {
      icon: CheckSquare,
      title: "Checklist intelligente",
      description: "Planning personnalisé",
    },
    {
      icon: Calculator,
      title: "Gestion budget",
      description: "Suivi de vos dépenses",
    },
    {
      icon: Users,
      title: "RSVP & plan de table",
      description: "Gestion des invités",
    },
    {
      icon: Search,
      title: "Sélection prestataires",
      description: "Recommandations personnalisées",
    },
    {
      icon: FileText,
      title: "Stockage documents",
      description: "Tous vos contrats centralisés",
    },
    {
      icon: Smartphone,
      title: "Coordination Jour J",
      description: "Application mobile",
    },
  ];

  return (
    <section id="premium-tools-section" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Titre éditorial */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-editorial-noir mb-4 font-normal">
            Vos outils de planification <em>gratuits</em>
          </h2>
          <p className="text-editorial-noir/70 text-lg max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour organiser votre mariage sereinement
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
          {/* Tools Grid */}
          <div>
            <div className="grid grid-cols-2 gap-6">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="group p-6 border border-editorial-noir/10 hover:border-editorial-olive/30 transition-colors bg-white"
                >
                  <div className="mb-4">
                    <tool.icon className="h-8 w-8 text-editorial-olive" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-serif text-lg text-editorial-noir mb-2">
                    {tool.title}
                  </h4>
                  <p className="text-editorial-noir/60 text-sm">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-editorial-olive hover:bg-editorial-noir text-white px-10 py-6 text-base font-medium rounded-none w-full"
                >
                  Créer mon compte gratuit <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative">
            <div className="bg-editorial-noir rounded-[2.5rem] p-2 shadow-2xl max-w-sm mx-auto">
              <div className="bg-white rounded-[2rem] overflow-hidden">
                <div className="relative h-[480px]">
                  {/* Status bar */}
                  <div className="flex justify-between items-center p-4 text-xs text-editorial-noir/60">
                    <span>9:41</span>
                    <span>🔋 100%</span>
                  </div>
                  
                  {/* App header */}
                  <div className="bg-editorial-olive text-white p-4">
                    <h4 className="font-serif text-lg">Coordination Jour J</h4>
                    <p className="text-white/80 text-sm">Votre mariage</p>
                  </div>
                  
                  {/* Timeline */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 border-l-2 border-green-500">
                      <div>
                        <p className="font-medium text-sm text-editorial-noir">14:00 - Arrivée invités</p>
                        <p className="text-xs text-editorial-noir/60">En cours ✓</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-editorial-olive/5 border-l-2 border-editorial-olive">
                      <div>
                        <p className="font-medium text-sm text-editorial-noir">15:30 - Cérémonie</p>
                        <p className="text-xs text-editorial-noir/60">Préparation</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-editorial-beige border-l-2 border-editorial-noir/30">
                      <div>
                        <p className="font-medium text-sm text-editorial-noir">17:00 - Cocktail</p>
                        <p className="text-xs text-editorial-noir/60">À venir</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notification */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white border border-editorial-noir/10 p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-xs text-editorial-noir">
                          <strong>Photographe:</strong> En position
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo button */}
            <div className="text-center mt-8">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-xs tracking-widest text-editorial-olive uppercase border-b border-editorial-olive pb-1 hover:text-editorial-noir hover:border-editorial-noir transition-colors"
              >
                Voir la démo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal vidéo */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0 rounded-none">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-serif text-xl">Démonstration de la coordination Jour J</DialogTitle>
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
