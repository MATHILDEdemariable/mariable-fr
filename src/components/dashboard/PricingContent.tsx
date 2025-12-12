import React from 'react';
import { Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const PricingContent = () => {
  const plans = [
    {
      name: 'Gratuit',
      price: '0€',
      description: 'Pour commencer',
      features: [
        { text: 'Quiz de planification', included: true },
        { text: 'Calculateur de budget', included: true },
        { text: 'Liste d\'invités (limité)', included: true },
        { text: 'Checklist basique', included: true },
        { text: 'Accès aux prestataires', included: true },
        { text: 'Checklist IA personnalisée', included: false },
        { text: 'Coordination Jour-J', included: false },
        { text: 'Support WhatsApp', included: false },
      ],
      highlight: false
    },
    {
      name: 'Premium',
      price: '9€',
      period: '/mois',
      description: 'Fonctionnalités complètes',
      features: [
        { text: 'Tout le plan Gratuit', included: true },
        { text: 'Checklist IA personnalisée', included: true },
        { text: 'Liste d\'invités illimitée', included: true },
        { text: 'RSVP en ligne', included: true },
        { text: 'Plan de table', included: true },
        { text: 'Guides PDF téléchargeables', included: true },
        { text: 'Coordination Jour-J', included: false },
        { text: 'Support WhatsApp prioritaire', included: false },
      ],
      highlight: true
    },
    {
      name: 'Coordinateur Jour-J',
      price: '9,90€',
      period: '/mois',
      description: 'Organisation complète',
      features: [
        { text: 'Tout le plan Premium', included: true },
        { text: 'Planning minute par minute', included: true },
        { text: 'Gestion des prestataires', included: true },
        { text: 'Documents & contacts centralisés', included: true },
        { text: 'Partage avec l\'équipe', included: true },
        { text: 'Rappels automatiques', included: true },
        { text: 'Support WhatsApp prioritaire', included: true },
        { text: 'Pense-bête Jour-J', included: true },
      ],
      highlight: false
    }
  ];

  const faqItems = [
    {
      question: 'Puis-je changer de formule à tout moment ?',
      answer: 'Oui, vous pouvez upgrader ou downgrader votre formule à tout moment. Les changements sont pris en compte immédiatement.'
    },
    {
      question: 'Y a-t-il un engagement ?',
      answer: 'Non, aucun engagement. Vous pouvez annuler à tout moment. L\'abonnement est mensuel et sans engagement.'
    },
    {
      question: 'Comment fonctionne le Club Mariable ?',
      answer: 'Le Club Mariable vous donne accès à des avantages exclusifs chez nos partenaires. Demandez votre code à votre lieu de réception ou contactez-nous.'
    },
    {
      question: 'Les outils sont-ils disponibles après le mariage ?',
      answer: 'Oui, vous gardez accès à vos données tant que votre compte est actif. Idéal pour les remerciements et souvenirs !'
    }
  ];

  return (
    <div className="space-y-8 p-4">
      {/* Titre */}
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
          Choisissez la formule qui vous correspond
        </h2>
        <p className="text-muted-foreground">
          Accédez à tous les outils pour organiser votre mariage sereinement
        </p>
      </div>

      {/* Tableau comparatif */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`relative ${plan.highlight ? 'border-2 border-premium-sage shadow-lg' : 'border'}`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-premium-sage text-white text-xs font-medium px-3 py-1 rounded-full">
                  Populaire
                </span>
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg font-serif">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-premium-sage flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-foreground' : 'text-muted-foreground/60'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div>
        <h3 className="text-lg font-serif font-bold text-foreground mb-4 text-center">
          Questions fréquentes
        </h3>
        <Accordion type="single" collapsible className="max-w-2xl mx-auto">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-sm font-medium">
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
