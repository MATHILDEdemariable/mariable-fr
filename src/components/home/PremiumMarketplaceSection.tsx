import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import VendorPreviewWidget from './VendorPreviewWidget';
import { motion } from 'framer-motion';

const PremiumMarketplaceSection = () => {
  const selectionProcess = [
    "Portfolio vérifié",
    "Test qualité",
    "Références clients",
    "Respect des délais"
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 text-xs tracking-[0.2em] uppercase text-editorial-gold border border-[hsl(42,56%,52%,0.3)] mb-6">
            Sélection premium
          </span>
          
          <h2 className="font-editorial text-3xl md:text-4xl lg:text-5xl text-editorial-charcoal mb-6 leading-tight">
            Une sélection d'exception,
            <br />
            <span className="font-editorial-italic text-premium-sage">pas un annuaire</span>
          </h2>
          
          <div className="editorial-divider" />
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
            Nous sélectionnons les meilleurs prestataires pour vous
          </p>
        </motion.div>

        {/* Vendor Preview Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <VendorPreviewWidget />
        </motion.div>

        {/* Selection Process - Editorial style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-editorial-warm rounded-none p-12 mb-16"
        >
          <h3 className="font-editorial text-2xl text-editorial-charcoal mb-8 text-center">
            Notre processus de sélection
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            {selectionProcess.map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-4"
              >
                <CheckCircle className="h-5 w-5 text-premium-sage flex-shrink-0" />
                <span className="text-muted-foreground">{process}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA - Editorial style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/selection">
            <Button 
              size="lg" 
              className="bg-editorial-charcoal text-white hover:bg-foreground px-12 py-6 text-sm tracking-wide rounded-none border-0"
              style={{ backgroundColor: 'hsl(0, 0%, 15%)' }}
            >
              Explorer notre sélection
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumMarketplaceSection;
