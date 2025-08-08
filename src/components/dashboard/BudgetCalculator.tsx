
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Euro, ArrowRight, ArrowLeft } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';

// Types pour la calculatrice de budget
type Step = 1 | 2 | 3 | 4 | 5;
type Region = string;
type Season = 'haute' | 'basse';
type ServiceLevel = 'economique' | 'abordable' | 'premium' | 'luxe';
type VendorType = 'lieu' | 'traiteur' | 'photo' | 'dj' | 'planner' | 'deco' | 'autres';
type CalculatorMode = 'unknown' | 'known';

interface BudgetLine {
  name: string;
  amount: number;
  basePrice: number;
  color: string;
}

interface BudgetEstimate {
  total: number;
  breakdown: BudgetLine[];
}

// Budget allocation percentages for "known budget" mode
const BUDGET_ALLOCATION_PERCENTAGES = {
  'lieu': { name: 'Lieu de réception', percentage: 0.35, color: '#7F9474' },
  'traiteur': { name: 'Traiteur (repas + boissons)', percentage: 0.35, color: '#948970' },
  'photo': { name: 'Photographe & Vidéaste', percentage: 0.08, color: '#A99E89' },
  'dj': { name: 'DJ / Animation', percentage: 0.04, color: '#C6BCA9' },
  'deco': { name: 'Décoration & Fleurs', percentage: 0.07, color: '#8E9196' },
  'tenues': { name: 'Tenues & mise en beauté', percentage: 0.05, color: '#1A1F2C' },
  'papeterie': { name: 'Papeterie & faire-part', percentage: 0.02, color: '#B8A99A' },
  'autres': { name: 'Autres (transport, cadeaux, imprévus)', percentage: 0.04, color: '#aaadb0' }
};

const BudgetCalculator: React.FC = () => {
  // État pour le multi-étapes de la calculatrice
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showEstimate, setShowEstimate] = useState(false);
  const [calculatorMode, setCalculatorMode] = useState<CalculatorMode | null>(null);
  
  // États pour les paramètres de budget
  const [region, setRegion] = useState<Region>('Pays de la Loire');
  const [season, setSeason] = useState<Season>('basse');
  const [globalBudgetInput, setGlobalBudgetInput] = useState<string>("");
  const [globalBudget, setGlobalBudget] = useState<number>(0);
  const [serviceLevel, setServiceLevel] = useState<ServiceLevel>('premium');
  const [guestsCount, setGuestsCount] = useState<number>(100);
  
  // États pour le mode "budget connu"
  const [knownBudget, setKnownBudget] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<(keyof typeof BUDGET_ALLOCATION_PERCENTAGES)[]>([
    'lieu', 'traiteur', 'photo', 'dj', 'deco'
  ]);
  
  // État pour l'estimation du budget
  const [budgetEstimate, setBudgetEstimate] = useState<BudgetEstimate>({
    total: 0,
    breakdown: []
  });

  // Formater les montants en euros
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Gérer la sélection du mode calculatrice
  const handleModeSelection = (mode: CalculatorMode) => {
    setCalculatorMode(mode);
    setCurrentStep(1);
    if (mode === 'known') {
      setShowEstimate(false);
    }
  };

  // Calculer la répartition pour le mode "budget connu"
  const calculateKnownBudgetAllocation = () => {
    const totalBudget = parseFloat(knownBudget) || 0;
    if (totalBudget <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un budget valide",
        variant: "destructive"
      });
      return;
    }

    const breakdown: BudgetLine[] = [];
    let totalPercentage = 0;

    selectedCategories.forEach(categoryKey => {
      const categoryInfo = BUDGET_ALLOCATION_PERCENTAGES[categoryKey];
      const amount = Math.round(totalBudget * categoryInfo.percentage);
      totalPercentage += categoryInfo.percentage;
      
      breakdown.push({
        name: categoryInfo.name,
        amount,
        basePrice: amount,
        color: categoryInfo.color
      });
    });

    if (totalPercentage < 1) {
      const remaining = totalBudget - breakdown.reduce((sum, item) => sum + item.amount, 0);
      if (remaining > 0) {
        breakdown.push({
          name: 'Budget non alloué',
          amount: remaining,
          basePrice: remaining,
          color: '#cccccc'
        });
      }
    }

    const finalBudgetEstimate = {
      total: totalBudget,
      breakdown
    };
    
    setBudgetEstimate(finalBudgetEstimate);
    setShowEstimate(true);
  };

  // Gérer les changements de catégories pour le mode "budget connu"
  const toggleCategory = (category: keyof typeof BUDGET_ALLOCATION_PERCENTAGES) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Rendu du choix de mode initial
  const renderModeSelection = () => {
    return (
      <div className="space-y-6 p-4">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-serif mb-4">Choisissez votre méthode de calcul</h2>
          <p className="text-sm md:text-base text-muted-foreground px-2">Sélectionnez la méthode qui vous convient le mieux</p>
        </div>
        
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-auto p-4 md:p-6 flex flex-col items-start text-left hover:bg-wedding-cream/20"
            onClick={() => handleModeSelection('known')}
          >
            <div className="flex items-center gap-3 mb-2 w-full">
              <Euro className="h-5 w-5 md:h-6 md:w-6 text-black flex-shrink-0" />
              <span className="text-base md:text-lg font-medium">Je connais mon budget total</span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground text-left">
              Saisissez votre budget et nous le répartirons automatiquement selon les standards du secteur
            </p>
          </Button>
          
          <Button
            variant="outline"
            className="w-full h-auto p-4 md:p-6 flex flex-col items-start text-left hover:bg-wedding-cream/20"
            onClick={() => handleModeSelection('unknown')}
          >
            <div className="flex items-center gap-3 mb-2 w-full">
              <Calculator className="h-5 w-5 md:h-6 md:w-6 text-black flex-shrink-0" />
              <span className="text-base md:text-lg font-medium">Je ne connais pas mon budget</span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground text-left">
              Répondez à quelques questions et nous estimerons votre budget selon vos critères
            </p>
          </Button>
        </div>
      </div>
    );
  };

  // Rendu du mode "budget connu"
  const renderKnownBudgetMode = () => {
    return (
      <div className="space-y-6 p-4">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-serif mb-4">Budget connu</h2>
          <p className="text-sm md:text-base text-muted-foreground px-2">Saisissez votre budget et sélectionnez les catégories à inclure</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="knownBudget" className="text-base md:text-lg mb-4 block">Budget total (€)</Label>
            <Input
              type="number"
              id="knownBudget"
              value={knownBudget}
              onChange={(e) => setKnownBudget(e.target.value)}
              className="py-4 md:py-6 text-base md:text-lg"
              placeholder="Ex: 20000"
              min="1000"
              max="200000"
            />
          </div>

          <div>
            <Label className="text-base md:text-lg mb-4 block">Catégories à inclure</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(BUDGET_ALLOCATION_PERCENTAGES).map(([key, category]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={selectedCategories.includes(key as keyof typeof BUDGET_ALLOCATION_PERCENTAGES)}
                    onCheckedChange={() => toggleCategory(key as keyof typeof BUDGET_ALLOCATION_PERCENTAGES)}
                  />
                  <Label htmlFor={key} className="text-sm flex-1">
                    {category.name} ({Math.round(category.percentage * 100)}%)
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={calculateKnownBudgetAllocation}
            className="w-full bg-wedding-beige hover:bg-wedding-beige-dark text-black py-6 text-lg"
            disabled={!knownBudget || selectedCategories.length === 0}
          >
            <Calculator className="h-5 w-5 mr-2" />
            Calculer la répartition
          </Button>
        </div>
      </div>
    );
  };

  // Rendu des résultats
  const renderResults = () => {
    if (!showEstimate || !budgetEstimate.breakdown.length) return null;

    return (
      <div className="space-y-6 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Votre estimation budgétaire</h2>
          <div className="text-3xl font-bold text-black mb-2">
            {formatCurrency(budgetEstimate.total)}
          </div>
          <p className="text-muted-foreground">Budget total estimé</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Répartition détaillée</h3>
          {budgetEstimate.breakdown.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-3 px-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium">{item.name}</span>
              </div>
              <span className="text-lg font-bold">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setShowEstimate(false);
              setCalculatorMode(null);
            }}
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Nouvelle estimation
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculatrice Budget
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!calculatorMode && renderModeSelection()}
        {calculatorMode === 'known' && !showEstimate && renderKnownBudgetMode()}
        {showEstimate && renderResults()}
      </CardContent>
    </Card>
  );
};

export default BudgetCalculator;
