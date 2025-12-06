import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, Search, Wrench } from 'lucide-react';

const PremiumConciergerie = () => {
  const scrollToForm = () => {
    const element = document.getElementById('carnet-adresses-section');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const scrollToTools = () => {
    const element = document.getElementById('premium-tools-section');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const services = [
    {
      id: 1,
      icon: Search,
      title: "Recommandations de professionnels",
      description: "Notre équipe sélectionne pour vous les meilleurs prestataires de votre région",
      cta: "Trouver mes prestataires",
      ctaAction: scrollToForm,
      gradient: "from-premium-sage to-premium-sage-medium",
      badge: "CONCIERGERIE",
      badgeColor: "bg-premium-sage"
    },
    {
      id: 2,
      icon: Wrench,
      title: "Je gère moi-même",
      description: "Accédez à tous les outils pour organiser votre mariage en toute autonomie",
      cta: "Découvrir les outils",
      ctaAction: scrollToTools,
      gradient: "from-premium-sage-medium to-premium-sage-light",
      badge: "AUTONOME",
      badgeColor: "bg-premium-sage-medium"
    }
  ];

  return (
    <section id="premium-conciergerie-section" className="py-16 bg-premium-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-2 bg-premium-sage-very-light text-premium-sage border-premium-sage-light">
            <Sparkles className="h-4 w-4 mr-2 inline" />
            Comment ça marche
          </Badge>
          
          <h2 className="text-3xl font-bold text-premium-black mb-4 md:text-4xl">
            Transformez l'organisation de
            <br />
            <span className="text-premium-sage">votre mariage</span>
          </h2>
          
          <p className="text-lg text-premium-charcoal max-w-2xl mx-auto">
            Vous gardez le contrôle, on vous donne juste les bonnes recommandations et les bons outils.
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map(service => (
            <Card 
              key={service.id} 
              className="group relative overflow-hidden border-2 border-transparent hover:border-premium-sage/30 transition-all duration-500 hover:shadow-xl"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.gradient}`} />
              
              <CardContent className="p-6">
                {/* Badge */}
                <Badge className={`${service.badgeColor} text-white mb-3 text-xs`}>
                  {service.badge}
                </Badge>

                {/* Icon & Title */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${service.gradient} flex-shrink-0`}>
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-premium-black">
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-premium-charcoal mb-5">
                  {service.description}
                </p>

                {/* CTA */}
                <Button 
                  onClick={service.ctaAction} 
                  variant="outline"
                  className="w-full border-premium-sage text-premium-sage hover:bg-premium-sage hover:text-white py-5 font-semibold"
                >
                  {service.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumConciergerie;
