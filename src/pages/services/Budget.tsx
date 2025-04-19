import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Euro, Calculator, PieChart, ArrowRight } from 'lucide-react';
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
        <h1 className="text-3xl font-serif mb-8">Budget</h1>
        
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-serif mb-6 flex items-center">
            <Calculator className="mr-2 h-5 w-5 text-wedding-olive" />
            Calculateur de budget
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label htmlFor="budget" className="mb-2 block">
                Budget total
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                  className="max-w-[200px]"
                />
                <Euro className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="mt-6">
                <Slider
                  value={[budget]}
                  min={5000}
                  max={100000}
                  step={1000}
                  onValueChange={(value) => setBudget(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 000€</span>
                  <span>50 000€</span>
                  <span>100 000€</span>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="guests" className="mb-2 block">
                Nombre d'invités
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="guests"
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 0)}
                  min={1}
                  className="max-w-[200px]"
                />
                <span className="text-muted-foreground">personnes</span>
              </div>
              
              <div className="mt-6">
                <Slider
                  value={[guests]}
                  min={10}
                  max={300}
                  step={5}
                  onValueChange={(value) => setGuests(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10</span>
                  <span>150</span>
                  <span>300</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <PieChart className="mr-2 h-4 w-4 text-wedding-olive" />
              Répartition recommandée
            </h3>
            
            <Tabs defaultValue="percentage">
              <TabsList className="mb-4">
                <TabsTrigger value="percentage">Pourcentage</TabsTrigger>
                <TabsTrigger value="amount">Montant</TabsTrigger>
                <TabsTrigger value="per-guest">Par invité</TabsTrigger>
              </TabsList>
              
              <TabsContent value="percentage">
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.name} className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <span className="font-medium">{category.percentage}%</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="amount">
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.name} className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <span className="font-medium">{calculateCategoryBudget(category.percentage)}€</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="per-guest">
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.name} className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <span className="font-medium">{calculatePerGuest(category.percentage)}€ / invité</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mt-8 text-center">
            <Button className="bg-wedding-olive hover:bg-wedding-olive/90">
              Créer mon budget personnalisé
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* New drinks calculator */}
        <div className="mt-12">
          <DrinksCalculator />
        </div>
      </main>
    </div>
  );
};

export default Budget;
