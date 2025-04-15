
import React, { useState, useRef } from 'react';
import ServiceTemplate from '../ServiceTemplate';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight, ArrowLeft, Download, RefreshCcw, Sun, Snowflake, MapPin, Euro, Info, Users } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';

// Coût par invité pour le traiteur selon le niveau de service
const COST_PER_GUEST = {
  "economique": 70,
  "abordable": 100,
  "premium": 150,
  "luxe": 250
};

// Coût de base pour un lieu selon le niveau de service
const BASE_VENUE_COST = {
  "economique": 2000,
  "abordable": 4000,
  "premium": 8000,
  "luxe": 15000
};

// Coefficients par région
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

// Coefficients par saison
const SEASON_COEFFICIENTS = {
  "haute": 1.15,
  "basse": 0.80
};

// Pourcentages standard de répartition du budget (ajustables)
const STANDARD_PERCENTAGES = {
  "lieu": 25,         // % du budget hors traiteur
  "traiteur": 0,      // Calculé séparément en fonction du nombre d'invités
  "photo-video": 20,  // % du budget hors traiteur et lieu
  "musique": 10,      // % du budget hors traiteur et lieu
  "wedding-planner": 12, // % du budget hors traiteur et lieu
  "deco-fleurs": 15,  // % du budget hors traiteur et lieu
  "divers": 8        // % du budget hors traiteur et lieu
};

const BudgetCalculator = () => {
  const [step, setStep] = useState(1);
  const [region, setRegion] = useState<string>("");
  const [season, setSeason] = useState<string>("");
  const [guestCount, setGuestCount] = useState<number>(0);
  const [services, setServices] = useState<string[]>([]);
  const [serviceLevel, setServiceLevel] = useState<string>("");
  const [finalBudget, setFinalBudget] = useState<number | null>(null);
  const [budgetBreakdown, setBudgetBreakdown] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [airtableSubmitted, setAirtableSubmitted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleServiceToggle = (value: string) => {
    if (services.includes(value)) {
      setServices(services.filter(service => service !== value));
    } else {
      setServices([...services, value]);
    }
  };

  const roundToNearest10 = (value: number): number => {
    return Math.round(value / 10) * 10;
  };

  const calculateBudget = () => {
    if (!region || !season || guestCount <= 0 || !serviceLevel || services.length === 0) {
      return;
    }

    // Calculer le coût du traiteur en fonction du nombre d'invités (si sélectionné)
    const costPerGuest = COST_PER_GUEST[serviceLevel as keyof typeof COST_PER_GUEST];
    const cateringCost = services.includes('traiteur') ? roundToNearest10(guestCount * costPerGuest) : 0;
    
    // Calculer le coût du lieu en fonction du niveau de service (si sélectionné)
    const baseLieuCost = BASE_VENUE_COST[serviceLevel as keyof typeof BASE_VENUE_COST];
    const regionCoef = REGION_COEFFICIENTS[region as keyof typeof REGION_COEFFICIENTS];
    const seasonCoef = SEASON_COEFFICIENTS[season as keyof typeof SEASON_COEFFICIENTS];
    const lieuCost = services.includes('lieu') ? roundToNearest10(baseLieuCost * regionCoef * seasonCoef) : 0;
    
    // Créer la répartition du budget
    let breakdown: Record<string, number> = {};
    
    // Ajouter les coûts de lieu et traiteur s'ils sont sélectionnés
    if (services.includes('lieu')) {
      breakdown["Lieu"] = lieuCost;
    }
    
    if (services.includes('traiteur')) {
      breakdown["Traiteur"] = cateringCost;
    }
    
    // Calculer le budget de base pour les autres services
    // Si lieu et traiteur sont sélectionnés, on utilise une base proportionnelle à leurs coûts
    // Sinon, on estime un budget global en fonction du nombre d'invités et du niveau de service
    let baseOtherServicesTotal = 0;
    
    if (services.includes('lieu') && services.includes('traiteur')) {
      baseOtherServicesTotal = roundToNearest10((lieuCost + cateringCost) * 0.5); // 50% du budget lieu + traiteur
    } else if (services.includes('lieu')) {
      baseOtherServicesTotal = roundToNearest10(lieuCost * 1.0); // 100% du budget lieu pour les autres services
    } else if (services.includes('traiteur')) {
      baseOtherServicesTotal = roundToNearest10(cateringCost * 1.0); // 100% du budget traiteur pour les autres services
    } else {
      // Cas où ni lieu ni traiteur ne sont sélectionnés
      baseOtherServicesTotal = roundToNearest10(guestCount * costPerGuest * 2 * regionCoef * seasonCoef);
    }
    
    // Calculer les pourcentages pour les autres services sélectionnés
    let totalOtherServicesPercentage = 0;
    const otherServicesPercentages: Record<string, number> = {};
    
    if (services.includes("photo-video")) {
      totalOtherServicesPercentage += STANDARD_PERCENTAGES["photo-video"];
      otherServicesPercentages["Photographie & Vidéo"] = STANDARD_PERCENTAGES["photo-video"];
    }
    
    if (services.includes("musique")) {
      totalOtherServicesPercentage += STANDARD_PERCENTAGES["musique"];
      otherServicesPercentages["Musique (DJ/Groupe)"] = STANDARD_PERCENTAGES["musique"];
    }
    
    if (services.includes("wedding-planner")) {
      totalOtherServicesPercentage += STANDARD_PERCENTAGES["wedding-planner"];
      otherServicesPercentages["Wedding Planner"] = STANDARD_PERCENTAGES["wedding-planner"];
    }
    
    if (services.includes("deco-fleurs")) {
      totalOtherServicesPercentage += STANDARD_PERCENTAGES["deco-fleurs"];
      otherServicesPercentages["Décoration & Fleurs"] = STANDARD_PERCENTAGES["deco-fleurs"];
    }
    
    // Ajouter toujours les divers si au moins un autre service est sélectionné
    if (totalOtherServicesPercentage > 0) {
      totalOtherServicesPercentage += STANDARD_PERCENTAGES["divers"];
      otherServicesPercentages["Divers & Imprévus"] = STANDARD_PERCENTAGES["divers"];
    }
    
    // Normaliser les pourcentages et répartir le budget des autres services
    if (totalOtherServicesPercentage > 0) {
      const normalizationFactor = 100 / totalOtherServicesPercentage;
      
      for (const [service, percentage] of Object.entries(otherServicesPercentages)) {
        const normalizedPercentage = percentage * normalizationFactor;
        breakdown[service] = roundToNearest10((baseOtherServicesTotal * normalizedPercentage) / 100);
      }
    }
    
    // Calculer le budget total en additionnant tous les postes
    const totalBudget = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0);
    
    // Stocker le budget final et la répartition
    setFinalBudget(totalBudget);
    setBudgetBreakdown(breakdown);
    setShowResults(true);
  };

  const resetCalculator = () => {
    setRegion("");
    setSeason("");
    setGuestCount(0);
    setServices([]);
    setServiceLevel("");
    setFinalBudget(null);
    setBudgetBreakdown({});
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

  const handleDownloadClick = () => {
    setShowDownloadDialog(true);
  };

  const handleAirtableLoad = () => {
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'airtableSubmission') {
        setAirtableSubmitted(true);
        toast({
          title: "Formulaire soumis !",
          description: "Vous pouvez maintenant télécharger votre estimation",
        });
      }
    });
  };

  const handleGuestCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setGuestCount(isNaN(value) ? 0 : value);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    
    doc.setFontSize(22);
    doc.setTextColor(95, 103, 74);
    doc.text("Estimation Mariage – Personnalisée", pageWidth/2, 30, { align: 'center' });
    
    const regionName = {
      "ile-de-france": "Île-de-France",
      "paca": "PACA",
      "bretagne": "Bretagne",
      "centre": "Centre-Val de Loire",
      "bourgogne": "Bourgogne-Franche-Comté",
      "occitanie": "Occitanie",
      "normandie": "Normandie",
      "hauts-de-france": "Hauts-de-France",
      "grand-est": "Grand Est",
      "pays-de-la-loire": "Pays de la Loire",
      "auvergne-rhone-alpes": "Auvergne-Rhône-Alpes",
      "nouvelle-aquitaine": "Nouvelle-Aquitaine",
      "corse": "Corse"
    }[region as keyof typeof REGION_COEFFICIENTS] || "";

    const seasonText = season === "haute" ? "Haute saison (avril-sept)" : "Basse saison (oct-mars)";
    
    const paramText = `${regionName} - ${seasonText} - ${guestCount} invités - ${serviceLevel.charAt(0).toUpperCase() + serviceLevel.slice(1)}`;
    doc.text(paramText, pageWidth/2, 50, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setTextColor(95, 103, 74);
    doc.text("Budget Total Estimé", margin, 70);
    
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text(`${finalBudget?.toLocaleString('fr-FR')} €`, margin, 85);
    
    doc.setFontSize(16);
    doc.setTextColor(95, 103, 74);
    doc.text("Répartition Budgétaire", margin, 105);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    let yPosition = 120;
    
    Object.entries(budgetBreakdown).forEach(([service, amount], index) => {
      doc.text(`${service}`, margin, yPosition);
      doc.text(`${amount.toLocaleString('fr-FR')} €`, pageWidth - margin - 40, yPosition, { align: 'right' });
      yPosition += 10;
    });

    // Ajouter la note en bas de page
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Estimation indicative basée sur vos choix, ajustable selon vos prestataires réels.", pageWidth/2, 240, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("Estimation générée par Mariable.fr", pageWidth/2, 280, { align: 'center' });
    
    doc.save("estimation-mariage-mariable.pdf");
    
    setShowDownloadDialog(false);
    setAirtableSubmitted(false);
    
    toast({
      title: "Estimation téléchargée !",
      description: "Votre fichier PDF a été téléchargé avec succès.",
    });
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
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="guestCount"
                  type="number"
                  value={guestCount || ''}
                  onChange={handleGuestCountChange}
                  placeholder="Saisissez le nombre exact d'invités"
                  min="1"
                  className="w-full"
                />
              </div>
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
                    id="lieu" 
                    checked={services.includes("lieu")} 
                    onCheckedChange={() => handleServiceToggle("lieu")}
                  />
                  <label htmlFor="lieu" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    Lieu
                  </label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="traiteur" 
                    checked={services.includes("traiteur")} 
                    onCheckedChange={() => handleServiceToggle("traiteur")}
                  />
                  <label htmlFor="traiteur" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    Traiteur
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
                (step === 2 && (!season || guestCount <= 0)) || 
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
                {Object.entries(budgetBreakdown).map(([service, amount]) => (
                  <div key={service} className="flex justify-between items-center">
                    <span>{service}</span>
                    <span className="font-medium">{amount.toLocaleString('fr-FR')} €</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-wedding-cream/10 border border-wedding-cream/20 rounded-md flex items-start text-sm">
                <Info className="h-5 w-5 text-wedding-olive/80 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Estimation indicative basée sur vos choix, ajustable selon vos prestataires réels.
                </p>
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
                  <div>{guestCount}</div>
                  
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
              onClick={handleDownloadClick}
            >
              <Download className="mr-2 h-4 w-4" /> 📥 Télécharger mon estimation
            </Button>
          </CardFooter>
        </Card>
      )}

      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Télécharger votre estimation</DialogTitle>
            <DialogDescription>
              Entrez votre adresse email pour recevoir ou télécharger votre estimation personnalisée.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {!airtableSubmitted ? (
              <iframe 
                ref={iframeRef}
                className="airtable-embed w-full border border-gray-200 rounded-md"
                src="https://airtable.com/embed/app6YR8d1UIVu4KQG/pagdkAeOPWMiQUIVU/form"
                frameBorder="0"
                width="100%" 
                height="400"
                style={{ background: "transparent" }}
                onLoad={handleAirtableLoad}
              ></iframe>
            ) : (
              <div className="text-center py-4">
                <Button
                  onClick={generatePDF}
                  className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
                >
                  ✅ Télécharger mon estimation
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
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
