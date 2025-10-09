import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import VendorPreviewWidget from './VendorPreviewWidget';
import CarnetAdressesModal from './CarnetAdressesModal';
const PremiumMarketplaceSectionCouple = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectionProcess = ["Portfolio vérifié", "Test qualité", "Références clients", "Respect des délais"];
  return <>
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-4 px-4 py-2 bg-premium-warm text-premium-charcoal border-premium-light">
              Sélection premium
            </Badge>
            <h2 className="text-4xl font-bold text-premium-black mb-6 md:text-4xl">
              Une sélection d'exception,
              <br />
              <span className="bg-gradient-to-r from-premium-sage via-premium-sage-medium to-premium-sage-light bg-clip-text text-transparent">
                pas un annuaire
              </span>
            </h2>
            <p className="text-xl text-premium-charcoal max-w-3xl mx-auto mb-6">
              Nous sélectionnons les meilleurs prestataires pour vous
            </p>
          </div>

          {/* Aperçu des prestataires avec VendorPreviewWidget */}
          <div className="mb-4">
            <VendorPreviewWidget />
          </div>

          {/* Process de sélection - padding réduit */}
          <div className="bg-premium-warm rounded-2xl p-8 mb-12">
            <div className="grid md:grid-cols-4 gap-6">
              {selectionProcess.map((process, index) => <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-premium-sage flex-shrink-0" />
                  <span className="text-premium-charcoal font-medium text-sm">{process}</span>
                </div>)}
            </div>
          </div>

          {/* CTAs principaux */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="btn-primary text-white px-12 py-4 text-lg font-semibold ripple" onClick={() => setIsModalOpen(true)}>
                Recevoir votre sélection personnalisée
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary border-premium-sage text-premium-sage hover:bg-premium-sage/5 px-12 py-4 text-lg font-semibold ripple" onClick={() => window.location.href = '/selection'}>
                Découvrir notre sélection complète
              </Button>
            </div>
            <div className="text-sm text-premium-charcoal max-w-2xl mx-auto space-y-1">
              
              <p>Professionnels d'excellence et de confiance triés sur le volet</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Carnet d'Adresses */}
      <CarnetAdressesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>;
};
export default PremiumMarketplaceSectionCouple;