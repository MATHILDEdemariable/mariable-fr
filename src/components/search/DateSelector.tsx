
import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DateSelectorProps = {
  className?: string;
  onDateChange?: (date: Date | null | undefined, type: 'exact' | 'flexible') => void;
};

const DateSelector: React.FC<DateSelectorProps> = ({ className, onDateChange }) => {
  const [date, setDate] = useState<Date | undefined>();
  const [isFlexible, setIsFlexible] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected);
    onDateChange?.(selected, isFlexible ? 'flexible' : 'exact');
  };

  const handleFlexibleToggle = () => {
    setIsFlexible(!isFlexible);
    onDateChange?.(date, !isFlexible ? 'flexible' : 'exact');
  };

  const handleClearDate = () => {
    setDate(undefined);
    onDateChange?.(undefined, isFlexible ? 'flexible' : 'exact');
  };

  let displayText = "Date";
  if (date) {
    displayText = format(date, 'PPP', { locale: fr });
    if (isFlexible) {
      displayText += " (flexible)";
    }
  } else if (isFlexible) {
    displayText = "Date flexible";
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex-1 justify-start border border-wedding-black/10 bg-white font-normal shadow-sm hover:bg-white/80",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{displayText}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="center" sideOffset={5}>
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />

          <div className="flex flex-wrap justify-between gap-2">
            <Button 
              variant="outline" 
              onClick={handleClearDate}
              className="flex-1"
            >
              Effacer la date
            </Button>
            <Button 
              variant={isFlexible ? "default" : "outline"}
              onClick={handleFlexibleToggle}
              className={cn(
                "flex-1",
                isFlexible && "bg-wedding-olive hover:bg-wedding-olive/90"
              )}
            >
              Date flexible
            </Button>
            <Button 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Appliquer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateSelector;
