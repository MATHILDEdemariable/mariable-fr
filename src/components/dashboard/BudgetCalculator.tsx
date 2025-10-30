
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Euro, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
              <Euro className="h-5 w-5 md:h-6 md:w-6 text-wedding-olive flex-shrink-0" />
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
              <Calculator className="h-5 w-5 md:h-6 md:w-6 text-wedding-olive flex-shrink-0" />
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
            className="w-full bg-wedding-olive hover:bg-wedding-olive/90 py-6 text-lg"
            disabled={!knownBudget || selectedCategories.length === 0}
          >
            <Calculator className="h-5 w-5 mr-2" />
            Calculer la répartition
          </Button>
        </div>
      </div>
    );
  };

  // Rendu du mode "budget inconnu" - Multi-étapes
  const renderUnknownBudgetMode = () => {
    // Étape 1 : Région
    if (currentStep === 1) {
      return (
        <div className="space-y-6 p-4">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-serif mb-4">Étape 1/4 : Localisation</h2>
            <p className="text-sm md:text-base text-muted-foreground px-2">Où se déroulera votre mariage ?</p>
          </div>
          
          <div>
            <Label>Région</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Île-de-France">Île-de-France</SelectItem>
                <SelectItem value="Provence-Alpes-Côte d'Azur">Provence-Alpes-Côte d'Azur</SelectItem>
                <SelectItem value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</SelectItem>
                <SelectItem value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</SelectItem>
                <SelectItem value="Occitanie">Occitanie</SelectItem>
                <SelectItem value="Bretagne">Bretagne</SelectItem>
                <SelectItem value="Pays de la Loire">Pays de la Loire</SelectItem>
                <SelectItem value="Grand Est">Grand Est</SelectItem>
                <SelectItem value="Hauts-de-France">Hauts-de-France</SelectItem>
                <SelectItem value="Normandie">Normandie</SelectItem>
                <SelectItem value="Bourgogne-Franche-Comté">Bourgogne-Franche-Comté</SelectItem>
                <SelectItem value="Centre-Val de Loire">Centre-Val de Loire</SelectItem>
                <SelectItem value="Corse">Corse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={() => setCurrentStep(2)}
            className="w-full bg-wedding-olive hover:bg-wedding-olive/90 py-6 text-lg"
          >
            Suivant
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      );
    }
    
    // Étape 2 : Saison
    if (currentStep === 2) {
      return (
        <div className="space-y-6 p-4">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-serif mb-4">Étape 2/4 : Période</h2>
            <p className="text-sm md:text-base text-muted-foreground px-2">Quand aura lieu votre mariage ?</p>
          </div>
          
          <RadioGroup value={season} onValueChange={(v) => setSeason(v as Season)}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="haute" id="haute" />
                <Label htmlFor="haute" className="flex-1 cursor-pointer">
                  <div className="font-medium">Haute saison (Mai - Septembre)</div>
                  <p className="text-sm text-muted-foreground">Les mois les plus demandés</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="basse" id="basse" />
                <Label htmlFor="basse" className="flex-1 cursor-pointer">
                  <div className="font-medium">Basse saison (Octobre - Avril)</div>
                  <p className="text-sm text-muted-foreground">Tarifs plus avantageux</p>
                </Label>
              </div>
            </div>
          </RadioGroup>
          
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <Button 
              onClick={() => setCurrentStep(3)}
              className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90"
            >
              Suivant
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }
    
    // Étape 3 : Nombre d'invités
    if (currentStep === 3) {
      return (
        <div className="space-y-6 p-4">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-serif mb-4">Étape 3/4 : Invités</h2>
            <p className="text-sm md:text-base text-muted-foreground px-2">Combien d'invités prévoyez-vous ?</p>
          </div>
          
          <div>
            <Label>Nombre d'invités</Label>
            <Input
              type="number"
              value={guestsCount}
              onChange={(e) => setGuestsCount(parseInt(e.target.value) || 0)}
              className="py-6 text-lg"
              placeholder="100"
              min="10"
              max="500"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Le nombre d'invités impacte significativement le budget
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => setCurrentStep(2)}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <Button 
              onClick={() => setCurrentStep(4)}
              className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90"
              disabled={guestsCount < 10}
            >
              Suivant
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }
    
    // Étape 4 : Niveau de service
    if (currentStep === 4) {
      return (
        <div className="space-y-6 p-4">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-serif mb-4">Étape 4/4 : Standing</h2>
            <p className="text-sm md:text-base text-muted-foreground px-2">Quel niveau de standing souhaitez-vous ?</p>
          </div>
          
          <RadioGroup value={serviceLevel} onValueChange={(v) => setServiceLevel(v as ServiceLevel)}>
            <div className="space-y-4">
              {[
                { value: 'economique', label: 'Économique', desc: 'Budget maîtrisé, ~80-100€/personne' },
                { value: 'abordable', label: 'Abordable', desc: 'Bon rapport qualité-prix, ~100-130€/personne' },
                { value: 'premium', label: 'Premium', desc: 'Haut de gamme, ~130-180€/personne' },
                { value: 'luxe', label: 'Luxe', desc: 'Prestations d\'exception, ~180€+/personne' }
              ].map((level) => (
                <div key={level.value} className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value={level.value} id={level.value} />
                  <Label htmlFor={level.value} className="flex-1 cursor-pointer">
                    <div className="font-medium">{level.label}</div>
                    <p className="text-sm text-muted-foreground">{level.desc}</p>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => setCurrentStep(3)}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <Button 
              onClick={calculateUnknownBudget}
              className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculer
            </Button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Fonction de calcul pour le mode "unknown"
  const calculateUnknownBudget = () => {
    // Tarifs de base par personne selon le niveau
    const basePricePerGuest: Record<ServiceLevel, number> = {
      'economique': 90,
      'abordable': 115,
      'premium': 155,
      'luxe': 200
    };
    
    // Multiplicateurs régionaux
    const regionMultipliers: Record<string, number> = {
      'Île-de-France': 1.3,
      'Provence-Alpes-Côte d\'Azur': 1.2,
      'Corse': 1.15,
      'Auvergne-Rhône-Alpes': 1.1,
      'Bretagne': 1.0,
      'Pays de la Loire': 1.0,
    };
    
    // Multiplicateur saisonnier
    const seasonMultiplier = season === 'haute' ? 1.15 : 1.0;
    
    // Calcul du prix par invité
    const basePrice = basePricePerGuest[serviceLevel];
    const regionMultiplier = regionMultipliers[region] || 1.0;
    const finalPricePerGuest = basePrice * regionMultiplier * seasonMultiplier;
    
    // Budget total
    const totalBudget = Math.round(finalPricePerGuest * guestsCount);
    
    // Répartition selon les catégories standards
    const breakdown: BudgetLine[] = [];
    
    Object.entries(BUDGET_ALLOCATION_PERCENTAGES).forEach(([key, category]) => {
      const amount = Math.round(totalBudget * category.percentage);
      breakdown.push({
        name: category.name,
        amount,
        basePrice: amount,
        color: category.color
      });
    });
    
    setBudgetEstimate({
      total: totalBudget,
      breakdown
    });
    
    setShowEstimate(true);
  };

  // Rendu des résultats
  const renderResults = () => {
    if (!showEstimate || !budgetEstimate.breakdown.length) return null;
    
    const isKnownMode = calculatorMode === 'known';

    return (
      <div className="space-y-6 md:space-y-8 p-4">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-serif mb-4">
            {isKnownMode ? 'Répartition budgétaire' : 'Estimation budgétaire'}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground px-2">
            {isKnownMode 
              ? 'Voici la répartition de votre budget selon les standards du secteur'
              : 'Voici une estimation basée sur vos critères'
            }
          </p>
        </div>
        
        <div className="text-center py-6 md:py-8">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-serif mb-4" style={{ color: '#4CAF50' }}>
            Budget total {isKnownMode ? 'réparti' : 'estimé'}
          </h3>
          <p className="text-2xl md:text-3xl lg:text-4xl text-wedding-olive font-medium">
            {formatCurrency(budgetEstimate.total)}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground mt-2 px-2">
            {isKnownMode 
              ? 'Réparti selon les proportions standard du secteur'
              : 'Ce montant est calculé selon les standards du secteur'
            }
          </p>
        </div>

        {/* GRAPHIQUE PIE CHART */}
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={budgetEstimate.breakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius="90%"
                paddingAngle={2}
                dataKey="amount"
                nameKey="name"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: '#7F9474', strokeWidth: 0.5 }}
                strokeWidth={1}
                stroke="#f8f6f0"
              >
                {budgetEstimate.breakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h3 className="text-lg md:text-2xl font-serif mb-4">Répartition détaillée</h3>
          <div className="space-y-4 md:space-y-6">
            {budgetEstimate.breakdown.map((item, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div 
                      className="h-3 w-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm md:text-base break-words">{item.name}</span>
                  </div>
                  <span className="font-medium text-sm md:text-base ml-2 flex-shrink-0">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground bg-gray-50 p-4 rounded-md">
          <Info size={18} className="shrink-0 mt-0.5" />
          <p>
            {isKnownMode 
              ? 'Répartition basée sur les standards du secteur, à ajuster selon vos priorités.'
              : 'Estimation indicative basée sur les standards, à ajuster selon vos choix et besoins spécifiques.'
            }
          </p>
        </div>
        
        {/* Paramètres UNIQUEMENT pour le mode "unknown" */}
        {!isKnownMode && (
          <div>
            <h3 className="text-lg md:text-2xl font-serif mb-4">Paramètres de votre estimation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border p-3 rounded">
                <p className="text-sm font-medium">Nombre d'invités</p>
                <p>{guestsCount} personnes</p>
              </div>
              <div className="border p-3 rounded">
                <p className="text-sm font-medium">Région</p>
                <p>{region}</p>
              </div>
              <div className="border p-3 rounded">
                <p className="text-sm font-medium">Saison</p>
                <p>{season === 'haute' ? 'Haute saison (avril-sept)' : 'Basse saison (oct-mars)'}</p>
              </div>
              <div className="border p-3 rounded">
                <p className="text-sm font-medium">Niveau de prestation</p>
                <p className="capitalize">{serviceLevel}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-4 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setShowEstimate(false);
              setCalculatorMode(null);
              setCurrentStep(1);
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
        {calculatorMode === 'unknown' && !showEstimate && renderUnknownBudgetMode()}
        {showEstimate && renderResults()}
      </CardContent>
    </Card>
  );
};

export default BudgetCalculator;
