
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calculator, PieChart, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';
import DrinksCalculator from '@/components/drinks/DrinksCalculator';

const Budget = () => {
  const [budget, setBudget] = useState(25000);
  const [guests, setGuests] = useState(100);

  const categories = [
    { name: 'Lieu de réception', percentage: 40 },
    { name: 'Traiteur & boissons', percentage: 25 },
    { name: 'Décoration & fleurs', percentage: 10 },
    { name: 'Tenues & beauté', percentage: 10 },
    { name: 'Photo & vidéo', percentage: 8 },
    { name: 'Musique & animation', percentage: 5 },
    { name: 'Divers (faire-part, cadeaux...)', percentage: 2 },
  ];

  const calculateCategoryBudget = (percentage: number) => {
    return Math.round((budget * percentage) / 100);
  };

  const calculatePerGuest = (percentage: number) => {
    const categoryBudget = calculateCategoryBudget(percentage);
    return guests > 0 ? Math.round(categoryBudget / guests) : 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Budget de mariage - Calculez et planifiez vos dépenses"
        description="Utilisez notre calculateur de budget de mariage pour estimer vos dépenses et répartir votre budget selon les différentes catégories."
      />
      <Header />
      <main className="container max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-serif mb-2">Budget de mariage</h1>
        <p className="text-xl text-muted-foreground mb-4">Calculez et gérez votre budget de mariage</p>
        
        <p className="mb-8">
          La transparence des prix est au cœur de notre approche. Notre plateforme vous permet d'accéder aux tarifs réels des prestataires sans mauvaises surprises.
        </p>

        <Tabs defaultValue="calculator" className="space-y-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="calculator">Calculatrice</TabsTrigger>
            <TabsTrigger value="breakdown">Répartition</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-8">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="h-6 w-6 text-wedding-olive" />
                <h2 className="text-2xl font-serif">Simulez votre budget</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="budget" className="mb-2 block">Budget total (€)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="budget"
                      min={5000}
                      max={100000}
                      step={1000}
                      value={[budget]}
                      onValueChange={(vals) => setBudget(vals[0])}
                      className="flex-grow"
                    />
                    <Input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="guests" className="mb-2 block">Nombre d'invités</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="guests"
                      min={10}
                      max={500}
                      step={5}
                      value={[guests]}
                      onValueChange={(vals) => setGuests(vals[0])}
                      className="flex-grow"
                    />
                    <Input
                      type="number"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="h-6 w-6 text-wedding-olive" />
                <h2 className="text-2xl font-serif">Répartition suggérée</h2>
              </div>
              
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span>{category.name}</span>
                      <span className="font-medium">{category.percentage}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{calculateCategoryBudget(category.percentage)} €</span>
                      <span>{calculatePerGuest(category.percentage)} € / invité</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full mt-1">
                      <div
                        className="bg-wedding-olive h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <Separator className="mt-3 mb-2" />
                  </div>
                ))}
                
                <div className="mt-6 flex justify-between items-center text-lg font-medium">
                  <span>Total</span>
                  <span>{budget} €</span>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="breakdown">
            <Card className="p-6">
              <h2 className="text-2xl font-serif mb-6">Détails par poste de dépense</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-4">Lieu de réception</h3>
                  <p className="mb-2">Comprend : location de la salle, hébergement, mobilier de base</p>
                  <p className="text-muted-foreground">Le lieu de réception représente généralement le poste de dépense le plus important d'un mariage. Les prix varient considérablement selon la région, la saison, et les prestations incluses.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4">Traiteur & boissons</h3>
                  <p className="mb-2">Comprend : cocktail, repas, service, location de matériel spécifique</p>
                  <p className="text-muted-foreground">Le budget traiteur est calculé sur une base par personne et dépend du type de menu, du nombre de pièces au cocktail, et du niveau de service.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4">Décoration & fleurs</h3>
                  <p className="mb-2">Comprend : décorations de salle, centres de table, bouquets, arche florale</p>
                  <p className="text-muted-foreground">Les fleurs fraîches représentent un coût significatif. Certains couples optent pour un mélange de fleurs fraîches et artificielles pour optimiser leur budget.</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Texte de transition vers la calculatrice de boissons */}
        <div className="my-8 p-4 bg-wedding-cream rounded-lg">
          <p className="text-lg">
            L'estimation du budget traiteur ci-dessus est calculée hors boissons. Pour vous aider à prévoir avec précision la quantité et le coût des boissons pour votre mariage, nous avons développé une calculatrice spéciale ci-dessous.
          </p>
        </div>

        {/* Calculatrice de boissons */}
        <div className="mt-4 mb-12">
          <DrinksCalculator />
        </div>
      </main>
    </div>
  );
};

export default Budget;
