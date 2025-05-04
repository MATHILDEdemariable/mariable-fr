
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wine, Martini, Download, Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { DrinkTier, DrinkMoment } from '@/types/drinks';
import { calculateBottles, calculatePrice } from '@/utils/drinkCalculator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  const { toast } = useToast();

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

  const exportToPDF = async () => {
    try {
      toast({
        title: "Préparation",
        description: "Génération du PDF en cours...",
      });

      const element = document.getElementById('drinks-calculator-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('calculateur-boissons.pdf');
      
      toast({
        title: "Succès",
        description: "Votre calculateur de boissons a été exporté en PDF",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF",
        variant: "destructive"
      });
    }
  };

  const shareLink = () => {
    setIsSharing(true);
    
    // Create a shareable link with parameters
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
    
    // Copy to clipboard
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
    <Card className="p-6 max-w-2xl mx-auto" id="drinks-calculator-content">
      <h2 className="text-2xl font-serif mb-6">Calculatrice boissons : quantité et budget</h2>
      
      <div className="space-y-6">
        {/* Nombre d'invités */}
        <div>
          <Label htmlFor="guests" className="text-base">Nombre d'invités</Label>
          <div className="flex items-center gap-2">
            <Input
              id="guests"
              type="number"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 0)}
              min={1}
              className="max-w-[200px] h-10"
            />
          </div>
        </div>

        {/* Moments de consommation */}
        <div>
          <Label className="mb-3 block text-base">Moments de consommation</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor={moment.id} className="flex items-center gap-2 text-base">
                  <moment.icon className="h-5 w-5" />
                  <span>{moment.label}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Gamme de boissons */}
        <div>
          <Label htmlFor="tier" className="text-base">Gamme de boissons</Label>
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
        <div>
          <Label className="mb-3 block text-base">Verres par personne</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedMoments.map((moment) => (
              <div key={moment} className="flex items-center gap-3 py-1">
                <Label htmlFor={`drinks-${moment}`} className="flex-grow text-base">
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
                  className="w-20 h-10 text-base"
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
              <div className="p-3 bg-white/50 rounded-md">
                <span className="text-muted-foreground text-base">Champagne:</span>
                <p className="font-medium text-base">{totalBottles.champagne} bouteilles</p>
              </div>
            )}
            {totalBottles.wine > 0 && (
              <div className="p-3 bg-white/50 rounded-md">
                <span className="text-muted-foreground text-base">Vin:</span>
                <p className="font-medium text-base">{totalBottles.wine} bouteilles</p>
              </div>
            )}
            {totalBottles.spirits > 0 && (
              <div className="p-3 bg-white/50 rounded-md">
                <span className="text-muted-foreground text-base">Alcools forts:</span>
                <p className="font-medium text-base">{totalBottles.spirits} bouteilles</p>
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
        
        {/* Sharing buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button 
            variant="outline"
            className="w-full sm:w-auto bg-wedding-olive/10 hover:bg-wedding-olive/20 text-wedding-olive"
            onClick={exportToPDF}
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter en PDF
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
