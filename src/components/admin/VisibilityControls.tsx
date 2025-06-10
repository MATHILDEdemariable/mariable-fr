
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface VisibilityControlsProps {
  formData: {
    show_prices?: boolean;
    show_contact_form?: boolean;
    show_description?: boolean;
    show_photos?: boolean;
    show_brochures?: boolean;
    show_responsable?: boolean;
  };
  onChange: (field: string, value: boolean) => void;
}

const VisibilityControls: React.FC<VisibilityControlsProps> = ({ formData, onChange }) => {
  const controls = [
    { key: 'show_description', label: 'Afficher la description' },
    { key: 'show_photos', label: 'Afficher les photos' },
    { key: 'show_prices', label: 'Afficher les prix' },
    { key: 'show_brochures', label: 'Afficher les brochures' },
    { key: 'show_contact_form', label: 'Afficher le formulaire de contact' },
    { key: 'show_responsable', label: 'Afficher les infos du responsable' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Contrôles de visibilité</h3>
      <p className="text-sm text-gray-600">
        Choisissez quels éléments afficher sur la page publique du prestataire
      </p>
      
      <Separator />
      
      <div className="space-y-4">
        {controls.map((control) => (
          <div key={control.key} className="flex items-center justify-between">
            <Label htmlFor={control.key} className="text-sm font-medium">
              {control.label}
            </Label>
            <Switch
              id={control.key}
              checked={formData[control.key as keyof typeof formData] ?? true}
              onCheckedChange={(checked) => onChange(control.key, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisibilityControls;
