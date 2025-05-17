
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, ArrowRight, Download } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const BudgetCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  const handleGoToBudgetCalculator = () => {
    setRedirecting(true);
    navigate('/services/budget');
  };

  const handleSaveBudget = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      } else {
        // User is not logged in, redirect to registration
        navigate('/register');
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error);
      navigate('/register');
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-serif mb-4 text-center">Calculatrice de Budget Personnalisé</h2>
        <p className="text-center text-muted-foreground mb-6">
          Utilisez notre outil pour estimer et planifier votre budget de mariage selon vos besoins spécifiques.
        </p>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator size={20} />
              Calculateur de Budget Complet
            </CardTitle>
            <CardDescription>
              Calculez votre budget total de mariage par poste de dépense
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Notre calculateur de budget mariage vous permet de planifier vos dépenses selon:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>La région de votre mariage</li>
              <li>Le nombre d'invités</li>
              <li>La saison de votre mariage</li>
              <li>Les prestataires dont vous avez besoin</li>
              <li>Le niveau de gamme souhaité</li>
            </ul>
            
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleGoToBudgetCalculator}
                disabled={redirecting}
                className="bg-wedding-olive hover:bg-wedding-olive/90 flex items-center gap-2 py-6 px-5"
              >
                <Calculator size={18} />
                Accéder au calculateur de budget complet
                <ArrowRight size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sauvegarder votre budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Créez votre compte pour sauvegarder et gérer votre budget de mariage:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Conservez votre estimation budgétaire</li>
              <li>Suivez vos dépenses réelles</li>
              <li>Ajoutez des prestataires à votre comparatif</li>
              <li>Exportez votre budget pour le partager</li>
            </ul>
            
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleSaveBudget}
                className="bg-wedding-olive hover:bg-wedding-olive/90 flex items-center gap-2"
              >
                <Download size={18} />
                S'inscrire et sauvegarder mon budget
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetCalculator;
