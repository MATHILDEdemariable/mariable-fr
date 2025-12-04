import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sparkles, Gift, Search, Clock, Check, ArrowRight, Star, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
const PremiumConciergerie = () => {
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
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
  const services = [{
    id: 1,
    icon: Search,
    title: "Trouver mes prestataires",
    description: "Notre équipe sélectionne pour vous les meilleurs prestataires de votre région",
    features: ["Sélection gratuite sous 48H", "5-8 prestataires triés", "Adaptée à votre budget", "Option premium avec vérification disponibilités"],
    cta: "Recevoir ma sélection",
    ctaAction: scrollToForm,
    gradient: "from-premium-sage to-premium-sage-medium",
    badge: "CONCIERGERIE",
    badgeColor: "bg-premium-sage"
  }, {
    id: 2,
    icon: Wrench,
    title: "Utiliser les outils",
    description: "Tous les outils pour organiser votre mariage et coordonner le jour J",
    features: ["Checklist & retroplanning", "Gestion du budget", "RSVP & plan de table", "App coordination Jour J"],
    cta: "Découvrir les outils",
    ctaAction: scrollToTools,
    gradient: "from-premium-sage-medium to-premium-sage-light",
    badge: "100% GRATUIT",
    badgeColor: "bg-premium-sage-medium"
  }];
  return <section id="premium-conciergerie-section" className="py-24 bg-premium-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-premium-sage-very-light text-premium-sage border-premium-sage-light">
            <Sparkles className="h-4 w-4 mr-2 inline" />
            Comment ça marche
          </Badge>
          
          <h2 className="text-4xl font-bold text-premium-black mb-4 md:text-5xl">Transformez l'organisation de


          <br />
            <span className="text-premium-sage">votre mariage</span>
          </h2>
          
          <p className="text-xl text-premium-charcoal max-w-3xl mx-auto">
             Vous gardez le contrôle, on vous donne juste les bonnes recommandations et les bons outils.    


          </p>
        </div>

        {/* Services Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map(service => <Card key={service.id} className="group relative overflow-hidden border-2 border-transparent hover:border-premium-sage/30 transition-all duration-500 hover:shadow-2xl">
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
                  </div>
                </div>

                {/* Description */}
                <p className="text-premium-charcoal mb-6 text-lg">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, index) => <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-premium-sage flex-shrink-0" />
                      <span className="text-premium-charcoal">{feature}</span>
                    </li>)}
                </ul>

                {/* CTA */}
                <Button onClick={service.ctaAction} className={`w-full bg-gradient-to-r ${service.gradient} text-white hover:opacity-90 py-6 text-lg font-semibold`}>
                  {service.cta} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>)}
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
    </section>;
};
export default PremiumConciergerie;