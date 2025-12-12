import React from 'react';
import { CheckCircle, Gift, ListChecks, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const GuideStartupContent = () => {
  const benefits = [
    {
      emoji: "✅",
      title: "Accès aux meilleurs professionnels",
      description: "50+ prestataires vérifiés et recommandés par notre réseau de lieux"
    },
    {
      emoji: "🎁",
      title: "Prix préférentiels & privilèges",
      description: "Bénéficiez d'avantages exclusifs grâce au Club Mariable"
    },
    {
      emoji: "📋",
      title: "Outils de planification",
      description: "Checklist IA, budget, liste d'invités, coordination Jour-J"
    }
  ];

  const tools = [
    { title: 'Quiz Mariage', description: 'Définissez vos priorités', icon: '❓', path: '/dashboard/planning' },
    { title: 'Budget', description: 'Gérez vos dépenses', icon: '💰', path: '/dashboard/budget' },
    { title: 'Prestataires', description: 'Trouvez vos fournisseurs', icon: '🏪', path: '/dashboard/professionnelsmariable' },
    { title: 'Liste d\'invités', description: 'Gérez vos RSVP', icon: '✉️', path: '/dashboard/rsvp' },
    { title: 'Check-list', description: 'Suivez vos préparatifs', icon: '✅', path: '/dashboard/checklist-mariage' },
    { title: 'Coordination Jour-J', description: 'Planifiez le grand jour', icon: '📅', path: '/dashboard/coordination' },
  ];

  return (
    <div className="space-y-8 p-4">
      {/* Titre principal */}
      <div className="text-center">
        <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
          Bienvenue sur Mariable
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Mariable vous accompagne dans l'organisation de votre mariage avec des outils intelligents 
          et un réseau de professionnels de confiance.
        </p>
      </div>

      {/* Bénéfices */}
      <div className="grid md:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <Card key={index} className="border-2 hover:border-premium-sage/40 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">{benefit.emoji}</div>
              <h3 className="font-serif font-bold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Outils disponibles */}
      <div>
        <h3 className="text-xl font-serif font-bold text-foreground mb-4 text-center">
          Vos outils de planification
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tools.map((tool, index) => (
            <Link 
              key={index} 
              to={tool.path}
              className="block"
            >
              <Card className="h-full hover:shadow-md hover:border-premium-sage/40 transition-all duration-300 cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-2xl">{tool.icon}</span>
                  <div>
                    <p className="font-medium text-foreground">{tool.title}</p>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Button asChild className="bg-premium-sage hover:bg-premium-sage-dark">
          <Link to="/dashboard/planning">
            Commencer par le Quiz
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default GuideStartupContent;
