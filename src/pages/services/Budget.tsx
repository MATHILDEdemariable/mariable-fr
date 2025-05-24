
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, Calculator, PieChart, ArrowRight, ArrowLeft, 
  Sun, Snowflake, Users, Info, CalendarIcon, Download, Mail, UserPlus, Wine, Euro 
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import SEO from '@/components/SEO';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend
} from 'recharts';
import { exportDashboardToPDF } from '@/services/pdfExportService';

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

// Constantes pour les calculs
const BASE_PRICES: Record<VendorType, number> = {
  lieu: 3500,
  traiteur: 1,
  photo: 1800,
  dj: 1500,
  planner: 2000,
  deco: 1,
  autres: 0
};

const CATERING_PRICES: Record<ServiceLevel, number> = {
  economique: 50,
  abordable: 90,
  premium: 115,
  luxe: 200
};

const DECOR_PRICES: Record<ServiceLevel, number> = {
  economique: 8,
  abordable: 15,
  premium: 25,
  luxe: 50
};

const REGION_MODIFIERS: Record<string, number> = {
  'Île-de-France': 1.3,
  'Provence-Alpes-Côte d\'Azur': 1.2,
  'Bretagne': 1.0,
  'Centre-Val de Loire': 1.0,
  'Bourgogne-Franche-Comté': 0.95,
  'Occitanie': 0.95,
  'Normandie': 1.0,
  'Nouvelle-Aquitaine': 1.0,
  'Auvergne-Rhône-Alpes': 1.0,
  'Grand Est': 1.0,
  'Hauts-de-France': 1.0,
  'Corse': 1.0,
  'Pays de la Loire': 1.0
};

const PRICE_MODIFIERS: Record<ServiceLevel, number> = {
  economique: 1.0,
  abordable: 1.2,
  premium: 1.5,
  luxe: 2.0
};

const BUDGET_COLORS: Record<VendorType, string> = {
  lieu: '#7F9474',
  traiteur: '#948970',
  photo: '#A99E89',
  dj: '#C6BCA9',
  planner: '#8E9196',
  deco: '#1A1F2C',
  autres: '#aaadb0'
};

const Budget = () => {
  // État pour le multi-étapes de la calculatrice
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showEstimate, setShowEstimate] = useState(false);
  const [calculatorMode, setCalculatorMode] = useState<CalculatorMode | null>(null);
  
  // États pour les paramètres de budget
  const [region, setRegion] = useState<Region>('Pays de la Loire');
  const [season, setSeason] = useState<Season>('basse');
  const [globalBudgetInput, setGlobalBudgetInput] = useState<string>("");
  const [globalBudget, setGlobalBudget] = useState<number>(0);
  const [selectedVendors, setSelectedVendors] = useState<VendorType[]>([
    'lieu', 'traiteur', 'photo', 'dj', 'deco'
  ]);
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

  // État pour l'export
  const [isExporting, setIsExporting] = useState(false);

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

  // Progression des étapes
  const getStepProgress = () => {
    if (showEstimate) return 100;
    return (currentStep / 4) * 100;
  };

  // Gérer la navigation entre étapes
  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prevStep => (prevStep + 1) as Step);
    } else {
      calculateBudget();
      setShowEstimate(true);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => (prevStep - 1) as Step);
    }
  };

  // Calculer le budget basé sur les sélections
  const calculateBudget = () => {
    let totalBudget = globalBudget;
    if (!totalBudget || totalBudget <= 0) totalBudget = 15000;

    const breakdown: BudgetLine[] = [];
    const serviceMultiplier = PRICE_MODIFIERS[serviceLevel];
    const regionMultiplier = REGION_MODIFIERS[region];
    const seasonMultiplier = season === 'haute' ? 1.0 : 0.8;
    
    selectedVendors.forEach(vendor => {
      let amount = 0;
      let basePrice = BASE_PRICES[vendor];
      
      if (vendor === 'lieu') {
        amount = basePrice * serviceMultiplier * regionMultiplier * seasonMultiplier;
      } else if (vendor === 'traiteur') {
        const pricePerGuest = CATERING_PRICES[serviceLevel];
        amount = pricePerGuest * guestsCount * regionMultiplier * seasonMultiplier;
        basePrice = pricePerGuest;
      } else if (vendor === 'deco') {
        const pricePerGuest = DECOR_PRICES[serviceLevel];
        amount = pricePerGuest * guestsCount * regionMultiplier * seasonMultiplier;
        basePrice = pricePerGuest;
      } else if (vendor === 'photo' || vendor === 'dj' || vendor === 'planner') {
        amount = basePrice * serviceMultiplier * regionMultiplier * seasonMultiplier;
      }
      
      breakdown.push({
        name: getVendorName(vendor),
        amount: Math.round(amount),
        basePrice,
        color: BUDGET_COLORS[vendor]
      });
    });
    
    const total = breakdown.reduce((sum, item) => sum + item.amount, 0);
    const otherExpenses = Math.round(total * 0.1);
    
    breakdown.push({
      name: 'Autres dépenses',
      amount: otherExpenses,
      basePrice: 0,
      color: BUDGET_COLORS['autres']
    });
    
    setBudgetEstimate({
      total: total + otherExpenses,
      breakdown
    });
  };

  // Handler pour le bouton de calculateur de boissons
  const handleDrinksCalculatorClick = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard/drinks');
      } else {
        navigate('/register');
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error);
      navigate('/register');
    }
  };

  // Handler pour l'export direct
  const handleDirectExport = async () => {
    if (!showEstimate || !budgetEstimate.breakdown.length) {
      toast({
        title: "Erreur",
        description: "Aucune estimation disponible pour l'exportation",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);

    try {
      // Créer un conteneur temporaire avec les données du budget
      const tempContainer = document.createElement('div');
      tempContainer.id = 'budget-export-content';
      tempContainer.className = 'p-8 bg-white';
      tempContainer.innerHTML = `
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold mb-4">Estimation Budgétaire - Mariable</h1>
          <p class="text-xl text-gray-600">Budget total estimé: ${formatCurrency(budgetEstimate.total)}</p>
        </div>
        <div class="space-y-4">
          <h2 class="text-lg font-semibold mb-4">Répartition détaillée:</h2>
          ${budgetEstimate.breakdown.map(item => `
            <div class="flex justify-between items-center py-2 border-b">
              <span>${item.name}</span>
              <span class="font-medium">${formatCurrency(item.amount)}</span>
            </div>
          `).join('')}
        </div>
        ${calculatorMode === 'unknown' ? `
          <div class="mt-8 space-y-2">
            <h3 class="text-lg font-semibold">Paramètres utilisés:</h3>
            <p>Région: ${region}</p>
            <p>Nombre d'invités: ${guestsCount}</p>
            <p>Saison: ${season === 'haute' ? 'Haute saison' : 'Basse saison'}</p>
            <p>Niveau de prestation: ${serviceLevel}</p>
          </div>
        ` : ''}
      `;
      
      document.body.appendChild(tempContainer);

      const success = await exportDashboardToPDF(
        'budget-export-content',
        `estimation-budget-mariable-${new Date().toISOString().split('T')[0]}.pdf`,
        'portrait',
        'Estimation Budgétaire Mariable'
      );

      document.body.removeChild(tempContainer);

      if (success) {
        toast({
          title: "Export réussi",
          description: "Votre estimation budgétaire a été exportée en PDF",
        });
      } else {
        throw new Error('Export PDF failed');
      }
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      
      // Fallback vers CSV
      try {
        let csvContent = "Catégorie,Montant\n";
        budgetEstimate.breakdown.forEach(item => {
          csvContent += `"${item.name}","${item.amount}"\n`;
        });
        csvContent += `"TOTAL","${budgetEstimate.total}"\n`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `estimation-budget-mariable-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "Export CSV réussi",
          description: "Le PDF n'était pas disponible, votre estimation a été exportée au format CSV",
        });
      } catch (csvError) {
        toast({
          title: "Erreur d'export",
          description: "Impossible d'exporter le fichier. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Obtenir le nom lisible d'un type de prestataire
  const getVendorName = (vendor: VendorType): string => {
    const names: Record<VendorType, string> = {
      lieu: 'Lieu de réception',
      traiteur: 'Traiteur (hors boissons)',
      photo: 'Photographe & Vidéaste',
      dj: 'DJ / Animation',
      planner: 'Wedding Planner',
      deco: 'Décoration & Fleurs',
      autres: 'Autres (risques)'
    };
    return names[vendor];
  };

  // Gérer les changements de sélection de prestataires
  const toggleVendor = (vendor: VendorType) => {
    setSelectedVendors(prev => 
      prev.includes(vendor) 
        ? prev.filter(v => v !== vendor) 
        : [...prev, vendor]
    );
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
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-serif mb-2">Choisissez votre méthode de calcul</h2>
          <p className="text-muted-foreground">Sélectionnez la méthode qui vous convient le mieux</p>
        </div>
        
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-auto p-6 flex flex-col items-start text-left hover:bg-wedding-cream/20"
            onClick={() => handleModeSelection('known')}
          >
            <div className="flex items-center gap-3 mb-2">
              <Euro className="h-6 w-6 text-wedding-olive" />
              <span className="text-lg font-medium">Je connais mon budget total</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Saisissez votre budget et nous le répartirons automatiquement selon les standards du secteur
            </p>
          </Button>
          
          <Button
            variant="outline"
            className="w-full h-auto p-6 flex flex-col items-start text-left hover:bg-wedding-cream/20"
            onClick={() => handleModeSelection('unknown')}
          >
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="h-6 w-6 text-wedding-olive" />
              <span className="text-lg font-medium">Je ne connais pas mon budget</span>
            </div>
            <p className="text-sm text-muted-foreground">
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
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-serif mb-2">Budget connu</h2>
          <p className="text-muted-foreground">Saisissez votre budget et sélectionnez les catégories à inclure</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="knownBudget" className="text-lg mb-2 block">Budget total (€)</Label>
            <Input
              type="number"
              id="knownBudget"
              value={knownBudget}
              onChange={(e) => setKnownBudget(e.target.value)}
              className="py-6 text-lg"
              placeholder="Ex: 20000"
              min="1000"
              max="200000"
            />
          </div>
          
          <div>
            <Label className="text-lg mb-4 block">Catégories à inclure</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(BUDGET_ALLOCATION_PERCENTAGES).map(([key, info]) => (
                <div key={key} className="flex items-center space-x-3 p-3 border rounded-md">
                  <Checkbox 
                    id={`category-${key}`}
                    checked={selectedCategories.includes(key as keyof typeof BUDGET_ALLOCATION_PERCENTAGES)} 
                    onCheckedChange={() => toggleCategory(key as keyof typeof BUDGET_ALLOCATION_PERCENTAGES)}
                    className="border-2 h-5 w-5"
                  />
                  <div className="flex-1">
                    <Label htmlFor={`category-${key}`} className="text-sm font-medium cursor-pointer">
                      {info.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {(info.percentage * 100).toFixed(0)}% du budget
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCalculatorMode(null)}
          >
            Retour
          </Button>
          
          <Button
            className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
            onClick={calculateKnownBudgetAllocation}
            disabled={!knownBudget || selectedCategories.length === 0}
          >
            Calculer la répartition
          </Button>
        </div>
      </div>
    );
  };

  // Rendu des différentes étapes
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-serif mb-6">Étape 1/4 : Région</h2>
            
            <div className="mb-6">
              <Label htmlFor="region" className="text-lg mb-2 block">Région du mariage</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <Select 
                  value={region} 
                  onValueChange={(value) => setRegion(value)}
                >
                  <SelectTrigger className="w-full pl-10 py-6">
                    <SelectValue placeholder="Sélectionnez une région" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Île-de-France">Île-de-France</SelectItem>
                    <SelectItem value="Provence-Alpes-Côte d'Azur">Provence-Alpes-Côte d'Azur</SelectItem>
                    <SelectItem value="Pays de la Loire">Pays de la Loire</SelectItem>
                    <SelectItem value="Bretagne">Bretagne</SelectItem>
                    <SelectItem value="Normandie">Normandie</SelectItem>
                    <SelectItem value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</SelectItem>
                    <SelectItem value="Occitanie">Occitanie</SelectItem>
                    <SelectItem value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</SelectItem>
                    <SelectItem value="Bourgogne-Franche-Comté">Bourgogne-Franche-Comté</SelectItem>
                    <SelectItem value="Grand Est">Grand Est</SelectItem>
                    <SelectItem value="Hauts-de-France">Hauts-de-France</SelectItem>
                    <SelectItem value="Centre-Val de Loire">Centre-Val de Loire</SelectItem>
                    <SelectItem value="Corse">Corse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <h2 className="text-2xl font-serif mb-6">Étape 2/4 : Nombre d'invités et Saison</h2>
            <div className="mb-6">
              <Label htmlFor="guestsCount" className="text-lg mb-2 block">Nombre d'invités</Label>
              <Input
                type="number"
                id="guestsCount"
                value={guestsCount}
                onChange={e => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val > 0) setGuestsCount(val);
                }}
                className="py-6"
                min="10"
                max="500"
                placeholder="Ex: 100"
              />
              <p className="text-xs text-muted-foreground mt-1">Nombre d'invités minimum recommandé : 10 personnes</p>
            </div>
            <div className="mb-6">
              <Label className="text-lg mb-2 block">Période de l'année</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  className={`flex items-center gap-2 py-6 px-6 rounded-md ${season === 'haute' ? 'bg-wedding-cream border-wedding-olive' : 'bg-white'}`}
                  onClick={() => setSeason('haute')}
                >
                  <Sun size={20} />
                  <span>Haute saison (avril-sept)</span>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className={`flex items-center gap-2 py-6 px-6 rounded-md ${season === 'basse' ? 'bg-wedding-cream border-wedding-olive' : 'bg-white'}`}
                  onClick={() => setSeason('basse')}
                >
                  <Snowflake size={20} />
                  <span>Basse saison (oct-mars)</span>
                </Button>
              </div>
            </div>
          </>
        );
      
      case 3:
        return (
          <>
            <h2 className="text-2xl font-serif mb-6">Étape 3/4 : Prestataires</h2>
            
            <div className="mb-6">
              <Label className="text-lg mb-2 block">Prestataires nécessaires</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vendor-lieu" 
                    checked={selectedVendors.includes('lieu')} 
                    onCheckedChange={() => toggleVendor('lieu')}
                    className="border-2 h-6 w-6"
                  />
                  <Label htmlFor="vendor-lieu" className="text-base">Lieu de réception</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vendor-traiteur" 
                    checked={selectedVendors.includes('traiteur')} 
                    onCheckedChange={() => toggleVendor('traiteur')}
                    className="border-2 h-6 w-6"
                  />
                  <Label htmlFor="vendor-traiteur" className="text-base">Traiteur (hors boissons)</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vendor-photo" 
                    checked={selectedVendors.includes('photo')} 
                    onCheckedChange={() => toggleVendor('photo')}
                    className="border-2 h-6 w-6"
                  />
                  <Label htmlFor="vendor-photo" className="text-base">Photographe & Vidéaste</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vendor-dj" 
                    checked={selectedVendors.includes('dj')} 
                    onCheckedChange={() => toggleVendor('dj')}
                    className="border-2 h-6 w-6"
                  />
                  <Label htmlFor="vendor-dj" className="text-base">DJ / Animation</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vendor-planner" 
                    checked={selectedVendors.includes('planner')} 
                    onCheckedChange={() => toggleVendor('planner')}
                    className="border-2 h-6 w-6"
                  />
                  <Label htmlFor="vendor-planner" className="text-base">Wedding Planner</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vendor-deco" 
                    checked={selectedVendors.includes('deco')} 
                    onCheckedChange={() => toggleVendor('deco')}
                    className="border-2 h-6 w-6"
                  />
                  <Label htmlFor="vendor-deco" className="text-base">Décoration & Fleurs</Label>
                </div>
              </div>
            </div>
          </>
        );
      
      case 4:
        return (
          <>
            <h2 className="text-2xl font-serif mb-6">Étape 4/4 : Niveau de prestation</h2>
            
            <div className="mb-6">
              <Label className="text-lg mb-2 block">Niveau de prestation souhaité</Label>
              <RadioGroup 
                value={serviceLevel} 
                onValueChange={(value) => setServiceLevel(value as ServiceLevel)}
                className="mt-4 space-y-6"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem id="level-economique" value="economique" className="h-8 w-8 border-2" />
                  <Label htmlFor="level-economique" className="text-base">Économique</Label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <RadioGroupItem id="level-abordable" value="abordable" className="h-8 w-8 border-2" />
                  <Label htmlFor="level-abordable" className="text-base">Abordable</Label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <RadioGroupItem id="level-premium" value="premium" className="h-8 w-8 border-2" />
                  <Label htmlFor="level-premium" className="text-base">Premium</Label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <RadioGroupItem id="level-luxe" value="luxe" className="h-8 w-8 border-2" />
                  <Label htmlFor="level-luxe" className="text-base">Luxe</Label>
                </div>
              </RadioGroup>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  // Rendu du résultat de l'estimation
  const renderEstimate = () => {
    const isKnownMode = calculatorMode === 'known';
    
    return (
      <div className="space-y-8" id="budget-dashboard-content">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif mb-2">
            {isKnownMode ? 'Répartition budgétaire' : 'Estimation budgétaire'}
          </h2>
          <p className="text-muted-foreground">
            {isKnownMode 
              ? 'Voici la répartition de votre budget selon les standards du secteur'
              : 'Voici une estimation basée sur vos critères'
            }
          </p>
        </div>
        
        <div className="text-center py-8">
          <h3 className="text-2xl md:text-3xl font-serif mb-4" style={{ color: '#4CAF50' }}>
            Budget total {isKnownMode ? 'réparti' : 'estimé'}
          </h3>
          <p className="text-4xl text-wedding-olive font-medium">{formatCurrency(budgetEstimate.total)}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {isKnownMode 
              ? 'Réparti selon les proportions standard du secteur'
              : 'Ce montant est calculé selon les standards du secteur'
            }
          </p>
        </div>

        {/* Graphique circulaire */}
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
          <h3 className="text-2xl font-serif mb-4">Répartition détaillée</h3>
          <div className="space-y-6">
            {budgetEstimate.breakdown.map((item, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-start gap-2 text-sm text-muted-foreground bg-gray-50 p-4 rounded-md">
          <Info size={18} className="shrink-0 mt-0.5" />
          <p>
            {isKnownMode 
              ? 'Répartition basée sur les standards du secteur, à ajuster selon vos priorités.'
              : 'Estimation indicative basée sur les standards, à ajuster selon vos choix et besoins spécifiques.'
            }
          </p>
        </div>
        
        {!isKnownMode && (
          <div>
            <h3 className="text-2xl font-serif mb-4">Paramètres de votre estimation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline"
            className="md:col-span-2 bg-gray-200 hover:bg-gray-300 text-wedding-black flex items-center justify-center gap-2"
            onClick={() => {
              setShowEstimate(false);
              setCurrentStep(1);
              setCalculatorMode(null);
            }}
          >
            Recommencer l'estimation
          </Button>
          <Button 
            type="button"
            className="md:col-span-2 bg-wedding-olive hover:bg-wedding-olive/90 text-white flex items-center justify-center gap-2"
            onClick={handleDirectExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                Export en cours...
              </>
            ) : (
              <>
                <Download size={18} />
                Exporter
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  // Obtain the navigate helper to use for redirects
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Budget de mariage - Calculez et planifiez vos dépenses"
        description="Utilisez notre calculateur de budget de mariage pour estimer vos dépenses et répartir votre budget selon les différentes catégories."
      />
      <Header />
      <main className="container max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-serif mb-2">Calculatrice de budget mariage</h1>
        <p className="text-muted-foreground mb-6">Estimez le budget de votre mariage en quelques étapes</p>
        
        <Card className="p-6 mt-6 bg-wedding-cream/20">
          {showEstimate ? (
            renderEstimate()
          ) : calculatorMode === null ? (
            renderModeSelection()
          ) : calculatorMode === 'known' ? (
            renderKnownBudgetMode()
          ) : (
            <>
              <div className="min-h-[300px]">
                {renderStepContent()}
              </div>
              
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={goToPreviousStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft size={16} />
                  Précédent
                </Button>
                
                <Button
                  type="button"
                  className="bg-wedding-olive hover:bg-wedding-olive/90 text-white flex items-center justify-center gap-2"
                  onClick={goToNextStep}
                >
                  {currentStep === 4 ? (
                    <>
                      Calculer
                      <ArrowRight size={16} />
                    </>
                  ) : (
                    <>
                      Suivant
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* Texte de transition vers la calculatrice de boissons */}
        <div className="my-8 p-4 bg-wedding-cream rounded-lg">
          <p className="text-lg">
            L'estimation du budget traiteur ci-dessus est calculée hors boissons. Pour estimer précisément la quantité et le coût des boissons pour votre mariage, utilisez notre calculatrice boissons dédiée.
          </p>
          <div className="mt-4 text-center">
            <Button 
              className="bg-wedding-olive hover:bg-wedding-olive/90 gap-2 w-full sm:w-auto py-2 px-4"
              onClick={handleDrinksCalculatorClick}
            >
              <Wine size={18} />
              Calculer vos boissons
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Budget;
