
import React from 'react';
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
  minCapacity: string;
  maxCapacity: string;
  onMinCapacityChange: (value: string) => void;
  onMaxCapacityChange: (value: string) => void;
}

// Predefined capacity ranges
const CAPACITY_RANGES = [
  "0", "50", "100", "150", "200", "250", "300", "350", "400", "450", "500"
];

const VenueCapacitySelector: React.FC<VenueCapacitySelectorProps> = ({
  minCapacity,
  maxCapacity,
  onMinCapacityChange,
  onMaxCapacityChange
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-xs">Capacité du lieu</Label>
      
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Label htmlFor="min-capacity" className="text-xs text-muted-foreground mb-1 block">
            Minimum
          </Label>
          <Select
            value={minCapacity}
            onValueChange={onMinCapacityChange}
          >
            <SelectTrigger id="min-capacity" className="w-full">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              {CAPACITY_RANGES.map((value) => (
                <SelectItem key={`min-${value}`} value={value}>
                  {value} invités
                </SelectItem>
              ))}
              <SelectItem value="custom">
                Personnalisé
              </SelectItem>
            </SelectContent>
          </Select>
          
          {minCapacity === "custom" && (
            <Input 
              type="number" 
              placeholder="Ex: 75"
              className="mt-1" 
              min="0"
              onChange={(e) => onMinCapacityChange(e.target.value)}
            />
          )}
        </div>
        
        <div className="flex-1">
          <Label htmlFor="max-capacity" className="text-xs text-muted-foreground mb-1 block">
            Maximum
          </Label>
          <Select
            value={maxCapacity}
            onValueChange={onMaxCapacityChange}
          >
            <SelectTrigger id="max-capacity" className="w-full">
              <SelectValue placeholder="Max" />
            </SelectTrigger>
            <SelectContent>
              {CAPACITY_RANGES.map((value) => (
                <SelectItem key={`max-${value}`} value={value}>
                  {value} invités
                </SelectItem>
              ))}
              <SelectItem value="custom">
                Personnalisé
              </SelectItem>
            </SelectContent>
          </Select>
          
          {maxCapacity === "custom" && (
            <Input 
              type="number" 
              placeholder="Ex: 125"
              className="mt-1" 
              min="0"
              onChange={(e) => onMaxCapacityChange(e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueCapacitySelector;
