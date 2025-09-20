import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Camera, MapPin, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumMarketplaceSection = () => {
  const vendors = [
    {
      id: 1,
      name: "Château de Vaux-le-Vicomte",
      category: "Lieux",
      image: "/lovable-uploads/c1b39e22-fe32-4dc7-8f94-fbb929ae43fa.png",
      icon: MapPin,
      location: "Seine-et-Marne"
    },
    {
      id: 2,
      name: "Studio Lumière",
      category: "Photographes",
      image: "/lovable-uploads/3d59e058-b318-46af-a10b-9a239cc218e5.png",
      icon: Camera,
      location: "Paris"
    },
    {
      id: 3,
      name: "Saveurs & Délices",
      category: "Traiteurs",
      image: "/lovable-uploads/bea0740d-427b-4f1b-95e3-2468f199ec77.png",
      icon: Utensils,
      location: "Lyon"
    }
  ];

  const selectionProcess = [
    "Portfolio vérifié",
    "Test qualité",
    "Références clients",
    "Respect des délais"
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-premium-warm text-premium-charcoal border-premium-light">
            Sélection premium
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-premium-black mb-6">
            Une sélection d'exception,
            <br />
            <span className="bg-gradient-to-r from-premium-gradient-start via-premium-gradient-mid to-premium-gradient-end bg-clip-text text-transparent">
              pas un annuaire
            </span>
          </h2>
          <p className="text-xl text-premium-charcoal max-w-3xl mx-auto">
            Nous sélectionnons les meilleurs prestataires pour vous
          </p>
        </div>

        {/* Grid des prestataires */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {vendors.map((vendor) => (
            <Card key={vendor.id} className="group hover:scale-105 transition-all duration-300 bg-white shadow-lg border-premium-light overflow-hidden">
              <div className="relative">
                <img 
                  src={vendor.image} 
                  alt={vendor.name}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-premium-gradient-start to-premium-gradient-mid text-white border-0">
                  Certifié Mariable
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-premium-warm rounded-full">
                    <vendor.icon className="h-5 w-5 text-premium-charcoal" />
                  </div>
                  <span className="text-sm font-medium text-premium-charcoal uppercase tracking-wide">
                    {vendor.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-premium-black mb-2">
                  {vendor.name}
                </h3>
                <p className="text-premium-charcoal">
                  {vendor.location}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process de sélection */}
        <div className="bg-premium-warm rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-premium-black mb-6 text-center">
            Notre processus de sélection
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {selectionProcess.map((process, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span className="text-premium-charcoal font-medium">{process}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA principal */}
        <div className="text-center">
          <Link to="/selection">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-premium-gradient-start via-premium-gradient-mid to-premium-gradient-end text-white hover:opacity-90 transition-all duration-300 hover:scale-105 px-12 py-4 text-lg font-semibold"
            >
              Explorer notre sélection
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PremiumMarketplaceSection;