
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wine, Martini, Clock } from 'lucide-react';
import { DrinkTier, DrinkMoment } from '@/types/drinks';
import { calculateBottles, calculatePrice } from '@/utils/drinkCalculator';

const DrinksCalculator = () => {
  const [guests, setGuests] = useState(100);
  const [selectedMoments, setSelectedMoments] = useState<DrinkMoment[]>([]);
  const [tier, setTier] = useState<DrinkTier>('affordable');
  const [drinksPerPerson, setDrinksPerPerson] = useState({
    cocktail: 2,
    dinner: 3,
    dessert: 1,
    party: 2,
  });

  const moments = [
    { id: 'cocktail', label: 'Champagne au cocktail', icon: Martini },
    { id: 'dinner', label: 'Vin pendant le repas', icon: Wine },
    { id: 'dessert', label: 'Champagne dessert', icon: Martini },
    { id: 'party', label: 'Alcool fort pour la soirée', icon: Martini },
  ];

  const calculateTotals = () => {
    let totalBottles = {
      champagne: 0,
      wine: 0,
      spirits: 0,
    };
    
    let totalCost = 0;

    if (selectedMoments.includes('cocktail')) {
      const champagneBottles = calculateBottles(guests, drinksPerPerson.cocktail, 'champagne');
      totalBottles.champagne += champagneBottles;
      totalCost += calculatePrice(champagneBottles, 'champagne', tier);
    }

    if (selectedMoments.includes('dinner')) {
      const wineBottles = calculateBottles(guests, drinksPerPerson.dinner, 'wine');
      totalBottles.wine += wineBottles;
      totalCost += calculatePrice(wineBottles, 'wine', tier);
    }

    if (selectedMoments.includes('dessert')) {
      const dessertChampagne = calculateBottles(guests, drinksPerPerson.dessert, 'champagne');
      totalBottles.champagne += dessertChampagne;
      totalCost += calculatePrice(dessertChampagne, 'champagne', tier);
    }

    if (selectedMoments.includes('party')) {
      const spiritsBottles = calculateBottles(guests, drinksPerPerson.party, 'spirits');
      totalBottles.spirits += spiritsBottles;
      totalCost += calculatePrice(spiritsBottles, 'spirits', tier);
    }

    return { totalBottles, totalCost };
  };

  const { totalBottles, totalCost } = calculateTotals();

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-serif mb-6">Calculatrice boissons : quantité et budget</h2>
      
      <div className="space-y-6">
        {/* Nombre d'invités */}
        <div>
          <Label htmlFor="guests">Nombre d'invités</Label>
          <div className="flex items-center gap-2">
            <Input
              id="guests"
              type="number"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 0)}
              min={1}
              className="max-w-[200px]"
            />
          </div>
        </div>

        {/* Moments de consommation */}
        <div>
          <Label className="mb-3 block">Moments de consommation</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moments.map((moment) => (
              <div key={moment.id} className="flex items-center space-x-2">
                <Checkbox
                  id={moment.id}
                  checked={selectedMoments.includes(moment.id as DrinkMoment)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedMoments([...selectedMoments, moment.id as DrinkMoment]);
                    } else {
                      setSelectedMoments(selectedMoments.filter(m => m !== moment.id));
                    }
                  }}
                />
                <Label htmlFor={moment.id} className="flex items-center gap-2">
                  <moment.icon className="h-4 w-4" />
                  <span>{moment.label}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Gamme de boissons */}
        <div>
          <Label htmlFor="tier">Gamme de boissons</Label>
          <Select value={tier} onValueChange={(value: DrinkTier) => setTier(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sélectionnez une gamme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economic">Économique</SelectItem>
              <SelectItem value="affordable">Abordable</SelectItem>
              <SelectItem value="premium">Haut de gamme</SelectItem>
              <SelectItem value="luxury">Luxe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verres par personne */}
        <div>
          <Label className="mb-3 block">Verres par personne</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedMoments.map((moment) => (
              <div key={moment} className="flex items-center gap-2">
                <Label htmlFor={`drinks-${moment}`} className="flex-grow">
                  {moments.find(m => m.id === moment)?.label}
                </Label>
                <Input
                  id={`drinks-${moment}`}
                  type="number"
                  value={drinksPerPerson[moment]}
                  onChange={(e) => setDrinksPerPerson({
                    ...drinksPerPerson,
                    [moment]: parseInt(e.target.value) || 0
                  })}
                  min={0}
                  className="w-20"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Résultats */}
        <div className="mt-8 space-y-4 border-t pt-6">
          <h3 className="font-medium text-lg mb-4">Résultats</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {totalBottles.champagne > 0 && (
              <div>
                <span className="text-muted-foreground">Champagne:</span>
                <p className="font-medium">{totalBottles.champagne} bouteilles</p>
              </div>
            )}
            {totalBottles.wine > 0 && (
              <div>
                <span className="text-muted-foreground">Vin:</span>
                <p className="font-medium">{totalBottles.wine} bouteilles</p>
              </div>
            )}
            {totalBottles.spirits > 0 && (
              <div>
                <span className="text-muted-foreground">Alcools forts:</span>
                <p className="font-medium">{totalBottles.spirits} bouteilles</p>
              </div>
            )}
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="text-lg font-medium flex justify-between items-center">
              <span>Coût total estimé:</span>
              <span>{totalCost.toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DrinksCalculator;
