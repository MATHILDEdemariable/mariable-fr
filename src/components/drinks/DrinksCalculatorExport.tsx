
import React from 'react';
import { DrinkTier, DrinkMoment, DrinkConsumption } from '@/types/drinks';

interface DrinksCalculatorExportProps {
  guests: number;
  selectedMoments: DrinkMoment[];
  tier: DrinkTier;
  drinksPerPerson: DrinkConsumption;
  totalBottles: {
    champagne: number;
    wine: number;
    spirits: number;
  };
  totalCost: number;
}

const DrinksCalculatorExport: React.FC<DrinksCalculatorExportProps> = ({
  guests,
  selectedMoments,
  tier,
  drinksPerPerson,
  totalBottles,
  totalCost
}) => {
  const tierLabels = {
    economic: 'Économique',
    affordable: 'Abordable',
    premium: 'Haut de gamme',
    luxury: 'Luxe'
  };

  const momentLabels = {
    cocktail: 'Champagne au cocktail',
    dinner: 'Vin pendant le repas',
    dessert: 'Champagne dessert',
    party: 'Alcool fort pour la soirée'
  };

  return (
    <div className="export-container bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Calculateur de Boissons - Mariable
        </h1>
        <p className="text-gray-600">
          Estimation personnalisée pour votre événement
        </p>
      </div>

      {/* Event Parameters */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Paramètres de l'événement
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="export-field bg-gray-50 p-3 rounded border">
            <span className="font-medium text-gray-700">Nombre d'invités :</span>
            <span className="ml-2 text-gray-900 font-semibold">{guests}</span>
          </div>
          
          <div className="export-field bg-gray-50 p-3 rounded border">
            <span className="font-medium text-gray-700">Gamme de boissons :</span>
            <span className="ml-2 text-gray-900 font-semibold">{tierLabels[tier]}</span>
          </div>
        </div>
      </div>

      {/* Selected Moments */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Moments de consommation sélectionnés
        </h2>
        
        <div className="space-y-3">
          {selectedMoments.map((moment) => (
            <div key={moment} className="export-moment bg-blue-50 p-3 rounded border border-blue-200 flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-800">
                  {momentLabels[moment]}
                </span>
                <span className="text-gray-600 ml-2">
                  - {drinksPerPerson[moment]} verre{drinksPerPerson[moment] > 1 ? 's' : ''} par personne
                </span>
              </div>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                ✓ Inclus
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Résultats du calcul
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {totalBottles.champagne > 0 && (
            <div className="export-result bg-amber-50 p-4 rounded border border-amber-200 text-center">
              <div className="text-amber-800 font-medium mb-1">Champagne</div>
              <div className="text-2xl font-bold text-amber-900">
                {totalBottles.champagne}
              </div>
              <div className="text-amber-700 text-sm">
                bouteille{totalBottles.champagne > 1 ? 's' : ''}
              </div>
            </div>
          )}
          
          {totalBottles.wine > 0 && (
            <div className="export-result bg-purple-50 p-4 rounded border border-purple-200 text-center">
              <div className="text-purple-800 font-medium mb-1">Vin</div>
              <div className="text-2xl font-bold text-purple-900">
                {totalBottles.wine}
              </div>
              <div className="text-purple-700 text-sm">
                bouteille{totalBottles.wine > 1 ? 's' : ''}
              </div>
            </div>
          )}
          
          {totalBottles.spirits > 0 && (
            <div className="export-result bg-orange-50 p-4 rounded border border-orange-200 text-center">
              <div className="text-orange-800 font-medium mb-1">Alcools forts</div>
              <div className="text-2xl font-bold text-orange-900">
                {totalBottles.spirits}
              </div>
              <div className="text-orange-700 text-sm">
                bouteille{totalBottles.spirits > 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>

        {/* Total Cost */}
        <div className="bg-green-600 text-white p-4 rounded text-center">
          <div className="text-lg font-medium mb-1">Coût total estimé</div>
          <div className="text-3xl font-bold">{totalCost.toFixed(2)}€</div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Recommandations de service
        </h2>
        
        <div className="bg-gray-50 p-4 rounded border text-sm leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-medium mb-2">Apéritif/Cocktail (1 à 1,5 heure) :</p>
              <p className="mb-3">• Champagne ou cocktail : 2 à 3 coupes/verres par personne</p>
              
              <p className="font-medium mb-2">Repas (2 à 3 heures) :</p>
              <p className="mb-1">• Vin Blanc (entrée ou poisson) : 1 verre par personne</p>
              <p>• Vin Rouge (plat principal) : 2 verres par personne</p>
            </div>
            <div>
              <p className="font-medium mb-2">Dessert :</p>
              <p className="mb-3">• Champagne pour le toast : 1 coupe par personne</p>
              
              <p className="font-medium mb-2">Soirée dansante (4 heures ou plus) :</p>
              <p>• Cocktails : 1 verre par heure par personne</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm border-t border-gray-200 pt-4">
        <p>Document généré le {new Date().toLocaleDateString('fr-FR')} par Mariable</p>
        <p className="mt-1">www.mariable.fr - Votre assistant mariage personnalisé</p>
      </div>
    </div>
  );
};

export default DrinksCalculatorExport;
