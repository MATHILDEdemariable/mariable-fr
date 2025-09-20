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
      gradient: "from-premium-gradient-start to-premium-gradient-mid"
    },
    {
      id: 2,
      icon: ClipboardList,
      title: "ORGANISER",
      description: "Vos outils de planification inclus",
      cta: "Créer mon planning gratuit",
      link: "/register",
      gradient: "from-premium-gradient-mid to-premium-gradient-end"
    },
    {
      id: 3,
      icon: Calendar,
      title: "VIVRE",
      description: "Coordination tech intégrée le jour J",
      cta: "Découvrir la coordination",
      link: "/coordination-jour-j",
      gradient: "from-premium-gradient-end to-premium-gradient-start"
    }
  ];

  return (
    <section id="premium-process-section" className="py-24 bg-premium-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-premium-black mb-4">
            De l'inspiration au jour J :
            <br />
            <span className="bg-gradient-to-r from-premium-gradient-start via-premium-gradient-mid to-premium-gradient-end bg-clip-text text-transparent">
              Votre parcours Mariable
            </span>
          </h2>
        </div>

        {/* Timeline horizontale */}
        <div className="relative max-w-6xl mx-auto">
          {/* Ligne de connexion */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-premium-gradient-start via-premium-gradient-mid to-premium-gradient-end transform -translate-y-1/2 z-0"></div>
          
          <div className="grid lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <Card key={step.id} className="group hover:scale-105 transition-all duration-300 bg-white shadow-xl border-0 relative overflow-hidden">
                {/* Numérotation */}
                <div className={`absolute top-4 left-4 w-12 h-12 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center text-white font-bold text-lg`}>
                  {step.id}
                </div>

                <CardContent className="p-8 pt-20">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${step.gradient} mb-6`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-premium-black mb-4 tracking-wide">
                    {step.title}
                  </h3>
                  
                  <p className="text-premium-charcoal mb-8 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <Link to={step.link}>
                    <Button 
                      className={`w-full bg-gradient-to-r ${step.gradient} text-white hover:opacity-90 transition-all duration-300 font-semibold py-3`}
                    >
                      {step.cta}
                    </Button>
                  </Link>
                </CardContent>

                {/* Effet hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumProcessSection;