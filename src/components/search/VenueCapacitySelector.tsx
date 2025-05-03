
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface VenueCapacitySelectorProps {
  capacity: string;
  onCapacityChange: (value: string) => void;
}

// Predefined capacity ranges
const CAPACITY_RANGES = [
  "0", "50", "100", "150", "200", "250", "300", "350", "400", "450", "500"
];

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
        <Select
          value={capacity}
          onValueChange={onCapacityChange}
        >
          <SelectTrigger id="capacity" className="w-full">
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            {CAPACITY_RANGES.map((value) => (
              <SelectItem key={value} value={value}>
                {value} invités
              </SelectItem>
            ))}
            <SelectItem value="custom">
              Personnalisé
            </SelectItem>
          </SelectContent>
        </Select>
        
        {capacity === "custom" && (
          <Input 
            type="number" 
            placeholder="Ex: 175"
            className="mt-1" 
            min="0"
            onChange={(e) => onCapacityChange(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

export default VenueCapacitySelector;
