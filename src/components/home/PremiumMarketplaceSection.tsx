import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Camera, MapPin, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import VendorPreviewWidget from './VendorPreviewWidget';
const PremiumMarketplaceSection = () => {
  const vendors = [{
    id: 1,
    name: "Château de Vaux-le-Vicomte",
    category: "Lieux",
    image: "/lovable-uploads/c1b39e22-fe32-4dc7-8f94-fbb929ae43fa.png",
    icon: MapPin,
    location: "Seine-et-Marne"
  }, {
    id: 2,
    name: "Studio Lumière",
    category: "Photographes",
    image: "/lovable-uploads/3d59e058-b318-46af-a10b-9a239cc218e5.png",
    icon: Camera,
    location: "Paris"
  }, {
    id: 3,
    name: "Saveurs & Délices",
    category: "Traiteurs",
    image: "/lovable-uploads/bea0740d-427b-4f1b-95e3-2468f199ec77.png",
    icon: Utensils,
    location: "Lyon"
  }];
  const selectionProcess = ["Portfolio vérifié", "Test qualité", "Références clients", "Respect des délais"];
  return <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
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
          <p className="text-xl text-premium-charcoal max-w-3xl mx-auto">
            Nous sélectionnons les meilleurs prestataires pour vous
          </p>
        </div>

        {/* Aperçu des prestataires avec VendorPreviewWidget */}
        <div className="mb-16">
          <VendorPreviewWidget />
        </div>

        {/* Process de sélection */}
        <div className="bg-premium-warm rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-premium-black mb-6 text-center">
            Notre processus de sélection
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {selectionProcess.map((process, index) => <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-premium-sage flex-shrink-0" />
                <span className="text-premium-charcoal font-medium">{process}</span>
              </div>)}
          </div>
        </div>

        {/* CTA principal */}
        <div className="text-center">
          <Link to="/selection">
            <Button size="lg" className="btn-primary text-white px-12 py-4 text-lg font-semibold ripple">
              Explorer notre sélection
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};
export default PremiumMarketplaceSection;