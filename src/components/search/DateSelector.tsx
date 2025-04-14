
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type DateSelectorProps = {
  className?: string;
  onDateChange?: (date: Date | null | undefined, type: 'exact' | 'month' | 'flexible') => void;
};

const DateSelector: React.FC<DateSelectorProps> = ({ className, onDateChange }) => {
  const [date, setDate] = useState<Date | undefined>();
  const [selectionType, setSelectionType] = useState<'exact' | 'month' | 'flexible'>('exact');
  const [open, setOpen] = useState(false);

  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected);
    onDateChange?.(selected, selectionType);
  };

  const handleTypeChange = (value: 'exact' | 'month' | 'flexible') => {
    setSelectionType(value);
    onDateChange?.(date, value);
  };

  const handleClearDate = () => {
    setDate(undefined);
    onDateChange?.(undefined, selectionType);
    setOpen(false);
  };

  let displayText = "Date";
  if (date && selectionType === 'exact') {
    displayText = format(date, 'PPP', { locale: fr });
  } else if (date && selectionType === 'month') {
    displayText = format(date, 'MMMM yyyy', { locale: fr });
  } else if (selectionType === 'flexible') {
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
      <PopoverContent className="w-auto p-4" align="center">
        <div className="space-y-4">
          <Tabs 
            defaultValue="exact" 
            value={selectionType}
            onValueChange={(value) => handleTypeChange(value as 'exact' | 'month' | 'flexible')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="exact">Date précise</TabsTrigger>
              <TabsTrigger value="month">Mois</TabsTrigger>
              <TabsTrigger value="flexible">Flexible</TabsTrigger>
            </TabsList>
          </Tabs>

          {selectionType !== 'flexible' && (
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                day: cn(
                  "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                ),
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
              components={{
                IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                IconRight: () => <ChevronRight className="h-4 w-4" />,
              }}
            />
          )}

          {selectionType === 'flexible' && (
            <div className="py-4 text-center">
              <p>Nous vous montrerons les disponibilités pour tout 2025</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleClearDate}>
              Effacer la date
            </Button>
            <Button onClick={() => setOpen(false)}>
              Appliquer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateSelector;
