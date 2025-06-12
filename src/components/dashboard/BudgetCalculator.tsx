
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const BudgetCalculator: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center space-y-6">
          <div className="bg-wedding-cream/20 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <Calculator className="h-10 w-10 text-wedding-olive" />
          </div>
          
          <div>
            <h3 className="text-xl font-serif mb-2">Calculatrice de Budget</h3>
            <p className="text-muted-foreground">
              Utilisez notre calculatrice pour estimer le budget de votre mariage selon vos critères.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              La calculatrice vous permet de :
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Estimer votre budget selon vos critères</li>
              <li>• Répartir un budget connu par catégories</li>
              <li>• Personnaliser selon votre région et nombre d'invités</li>
              <li>• Sauvegarder automatiquement dans votre dashboard</li>
            </ul>
          </div>
          
          <Link to="/budget" className="block">
            <Button className="bg-wedding-olive hover:bg-wedding-olive/90 text-white w-full flex items-center justify-center gap-2">
              <Calculator className="h-4 w-4" />
              Ouvrir la calculatrice
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
          
          <p className="text-xs text-muted-foreground">
            Les résultats de la calculatrice seront automatiquement affichés dans votre résumé budget.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetCalculator;
