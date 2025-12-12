import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, User, Users, CheckSquare, Calculator, FileText, Droplet, Mail, Home, Table, Brain, Calendar, Share2, QrCode, Headphones, Settings, Phone, Clock, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingContent = () => {
  const features = [
    { name: "Accès espace personnel", icon: User, gratuit: true, premium: true, coordinateur: true },
    { name: "Guide de prestataires", icon: Users, gratuit: true, premium: true, coordinateur: true },
    { name: "Modèle de check-list version post-it", icon: CheckSquare, gratuit: true, premium: true, coordinateur: true },
    { name: "Calculatrice budget", icon: Calculator, gratuit: true, premium: true, coordinateur: true },
    { name: "Modèle suivi budgétaire personnalisable", icon: FileText, gratuit: false, premium: true, coordinateur: true },
    { name: "Calculatrice boisson", icon: Droplet, gratuit: false, premium: true, coordinateur: true },
    { name: "RSVP invité en ligne", icon: Mail, gratuit: false, premium: true, coordinateur: true },
    { name: "Gestion hébergement", icon: Home, gratuit: false, premium: true, coordinateur: true },
    { name: "Nos guides PDF", icon: FileText, gratuit: false, premium: true, coordinateur: true },
    { name: "Plan de table", icon: Table, gratuit: false, premium: true, coordinateur: true },
    { name: "Génération rétroplanning & check-list IA", icon: Brain, gratuit: false, premium: true, coordinateur: true },
    { name: "Planning intelligent Jour-J", icon: Calendar, gratuit: false, premium: true, coordinateur: true },
    { name: "Assignation tâches équipe Jour-J", icon: Users, gratuit: false, premium: true, coordinateur: true },
    { name: "Partage temps réel infos Jour-J", icon: Share2, gratuit: false, premium: true, coordinateur: true },
    { name: "Stockage documents", icon: FileText, gratuit: false, premium: true, coordinateur: true },
    { name: "Génération illimitée QR code", icon: QrCode, gratuit: false, premium: true, coordinateur: true },
    { name: "Support téléphonique & Whatsapp", icon: Headphones, gratuit: false, premium: true, coordinateur: true },
    { name: "Audit organisation via l'appli", icon: Settings, gratuit: false, premium: false, coordinateur: true },
    { name: "2h rdv téléphonique/visio", icon: Phone, gratuit: false, premium: false, coordinateur: true },
    { name: "14h présence jour-J", icon: Clock, gratuit: false, premium: false, coordinateur: true },
    { name: "Coordination prestataires terrain", icon: Handshake, gratuit: false, premium: false, coordinateur: true },
    { name: "Gestion imprévus terrain", icon: Settings, gratuit: false, premium: false, coordinateur: true },
  ];

  const faqItems = [
    { question: "Puis-je modifier la formule plus tard ?", answer: "Oui, vous pouvez upgrader votre formule jusqu'à J-30. Un ajustement tarifaire sera appliqué au prorata du temps restant jusqu'à votre mariage." },
    { question: "La présence terrain, c'est quoi exactement ?", answer: "Un manager Mariable est physiquement présent le jour J pour superviser le déroulement, coordonner les prestataires et gérer les imprévus." },
    { question: "Puis-je utiliser l'app avec ma famille ?", answer: "Oui justement, l'application est faite pour être collaborative - chacun peut accéder à son planning et aux informations importantes." },
  ];

  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      subtitle: "Pour bien démarrer",
      highlighted: false,
      cta: { label: "S'inscrire gratuitement", href: "/register" }
    },
    {
      name: "Application Premium",
      price: "9,9€/mois",
      subtitle: "Sans engagement • Annulation en 2 clics",
      highlighted: true,
      badge: "⭐ RECOMMANDÉ",
      cta: { label: "Découvrir - Payer plus tard", href: "/register" }
    },
    {
      name: "Coordinateur.rice Renfort",
      price: "1000€",
      subtitle: "Avec présence jour-J",
      highlighted: false,
      cta: { label: "Faire une demande", href: "/reservation-jour-m" }
    }
  ];

  return (
    <div className="space-y-8 p-4">
      {/* Titre */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
          Choisissez la formule qui vous correspond
        </h2>
        <p className="text-muted-foreground">
          De l'autonomie totale à l'accompagnement complet
        </p>
      </div>

      {/* En-têtes des plans - version cards empilées */}
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan, idx) => (
          <Card 
            key={idx} 
            className={`relative ${plan.highlighted ? 'border-2 border-premium-sage bg-premium-sage/5' : 'border'}`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-premium-sage text-white px-3 py-1 rounded-full text-xs font-bold">
                  {plan.badge}
                </span>
              </div>
            )}
            <CardHeader className={`text-center pb-2 ${plan.highlighted ? 'pt-6' : 'pt-4'}`}>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className={`text-2xl font-bold ${plan.highlighted ? 'text-premium-sage' : 'text-foreground'}`}>
                {plan.price}
              </div>
              <p className="text-xs text-muted-foreground">{plan.subtitle}</p>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-1 mb-4 max-h-48 overflow-y-auto">
                {features.map((feature, fidx) => {
                  const isIncluded = idx === 0 ? feature.gratuit : idx === 1 ? feature.premium : feature.coordinateur;
                  if (!isIncluded) return null;
                  return (
                    <div key={fidx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-foreground">{feature.name}</span>
                    </div>
                  );
                })}
              </div>
              <Button 
                asChild 
                size="sm"
                className={`w-full ${plan.highlighted ? 'bg-premium-sage hover:bg-premium-sage-dark' : 'bg-foreground hover:bg-foreground/90'}`}
              >
                <Link to={plan.cta.href}>{plan.cta.label}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div>
        <h3 className="text-lg font-serif font-bold text-foreground mb-4 text-center">
          Questions fréquentes
        </h3>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-sm font-medium text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default PricingContent;
