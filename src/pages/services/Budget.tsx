
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, Calculator, PieChart, ArrowRight, ArrowLeft, 
  Sun, Snowflake, Users, Info, CalendarIcon, Download, Mail 
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import SEO from '@/components/SEO';
import DrinksCalculator from '@/components/drinks/DrinksCalculator';
import { toast } from '@/components/ui/use-toast';

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

// Constantes pour les calculs
const BASE_PRICES: Record<VendorType, number> = {
  lieu: 3500,
  traiteur: 1,
  photo: 1800,
  dj: 1500,
  planner:2000,
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
  'Île-de-France': 1.5,
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
  lieu: '#7e69ab',
  traiteur: '#9b87f5',
  photo: '#4f46e5',
  dj: '#8b5cf6',
  planner: '#6366f1',
  deco: '#a78bfa',
  autres: '#4CAF50'
};

const Budget = () => {
  // État pour le multi-étapes de la calculatrice
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
  
  // État pour l'estimation du budget
  const [budgetEstimate, setBudgetEstimate] = useState<BudgetEstimate>({
    total: 0,
    breakdown: []
  });

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
    // Si pas de saisie, on estime à 15 000 €
    if (!totalBudget || totalBudget <= 0) totalBudget = 15000;

    // Format des lignes budgétaires
    const breakdown: BudgetLine[] = [];
    
    // Pondération par niveau de service
    const serviceMultiplier = PRICE_MODIFIERS[serviceLevel];
    
    // Pondération par région
    const regionMultiplier = REGION_MODIFIERS[region];
    
    // Pondération par saison
    const seasonMultiplier = season === 'haute' ? 1.2 : 1.0;
    
    // Pour chaque prestataire sélectionné
    selectedVendors.forEach(vendor => {
      let amount = 0;
      let basePrice = BASE_PRICES[vendor];
      
      if (vendor === 'lieu') {
        // Calcul pour le lieu
        amount = basePrice * serviceMultiplier * regionMultiplier * seasonMultiplier;
      } else if (vendor === 'traiteur') {
        // Calcul pour le traiteur
        const guestsCount = 100; // Valeur par défaut
        const pricePerGuest = CATERING_PRICES[serviceLevel];
        amount = pricePerGuest * guestsCount * regionMultiplier * seasonMultiplier;
        basePrice = pricePerGuest;
      } else if (vendor === 'deco') {
        // Calcul pour la déco
        const guestsCount = 100; // Valeur par défaut
        const pricePerGuest = DECOR_PRICES[serviceLevel];
        amount = pricePerGuest * guestsCount * regionMultiplier * seasonMultiplier;
        basePrice = pricePerGuest;
      } else {
        // Calcul standard pour les autres prestataires
        amount = basePrice * serviceMultiplier * regionMultiplier * seasonMultiplier;
      }
      
      // Ajouter la ligne au budget
      breakdown.push({
        name: getVendorName(vendor),
        amount: Math.round(amount),
        basePrice,
        color: BUDGET_COLORS[vendor]
      });
    });
    
    // Calculer le total
    const total = breakdown.reduce((sum, item) => sum + item.amount, 0);
    
    // Ajouter une ligne "Autres dépenses" (10% du budget)
    const otherExpenses = Math.round(total * 0.1);
    breakdown.push({
      name: 'Autres dépenses',
      amount: otherExpenses,
      basePrice: 0,
      color: '#4CAF50'
    });
    
    // Nouveau total incluant les autres dépenses
    const grandTotal = total + otherExpenses;
    
    // Mise à jour de l'état
    setBudgetEstimate({
      total: grandTotal,
      breakdown
    });
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

  // Fonctions pour les actions sur l'estimation
  const handleDownloadPDF = () => {
    // Cette fonction serait implémentée pour générer un PDF
    toast({
      title: "Téléchargement initié",
      description: "Votre estimation budgétaire est en cours de téléchargement",
      duration: 3000,
    });
  };

  const handleSendByEmail = () => {
    // Cette fonction serait implémentée pour envoyer par email
    toast({
      title: "Envoi programmé",
      description: "Votre estimation budgétaire sera envoyée à votre adresse email",
      duration: 3000,
    });
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
            <h2 className="text-2xl font-serif mb-6">Étape 2/4 : Budget et Saison</h2>
            <div className="mb-6">
              <Label htmlFor="globalBudget" className="text-lg mb-2 block">Budget global disponible (€)</Label>
              <Input
                type="number"
                id="globalBudget"
                value={globalBudgetInput}
                onChange={e => {
                  setGlobalBudgetInput(e.target.value);
                  const val = parseInt(e.target.value, 10);
                  if(!isNaN(val) && val>0) setGlobalBudget(val);
                }}
                className="py-6"
                min="500"
                max="100000"
                placeholder="Ex: 15000"
              />
              <p className="text-xs text-muted-foreground mt-1">Indiquez votre budget total (minimum recommandé : 500 €)</p>
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
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif mb-2">Estimation budgétaire</h2>
          <p className="text-muted-foreground">Voici une estimation basée sur vos critères</p>
        </div>
        
        <div className="text-center py-8">
          <h3 className="text-2xl md:text-3xl font-serif mb-4" style={{ color: '#4CAF50' }}>Budget total estimé</h3>
          <p className="text-4xl text-wedding-olive font-medium">{budgetEstimate.total.toLocaleString('fr-FR')} €</p>
          <p className="text-sm text-muted-foreground mt-2">Ce montant est réparti selon les proportions standard du secteur</p>
        </div>
        
        <div>
          <h3 className="text-2xl font-serif mb-4">Répartition détaillée</h3>
          <div className="space-y-6">
            {budgetEstimate.breakdown.map((item, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between mb-1">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.amount.toLocaleString('fr-FR')} €</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-start gap-2 text-sm text-muted-foreground bg-gray-50 p-4 rounded-md">
          <Info size={18} className="shrink-0 mt-0.5" />
          <p>Estimation indicative basée sur les standards, à ajuster selon vos choix et besoins spécifiques.</p>
        </div>
        
        <div>
          <h3 className="text-2xl font-serif mb-4">Paramètres de votre estimation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border p-3 rounded">
              <p className="text-sm font-medium">Région</p>
              <p>{region}</p>
            </div>
            <div className="border p-3 rounded">
              <p className="text-sm font-medium">Saison</p>
              <p>{season === 'haute' ? 'Haute saison (avril-sept)' : 'Basse saison (oct-mars)'}</p>
            </div>
            <div className="border p-3 rounded">
              <p className="text-sm font-medium">Budget global</p>
              <p>{budgetEstimate.total.toLocaleString('fr-FR')} €</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline"
            className="md:col-span-2 bg-gray-200 hover:bg-gray-300 text-wedding-black flex items-center justify-center gap-2"
            onClick={() => {
              setShowEstimate(false);
              setCurrentStep(1);
            }}
          >
            Recommencer l'estimation
          </Button>
          <Button 
            type="button"
            variant="outline"
            className="md:col-span-2 bg-gray-200 hover:bg-gray-300 text-wedding-black flex items-center justify-center gap-2"
            onClick={() => {
              toast({
                title: "Inscription",
                description: "Inscrivez-vous : fonctionnalité prochainement disponible",
                duration: 3000,
              });
            }}
          >
            <Mail size={18} />
            Recevoir par email
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Budget de mariage - Calculez et planifiez vos dépenses"
        description="Utilisez notre calculateur de budget de mariage pour estimer vos dépenses et répartir votre budget selon les différentes catégories."
      />
      <Header />
      <main className="container max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-serif mb-2">Calculez votre budget mariage</h1>
        
        <Card className="p-6 mt-6 bg-wedding-cream/20">
          <div className="mb-4">
            <h2 className="text-2xl md:text-3xl font-serif mb-2">Calculatrice de budget mariage</h2>
            <p className="text-muted-foreground">Estimez le budget de votre mariage en quelques étapes</p>
          </div>
          
          {/* Progress bars removed */}
          
          {showEstimate ? (
            renderEstimate()
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
            L'estimation du budget traiteur ci-dessus est calculée avec une estimation globale des boissons. Pour vous aider à prévoir avec précision la quantité et le coût des boissons pour votre mariage, nous avons développé une calculatrice spéciale ci-dessous.
          </p>
        </div>

        {/* Calculatrice de boissons */}
        <div className="mt-4 mb-12">
          <h2 className="text-2xl md:text-3xl font-serif mb-4">Calculatrice boissons : quantité et budget</h2>
          <DrinksCalculator />
        </div>
      </main>
    </div>
  );
};

export default Budget;
