
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip
} from 'recharts';
import { 
  Euro, ArrowRight, Download, 
  MapPin, Calculator, Users, Calendar, Info, ChevronRight, ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { exportDashboardToPDF } from '@/services/pdfExportService';
import { supabase } from '@/integrations/supabase/client';

interface BudgetCategory {
  name: string;
  amount: number;
  color: string;
}

// Types pour la calculatrice de budget
type Step = 1 | 2 | 3 | 4 | 5;
type Region = string;
type Season = 'haute' | 'basse';
type ServiceLevel = 'economique' | 'abordable' | 'premium' | 'luxe';
type VendorType = 'lieu' | 'traiteur' | 'photo' | 'dj' | 'planner' | 'deco' | 'autres';

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

// Constantes pour les calculs du budget
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
  lieu: '#a19c88', // beige
  traiteur: '#7F9474', // vert sauge
  photo: '#b5c4a8', // vert clair
  dj: '#d1c7b7', // beige clair
  planner: '#908e7e', // taupe
  deco: '#dbdacb', // crème
  autres: '#f8f6f0' // blanc cassé
};

const INITIAL_BUDGET_DATA: BudgetCategory[] = [
  { name: 'Lieu', amount: 5000, color: '#a19c88' }, // beige
  { name: 'Traiteur', amount: 7000, color: '#7F9474' }, // vert sauge
  { name: 'Décoration', amount: 2000, color: '#b5c4a8' }, // vert clair
  { name: 'Tenue', amount: 3000, color: '#d1c7b7' }, // beige clair
  { name: 'Photo & Vidéo', amount: 2500, color: '#908e7e' }, // taupe
  { name: 'Imprévus', amount: 1500, color: '#dbdacb' } // crème
];

const BudgetSummary: React.FC = () => {
  // État pour le résumé du budget
  const [budgetData, setBudgetData] = useState<BudgetCategory[]>(INITIAL_BUDGET_DATA);
  
  // État pour le multi-étapes de la calculatrice
  const [showCalculator, setShowCalculator] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showEstimate, setShowEstimate] = useState(false);
  
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
  
  // État pour l'estimation du budget
  const [budgetEstimate, setBudgetEstimate] = useState<BudgetEstimate>({
    total: 0,
    breakdown: []
  });
  
  // Pour les toasts et export PDF
  const { toast } = useToast();
  
  // Formater les montants en euros
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Gérer l'export PDF
  const handleExportPDF = async () => {
    toast({
      title: "Export PDF en cours",
      description: "Préparation de votre document...",
    });
    
    setTimeout(async () => {
      const success = await exportDashboardToPDF();
      
      if (success) {
        toast({
          title: "Export réussi",
          description: "Votre dashboard a été exporté en PDF",
        });
      } else {
        toast({
          title: "Erreur d'export",
          description: "Une erreur s'est produite lors de l'export en PDF",
          variant: "destructive"
        });
      }
    }, 500);
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
  const calculateBudget = async () => {
    let totalBudget = globalBudget;
    // Si pas de saisie, on estime à 15 000 €
    if (!totalBudget || totalBudget <= 0) totalBudget = 15000;

    // Format des lignes budgétaires
    const breakdown: BudgetLine[] = [];
    
    // Pondération par niveau de service (uniquement pour les postes fixes)
    const serviceMultiplier = PRICE_MODIFIERS[serviceLevel];
    
    // Pondération par région
    const regionMultiplier = REGION_MODIFIERS[region];
    
    // Pondération par saison
    const seasonMultiplier = season === 'haute' ? 1.0 : 0.8;
    
    // Pour chaque prestataire sélectionné
    selectedVendors.forEach(vendor => {
      let amount = 0;
      let basePrice = BASE_PRICES[vendor];
      
      if (vendor === 'lieu') {
        // Poste fixe : lieu
        amount = basePrice * serviceMultiplier * regionMultiplier * seasonMultiplier;
      } else if (vendor === 'traiteur') {
        // Poste variable : traiteur (dépend du nombre d'invités)
        const pricePerGuest = CATERING_PRICES[serviceLevel];
        amount = pricePerGuest * guestsCount * regionMultiplier * seasonMultiplier;
        basePrice = pricePerGuest;
      } else if (vendor === 'deco') {
        // Poste variable : déco (dépend du nombre d'invités)
        const pricePerGuest = DECOR_PRICES[serviceLevel];
        amount = pricePerGuest * guestsCount * regionMultiplier * seasonMultiplier;
        basePrice = pricePerGuest;
      } else if (vendor === 'photo' || vendor === 'dj' || vendor === 'planner') {
        // Postes fixes : photo, DJ, wedding planner
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

    const finalBudgetEstimate = {
      total: total + otherExpenses,
      breakdown
    };
    
    setBudgetEstimate(finalBudgetEstimate);
    
    // Mettre à jour le graphique
    const newBudgetData = breakdown.map(item => ({
      name: item.name,
      amount: item.amount,
      color: item.color
    }));
    
    setBudgetData(newBudgetData);
    
    // Enregistrer dans Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Récupérer l'ID du projet actuel si disponible
        const { data: projects } = await supabase
          .from('projects')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        const projectId = projects && projects.length > 0 ? projects[0].id : null;
        
        // Insérer les données de budget dans Supabase
        await supabase
          .from('budgets_dashboard')
          .insert({
            user_id: user.id,
            project_id: projectId,
            region,
            season,
            guests_count: guestsCount,
            service_level: serviceLevel,
            selected_vendors: selectedVendors,
            total_budget: finalBudgetEstimate.total,
            breakdown: finalBudgetEstimate.breakdown
          });
        
        toast({
          title: "Budget enregistré",
          description: "Votre estimation budgétaire a été enregistrée"
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du budget:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre budget",
        variant: "destructive"
      });
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
      autres: 'Autres dépenses'
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
  
  // Calculer le total du budget actuel
  const totalBudget = budgetData.reduce((sum, category) => sum + category.amount, 0);
  
  // Charger les données de budget sauvegardées au montage du composant
  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: budgets } = await supabase
            .from('budgets_dashboard')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (budgets && budgets.length > 0) {
            const latestBudget = budgets[0];
            
            // Mettre à jour les états avec les données sauvegardées
            setRegion(latestBudget.region);
            setSeason(latestBudget.season as Season);
            setGuestsCount(latestBudget.guests_count);
            setServiceLevel(latestBudget.service_level as ServiceLevel);
            setSelectedVendors(latestBudget.selected_vendors as VendorType[]);
            setGlobalBudget(latestBudget.total_budget);
            
            if (latestBudget.breakdown) {
              // Mettre à jour le graphique
              const newBudgetData = latestBudget.breakdown.map((item: any) => ({
                name: item.name,
                amount: item.amount,
                color: item.color
              }));
              
              setBudgetData(newBudgetData);
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données de budget:", error);
      }
    };
    
    fetchBudgetData();
  }, []);
  
  // Rendu des différentes étapes de la calculatrice de budget
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-serif mb-4">Étape 1/4 : Région</h2>
            
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
            <h2 className="text-xl font-serif mb-4">Étape 2/4 : Nombre d'invités et Saison</h2>
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
                  <Calendar size={20} />
                  <span>Haute saison (avril-sept)</span>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className={`flex items-center gap-2 py-6 px-6 rounded-md ${season === 'basse' ? 'bg-wedding-cream border-wedding-olive' : 'bg-white'}`}
                  onClick={() => setSeason('basse')}
                >
                  <Calendar size={20} />
                  <span>Basse saison (oct-mars)</span>
                </Button>
              </div>
            </div>
          </>
        );
      
      case 3:
        return (
          <>
            <h2 className="text-xl font-serif mb-4">Étape 3/4 : Prestataires</h2>
            
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
            <h2 className="text-xl font-serif mb-4">Étape 4/4 : Niveau de prestation</h2>
            
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
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-serif mb-2">Estimation budgétaire</h2>
          <p className="text-muted-foreground">Voici une estimation basée sur vos critères</p>
        </div>
        
        <div className="text-center py-6">
          <h3 className="text-xl md:text-2xl font-serif mb-4" style={{ color: '#7F9474' }}>Budget total estimé</h3>
          <p className="text-3xl text-wedding-olive font-medium">{formatCurrency(budgetEstimate.total)}</p>
          <p className="text-sm text-muted-foreground mt-2">Ce montant est réparti selon les proportions standard du secteur</p>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-serif mb-2">Répartition détaillée</h3>
          <div className="space-y-4">
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
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-gray-50 p-4 rounded-md">
          <Info size={18} className="shrink-0" />
          <p>Estimation indicative basée sur les standards, à ajuster selon vos choix et besoins spécifiques.</p>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-serif mb-2">Paramètres de votre estimation</h3>
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
        
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full bg-wedding-cream/20 hover:bg-wedding-cream text-wedding-olive"
            onClick={() => {
              setShowEstimate(false);
              setCurrentStep(1);
              setShowCalculator(false);
            }}
          >
            Fermer l'estimation
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="bg-wedding-cream/5 border-wedding-cream/20">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-wedding-olive">Budget</CardTitle>
        <CardDescription className="text-muted-foreground">
          Répartition de votre budget de mariage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {showCalculator ? (
          showEstimate ? (
            renderEstimate()
          ) : (
            <>
              <div className="min-h-[300px]">
                {renderStepContent()}
              </div>
              
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={goToPreviousStep}
                  disabled={currentStep === 1}
                >
                  <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
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
                      <Calculator className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Suivant
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )
        ) : (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="amount"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#7F9474', strokeWidth: 0.5 }}
                    strokeWidth={1}
                    stroke="#f8f6f0"
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend formatter={(value) => <span className="text-sm font-medium">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="pt-6 border-t border-wedding-cream/30">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="bg-wedding-cream/20 p-2 rounded-full">
                  <Euro className="h-8 w-8 text-wedding-olive" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Budget total</p>
                  <p className="text-2xl font-medium text-wedding-olive">{formatCurrency(totalBudget)}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {budgetData.map((category) => (
                <div key={category.name} className="flex items-center space-x-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <p className="text-sm font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(category.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between gap-2 mt-6">
              <Button 
                variant="outline" 
                className="flex-1 bg-wedding-cream/10 hover:bg-wedding-cream/20" 
                onClick={() => setShowCalculator(true)}
              >
                <Calculator className="mr-2 h-4 w-4" />
                Calculer mon budget
              </Button>
              
              <Button 
                variant="outline"
                className="bg-wedding-olive/10 hover:bg-wedding-olive/20 text-wedding-olive"
                onClick={handleExportPDF}
              >
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetSummary;
