
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { MapPin, Users, Star, Award, CalendarCheck, Euro } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Demo = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  const disabledDates = [
    new Date(2025, 5, 15),
    new Date(2025, 5, 16),
    new Date(2025, 5, 17),
    new Date(2025, 6, 1),
  ];

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
                      onSelect={setDate}
                      disabled={disabledDates}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Button className="w-full mt-4 bg-wedding-olive hover:bg-wedding-olive/90">
                  Réserver
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
