import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, User, Users, CheckSquare, Calculator, FileText, Droplet, Mail, Home, Table, Brain, Calendar, Share2, QrCode, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingContent = () => {
  const features = [
    { name: "Accès espace personnel", icon: User, gratuit: true, premium: true },
    { name: "Guide de prestataires", icon: Users, gratuit: true, premium: true },
    { name: "Modèle de check-list version post-it", icon: CheckSquare, gratuit: true, premium: true },
    { name: "Calculatrice budget", icon: Calculator, gratuit: true, premium: true },
    { name: "RSVP digital invités", icon: Mail, gratuit: true, premium: true },
    { name: "Modèle suivi budgétaire personnalisable", icon: FileText, gratuit: false, premium: true },
    { name: "Calculatrice boisson", icon: Droplet, gratuit: false, premium: true },
    { name: "Gestion hébergement", icon: Home, gratuit: false, premium: true },
    { name: "Nos guides PDF", icon: FileText, gratuit: false, premium: true },
    { name: "Plan de table", icon: Table, gratuit: false, premium: true },
    { name: "Génération rétroplanning & check-list IA", icon: Brain, gratuit: false, premium: true },
    { name: "Planning intelligent Jour-J", icon: Calendar, gratuit: false, premium: true },
    { name: "Assignation tâches équipe Jour-J", icon: Users, gratuit: false, premium: true },
    { name: "Partage temps réel infos Jour-J", icon: Share2, gratuit: false, premium: true },
    { name: "Stockage documents illimité", icon: FileText, gratuit: false, premium: true },
    { name: "Génération illimitée QR code", icon: QrCode, gratuit: false, premium: true },
    { name: "Exports PDF/CSV illimités", icon: FileText, gratuit: false, premium: true },
    { name: "Support prioritaire", icon: Headphones, gratuit: false, premium: true },
  ];

  const faqItems = [
    { question: "Mariable est-il vraiment gratuit ?", answer: "Oui, les outils essentiels (dashboard, checklist, budget, guide prestataires, RSVP) sont 100 % gratuits." },
    { question: "Que contient le Premium à 29 € ?", answer: "Un achat unique qui donne accès à vie à tous les outils avancés : exports illimités, IA illimitée, plan de table, coordination jour-J, stockage illimité et support prioritaire." },
    { question: "Est-ce un abonnement ?", answer: "Non, c'est un paiement unique de 29 €. Pas de renouvellement automatique." },
    { question: "Puis-je utiliser l'app avec ma famille ?", answer: "Oui, l'application est collaborative. Chacun peut accéder au planning et aux informations importantes." },
  ];

  const plans = [
    {
      name: "Gratuit",
      price: "0 €",
      subtitle: "Pour bien démarrer",
      highlighted: false,
      cta: { label: "S'inscrire gratuitement", href: "/register" }
    },
    {
      name: "Premium",
      price: "29 €",
      subtitle: "Achat unique · Accès à vie",
      highlighted: true,
      badge: "⭐ RECOMMANDÉ",
      cta: { label: "Passer au Premium", href: "/register" }
    }
  ];

  return (
    <div className="space-y-8 p-4">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
          Nos tarifs
        </h2>
        <p className="text-muted-foreground">
          Gratuit pour démarrer, Premium pour tout débloquer
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {plans.map((plan, idx) => (
          <Card 
            key={idx} 
            className={`relative rounded-none ${plan.highlighted ? 'border-2 border-foreground' : 'border border-border'}`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-foreground text-background px-3 py-1 text-xs font-bold">
                  {plan.badge}
                </span>
              </div>
            )}
            <CardHeader className={`text-center pb-2 ${plan.highlighted ? 'pt-6' : 'pt-4'}`}>
              <CardTitle className="text-lg font-serif">{plan.name}</CardTitle>
              <div className="text-2xl font-bold text-foreground">
                {plan.price}
              </div>
              <p className="text-xs text-muted-foreground">{plan.subtitle}</p>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-1 mb-4 max-h-48 overflow-y-auto">
                {features.map((feature, fidx) => {
                  const isIncluded = idx === 0 ? feature.gratuit : feature.premium;
                  if (!isIncluded) return null;
                  return (
                    <div key={fidx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-foreground">{feature.name}</span>
                    </div>
                  );
                })}
              </div>
              <Button 
                asChild 
                size="sm"
                className="w-full bg-foreground hover:bg-foreground/90 rounded-none"
              >
                <Link to={plan.cta.href}>{plan.cta.label}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

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
