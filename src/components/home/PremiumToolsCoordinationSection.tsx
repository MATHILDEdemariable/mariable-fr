import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckSquare, Calculator, Users, Search, FileText, Smartphone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PremiumToolsCoordinationSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation('home');

  const tools = [
    { icon: CheckSquare, title: t('toolsCoord.items.checklist.title'), description: t('toolsCoord.items.checklist.description') },
    { icon: Calculator, title: t('toolsCoord.items.budget.title'), description: t('toolsCoord.items.budget.description') },
    { icon: Users, title: t('toolsCoord.items.rsvp.title'), description: t('toolsCoord.items.rsvp.description') },
    { icon: Search, title: t('toolsCoord.items.vendors.title'), description: t('toolsCoord.items.vendors.description') },
    { icon: FileText, title: t('toolsCoord.items.documents.title'), description: t('toolsCoord.items.documents.description') },
    { icon: Smartphone, title: t('toolsCoord.items.coordination.title'), description: t('toolsCoord.items.coordination.description') },
  ];

  return (
    <section id="outils-planification" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Titre éditorial */}
        <header className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir mb-4">
            {t('toolsCoord.title')}
          </h2>
          <p className="text-editorial-gray text-base md:text-lg max-w-2xl mx-auto px-2">
            {t('toolsCoord.subtitle')}
          </p>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Tools Grid */}
          <div className="order-2 lg:order-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto lg:max-w-none">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="group p-4 sm:p-6 border border-editorial-noir/10 hover:border-editorial-olive/30 transition-colors bg-white"
                >
                  <div className="mb-3 sm:mb-4">
                    <tool.icon className="h-6 w-6 sm:h-8 sm:w-8 text-editorial-olive" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-base sm:text-lg text-editorial-noir mb-1 sm:mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-editorial-noir/60 text-xs sm:text-sm">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-6 sm:mt-8 flex justify-center lg:justify-start">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-editorial-olive hover:bg-editorial-olive/90 text-white px-8 sm:px-10 py-5 sm:py-6 text-sm sm:text-base font-medium rounded-none"
                >
                  Créer mon compte gratuit <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative order-1 lg:order-2 flex justify-center w-full">
            <div className="bg-editorial-noir rounded-[2rem] sm:rounded-[2.5rem] p-1.5 sm:p-2 shadow-2xl w-[220px] sm:w-[280px] lg:w-[320px]">
              <div className="bg-white rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden">
                <div className="relative h-[280px] sm:h-[380px] lg:h-[480px]">
                  {/* Status bar */}
                  <div className="flex justify-between items-center p-3 sm:p-4 text-xs text-editorial-noir/60">
                    <span>9:41</span>
                    <span>🔋 100%</span>
                  </div>
                  
                  {/* App header */}
                  <div className="bg-editorial-olive text-white p-3 sm:p-4">
                    <span className="font-serif text-sm sm:text-lg block" aria-hidden="true">Coordination Jour J</span>
                    <span className="text-white/80 text-xs sm:text-sm block" aria-hidden="true">Votre mariage</span>
                  </div>
                  
                  {/* Timeline */}
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 border-l-2 border-green-500">
                      <div>
                        <p className="font-medium text-xs sm:text-sm text-editorial-noir">14:00 - Arrivée invités</p>
                        <p className="text-[10px] sm:text-xs text-editorial-noir/60">En cours ✓</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-editorial-olive/5 border-l-2 border-editorial-olive">
                      <div>
                        <p className="font-medium text-xs sm:text-sm text-editorial-noir">15:30 - Cérémonie</p>
                        <p className="text-[10px] sm:text-xs text-editorial-noir/60">Préparation</p>
                      </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-3 p-3 bg-editorial-beige border-l-2 border-editorial-noir/30">
                      <div>
                        <p className="font-medium text-sm text-editorial-noir">17:00 - Cocktail</p>
                        <p className="text-xs text-editorial-noir/60">À venir</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notification */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                    <div className="bg-white border border-editorial-noir/10 p-2 sm:p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-[10px] sm:text-xs text-editorial-noir">
                          <strong>Photographe:</strong> En position
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo button */}
            <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 -translate-x-1/2">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-[10px] sm:text-xs tracking-widest text-editorial-olive uppercase border-b border-editorial-olive pb-1 hover:text-editorial-noir hover:border-editorial-noir transition-colors whitespace-nowrap"
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
