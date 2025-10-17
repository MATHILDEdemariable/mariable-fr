import { Card } from '@/components/ui/card';
import { Shield, Settings, Zap } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Shield,
      title: "Créez votre compte sécurisé en 2 clics",
      description: "KYC Stripe Connect pour votre protection"
    },
    {
      icon: Settings,
      title: "Définissez vos règles de paiement",
      description: "Acompte/solde, dates personnalisées"
    },
    {
      icon: Zap,
      title: "Encaissez sans relancer",
      description: "CB, virement, SEPA automatiques"
    }
  ];

  return (
    <section className="max-w-6xl mx-auto mb-16">
      <h2 className="text-3xl font-serif text-center mb-8">Comment ça marche</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="p-6 text-center relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-wedding-olive text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <step.icon className="h-12 w-12 mx-auto mb-4 text-wedding-olive" />
            <h3 className="font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
        ⚖️ Mariable ne détient pas vos fonds ; les paiements transitent via notre PSP (Stripe Connect).
      </p>
    </section>
  );
};

export default HowItWorksSection;
