
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      description: "Pour commencer votre planification",
      features: [
        "Checklist de mariage",
        "Calculatrice budget basique",
        "Recherche de prestataires",
        "Support communautaire"
      ],
      cta: "Commencer gratuitement",
      highlighted: false
    },
    {
      name: "Premium",
      price: "29€/mois",
      description: "Pour une planification complète",
      features: [
        "Tout du plan gratuit",
        "Tableau de bord complet",
        "Gestion budget avancée",
        "Suivi prestataires",
        "Planning détaillé",
        "Support prioritaire"
      ],
      cta: "Essayer Premium",
      highlighted: true
    },
    {
      name: "Coordination Jour J",
      price: "Sur devis",
      description: "Pour une journée sereine",
      features: [
        "Coordination complète",
        "Planning minute par minute",
        "Hotline jour J",
        "Gestion des prestataires",
        "Assistance sur site"
      ],
      cta: "Demander un devis",
      highlighted: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>Tarifs | Mariable</title>
        <meta name="description" content="Découvrez nos offres pour organiser votre mariage selon vos besoins et votre budget." />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif mb-4">Nos offres</h1>
          <p className="text-xl text-muted-foreground">
            Choisissez l'accompagnement qui vous correspond
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.highlighted ? 'border-wedding-olive shadow-lg scale-105' : ''}`}>
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-wedding-olive text-white px-4 py-1 rounded-full text-sm font-medium">
                    Populaire
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-wedding-olive">{plan.price}</div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-wedding-olive flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.highlighted ? 'bg-wedding-olive hover:bg-wedding-olive/90' : ''}`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                  onClick={() => {
                    if (plan.name === "Gratuit") {
                      navigate('/register');
                    } else if (plan.name === "Premium") {
                      navigate('/register');
                    } else {
                      navigate('/contact');
                    }
                  }}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Des questions sur nos offres ?
          </p>
          <Button variant="outline" onClick={() => navigate('/contact')}>
            Nous contacter
          </Button>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Pricing;
