import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, Palette, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LieuxPartenairesSection = () => {
  const lieuxBenefits = [
    "Mini-site personnalisé du lieu",
    "Vos prestataires habituels mis en avant en priorité",
    "Service premium immédiat pour vos couples",
    "Revenu passif partagé (commissions générées)",
    "Zéro travail, zéro risque, zéro gestion"
  ];

  const partenairesBenefits = [
    "Référencement dans le Club Mariable",
    "Leads pré-qualifiés via les lieux",
    "Commission uniquement en cas de vente → 0 risque",
    "Visibilité ciblée et premium",
    "Possibilité d'offrir un avantage exclusif aux mariés"
  ];

  return (
    <section id="pros-section" className="py-20 bg-[#efeee9]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-2">
            Pour les Professionnels
          </h2>
          <p className="text-lg text-muted-foreground">
            Lieux de réception, Prestataires & Marques : développez votre activité
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Lieux Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-border"
          >
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 rounded-full px-3 py-1 mb-4">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">Lieux</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
              Offrez plus, gagnez sans effort
            </h3>

            <Accordion type="single" collapsible className="mb-6">
              <AccordionItem value="avantages" className="border-none">
                <AccordionTrigger className="text-premium-sage-dark hover:no-underline py-2">
                  Voir les avantages
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {lieuxBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-premium-sage mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Link to="/mariable.ambassadeur">
              <Button className="w-full bg-premium-sage hover:bg-premium-sage-dark text-white rounded-full">
                Devenir Lieu ambassadeur
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Partenaires Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-border"
          >
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 rounded-full px-3 py-1 mb-4">
              <Palette className="w-4 h-4" />
              <span className="text-sm font-medium">Prestataires ou marques</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
              Plus de clients, sans prospection
            </h3>

            <Accordion type="single" collapsible className="mb-6">
              <AccordionItem value="avantages" className="border-none">
                <AccordionTrigger className="text-premium-sage-dark hover:no-underline py-2">
                  Voir les avantages
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {partenairesBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-premium-sage mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Link to="/mariable.partenaire">
              <Button className="w-full bg-premium-sage hover:bg-premium-sage-dark text-white rounded-full">
                Devenir Partenaire
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LieuxPartenairesSection;
