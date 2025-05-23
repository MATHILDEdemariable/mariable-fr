
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    try {
      toast({
        title: "Préparation",
        description: "Génération du PDF en cours...",
      });

      // Add PDF-specific styles
      const style = document.createElement('style');
      style.innerHTML = `
        .pdf-export * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .pdf-export .pdf-form-field {
          border: 2px solid #333 !important;
          background-color: #f8f9fa !important;
          padding: 8px 12px !important;
          margin: 4px 0 !important;
          border-radius: 6px !important;
          display: inline-block !important;
          min-width: 120px !important;
          text-align: center !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          line-height: 1.4 !important;
        }
        .pdf-export .pdf-checkbox-selected {
          border: 2px solid #333 !important;
          background-color: #e8f5e8 !important;
          padding: 8px 12px !important;
          margin: 4px 0 !important;
          border-radius: 6px !important;
          display: flex !important;
          align-items: center !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          line-height: 1.4 !important;
        }
        .pdf-export .pdf-checkbox-selected::before {
          content: "✓" !important;
          margin-right: 8px !important;
          color: #28a745 !important;
          font-weight: bold !important;
        }
        .pdf-export .pdf-section {
          margin-bottom: 24px !important;
          page-break-inside: avoid !important;
        }
        .pdf-export .pdf-label {
          font-weight: 600 !important;
          margin-bottom: 8px !important;
          font-size: 16px !important;
          line-height: 1.4 !important;
        }
        .pdf-export .pdf-grid {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 16px !important;
        }
        .pdf-export .pdf-results-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
          gap: 12px !important;
        }
        .pdf-export .pdf-result-item {
          background-color: #f8f9fa !important;
          border: 1px solid #ddd !important;
          padding: 12px !important;
          border-radius: 6px !important;
          text-align: center !important;
        }
      `;
      document.head.appendChild(style);

      const element = document.getElementById('drinks-calculator-content');
      if (!element) return;

      // Add PDF export class
      element.classList.add('pdf-export');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 800,
        height: element.scrollHeight
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
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('calculateur-boissons.pdf');
      
      // Clean up
      element.classList.remove('pdf-export');
      document.head.removeChild(style);
      
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
        <div className="pdf-section">
          <Label htmlFor="guests" className="pdf-label block mb-2">Nombre d'invités</Label>
          <div className="pdf-form-field">
            <span>{guests} invités</span>
          </div>
          <div className="block md:hidden mt-2">
            <Input
              id="guests"
              type="number"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 0)}
              min={1}
              className="w-full h-10"
            />
          </div>
          <div className="hidden md:block">
            <Input
              id="guests"
              type="number"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 0)}
              min={1}
              className="max-w-[200px] h-10 mt-2"
            />
          </div>
        </div>

        {/* Moments de consommation */}
        <div className="pdf-section">
          <Label className="pdf-label block mb-3">Moments de consommation</Label>
          <div className="space-y-2">
            {moments.map((moment) => (
              <div key={moment.id}>
                {selectedMoments.includes(moment.id as DrinkMoment) ? (
                  <div className="pdf-checkbox-selected">
                    <moment.icon className="h-5 w-5 mr-2" />
                    <span>{moment.label}</span>
                  </div>
                ) : null}
                <div className="block pdf-export:hidden">
                  <div className="flex items-center space-x-3 py-1">
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
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gamme de boissons */}
        <div className="pdf-section">
          <Label htmlFor="tier" className="pdf-label block mb-2">Gamme de boissons</Label>
          <div className="pdf-form-field">
            <span>{tierLabels[tier]}</span>
          </div>
          <div className="pdf-export:hidden mt-2">
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
        </div>

        {/* Verres par personne */}
        <div className="pdf-section">
          <Label className="pdf-label block mb-3">Verres par personne</Label>
          <div className="pdf-grid">
            {selectedMoments.map((moment) => (
              <div key={moment} className="space-y-2">
                <div className="font-medium">
                  {moments.find(m => m.id === moment)?.label}
                </div>
                <div className="pdf-form-field">
                  <span>{drinksPerPerson[moment]} verres</span>
                </div>
                <div className="pdf-export:hidden">
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
              </div>
            ))}
          </div>
        </div>
        
        {/* Recommandations de service */}
        <div className="pdf-section border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={18} className="text-wedding-olive" />
            <h3 className="pdf-label">Recommandations de service</h3>
          </div>
          
          <div className="bg-wedding-cream/10 p-4 rounded-md text-sm">
            <div className="pdf-grid">
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
        <div className="pdf-section border-t pt-6">
          <h3 className="pdf-label mb-4">Résultats</h3>
          
          <div className="pdf-results-grid">
            {totalBottles.champagne > 0 && (
              <div className="pdf-result-item">
                <div className="font-medium">Champagne</div>
                <div className="text-lg font-bold">{totalBottles.champagne} bouteilles</div>
              </div>
            )}
            {totalBottles.wine > 0 && (
              <div className="pdf-result-item">
                <div className="font-medium">Vin</div>
                <div className="text-lg font-bold">{totalBottles.wine} bouteilles</div>
              </div>
            )}
            {totalBottles.spirits > 0 && (
              <div className="pdf-result-item">
                <div className="font-medium">Alcools forts</div>
                <div className="text-lg font-bold">{totalBottles.spirits} bouteilles</div>
              </div>
            )}
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="text-lg font-medium flex justify-between items-center">
              <span>Coût total estimé:</span>
              <span className="pdf-form-field">{totalCost.toFixed(2)}€</span>
            </div>
          </div>
        </div>
        
        {/* Sharing buttons */}
        <div className="pdf-export:hidden flex flex-col sm:flex-row items-center justify-between gap-3">
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
