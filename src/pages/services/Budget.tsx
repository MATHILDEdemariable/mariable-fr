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

        <h2 className="text-2xl font-serif mb-6 bg-wedding-cream px-4 py-2 rounded-lg inline-block">Calculez votre budget mariage</h2>
        
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-serif mb-2">Calculatrice de budget mariage</h2>
          <p className="text-muted-foreground mb-6">Estimez le budget de votre mariage en quelques étapes</p>

          <div className="space-y-1 mb-4">
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="w-1/4 h-full bg-wedding-olive rounded-full"></div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Étape 1</span>
              <span>Étape 2</span>
              <span>Étape 3</span>
              <span>Étape 4</span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-serif mb-4">Étape 1/4 : Région</h3>
            <Label className="mb-2 block">Région du mariage</Label>
            <div className="relative">
              <select className="w-full p-2 pr-8 border rounded-md appearance-none bg-white">
                <option value="">Sélectionnez une région</option>
                <option value="idf">Île-de-France</option>
                <option value="paca">Provence-Alpes-Côte d'Azur</option>
                <option value="aura">Auvergne-Rhône-Alpes</option>
                <option value="occi">Occitanie</option>
                <option value="hdf">Hauts-de-France</option>
                <option value="na">Nouvelle-Aquitaine</option>
                <option value="bfc">Bourgogne-Franche-Comté</option>
                <option value="cvl">Centre-Val de Loire</option>
                <option value="norm">Normandie</option>
                <option value="pdl">Pays de la Loire</option>
                <option value="bre">Bretagne</option>
                <option value="ge">Grand Est</option>
                <option value="corse">Corse</option>
              </select>
              <MapPin className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Button variant="outline" disabled>
              Précédent
            </Button>
            <Button className="bg-wedding-olive hover:bg-wedding-olive/90">
              Suivant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Drinks Calculator - keeping the new component */}
        <div className="mt-12">
          <DrinksCalculator />
        </div>
      </main>
    </div>
  );
};

export default Budget;
