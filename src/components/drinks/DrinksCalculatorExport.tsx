
import React from 'react';
import { DrinkTier, DrinkMoment, DrinkConsumption } from '@/types/drinks';
import { Logo } from '@/components/Logo';

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
    <div className="export-container bg-white font-sans" style={{ 
      fontFamily: 'Raleway, sans-serif',
      maxWidth: '210mm',
      minHeight: '297mm',
      margin: '0 auto',
      padding: '15mm',
      color: '#000000',
      lineHeight: '1.4'
    }}>
      {/* Header with Logo */}
      <div className="text-center mb-6 pb-4" style={{ borderBottom: '2px solid #7F9474' }}>
        <div className="flex justify-center mb-3">
          <Logo />
        </div>
        <h1 className="font-serif text-xl font-bold mb-1" style={{ 
          fontFamily: 'Playfair Display, serif',
          color: '#7F9474',
          fontSize: '24px',
          marginBottom: '8px'
        }}>
          Calculateur de Boissons
        </h1>
        <p className="text-sm" style={{ color: '#666666', fontSize: '14px' }}>
          Estimation personnalisée pour votre événement
        </p>
      </div>

      {/* Event Parameters - Compact Grid */}
      <div className="mb-5">
        <h2 className="font-serif font-semibold mb-3 pb-1" style={{ 
          fontFamily: 'Playfair Display, serif',
          fontSize: '16px',
          color: '#1a5d40',
          borderBottom: '1px solid #f1f7f3'
        }}>
          Paramètres de l'événement
        </h2>
        
        <div className="grid grid-cols-2 gap-3" style={{ fontSize: '13px' }}>
          <div className="p-2 rounded" style={{ backgroundColor: '#f8f6f0', border: '1px solid #e8e5db' }}>
            <span className="font-medium">Nombre d'invités :</span>
            <span className="ml-2 font-bold" style={{ color: '#7F9474' }}>{guests}</span>
          </div>
          
          <div className="p-2 rounded" style={{ backgroundColor: '#f8f6f0', border: '1px solid #e8e5db' }}>
            <span className="font-medium">Gamme de boissons :</span>
            <span className="ml-2 font-bold" style={{ color: '#7F9474' }}>{tierLabels[tier]}</span>
          </div>
        </div>
      </div>

      {/* Selected Moments - Compact List */}
      <div className="mb-5">
        <h2 className="font-serif font-semibold mb-3 pb-1" style={{ 
          fontFamily: 'Playfair Display, serif',
          fontSize: '16px',
          color: '#1a5d40',
          borderBottom: '1px solid #f1f7f3'
        }}>
          Moments de consommation sélectionnés
        </h2>
        
        <div className="space-y-2" style={{ fontSize: '13px' }}>
          {selectedMoments.map((moment) => (
            <div key={moment} className="flex justify-between items-center p-2 rounded" style={{ 
              backgroundColor: '#f1f7f3', 
              border: '1px solid #7F9474'
            }}>
              <div>
                <span className="font-medium">{momentLabels[moment]}</span>
                <span className="ml-2" style={{ color: '#666666' }}>
                  - {drinksPerPerson[moment]} verre{drinksPerPerson[moment] > 1 ? 's' : ''} par personne
                </span>
              </div>
              <div className="text-xs px-2 py-1 rounded font-medium" style={{ 
                backgroundColor: '#7F9474', 
                color: 'white' 
              }}>
                ✓ Inclus
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results - Compact Cards */}
      <div className="mb-5">
        <h2 className="font-serif font-semibold mb-3 pb-1" style={{ 
          fontFamily: 'Playfair Display, serif',
          fontSize: '16px',
          color: '#1a5d40',
          borderBottom: '1px solid #f1f7f3'
        }}>
          Résultats du calcul
        </h2>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {totalBottles.champagne > 0 && (
            <div className="p-3 rounded text-center" style={{ 
              backgroundColor: '#f8f6f0', 
              border: '2px solid #d4af37' 
            }}>
              <div className="font-medium mb-1" style={{ color: '#d4af37', fontSize: '12px' }}>
                Champagne
              </div>
              <div className="font-bold" style={{ fontSize: '18px', color: '#1a5d40' }}>
                {totalBottles.champagne}
              </div>
              <div style={{ fontSize: '11px', color: '#666666' }}>
                bouteille{totalBottles.champagne > 1 ? 's' : ''}
              </div>
            </div>
          )}
          
          {totalBottles.wine > 0 && (
            <div className="p-3 rounded text-center" style={{ 
              backgroundColor: '#f8f6f0', 
              border: '2px solid #7F9474' 
            }}>
              <div className="font-medium mb-1" style={{ color: '#7F9474', fontSize: '12px' }}>
                Vin
              </div>
              <div className="font-bold" style={{ fontSize: '18px', color: '#1a5d40' }}>
                {totalBottles.wine}
              </div>
              <div style={{ fontSize: '11px', color: '#666666' }}>
                bouteille{totalBottles.wine > 1 ? 's' : ''}
              </div>
            </div>
          )}
          
          {totalBottles.spirits > 0 && (
            <div className="p-3 rounded text-center" style={{ 
              backgroundColor: '#f8f6f0', 
              border: '2px solid #1a5d40' 
            }}>
              <div className="font-medium mb-1" style={{ color: '#1a5d40', fontSize: '12px' }}>
                Alcools forts
              </div>
              <div className="font-bold" style={{ fontSize: '18px', color: '#1a5d40' }}>
                {totalBottles.spirits}
              </div>
              <div style={{ fontSize: '11px', color: '#666666' }}>
                bouteille{totalBottles.spirits > 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>

        {/* Total Cost - Prominent Display */}
        <div className="text-center p-3 rounded" style={{ 
          backgroundColor: '#7F9474', 
          color: 'white' 
        }}>
          <div className="font-medium mb-1" style={{ fontSize: '14px' }}>
            Coût total estimé
          </div>
          <div className="font-bold" style={{ fontSize: '22px' }}>
            {totalCost.toFixed(2)}€
          </div>
        </div>
      </div>

      {/* Recommendations - Compact Version */}
      <div className="mb-4">
        <h2 className="font-serif font-semibold mb-2 pb-1" style={{ 
          fontFamily: 'Playfair Display, serif',
          fontSize: '16px',
          color: '#1a5d40',
          borderBottom: '1px solid #f1f7f3'
        }}>
          Recommandations de service
        </h2>
        
        <div className="p-3 rounded text-xs leading-relaxed" style={{ 
          backgroundColor: '#f1f7f3', 
          border: '1px solid #e8e5db',
          fontSize: '11px',
          lineHeight: '1.3'
        }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium mb-1">Apéritif/Cocktail (1-1,5h) :</p>
              <p className="mb-2">• 2-3 coupes/verres par personne</p>
              
              <p className="font-medium mb-1">Repas (2-3h) :</p>
              <p className="mb-1">• Vin Blanc : 1 verre/personne</p>
              <p>• Vin Rouge : 2 verres/personne</p>
            </div>
            <div>
              <p className="font-medium mb-1">Dessert :</p>
              <p className="mb-2">• Champagne toast : 1 coupe/personne</p>
              
              <p className="font-medium mb-1">Soirée dansante (4h+) :</p>
              <p>• Cocktails : 1 verre/heure/personne</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-3 text-xs" style={{ 
        borderTop: '1px solid #e8e5db',
        color: '#666666',
        fontSize: '10px'
      }}>
        <p className="mb-1">
          Document généré le {new Date().toLocaleDateString('fr-FR')} par Mariable
        </p>
        <p className="font-medium" style={{ color: '#7F9474' }}>
          www.mariable.fr - Votre assistant mariage personnalisé
        </p>
      </div>
    </div>
  );
};

export default DrinksCalculatorExport;
