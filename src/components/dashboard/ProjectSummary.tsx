
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserProfile } from '@/hooks/useUserProfile';
import ProgressOverview from './ProgressOverview';
import DashboardFeatureCards from './DashboardFeatureCards';

const ProjectSummary = () => {
  const today = new Date();
  const formattedDate = format(today, "EEEE d MMMM yyyy", { locale: fr });
  const { profile, loading, updateProfile } = useUserProfile();
  const [localWeddingDate, setLocalWeddingDate] = useState<Date | undefined>();
  const [localGuestCount, setLocalGuestCount] = useState<string>("");
  const isMobile = useIsMobile();

  // Initialize local state from profile
  useEffect(() => {
    if (profile) {
      if (profile.wedding_date) {
        setLocalWeddingDate(new Date(profile.wedding_date));
      }
      if (profile.guest_count) {
        setLocalGuestCount(profile.guest_count.toString());
      }
    }
  }, [profile]);

  // Auto-save wedding date
  const handleWeddingDateChange = async (date: Date | undefined) => {
    setLocalWeddingDate(date);
    if (date && updateProfile) {
      await updateProfile({ wedding_date: date.toISOString().split('T')[0] });
    }
  };

  // Auto-save guest count with debounce
  useEffect(() => {
    if (!localGuestCount || !updateProfile) return;
    
    const timer = setTimeout(() => {
      const count = parseInt(localGuestCount);
      if (!isNaN(count) && count > 0) {
        updateProfile({ guest_count: count });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [localGuestCount, updateProfile]);

  // Calculate days until wedding
  const daysUntilWedding = localWeddingDate ? differenceInDays(localWeddingDate, today) : null;

  // Get greeting with first name
  const getGreeting = () => {
    const firstName = profile?.first_name;
    if (firstName) {
      return `Bonjour & bienvenue, ${firstName}`;
    }
    return "Bonjour & bienvenue dans l'univers Mariable";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Personalized Header */}
      <div className="bg-gradient-to-r from-wedding-olive/10 to-wedding-cream/30 p-6 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-serif text-wedding-olive">{getGreeting()}</h1>
            <p className="text-gray-600 mt-1">{formattedDate}</p>
          </div>
          
          {/* Date picker and guest count */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="flex flex-1 sm:flex-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto justify-start">
                    <Calendar className="h-4 w-4 text-wedding-olive" />
                    {localWeddingDate ? format(localWeddingDate, 'dd/MM/yyyy') : 'Date du mariage'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={localWeddingDate}
                    onSelect={handleWeddingDateChange}
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
                value={localGuestCount}
                onChange={(e) => setLocalGuestCount(e.target.value)}
                className="border-none p-0 focus-visible:ring-0 w-16"
                min="1"
                placeholder="100"
              />
            </div>
          </div>
        </div>
        
        {/* Wedding countdown */}
        {daysUntilWedding !== null && localWeddingDate && (
          <div className="mt-2 bg-white/60 p-3 rounded-md inline-block">
            <p className="font-medium">
              {daysUntilWedding > 0 ? (
                <span className="text-wedding-olive">
                  Plus que <span className="text-xl font-bold">{daysUntilWedding}</span> jours avant votre grand jour !
                </span>
              ) : daysUntilWedding === 0 ? (
                <span className="text-pink-600 font-bold">C'est aujourd'hui ! Félicitations pour votre mariage !</span>
              ) : (
                <span className="text-wedding-olive">
                  Félicitations pour votre mariage qui a eu lieu il y a {Math.abs(daysUntilWedding)} jours !
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Progress Overview */}
      <ProgressOverview />
      
      {/* Feature Cards */}
      <div>
        <h2 className="text-xl font-serif mb-4 text-wedding-olive">Vos outils de planification</h2>
        <DashboardFeatureCards />
      </div>
    </div>
  );
};

export default ProjectSummary;
