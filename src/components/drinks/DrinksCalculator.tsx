
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';
import { useUserProfile } from '@/hooks/useUserProfile';

const DrinksCalculator = () => {
  const { t } = useTranslation('weddingDay');
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
  const { isPremium } = useUserProfile();
  const {
    executeAction,
    showPremiumModal,
    closePremiumModal,
    feature,
    description
  } = usePremiumAction({
    feature: t('drinks.premiumFeature'),
    description: t('drinks.premiumDesc')
  });

  const moments = [
    { id: 'cocktail', label: t('drinks.moments.cocktail'), icon: Martini },
    { id: 'dinner', label: t('drinks.moments.dinner'), icon: Wine },
    { id: 'dessert', label: t('drinks.moments.dessert'), icon: Martini },
    { id: 'party', label: t('drinks.moments.party'), icon: Martini },
  ];

  const calculateTotals = () => {
    let totalBottles = { champagne: 0, wine: 0, spirits: 0 };
    let totalCost = 0;

    if (selectedMoments.includes('cocktail')) {
      const b = calculateBottles(guests, drinksPerPerson.cocktail, 'champagne');
      totalBottles.champagne += b;
      totalCost += calculatePrice(b, 'champagne', tier);
    }
    if (selectedMoments.includes('dinner')) {
      const b = calculateBottles(guests, drinksPerPerson.dinner, 'wine');
      totalBottles.wine += b;
      totalCost += calculatePrice(b, 'wine', tier);
    }
    if (selectedMoments.includes('dessert')) {
      const b = calculateBottles(guests, drinksPerPerson.dessert, 'champagne');
      totalBottles.champagne += b;
      totalCost += calculatePrice(b, 'champagne', tier);
    }
    if (selectedMoments.includes('party')) {
      const b = calculateBottles(guests, drinksPerPerson.party, 'spirits');
      totalBottles.spirits += b;
      totalCost += calculatePrice(b, 'spirits', tier);
    }
    return { totalBottles, totalCost };
  };

  const { totalBottles, totalCost } = calculateTotals();

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      toast({ title: t('drinks.pdfPreparing'), description: t('drinks.pdfPreparingDesc') });
      const success = await exportDrinksCalculatorToPDF({
        guests, selectedMoments, tier, drinksPerPerson, totalBottles, totalCost
      });
      if (success) {
        toast({ title: t('drinks.pdfSuccess'), description: t('drinks.pdfSuccessDesc') });
      } else {
        toast({ title: t('budgetCalc.errorTitle'), description: t('drinks.pdfErrorDesc'), variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({ title: t('budgetCalc.errorTitle'), description: t('drinks.pdfErrorDesc'), variant: 'destructive' });
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
      tier,
      cocktail: drinksPerPerson.cocktail.toString(),
      dinner: drinksPerPerson.dinner.toString(),
      dessert: drinksPerPerson.dessert.toString(),
      party: drinksPerPerson.party.toString()
    });
    const shareUrl = `${baseUrl}?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({ title: t('drinks.linkCopied'), description: t('drinks.linkCopiedDesc') });
        setTimeout(() => setIsSharing(false), 2000);
      })
      .catch(err => {
        console.error('Error copying link:', err);
        toast({ title: t('budgetCalc.errorTitle'), description: t('drinks.copyError'), variant: 'destructive' });
        setIsSharing(false);
      });
  };

  return (
    <>
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={closePremiumModal}
        feature={feature}
        description={description}
      />
      <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-serif mb-6">{t('drinks.title')}</h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="guests" className="block mb-2">{t('drinks.guests')}</Label>
          <Input
            id="guests"
            type="number"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 0)}
            min={1}
            className="max-w-[200px] h-10"
          />
        </div>

        <div>
          <Label className="block mb-3">{t('drinks.momentsLabel')}</Label>
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

        <div>
          <Label htmlFor="tier" className="block mb-2">{t('drinks.tierLabel')}</Label>
          <Select value={tier} onValueChange={(value: DrinkTier) => setTier(value)}>
            <SelectTrigger className="w-full sm:w-[200px] h-10">
              <SelectValue placeholder={t('drinks.tierPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economic">{t('drinks.tiers.economic')}</SelectItem>
              <SelectItem value="affordable">{t('drinks.tiers.affordable')}</SelectItem>
              <SelectItem value="premium">{t('drinks.tiers.premium')}</SelectItem>
              <SelectItem value="luxury">{t('drinks.tiers.luxury')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedMoments.length > 0 && (
          <div>
            <Label className="block mb-3">{t('drinks.glassesPerPerson')}</Label>
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
        
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={18} className="text-wedding-olive" />
            <h3 className="font-medium">{t('drinks.recommendationsTitle')}</h3>
          </div>
          
          <div className="bg-wedding-cream/10 p-4 rounded-md text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium mb-1">{t('drinks.recommendations.aperitifTitle')}</p>
                <p>{t('drinks.recommendations.aperitifLine1')}</p>
                
                <p className="font-medium mt-3 mb-1">{t('drinks.recommendations.mealTitle')}</p>
                <p>{t('drinks.recommendations.mealLine1')}</p>
                <p>{t('drinks.recommendations.mealLine2')}</p>
              </div>
              <div>
                <p className="font-medium mb-1">{t('drinks.recommendations.dessertTitle')}</p>
                <p>{t('drinks.recommendations.dessertLine1')}</p>
                
                <p className="font-medium mt-3 mb-1">{t('drinks.recommendations.partyTitle')}</p>
                <p>{t('drinks.recommendations.partyLine1')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">{t('drinks.resultsTitle')}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {totalBottles.champagne > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="font-medium">{t('drinks.champagne')}</div>
                <div className="text-lg font-bold">{totalBottles.champagne} {t('drinks.bottles')}</div>
              </div>
            )}
            {totalBottles.wine > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="font-medium">{t('drinks.wine')}</div>
                <div className="text-lg font-bold">{totalBottles.wine} {t('drinks.bottles')}</div>
              </div>
            )}
            {totalBottles.spirits > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="font-medium">{t('drinks.spirits')}</div>
                <div className="text-lg font-bold">{totalBottles.spirits} {t('drinks.bottles')}</div>
              </div>
            )}
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="text-lg font-medium flex justify-between items-center">
              <span>{t('drinks.totalCost')}</span>
              <span className="text-wedding-olive font-bold">{totalCost.toFixed(2)}€</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button 
            variant="outline"
            className="w-full sm:w-auto bg-wedding-olive/10 hover:bg-wedding-olive/20 text-wedding-olive"
            onClick={() => executeAction(exportToPDF)}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t('drinks.exporting')}
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                {t('drinks.exportPdf')}
              </>
            )}
          </Button>
          
          <Button 
            variant="outline"
            className="w-full sm:w-auto bg-wedding-cream/10 hover:bg-wedding-cream/20"
            onClick={() => executeAction(shareLink)}
            disabled={isSharing}
          >
            {isSharing ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t('drinks.linkCopied')}
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                {t('drinks.shareLink')}
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
    </>
  );
};

export default DrinksCalculator;
