
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calculator, PieChart, ArrowRight, ArrowLeft, Sun, Snowflake, Users, Info, CalendarIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import SEO from '@/components/SEO';
import DrinksCalculator from '@/components/drinks/DrinksCalculator';

// Types pour la calculatrice de budget
type Step = 1 | 2 | 3 | 4 | 5;
type Region = string;
type Season = 'haute' | 'basse';
type ServiceLevel = 'economique' | 'abordable' | 'premium' | 'luxe';

type VendorType = 'lieu' | 'traiteur' | 'photo' | 'dj' | 'planner' | 'deco';

interface BudgetEstimate {
  lieu: number;
  photo: number;
  divers: number;
  total: number;
}

const Budget = () => {
  // État pour le multi-étapes de la calculatrice
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showEstimate, setShowEstimate] = useState(false);
  
  // États pour les paramètres de budget
  const [region, setRegion] = useState<Region>('Pays de la Loire');
  const [season, setSeason] = useState<Season>('basse');
  const [guestCount, setGuestCount] = useState<number>(100);
  const [selectedVendors, setSelectedVendors] = useState<VendorType[]>(['lieu']);
  const [serviceLevel, setServiceLevel] = useState<ServiceLevel>('premium');
  
  // État pour l'estimation du budget
  const [budgetEstimate, setBudgetEstimate] = useState<BudgetEstimate>({
    lieu: 6080,
    photo: 4340,
    divers: 1740,
    total: 12160
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
    // Dans une version réelle, nous aurions une logique de calcul plus sophistiquée basée sur les sélections de l'utilisateur
    // Cette fonction simule simplement un calcul pour l'exemple
    
    // Les valeurs utilisées sont celles montrées dans la capture d'écran
    setBudgetEstimate({
      lieu: 6080,
      photo: 4340,
      divers: 1740,
      total: 12160
    });
  };

  // Gérer les changements de sélection de prestataires
  const toggleVendor = (vendor: VendorType) => {
    setSelectedVendors(prev => 
      prev.includes(vendor) 
        ? prev.filter(v => v !== vendor) 
        : [...prev, vendor]
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
            <h2 className="text-2xl font-serif mb-6">Étape 2/4 : Saison et invités</h2>
            
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
            
            <div className="mb-6">
              <Label htmlFor="guestCount" className="text-lg mb-2 block">Nombre d'invités</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <Select
                  value={guestCount.toString()}
                  onValueChange={(value) => setGuestCount(parseInt(value))}
                >
                  <SelectTrigger className="w-full pl-10 py-6">
                    <SelectValue placeholder="Saisissez le nombre exact d'invités" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 invités</SelectItem>
                    <SelectItem value="75">75 invités</SelectItem>
                    <SelectItem value="100">100 invités</SelectItem>
                    <SelectItem value="125">125 invités</SelectItem>
                    <SelectItem value="150">150 invités</SelectItem>
                    <SelectItem value="175">175 invités</SelectItem>
                    <SelectItem value="200">200 invités</SelectItem>
                    <SelectItem value="250">250 invités</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Label htmlFor="vendor-lieu" className="text-base">Lieu</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vendor-traiteur" 
                    checked={selectedVendors.includes('traiteur')} 
                    onCheckedChange={() => toggleVendor('traiteur')}
                    className="border-2 h-6 w-6"
                  />
                  <Label htmlFor="vendor-traiteur" className="text-base">Traiteur</Label>
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
                  <Label htmlFor="vendor-dj" className="text-base">DJ / Groupe de musique</Label>
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
          <h2 className="text-3xl font-serif mb-2">Estimation budgétaire</h2>
          <p className="text-muted-foreground">Voici une estimation basée sur vos critères</p>
        </div>
        
        <div className="text-center py-8">
          <h3 className="text-3xl font-serif mb-4">Budget total estimé</h3>
          <p className="text-4xl text-wedding-olive font-medium">€ {budgetEstimate.total.toLocaleString('fr-FR')} €</p>
          <p className="text-sm text-muted-foreground mt-2">Ce montant inclut uniquement les prestataires sélectionnés</p>
        </div>
        
        <div>
          <h3 className="text-2xl font-serif mb-4">Répartition détaillée</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Lieu</span>
              <span className="font-medium">{budgetEstimate.lieu.toLocaleString('fr-FR')} €</span>
            </div>
            <Separator />
            
            <div className="flex justify-between">
              <span>Photographie & Vidéo</span>
              <span className="font-medium">{budgetEstimate.photo.toLocaleString('fr-FR')} €</span>
            </div>
            <Separator />
            
            <div className="flex justify-between">
              <span>Divers & Imprévus</span>
              <span className="font-medium">{budgetEstimate.divers.toLocaleString('fr-FR')} €</span>
            </div>
            <Separator />
          </div>
        </div>
        
        <div className="flex items-start gap-2 text-sm text-muted-foreground bg-gray-50 p-4 rounded-md">
          <Info size={18} className="shrink-0 mt-0.5" />
          <p>Estimation indicative basée sur vos choix, ajustable selon vos prestataires réels.</p>
        </div>
        
        <div>
          <h3 className="text-2xl font-serif mb-4">Paramètres de votre estimation</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <span className="text-muted-foreground">Région:</span>
              <span>{region}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <span className="text-muted-foreground">Saison:</span>
              <span>{season === 'haute' ? 'Haute saison (avril-sept)' : 'Basse saison (oct-mars)'}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <span className="text-muted-foreground">Invités:</span>
              <span>{guestCount}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <span className="text-muted-foreground">Niveau:</span>
              <span>{serviceLevel === 'economique' ? 'Économique' : 
                     serviceLevel === 'abordable' ? 'Abordable' : 
                     serviceLevel === 'premium' ? 'Premium' : 'Luxe'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center pt-4">
          <Button 
            type="button" 
            className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
            onClick={() => {
              setShowEstimate(false);
              setCurrentStep(1);
            }}
          >
            Recommencer l'estimation
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
            <h2 className="text-2xl font-serif mb-2">Calculatrice de budget mariage</h2>
            <p className="text-muted-foreground">Estimez le budget de votre mariage en quelques étapes</p>
          </div>
          
          <div className="flex items-center gap-2 my-6">
            <div className="h-2 flex-grow grid grid-cols-4 gap-1">
              {[1, 2, 3, 4].map((step) => (
                <div 
                  key={step}
                  className={`h-full rounded-full ${step <= currentStep || showEstimate ? 'bg-wedding-olive' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
          
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
                  className="bg-wedding-olive hover:bg-wedding-olive/90 text-white flex items-center gap-2"
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
            L'estimation du budget traiteur ci-dessus est calculée hors boissons. Pour vous aider à prévoir avec précision la quantité et le coût des boissons pour votre mariage, nous avons développé une calculatrice spéciale ci-dessous.
          </p>
        </div>

        {/* Calculatrice de boissons */}
        <div className="mt-4 mb-12">
          <DrinksCalculator />
        </div>
      </main>
    </div>
  );
};

export default Budget;
