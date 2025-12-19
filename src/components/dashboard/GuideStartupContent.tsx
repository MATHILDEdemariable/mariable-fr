import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Wrench, 
  CheckSquare, 
  Calculator, 
  Users, 
  FileText, 
  Smartphone, 
  ArrowRight, 
  Sparkles, 
  PlayCircle, 
  MessageCircle 
} from 'lucide-react';

const GuideStartupContent = () => {
  const services = [
    {
      id: 1,
      icon: Search,
      title: "Recommandations de professionnels",
      description: "Recevez une sélection de lieux et/ou prestataires de votre région",
      badge: "CONCIERGERIE",
      path: '/professionnelsmariable'
    },
    {
      id: 2,
      icon: Wrench,
      title: "Organisation facile en ligne",
      description: "Accédez à votre tableau de bord personnalisé pour planifier votre mariage en toute autonomie",
      badge: "AUTONOME",
      path: '/dashboard'
    }
  ];

  const tools = [
    {
      icon: CheckSquare,
      title: "Checklist intelligente",
      description: "Planning personnalisé selon votre style",
      path: '/dashboard/checklist-mariage'
    },
    {
      icon: Calculator,
      title: "Gestion budget",
      description: "Calculatrice budget & boissons incluses",
      path: '/dashboard/budget'
    },
    {
      icon: Users,
      title: "RSVP & plan de table",
      description: "Organisez vos invités facilement",
      path: '/dashboard/rsvp'
    },
    {
      icon: Search,
      title: "Liste prestataires",
      description: "Parcourez nos prestataires recommandés",
      path: '/dashboard/professionnelsmariable'
    },
    {
      icon: FileText,
      title: "Stockage documents",
      description: "Centralisez tous vos documents",
      path: '/dashboard/coordination'
    },
    {
      icon: Smartphone,
      title: "Coordination Jour J",
      description: "Application mobile pour le grand jour",
      path: '/dashboard/coordination'
    },
  ];

  return (
    <div className="space-y-8 p-4">
      {/* Titre principal */}
      <div className="text-center">
        <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
          Bienvenue sur <span className="text-premium-sage">Mariable</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Vous gardez le contrôle, on vous donne juste les bonnes recommandations et les bons outils.
        </p>
      </div>

      {/* Comment ça marche - 2 services */}
      <div>
        <div className="text-center mb-6">
          <Badge className="mb-2 px-3 py-1 bg-premium-sage-very-light text-premium-sage border-premium-sage-light">
            <Sparkles className="h-3 w-3 mr-1 inline" />
            Comment ça marche
          </Badge>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {services.map(service => (
            <Card 
              key={service.id} 
              className="group relative overflow-hidden border-2 border-transparent hover:border-premium-sage/30 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-premium-sage" />
              
              <CardContent className="p-5">
                <Badge className="bg-premium-sage text-white mb-3 text-xs">
                  {service.badge}
                </Badge>

                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-premium-sage flex-shrink-0">
                    <service.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {service.title}
                    </h3>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-4">
                  {service.description}
                </p>

                <Button 
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full border-premium-sage text-premium-sage hover:bg-premium-sage hover:text-white"
                >
                  <Link to={service.path}>
                    Découvrir <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Outils de planification */}
      <div>
        <h3 className="text-xl font-serif font-bold text-foreground mb-4 text-center">
          Vos outils de planification & coordination Jour J
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tools.map((tool, index) => (
            <Link 
              key={index} 
              to={tool.path}
              className="block"
            >
              <Card className="h-full hover:shadow-md hover:border-premium-sage/40 transition-all duration-300 cursor-pointer">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-premium-sage flex-shrink-0">
                    <tool.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{tool.title}</p>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* 3 points clés */}
      <div className="flex flex-wrap justify-center gap-3">
        <div className="flex items-center gap-2 bg-premium-sage/10 px-4 py-2 rounded-full">
          <Sparkles className="h-4 w-4 text-premium-sage" />
          <span className="text-sm text-muted-foreground font-medium">Dopé à l'IA</span>
        </div>
        <div className="flex items-center gap-2 bg-premium-sage/10 px-4 py-2 rounded-full">
          <PlayCircle className="h-4 w-4 text-premium-sage" />
          <span className="text-sm text-muted-foreground font-medium">Tutos explicatifs inclus</span>
        </div>
        <div className="flex items-center gap-2 bg-premium-sage/10 px-4 py-2 rounded-full">
          <MessageCircle className="h-4 w-4 text-premium-sage" />
          <span className="text-sm text-muted-foreground font-medium">Support WhatsApp inclus</span>
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
