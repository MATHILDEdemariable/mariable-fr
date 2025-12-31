import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Calculator, Users, Home, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PremiumToolsSection = () => {
  const tools = [
    {
      icon: CheckSquare,
      title: "Checklist intelligente",
      description: "Planning personnalisé selon votre style de mariage",
    },
    {
      icon: Calculator,
      title: "Gestion budget",
      description: "Suivez vos dépenses en temps réel",
    },
    {
      icon: Users,
      title: "RSVP & plan de table",
      description: "Organisez vos invités facilement",
      badge: "BETA",
    },
    {
      icon: Home,
      title: "Gestion hébergements",
      description: "Centralisez les logements de vos invités",
    },
    {
      icon: FileText,
      title: "Stockage documents",
      description: "Tous vos documents au même endroit",
    },
    {
      icon: Calculator,
      title: "Calculatrice boissons",
      description: "Estimations précises pour votre réception",
    },
  ];

  return (
    <section className="py-24 bg-editorial-cream">
      <div className="container mx-auto px-6">
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 text-xs tracking-[0.2em] uppercase text-premium-sage border border-premium-sage/30 mb-6">
            Inclus pour tous
          </span>
          
          <h2 className="font-editorial text-3xl md:text-4xl lg:text-5xl text-editorial-charcoal mb-6">
            Votre espace personnalisé
          </h2>
          
          <div className="editorial-divider" />
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
            Des outils élégants pour organiser chaque détail de votre mariage
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="editorial-card bg-white border-0 shadow-sm hover:shadow-lg rounded-none">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-premium-sage/10 flex-shrink-0">
                        <tool.icon className="h-5 w-5 text-premium-sage" />
                      </div>
                      <div>
                        <h3 className="font-medium text-editorial-charcoal mb-1 flex items-center gap-2">
                          {tool.title}
                          {tool.badge && (
                            <Badge className="text-[10px] bg-premium-sage text-white rounded-none px-2">
                              {tool.badge}
                            </Badge>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Mockup Interface - Editorial style */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-white shadow-2xl border border-foreground/5 overflow-hidden">
              {/* Header mockup */}
              <div className="bg-editorial-charcoal p-6" style={{ backgroundColor: 'hsl(0, 0%, 15%)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 bg-white/20 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-white/20 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-white/20 rounded-full"></div>
                </div>
                <h4 className="text-white font-editorial text-lg">Mon Planning</h4>
              </div>

              {/* Content mockup */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 py-3 border-b border-foreground/5">
                  <div className="w-3 h-3 bg-premium-sage"></div>
                  <span className="text-sm text-foreground flex-1">Réserver la salle</span>
                  <span className="text-xs text-premium-sage">Terminé</span>
                </div>
                <div className="flex items-center gap-4 py-3 border-b border-foreground/5">
                  <div className="w-3 h-3 border-2 border-amber-500"></div>
                  <span className="text-sm text-foreground flex-1">Choisir le traiteur</span>
                  <span className="text-xs text-amber-600">En cours</span>
                </div>
                <div className="flex items-center gap-4 py-3">
                  <div className="w-3 h-3 border border-foreground/20"></div>
                  <span className="text-sm text-muted-foreground flex-1">Sélectionner les fleurs</span>
                  <span className="text-xs text-muted-foreground">À faire</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-editorial-charcoal text-white hover:bg-foreground px-12 py-6 text-sm tracking-wide rounded-none border-0"
              style={{ backgroundColor: 'hsl(0, 0%, 15%)' }}
            >
              Créer un compte
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumToolsSection;
