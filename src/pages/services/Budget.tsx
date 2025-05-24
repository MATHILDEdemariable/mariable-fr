import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calculator, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface BudgetSettings {
  guestsCount: number;
  region: string;
  season: string;
  serviceLevel: string;
}

interface BudgetEstimation {
  totalBudget: number;
  costPerGuest: number;
}

const REGIONS = [
  { value: 'paris', label: 'Paris' },
  { value: 'lyon', label: 'Lyon' },
  { value: 'marseille', label: 'Marseille' },
  { value: 'bordeaux', label: 'Bordeaux' },
  { value: 'lille', label: 'Lille' },
  { value: 'toulouse', label: 'Toulouse' },
  { value: 'nantes', label: 'Nantes' },
  { value: 'nice', label: 'Nice' },
  { value: 'strasbourg', label: 'Strasbourg' },
  { value: 'rennes', label: 'Rennes' },
];

const SEASONS = [
  { value: 'spring', label: 'Printemps' },
  { value: 'summer', label: 'Été' },
  { value: 'autumn', label: 'Automne' },
  { value: 'winter', label: 'Hiver' },
];

const SERVICE_LEVELS = [
  { value: 'economy', label: 'Économique' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'luxury', label: 'Luxe' },
];

const COST_PER_GUEST = {
  economy: { spring: 80, summer: 90, autumn: 85, winter: 75 },
  standard: { spring: 120, summer: 130, autumn: 125, winter: 110 },
  premium: { spring: 200, summer: 220, autumn: 210, winter: 180 },
  luxury: { spring: 350, summer: 400, autumn: 380, winter: 320 },
};

const Budget: React.FC = () => {
  const [budgetSettings, setBudgetSettings] = useState<BudgetSettings>({
    guestsCount: 100,
    region: 'paris',
    season: 'summer',
    serviceLevel: 'standard',
  });
  const [budgetEstimation, setBudgetEstimation] = useState<BudgetEstimation>({
    totalBudget: 0,
    costPerGuest: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    calculateBudget();
  }, [budgetSettings]);

  const calculateBudget = () => {
    const cost = COST_PER_GUEST[budgetSettings.serviceLevel][budgetSettings.season];
    const total = cost * budgetSettings.guestsCount;
    setBudgetEstimation({
      totalBudget: total,
      costPerGuest: cost,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBudgetSettings({
      ...budgetSettings,
      [name]: Number(value) ? Math.max(0, Number(value)) : 0,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setBudgetSettings({
      ...budgetSettings,
      [name]: value,
    });
  };

  const handleSaveBudget = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('budgets_dashboard')
        .upsert([
          {
            user_id: userData.user.id,
            total_budget: budgetEstimation.totalBudget,
            guests_count: budgetSettings.guestsCount,
            region: budgetSettings.region,
            season: budgetSettings.season,
            service_level: budgetSettings.serviceLevel,
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Budget sauvegardé",
        description: "Les paramètres de votre budget ont été enregistrés avec succès.",
      });
    } catch (error) {
      console.error("Error saving budget:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres de votre budget.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-cream via-white to-wedding-light">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-wedding-olive mb-4">
            Calculatrice de budget mariage
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estimez le budget de votre mariage en quelques étapes
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-wedding-olive text-white">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Paramètres de votre mariage
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="guestsCount">Nombre d'invités</Label>
                <Input
                  type="number"
                  id="guestsCount"
                  name="guestsCount"
                  value={budgetSettings.guestsCount}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="region">Région</Label>
                <Select onValueChange={(value) => handleSelectChange('region', value)}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue placeholder="Sélectionnez une région" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="season">Saison</Label>
                <Select onValueChange={(value) => handleSelectChange('season', value)}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue placeholder="Sélectionnez une saison" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEASONS.map((season) => (
                      <SelectItem key={season.value} value={season.value}>
                        {season.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="serviceLevel">Niveau de service</Label>
                <Select onValueChange={(value) => handleSelectChange('serviceLevel', value)}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue placeholder="Sélectionnez un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-wedding-olive text-white">
              <CardTitle>Estimation budgétaire</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-lg font-semibold">Budget total estimé :</p>
                  <p className="text-2xl text-wedding-olive font-serif">
                    {budgetEstimation.totalBudget.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Coût par invité :{' '}
                    {budgetEstimation.costPerGuest.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </p>
                </div>
                <Button className="w-full bg-wedding-olive hover:bg-wedding-olive/90" onClick={handleSaveBudget}>
                  Enregistrer le budget
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="text-center">
          <h2 className="text-2xl font-serif text-wedding-olive mb-4">
            Répartition budgétaire détaillée (à venir)
          </h2>
          <p className="text-gray-600">
            Cette section sera bientôt disponible pour vous aider à planifier chaque
            dépense de votre mariage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Budget;
