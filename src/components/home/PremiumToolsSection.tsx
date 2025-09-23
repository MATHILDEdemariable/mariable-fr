import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Calculator, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
const PremiumToolsSection = () => {
  const tools = [{
    icon: CheckSquare,
    title: "Checklist intelligente",
    description: "Planning personnalisé selon votre style de mariage",
    gradient: "from-premium-sage to-premium-sage-medium"
  }, {
    icon: Calculator,
    title: "Gestion budget interactive",
    description: "Suivez vos dépenses en temps réel",
    gradient: "from-premium-sage-medium to-premium-sage-light"
  }, {
    icon: Users,
    title: "Calculatrice budget & boissons",
    description: "Estimations précises pour votre réception",
    gradient: "from-premium-sage-light to-premium-sage"
  }];
  return <section className="py-24 bg-premium-base">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-premium-sage-very-light text-premium-sage border-premium-sage-light">
            Inclus pour tous
          </Badge>
          <h2 className="text-4xl font-bold text-premium-black mb-6 md:text-4xl">
            Votre espace privé
            <br />
            <span className="bg-gradient-to-r from-premium-sage via-premium-sage-medium to-premium-sage-light bg-clip-text text-transparent">
              offert
            </span>
          </h2>
          <p className="text-xl text-premium-charcoal max-w-3xl mx-auto">
            Outils gratuits pour organiser votre mariage
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Features */}
          <div className="space-y-6">
            {tools.map((tool, index) => <Card key={index} className="feature-card group bg-white shadow-lg border-premium-light section-reveal stagger-item">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${tool.gradient} flex-shrink-0`}>
                      <tool.icon className="feature-icon h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-premium-black mb-2">
                        {tool.title}
                      </h3>
                      <p className="text-premium-charcoal">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>

          {/* Mockup Interface */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-premium-light overflow-hidden">
              {/* Header mockup */}
              <div className="bg-gradient-to-r from-premium-sage via-premium-sage-medium to-premium-sage-light p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                </div>
                <h4 className="text-white font-semibold mt-4">Mon Planning Mariage</h4>
              </div>
              
              {/* Content mockup */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-premium-charcoal">Réserver la salle</span>
                  <Badge className="ml-auto bg-green-100 text-green-700">Terminé</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-premium-sage rounded"></div>
                  <span className="text-premium-charcoal">Choisir le traiteur</span>
                  <Badge className="ml-auto bg-orange-100 text-orange-700">En cours</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-premium-light rounded"></div>
                  <span className="text-premium-charcoal/60">Sélectionner les fleurs</span>
                  <Badge className="ml-auto bg-gray-100 text-gray-600">À faire</Badge>
                </div>
              </div>
            </div>

            {/* Glassmorphism overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-premium-gradient-start/10 via-transparent to-premium-gradient-end/10 rounded-2xl pointer-events-none"></div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/register">
            <Button size="lg" className="btn-primary text-white px-12 py-4 text-lg font-semibold ripple">
              Créer mon espace gratuit
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};
export default PremiumToolsSection;