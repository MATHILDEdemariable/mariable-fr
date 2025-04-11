
import React, { useState } from 'react';
import ServiceTemplate from '../ServiceTemplate';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight, ArrowLeft, Mail, RefreshCcw, Sun, Snowflake, MapPin, Euro } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// Données de base pour les calculs
const PRICE_PER_GUEST = {
  "economique": 100,
  "abordable": 150,
  "premium": 250,
  "luxe": 400
};

const REGION_COEFFICIENTS = {
  "ile-de-france": 1.15,
  "paca": 1.15,
  "bretagne": 1.00,
  "centre": 1.00,
  "bourgogne": 0.85,
  "occitanie": 0.85,
  "normandie": 0.90,
  "hauts-de-france": 0.90,
  "grand-est": 0.90,
  "pays-de-la-loire": 0.95,
  "auvergne-rhone-alpes": 1.05,
  "nouvelle-aquitaine": 0.95,
  "corse": 1.20
};

const SEASON_COEFFICIENTS = {
  "haute": 1.15,
  "basse": 0.80
};

const BUDGET_DISTRIBUTION = {
  "lieu-traiteur": 47,
  "photo-video": 20,
  "musique": 10,
  "wedding-planner": 8,
  "deco-fleurs": 10,
  "divers": 5
};

const BudgetCalculator = () => {
  const [step, setStep] = useState(1);
  const [region, setRegion] = useState<string>("");
  const [season, setSeason] = useState<string>("");
  const [guestCount, setGuestCount] = useState<string>("");
  const [services, setServices] = useState<string[]>([]);
  const [serviceLevel, setServiceLevel] = useState<string>("");
  const [finalBudget, setFinalBudget] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleServiceToggle = (value: string) => {
    if (services.includes(value)) {
      setServices(services.filter(service => service !== value));
    } else {
      setServices([...services, value]);
    }
  };

  const calculateBudget = () => {
    // Vérifier que tous les champs sont remplis
    if (!region || !season || !guestCount || !serviceLevel || services.length === 0) {
      return;
    }

    // Calculer le budget de base
    const guests = Number(guestCount);
    const basePrice = PRICE_PER_GUEST[serviceLevel as keyof typeof PRICE_PER_GUEST];
    const baseBudget = guests * basePrice;

    // Appliquer les coefficients
    const regionCoef = REGION_COEFFICIENTS[region as keyof typeof REGION_COEFFICIENTS];
    const seasonCoef = SEASON_COEFFICIENTS[season as keyof typeof SEASON_COEFFICIENTS];
    
    // Calculer le budget final
    const calculatedBudget = Math.round(baseBudget * regionCoef * seasonCoef);
    setFinalBudget(calculatedBudget);
    setShowResults(true);
  };

  const resetCalculator = () => {
    setRegion("");
    setSeason("");
    setGuestCount("");
    setServices([]);
    setServiceLevel("");
    setFinalBudget(null);
    setShowResults(false);
    setStep(1);
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      calculateBudget();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Calculer la répartition du budget
  const getBudgetDistribution = () => {
    if (!finalBudget) return {};

    const distribution: Record<string, number> = {};
    
    if (services.includes("lieu-traiteur")) {
      distribution["Lieu & Traiteur"] = Math.round(finalBudget * BUDGET_DISTRIBUTION["lieu-traiteur"] / 100);
    }
    
    if (services.includes("photo-video")) {
      distribution["Photographie & Vidéo"] = Math.round(finalBudget * BUDGET_DISTRIBUTION["photo-video"] / 100);
    }
    
    if (services.includes("musique")) {
      distribution["Musique (DJ/Groupe)"] = Math.round(finalBudget * BUDGET_DISTRIBUTION["musique"] / 100);
    }
    
    if (services.includes("wedding-planner")) {
      distribution["Wedding Planner"] = Math.round(finalBudget * BUDGET_DISTRIBUTION["wedding-planner"] / 100);
    }
    
    if (services.includes("deco-fleurs")) {
      distribution["Décoration & Fleurs"] = Math.round(finalBudget * BUDGET_DISTRIBUTION["deco-fleurs"] / 100);
    }
    
    // Toujours inclure les divers/imprévus
    distribution["Divers & Imprévus"] = Math.round(finalBudget * BUDGET_DISTRIBUTION["divers"] / 100);
    
    return distribution;
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="region" className="text-base">Région du mariage</Label>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une région" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ile-de-france">Île-de-France</SelectItem>
                    <SelectItem value="paca">Provence-Alpes-Côte d'Azur</SelectItem>
                    <SelectItem value="bretagne">Bretagne</SelectItem>
                    <SelectItem value="centre">Centre-Val de Loire</SelectItem>
                    <SelectItem value="bourgogne">Bourgogne-Franche-Comté</SelectItem>
                    <SelectItem value="occitanie">Occitanie</SelectItem>
                    <SelectItem value="normandie">Normandie</SelectItem>
                    <SelectItem value="hauts-de-france">Hauts-de-France</SelectItem>
                    <SelectItem value="grand-est">Grand Est</SelectItem>
                    <SelectItem value="pays-de-la-loire">Pays de la Loire</SelectItem>
                    <SelectItem value="auvergne-rhone-alpes">Auvergne-Rhône-Alpes</SelectItem>
                    <SelectItem value="nouvelle-aquitaine">Nouvelle-Aquitaine</SelectItem>
                    <SelectItem value="corse">Corse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base">Période de l'année</Label>
              <ToggleGroup type="single" value={season} onValueChange={setSeason} className="flex justify-center">
                <ToggleGroupItem value="haute" className="flex items-center gap-2 py-2 px-4">
                  <Sun className="h-4 w-4" />
                  <span>Haute saison (avril-sept)</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="basse" className="flex items-center gap-2 py-2 px-4">
                  <Snowflake className="h-4 w-4" />
                  <span>Basse saison (oct-mars)</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="guestCount" className="text-base">Nombre d'invités</Label>
              <Select value={guestCount} onValueChange={setGuestCount}>
                <SelectTrigger>
                  <SelectValue placeholder="Nombre d'invités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Moins de 50</SelectItem>
                  <SelectItem value="75">50 à 100</SelectItem>
                  <SelectItem value="125">100 à 150</SelectItem>
                  <SelectItem value="175">Plus de 150</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base">Prestataires nécessaires</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="lieu-traiteur" 
                    checked={services.includes("lieu-traiteur")} 
                    onCheckedChange={() => handleServiceToggle("lieu-traiteur")}
                  />
                  <label htmlFor="lieu-traiteur" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    Lieu & Traiteur
                  </label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="photo-video" 
                    checked={services.includes("photo-video")} 
                    onCheckedChange={() => handleServiceToggle("photo-video")}
                  />
                  <label htmlFor="photo-video" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    Photographe & Vidéaste
                  </label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="musique" 
                    checked={services.includes("musique")} 
                    onCheckedChange={() => handleServiceToggle("musique")}
                  />
                  <label htmlFor="musique" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    DJ / Groupe de musique
                  </label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="wedding-planner" 
                    checked={services.includes("wedding-planner")} 
                    onCheckedChange={() => handleServiceToggle("wedding-planner")}
                  />
                  <label htmlFor="wedding-planner" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    Wedding Planner
                  </label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="deco-fleurs" 
                    checked={services.includes("deco-fleurs")} 
                    onCheckedChange={() => handleServiceToggle("deco-fleurs")}
                  />
                  <label htmlFor="deco-fleurs" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    Décoration & Fleurs
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base">Niveau de prestation souhaité</Label>
              <RadioGroup value={serviceLevel} onValueChange={setServiceLevel} className="grid gap-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="economique" id="economique" />
                  <Label htmlFor="economique" className="cursor-pointer">Économique</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="abordable" id="abordable" />
                  <Label htmlFor="abordable" className="cursor-pointer">Abordable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="premium" id="premium" />
                  <Label htmlFor="premium" className="cursor-pointer">Premium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="luxe" id="luxe" />
                  <Label htmlFor="luxe" className="cursor-pointer">Luxe</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {!showResults ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Calculatrice de budget mariage</CardTitle>
            <CardDescription>
              Estimez le budget de votre mariage en quelques étapes
            </CardDescription>
            <div className="flex justify-center mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((s) => (
                  <div 
                    key={s} 
                    className={`w-6 h-1 rounded-full ${step >= s ? 'bg-wedding-olive' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="py-4">
              <h3 className="font-medium text-lg mb-4">
                Étape {step}/4 : {
                  step === 1 ? "Région" : 
                  step === 2 ? "Saison et invités" : 
                  step === 3 ? "Prestataires" : 
                  "Niveau de prestation"
                }
              </h3>
              {renderStepContent()}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={step === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
            </Button>
            <Button 
              onClick={nextStep}
              className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
              disabled={
                (step === 1 && !region) || 
                (step === 2 && (!season || !guestCount)) || 
                (step === 3 && services.length === 0) ||
                (step === 4 && !serviceLevel)
              }
            >
              {step < 4 ? "Suivant" : "Calculer"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Estimation budgétaire</CardTitle>
            <CardDescription>
              Voici une estimation basée sur vos critères
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-4">
              <div className="bg-wedding-cream/30 p-6 rounded-lg mb-6 text-center">
                <h3 className="text-2xl font-serif mb-2">Budget total estimé</h3>
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-wedding-olive">
                  <Euro className="h-6 w-6" />
                  {finalBudget?.toLocaleString('fr-FR')} €
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Ce montant inclut uniquement les prestataires sélectionnés
                </p>
              </div>
              
              <h3 className="font-medium text-lg mb-3">Répartition détaillée</h3>
              <div className="space-y-3">
                {Object.entries(getBudgetDistribution()).map(([service, amount]) => (
                  <div key={service} className="flex justify-between items-center">
                    <span>{service}</span>
                    <span className="font-medium">{amount.toLocaleString('fr-FR')} €</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 mt-6 pt-6">
                <h3 className="font-medium text-base mb-3">Paramètres de votre estimation</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="text-muted-foreground">Région:</div>
                  <div>{
                    region === "ile-de-france" ? "Île-de-France" :
                    region === "paca" ? "PACA" :
                    region === "bretagne" ? "Bretagne" :
                    region === "centre" ? "Centre-Val de Loire" :
                    region === "bourgogne" ? "Bourgogne-Franche-Comté" :
                    region === "occitanie" ? "Occitanie" :
                    region === "normandie" ? "Normandie" :
                    region === "hauts-de-france" ? "Hauts-de-France" :
                    region === "grand-est" ? "Grand Est" :
                    region === "pays-de-la-loire" ? "Pays de la Loire" :
                    region === "auvergne-rhone-alpes" ? "Auvergne-Rhône-Alpes" :
                    region === "nouvelle-aquitaine" ? "Nouvelle-Aquitaine" :
                    region === "corse" ? "Corse" : ""
                  }</div>
                  
                  <div className="text-muted-foreground">Saison:</div>
                  <div>{season === "haute" ? "Haute saison (avril-sept)" : "Basse saison (oct-mars)"}</div>
                  
                  <div className="text-muted-foreground">Invités:</div>
                  <div>{
                    guestCount === "30" ? "Moins de 50" :
                    guestCount === "75" ? "50 à 100" :
                    guestCount === "125" ? "100 à 150" :
                    guestCount === "175" ? "Plus de 150" : ""
                  }</div>
                  
                  <div className="text-muted-foreground">Niveau:</div>
                  <div className="capitalize">{serviceLevel}</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={resetCalculator}
            >
              <RefreshCcw className="mr-2 h-4 w-4" /> Modifier mes paramètres
            </Button>
            <Button 
              className="w-full sm:w-auto bg-wedding-olive hover:bg-wedding-olive/90 text-white"
            >
              <Mail className="mr-2 h-4 w-4" /> Recevoir par email
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

const BudgetContent = () => (
  <>
    <p>
      La transparence des prix est au cœur de notre approche. Notre plateforme vous permet 
      d'accéder aux tarifs réels des prestataires sans mauvaises surprises.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Calculez votre budget mariage</h2>
    
    <BudgetCalculator />
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Fonctionnalités</h2>
    
    <ul className="list-disc pl-6 space-y-2">
      <li>Accès aux tarifs directs communiqués par les prestataires</li>
      <li>Calculatrice de budget générant un devis instantané et personnalisé</li>
      <li>Comparaison claire des différentes options selon votre budget</li>
      <li>Simulation des coûts en fonction du nombre d'invités</li>
      <li>Détection des économies potentielles</li>
      <li>Adaptation automatique en fonction de vos priorités</li>
    </ul>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Notre engagement</h2>
    
    <p>
      Fini les surprises de dernière minute et les coûts cachés. Notre outil vous 
      permet de planifier sereinement votre budget avec une vision claire et réaliste 
      des dépenses à prévoir, vous permettant de prendre des décisions éclairées tout 
      au long de l'organisation de votre mariage.
    </p>
  </>
);

const Budget = () => {
  return (
    <ServiceTemplate 
      title="Gestion de budget"
      description="Transparence des prix et devis instantanés personnalisés"
      content={<BudgetContent />}
    />
  );
};

export default Budget;
