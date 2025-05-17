
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DrinksCalculator from '@/components/drinks/DrinksCalculator';

const BudgetCalculator: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-serif mb-4 text-center">Calculatrice de Budget Personnalisé</h2>
        <p className="text-center text-muted-foreground mb-6">
          Utilisez nos outils pour estimer et planifier votre budget de mariage selon vos besoins spécifiques.
        </p>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Calculatrice de Boissons</CardTitle>
            <CardDescription>
              Estimez les quantités et le budget pour les boissons de votre mariage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DrinksCalculator />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Conseils pour gérer votre budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Répartition classique du budget</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Réception (lieu et traiteur) : 50-60%</li>
                <li>Tenues des mariés : 10-15%</li>
                <li>Photo et vidéo : 10%</li>
                <li>Fleurs et décoration : 5-10%</li>
                <li>Musique et animation : 5-10%</li>
                <li>Faire-part et papeterie : 2-5%</li>
                <li>Alliances : 2-3%</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Astuces pour économiser</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Mariage en semaine ou hors-saison (-30%)</li>
                <li>Limiter le nombre d'invités</li>
                <li>Prioriser les postes importants pour vous</li>
                <li>Faire appel à des talents parmi vos proches</li>
                <li>Prévoir une enveloppe "imprévus" de 10%</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetCalculator;
