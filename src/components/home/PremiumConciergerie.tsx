import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sparkles, Gift, Search, Clock, Check, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumConciergerie = () => {
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const services = [
    {
      id: 1,
      icon: Gift,
      title: "Sélection personnalisée",
      subtitle: "GRATUIT",
      description: "5-8 prestataires triés selon vos critères",
      features: [
        "Recommandations selon votre région",
        "Adaptées à votre budget",
        "Envoyées sous 48H",
        "Par email et WhatsApp"
      ],
      cta: "Recevoir ma sélection",
      ctaLink: "#carnet-adresses-section",
      gradient: "from-premium-sage to-premium-sage-medium",
      badge: "GRATUIT",
      badgeColor: "bg-green-500"
    },
    {
      id: 2,
      icon: Search,
      title: "Sélection sur mesure +",
      subtitle: "69€",
      description: "Recherche approfondie avec vérification des disponibilités",
      features: [
        "Vérification disponibilité à votre date",
        "Contact direct avec les prestataires",
        "Comparatif détaillé des offres",
        "Accompagnement personnalisé"
      ],
      cta: "Faire une demande",
      ctaAction: () => setIsPremiumModalOpen(true),
      gradient: "from-amber-500 to-orange-500",
      badge: "PREMIUM",
      badgeColor: "bg-amber-500"
    }
  ];

  const scrollToForm = () => {
    const element = document.getElementById('carnet-adresses-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="premium-conciergerie-section" className="py-24 bg-premium-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-premium-sage-very-light text-premium-sage border-premium-sage-light">
            <Sparkles className="h-4 w-4 mr-2 inline" />
            Conciergerie Premium
          </Badge>
          
          <h2 className="text-4xl font-bold text-premium-black mb-4 md:text-5xl">
            Trouvez vos prestataires
            <br />
            <span className="text-premium-sage">sans effort</span>
          </h2>
          
          <p className="text-xl text-premium-charcoal max-w-3xl mx-auto">
            Notre équipe sélectionne pour vous les meilleurs prestataires de votre région
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service) => (
            <Card 
              key={service.id} 
              className="group relative overflow-hidden border-2 border-transparent hover:border-premium-sage/30 transition-all duration-500 hover:shadow-2xl"
            >
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${service.gradient}`} />
              
              <CardContent className="p-8">
                {/* Badge */}
                <Badge className={`${service.badgeColor} text-white mb-4`}>
                  {service.badge}
                </Badge>

                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${service.gradient} flex-shrink-0`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-premium-black">
                      {service.title}
                    </h3>
                    <p className="text-3xl font-bold text-premium-sage mt-1">
                      {service.subtitle}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-premium-charcoal mb-6 text-lg">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-premium-sage flex-shrink-0" />
                      <span className="text-premium-charcoal">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {service.ctaLink ? (
                  <Button 
                    onClick={scrollToForm}
                    className={`w-full bg-gradient-to-r ${service.gradient} text-white hover:opacity-90 py-6 text-lg font-semibold`}
                  >
                    {service.cta} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <Button 
                    onClick={service.ctaAction}
                    className={`w-full bg-gradient-to-r ${service.gradient} text-white hover:opacity-90 py-6 text-lg font-semibold`}
                  >
                    {service.cta} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Garanties */}
        <div className="flex flex-wrap justify-center gap-8 mt-16">
          <div className="flex items-center gap-2 text-premium-charcoal">
            <Clock className="h-5 w-5 text-premium-sage" />
            <span>Réponse sous 48H</span>
          </div>
          <div className="flex items-center gap-2 text-premium-charcoal">
            <Star className="h-5 w-5 text-premium-sage" />
            <span>Prestataires vérifiés</span>
          </div>
          <div className="flex items-center gap-2 text-premium-charcoal">
            <Check className="h-5 w-5 text-premium-sage" />
            <span>Sans engagement</span>
          </div>
        </div>
      </div>

      {/* Modal Premium 69€ */}
      <Dialog open={isPremiumModalOpen} onOpenChange={setIsPremiumModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Sélection sur mesure + 
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Service premium à 69€
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-2">Ce service inclut :</h4>
              <ul className="space-y-2 text-amber-700">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Recherche approfondie de prestataires
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Vérification des disponibilités à votre date
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Contact direct avec les prestataires
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Comparatif détaillé et recommandations
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Accompagnement personnalisé par WhatsApp
                </li>
              </ul>
            </div>

            <p className="text-center text-premium-charcoal">
              Pour bénéficier de ce service, contactez-nous directement :
            </p>

            <div className="flex flex-col gap-3">
              <a 
                href="https://wa.me/33612345678?text=Bonjour, je souhaite bénéficier de la sélection sur mesure +" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg font-semibold">
                  Contacter par WhatsApp
                </Button>
              </a>
              
              <Button 
                variant="outline" 
                onClick={() => setIsPremiumModalOpen(false)}
                className="w-full"
              >
                Fermer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PremiumConciergerie;