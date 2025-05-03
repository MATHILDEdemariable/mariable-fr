
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface VenueCapacitySelectorProps {
  capacity: string;
  onCapacityChange: (value: string) => void;
}

const VenueCapacitySelector: React.FC<VenueCapacitySelectorProps> = ({
  capacity,
  onCapacityChange
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-xs">Capacité du lieu</Label>
      
      <div>
        <Label htmlFor="capacity" className="text-xs text-muted-foreground mb-1 block">
          Nombre d'invités
        </Label>
        <Input 
          id="capacity" 
          type="number" 
          placeholder="Ex: 100"
          className="w-full" 
          min="0"
          value={capacity}
          onChange={(e) => onCapacityChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default VenueCapacitySelector;
