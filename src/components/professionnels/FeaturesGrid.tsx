import { Card } from '@/components/ui/card';
import { 
  CreditCard, 
  Bell, 
  LayoutDashboard, 
  FileText
} from 'lucide-react';

const FeaturesGrid = () => {
  const features = [
    { icon: CreditCard, title: "Mandats SEPA et paiements par CB", description: "Tous les moyens de paiement" },
    { icon: Bell, title: "Relances et reçus automatiques", description: "Zéro effort de votre part" },
    { icon: LayoutDashboard, title: "Tableau de bord pro", description: "Vue d'ensemble du chiffre d'affaire" },
    { icon: FileText, title: "Export comptable (Excel)", description: "Pour votre compta" }
  ];

  return (
    <section className="max-w-6xl mx-auto mb-16">
      <h2 className="text-3xl font-serif text-center mb-8">Fonctionnalités clés</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
            <feature.icon className="h-8 w-8 mb-3 text-wedding-olive" />
            <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
            <p className="text-xs text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturesGrid;
