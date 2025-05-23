
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wine, Martini, Download, Share2, Check, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { DrinkTier, DrinkMoment } from '@/types/drinks';
import { calculateBottles, calculatePrice } from '@/utils/drinkCalculator';
import { exportDrinksCalculatorToPDF } from '@/services/drinksExportService';

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
  const [isSharing, setIsSharing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const moments = [
    { id: 'cocktail', label: 'Champagne au cocktail', icon: Martini },
    { id: 'dinner', label: 'Vin pendant le repas', icon: Wine },
    { id: 'dessert', label: 'Champagne dessert', icon: Martini },
    { id: 'party', label: 'Alcool fort pour la soirée', icon: Martini },
  ];

  const tierLabels = {
    economic: 'Économique',
    affordable: 'Abordable',
    premium: 'Haut de gamme',
    luxury: 'Luxe'
  };

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

  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      toast({
        title: "Préparation",
        description: "Génération du PDF en cours...",
      });

      const exportData = {
        guests,
        selectedMoments,
        tier,
        drinksPerPerson,
        totalBottles,
        totalCost
      };

      const success = await exportDrinksCalculatorToPDF(exportData);
      
      if (success) {
        toast({
          title: "Succès",
          description: "Votre calculateur de boissons a été exporté en PDF",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de générer le PDF",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const shareLink = () => {
    setIsSharing(true);
    
    const baseUrl = window.location.origin + '/dashboard/drinks';
    const params = new URLSearchParams({
      guests: guests.toString(),
      moments: selectedMoments.join(','),
      tier: tier,
      cocktail: drinksPerPerson.cocktail.toString(),
      dinner: drinksPerPerson.dinner.toString(),
      dessert: drinksPerPerson.dessert.toString(),
      party: drinksPerPerson.party.toString()
    });
    
    const shareUrl = `${baseUrl}?${params.toString()}`;
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: "Lien copié",
          description: "Le lien vers votre calcul a été copié dans le presse-papier",
        });
        setTimeout(() => setIsSharing(false), 2000);
      })
      .catch(err => {
        console.error('Error copying link:', err);
        toast({
          title: "Erreur",
          description: "Impossible de copier le lien",
          variant: "destructive"
        });
        setIsSharing(false);
      });
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-serif mb-6">Calculatrice boissons : quantité et budget</h2>
      
      <div className="space-y-6">
        {/* Nombre d'invités */}
        <div>
          <Label htmlFor="guests" className="block mb-2">Nombre d'invités</Label>
          <Input
            id="guests"
            type="number"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 0)}
            min={1}
            className="max-w-[200px] h-10"
          />
        </div>

        {/* Moments de consommation */}
        <div>
          <Label className="block mb-3">Moments de consommation</Label>
          <div className="space-y-2">
            {moments.map((moment) => (
              <div key={moment.id} className="flex items-center space-x-3 py-1">
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
                  className="h-5 w-5"
                />
                <Label htmlFor={moment.id} className="flex items-center gap-2 text-base cursor-pointer">
                  <moment.icon className="h-5 w-5" />
                  <span>{moment.label}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Gamme de boissons */}
        <div>
          <Label htmlFor="tier" className="block mb-2">Gamme de boissons</Label>
          <Select value={tier} onValueChange={(value: DrinkTier) => setTier(value)}>
            <SelectTrigger className="w-full sm:w-[200px] h-10">
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
        {selectedMoments.length > 0 && (
          <div>
            <Label className="block mb-3">Verres par personne</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedMoments.map((moment) => (
                <div key={moment} className="space-y-2">
                  <div className="font-medium">
                    {moments.find(m => m.id === moment)?.label}
                  </div>
                  <Input
                    id={`drinks-${moment}`}
                    type="number"
                    value={drinksPerPerson[moment]}
                    onChange={(e) => setDrinksPerPerson({
                      ...drinksPerPerson,
                      [moment]: parseInt(e.target.value) || 0
                    })}
                    min={0}
                    className="w-20 h-10 text-right"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Recommandations de service */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={18} className="text-wedding-olive" />
            <h3 className="font-medium">Recommandations de service</h3>
          </div>
          
          <div className="bg-wedding-cream/10 p-4 rounded-md text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium mb-1">Apéritif/Cocktail (1 à 1,5 heure) :</p>
                <p>• Champagne ou cocktail : 2 à 3 coupes/verres par personne</p>
                
                <p className="font-medium mt-3 mb-1">Repas (2 à 3 heures) :</p>
                <p>• Vin Blanc (entrée ou poisson) : 1 verre par personne</p>
                <p>• Vin Rouge (plat principal) : 2 verres par personne</p>
              </div>
              <div>
                <p className="font-medium mb-1">Dessert :</p>
                <p>• Champagne pour le toast : 1 coupe par personne</p>
                
                <p className="font-medium mt-3 mb-1">Soirée dansante (4 heures ou plus) :</p>
                <p>• Cocktails : 1 verre par heure par personne</p>
              </div>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">Résultats</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {totalBottles.champagne > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="font-medium">Champagne</div>
                <div className="text-lg font-bold">{totalBottles.champagne} bouteilles</div>
              </div>
            )}
            {totalBottles.wine > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="font-medium">Vin</div>
                <div className="text-lg font-bold">{totalBottles.wine} bouteilles</div>
              </div>
            )}
            {totalBottles.spirits > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="font-medium">Alcools forts</div>
                <div className="text-lg font-bold">{totalBottles.spirits} bouteilles</div>
              </div>
            )}
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="text-lg font-medium flex justify-between items-center">
              <span>Coût total estimé:</span>
              <span className="text-wedding-olive font-bold">{totalCost.toFixed(2)}€</span>
            </div>
          </div>
        </div>
        
        {/* Sharing buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button 
            variant="outline"
            className="w-full sm:w-auto bg-wedding-olive/10 hover:bg-wedding-olive/20 text-wedding-olive"
            onClick={exportToPDF}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Export...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Exporter en PDF
              </>
            )}
          </Button>
          
          <Button 
            variant="outline"
            className="w-full sm:w-auto bg-wedding-cream/10 hover:bg-wedding-cream/20"
            onClick={shareLink}
            disabled={isSharing}
          >
            {isSharing ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Lien copié
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Partager le lien
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DrinksCalculator;
