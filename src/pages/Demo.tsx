import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MapPin, Users, Star, Award, CalendarCheck, Euro, MessageSquare } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';

interface Package {
  name: string;
  basePrice: number;
  description: string;
}

const packages: Package[] = [
  { name: 'Classique', basePrice: 3200, description: 'Location simple du domaine' },
  { name: 'Premium', basePrice: 4500, description: 'Location + coordination' },
  { name: 'Luxe', basePrice: 6000, description: 'Service tout inclus' },
];

const Demo = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<number>(100);
  const [selectedPackage, setSelectedPackage] = useState<Package>(packages[0]);
  
  const disabledDates = [
    new Date(2025, 5, 15),
    new Date(2025, 5, 16),
    new Date(2025, 5, 17),
    new Date(2025, 6, 1),
  ];

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      const isDisabled = disabledDates.some(
        (disabled) => disabled.toDateString() === newDate.toDateString()
      );
      if (isDisabled) {
        toast({
          description: "Cette date n'est pas disponible",
          variant: "destructive",
        });
      } else {
        toast({
          description: "Date disponible ! Vous pouvez poursuivre votre réservation.",
        });
      }
    }
  };

  const calculateTotal = () => {
    const basePrice = selectedPackage.basePrice;
    const commission = basePrice * 0.04; // 4% de commission
    return {
      basePrice,
      commission,
      total: basePrice + commission
    };
  };

  const prices = calculateTotal();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full">
          <img
            src="/lovable-uploads/17e05913-97e1-4dec-bc8b-2e038b342ec2.png"
            alt="Château de Mariable"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="container max-w-6xl px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-grow space-y-6">
              <div>
                <h1 className="text-3xl font-serif mb-2">Château de Mariable</h1>
                <div className="flex items-center text-muted-foreground gap-2 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>Cap Ferret, Sud-Ouest</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Exclusif
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Prestataire recommandé
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CalendarCheck className="h-3 w-3" />
                    Disponible 2025
                  </Badge>
                </div>
              </div>

              {/* Key Information */}
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-wedding-olive" />
                    <div>
                      <p className="font-medium">Capacité</p>
                      <p className="text-sm text-muted-foreground">Jusqu'à 200 invités</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Euro className="h-5 w-5 text-wedding-olive" />
                    <div>
                      <p className="font-medium">À partir de</p>
                      <p className="text-sm text-muted-foreground">3200€ / jour</p>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-muted-foreground">
                  Un château authentique du XVIIIe siècle niché dans un parc de 15 hectares, 
                  offrant un cadre exceptionnel pour votre mariage de rêve.
                </p>
              </Card>

              {/* Pricing Options */}
              <div className="space-y-4">
                <h2 className="text-xl font-serif">Nos formules</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Classique</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Location simple du domaine
                    </p>
                    <p className="font-medium">3200€</p>
                  </Card>
                  <Card className="p-4 border-wedding-olive">
                    <h3 className="font-medium mb-2">Premium</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Location + coordination
                    </p>
                    <p className="font-medium">4500€</p>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">À la carte</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Services personnalisés
                    </p>
                    <p className="font-medium">Sur devis</p>
                  </Card>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-4">Vérifier les disponibilités</h3>
                
                {/* Date Selection */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {date ? date.toLocaleDateString() : 'Sélectionner une date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      disabled={disabledDates}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                {/* Guest Count */}
                <div className="mt-4">
                  <Label htmlFor="guests">Nombre d'invités</Label>
                  <Input
                    id="guests"
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 0)}
                    min={1}
                    max={200}
                    className="mt-1"
                  />
                </div>

                {/* Package Selection */}
                <div className="mt-4">
                  <Label>Formule</Label>
                  <RadioGroup 
                    value={selectedPackage.name} 
                    onValueChange={(value) => setSelectedPackage(packages.find(p => p.name === value) || packages[0])}
                    className="mt-2"
                  >
                    {packages.map((pkg) => (
                      <div key={pkg.name} className="flex items-center space-x-2">
                        <RadioGroupItem value={pkg.name} id={pkg.name} />
                        <Label htmlFor={pkg.name}>{pkg.name}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Price Breakdown */}
                <div className="mt-6 border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Prix de base</span>
                    <span>{prices.basePrice}€</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Frais de réservation (4%)</span>
                    <span>{prices.commission}€</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg border-t pt-2">
                    <span>Total</span>
                    <span>{prices.total}€</span>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-wedding-olive hover:bg-wedding-olive/90">
                  Prendre RDV
                </Button>
              </Card>

              <Card className="p-4">
                <Button variant="outline" className="w-full" onClick={() => toast({ description: "La messagerie sera bientôt disponible" })}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contacter
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Demo;
