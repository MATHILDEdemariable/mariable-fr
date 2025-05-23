
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import VerticalOnboardingProgress from './VerticalOnboardingProgress';
import DashboardInstructions from './DashboardInstructions';

const ProjectSummary = () => {
  const today = new Date();
  const formattedDate = format(today, "EEEE d MMMM yyyy", { locale: fr });
  const [weddingDate, setWeddingDate] = useState<Date | undefined>();
  const [guestCount, setGuestCount] = useState<string>("100");
  const isMobile = useIsMobile();
  
  // Calculer le nombre de jours restants jusqu'au mariage
  const daysUntilWedding = weddingDate ? Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
  
  return (
    <div className="space-y-8">
      {/* En-tête dynamique avec bienvenue et informations */}
      <div className="bg-gradient-to-r from-wedding-olive/10 to-wedding-cream/30 p-6 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-serif text-wedding-olive">Bonjour & bienvenue dans l'univers Mariable</h1>
            <p className="text-gray-600 mt-1">{formattedDate}</p>
          </div>
          
          {/* Improved date picker and guest count alignment */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="flex flex-1 sm:flex-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto justify-start">
                    <Calendar className="h-4 w-4 text-wedding-olive" />
                    {weddingDate ? format(weddingDate, 'dd/MM/yyyy') : 'Date du mariage'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={weddingDate}
                    onSelect={setWeddingDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-center gap-2 border rounded-md p-2 w-full sm:w-auto">
              <span className="text-wedding-olive whitespace-nowrap">Invités:</span>
              <Input
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="border-none p-0 focus-visible:ring-0"
                min="1"
              />
            </div>
          </div>
        </div>
        
        {/* Affichage des jours restants si une date est sélectionnée */}
        {daysUntilWedding !== null && (
          <div className="mt-2 bg-white/60 p-3 rounded-md inline-block">
            <p className="font-medium">
              {daysUntilWedding > 0 ? (
                <span className="text-wedding-olive">Plus que <span className="text-xl">{daysUntilWedding}</span> jours avant votre grand jour !</span>
              ) : daysUntilWedding === 0 ? (
                <span className="text-pink-600 font-bold">C'est aujourd'hui ! Félicitations pour votre mariage !</span>
              ) : (
                <span className="text-wedding-olive">Félicitations pour votre mariage qui a eu lieu il y a {Math.abs(daysUntilWedding)} jours !</span>
              )}
            </p>
          </div>
        )}
      </div>
      
      {/* Instructions dashboard */}
      <DashboardInstructions />
      
      {/* Vertical Onboarding Progress */}
      <VerticalOnboardingProgress />
    </div>
  );
};

export default ProjectSummary;
