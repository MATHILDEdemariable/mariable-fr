import { Card } from '@/components/ui/card';
import { 
  Calendar, 
  CreditCard, 
  Bell, 
  LayoutDashboard, 
  FileText, 
  Users, 
  TrendingUp, 
  FolderKanban 
} from 'lucide-react';

const FeaturesGrid = () => {
  const features = [
    { icon: Calendar, title: "Acomptes & soldes automatiques", description: "Définissez vos échéances" },
    { icon: CreditCard, title: "Mandats SEPA et paiements par CB", description: "Tous les moyens de paiement" },
    { icon: Bell, title: "Relances et reçus automatiques", description: "Zéro effort de votre part" },
    { icon: LayoutDashboard, title: "Tableau de bord pro unifié", description: "Vue d'ensemble claire" },
    { icon: FileText, title: "Exports comptables (CSV)", description: "Pour votre compta" },
    { icon: Users, title: "Split payment si plusieurs prestas", description: "Répartition automatique" },
    { icon: TrendingUp, title: "Virement mensuel regroupé", description: "Option disponible" },
    { icon: FolderKanban, title: "Suivi par couple & par événement", description: "Organisation parfaite" }
  ];

  return (
    <section className="max-w-6xl mx-auto mb-16">
      <h2 className="text-3xl font-serif text-center mb-8">Fonctionnalités clés</h2>
      
      <div className="grid md:grid-cols-4 gap-6">
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
