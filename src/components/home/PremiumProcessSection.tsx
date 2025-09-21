import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ClipboardList, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumProcessSection = () => {
  const steps = [
    {
      id: 1,
      icon: Sparkles,
      title: "S'INSPIRER",
      description: "Notre sélection exclusive de prestataires d'exception",
      cta: "Explorer nos prestataires",
      link: "/selection",
      gradient: "from-premium-sage to-premium-sage-medium"
    },
    {
      id: 2,
      icon: ClipboardList,
      title: "ORGANISER",
      description: "Vos outils de planification inclus",
      cta: "Créer mon planning gratuit",
      link: "/register",
      gradient: "from-premium-sage-medium to-premium-sage-light"
    },
    {
      id: 3,
      icon: Calendar,
      title: "VIVRE",
      description: "Coordination tech intégrée le jour J",
      cta: "Découvrir la coordination",
      link: "/coordination-jour-j",
      gradient: "from-premium-sage-light to-premium-sage"
    }
  ];

  return (
    <section id="premium-process-section" className="py-24 bg-premium-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-premium-black mb-4">
            De l'inspiration au jour J :
            <br />
            <span className="bg-gradient-to-r from-premium-sage via-premium-sage-medium to-premium-sage-light bg-clip-text text-transparent">
              Votre parcours Mariable
            </span>
          </h2>
        </div>

        {/* Timeline horizontale */}
        <div className="relative max-w-6xl mx-auto">
          {/* Ligne de connexion */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-premium-sage via-premium-sage-medium to-premium-sage-light transform -translate-y-1/2 z-0"></div>
          
          <div className="grid lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden group h-full bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-15 transition-opacity duration-500" style={{ backgroundImage: step.gradient }} />
              
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-premium-sage-light to-premium-sage text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    {index + 1}
                  </div>
                  <div className="text-premium-sage opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                    <step.icon size={36} />
                  </div>
                </div>
                
                <h3 className="text-xl font-serif text-premium-black mb-3 group-hover:text-premium-sage transition-colors duration-300">
                  {step.title}
                </h3>
                
                <p className="text-premium-charcoal leading-relaxed mb-6 flex-grow">
                  {step.description}
                </p>
                
                <Button 
                  asChild 
                  className="bg-premium-sage hover:bg-premium-sage-dark text-white border-0 w-full shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105 mt-auto"
                >
                  <Link to={step.link}>
                    {step.cta}
                  </Link>
                </Button>
              </CardContent>
            </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumProcessSection;