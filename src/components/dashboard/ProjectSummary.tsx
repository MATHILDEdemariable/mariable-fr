import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Wine, 
  Check, 
  DollarSign, 
  Heart, 
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import TasksList from './TasksList';
import BudgetSummary from './BudgetSummary';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import OnboardingProgress from './OnboardingProgress';

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
      
      {/* New Onboarding Progress Section */}
      <OnboardingProgress />
      
      {/* Section explicative du dashboard */}
      <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-medium mb-3 text-wedding-olive">Comment utiliser votre tableau de bord</h2>
        <p className="text-gray-600">
          Découvrez comment tirer le meilleur parti de votre tableau de bord Mariable. Suivez ces étapes pour planifier votre mariage sans stress et accéder à tous nos outils.
        </p>
      </section>
      
      {/* Grille de cartes uniformes */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top 3 tâches avec cases à cocher */}
        <Card className="overflow-hidden border-wedding-olive/20 hover:shadow-md transition-shadow h-[280px] flex flex-col">
          <CardHeader className="bg-wedding-olive/10 pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Check className="h-5 w-5 text-wedding-olive" />
              Top 3 tâches prioritaires
            </CardTitle>
            <CardDescription>À faire prochainement</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex-grow overflow-auto">
            <div className="mb-4 max-h-[100px]">
              <TasksList />
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between items-center mt-auto">
            <span className="text-sm text-gray-500">Prochaines étapes</span>
            <Button asChild variant="ghost" size="sm" className="text-wedding-olive">
              <Link to="/dashboard/tasks" className="flex items-center">
                Toutes les tâches <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Suivi budget */}
        <Card className="overflow-hidden border-wedding-olive/20 hover:shadow-md transition-shadow h-[280px] flex flex-col">
          <CardHeader className="bg-wedding-olive/10 pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-wedding-olive" />
              Aperçu budget
            </CardTitle>
            <CardDescription>Suivi des dépenses</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex-grow overflow-auto">
            <div className="max-h-[100px]">
              <BudgetSummary />
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between items-center mt-auto">
            <span className="text-sm text-gray-500">Votre situation financière</span>
            <Button asChild variant="ghost" size="sm" className="text-wedding-olive">
              <Link to="/dashboard/budget" className="flex items-center">
                Détails <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Coordination Jour J (prioritaire) */}
        <Card className="overflow-hidden bg-gradient-to-br from-wedding-cream/30 to-white border-wedding-cream/40 hover:shadow-md transition-shadow h-[280px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-wedding-olive" />
              Coordination Jour J
            </CardTitle>
            <CardDescription>Planning détaillé</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex-grow">
            <p className="mb-4">
              Planifiez votre journée de mariage heure par heure et assurez-vous que tout se déroule comme prévu.
            </p>
          </CardContent>
          <CardFooter className="bg-white/50 flex justify-center mt-auto">
            <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/80">
              <Link to="/dashboard/coordination" className="flex items-center justify-center">
                Planifier ma journée <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
};

export default ProjectSummary;
