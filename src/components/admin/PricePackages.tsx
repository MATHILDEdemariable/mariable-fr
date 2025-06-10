
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

interface PricePackagesProps {
  formData: {
    first_price_package?: number;
    first_price_package_description?: string;
    second_price_package?: number;
    second_price_package_description?: string;
    third_price_package?: number;
    third_price_package_description?: string;
  };
  onChange: (field: string, value: string | number) => void;
}

const PricePackages: React.FC<PricePackagesProps> = ({ formData, onChange }) => {
  const handleNumberChange = (field: string, value: string) => {
    onChange(field, value ? Number(value) : undefined);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Formules de prix</h3>
      
      {/* Première formule */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h4 className="font-medium text-md">Formule 1</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_price_package">Prix (€)</Label>
            <Input
              id="first_price_package"
              type="number"
              value={formData.first_price_package || ''}
              onChange={(e) => handleNumberChange('first_price_package', e.target.value)}
              placeholder="Prix de la première formule"
            />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="first_price_package_description">Description</Label>
            <Textarea
              id="first_price_package_description"
              value={formData.first_price_package_description || ''}
              onChange={(e) => onChange('first_price_package_description', e.target.value)}
              placeholder="Décrivez cette formule..."
              rows={3}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Deuxième formule */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h4 className="font-medium text-md">Formule 2</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="second_price_package">Prix (€)</Label>
            <Input
              id="second_price_package"
              type="number"
              value={formData.second_price_package || ''}
              onChange={(e) => handleNumberChange('second_price_package', e.target.value)}
              placeholder="Prix de la deuxième formule"
            />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="second_price_package_description">Description</Label>
            <Textarea
              id="second_price_package_description"
              value={formData.second_price_package_description || ''}
              onChange={(e) => onChange('second_price_package_description', e.target.value)}
              placeholder="Décrivez cette formule..."
              rows={3}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Troisième formule */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h4 className="font-medium text-md">Formule 3</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="third_price_package">Prix (€)</Label>
            <Input
              id="third_price_package"
              type="number"
              value={formData.third_price_package || ''}
              onChange={(e) => handleNumberChange('third_price_package', e.target.value)}
              placeholder="Prix de la troisième formule"
            />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="third_price_package_description">Description</Label>
            <Textarea
              id="third_price_package_description"
              value={formData.third_price_package_description || ''}
              onChange={(e) => onChange('third_price_package_description', e.target.value)}
              placeholder="Décrivez cette formule..."
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricePackages;
