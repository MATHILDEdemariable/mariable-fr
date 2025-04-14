
import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

type GuestSelectorProps = {
  className?: string;
  onGuestCountChange?: (count: number) => void;
};

const GuestSelector: React.FC<GuestSelectorProps> = ({ className, onGuestCountChange }) => {
  const [guestCount, setGuestCount] = useState(0);
  const [open, setOpen] = useState(false);

  const incrementGuests = () => {
    const newCount = guestCount + 1;
    setGuestCount(newCount);
    onGuestCountChange?.(newCount);
  };

  const decrementGuests = () => {
    if (guestCount > 0) {
      const newCount = guestCount - 1;
      setGuestCount(newCount);
      onGuestCountChange?.(newCount);
    }
  };

  const displayText = guestCount > 0 
    ? `${guestCount} invité${guestCount > 1 ? 's' : ''}` 
    : "Invités";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex-1 justify-start border border-wedding-black/10 bg-white font-normal shadow-sm hover:bg-white/80 text-sm",
            className
          )}
        >
          <Users className="mr-2 h-4 w-4" />
          <span>{displayText}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4 fixed" align="center" sideOffset={5}>
        <div className="space-y-4">
          <div>
            <Label className="text-base">Nombre d'invités</Label>
            <div className="flex items-center justify-between mt-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementGuests}
                disabled={guestCount <= 0}
                className="h-8 w-8 rounded-full"
              >
                -
              </Button>
              <span className="text-lg font-medium">{guestCount}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementGuests}
                className="h-8 w-8 rounded-full"
              >
                +
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[10, 20, 50, 100].map((num) => (
              <Button
                key={num}
                variant="outline"
                className="text-sm"
                onClick={() => {
                  setGuestCount(num);
                  onGuestCountChange?.(num);
                }}
              >
                {num}
              </Button>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setGuestCount(0);
                onGuestCountChange?.(0);
              }}
              className="text-sm"
            >
              Réinitialiser
            </Button>
            <Button onClick={() => setOpen(false)} className="text-sm">
              Appliquer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GuestSelector;
