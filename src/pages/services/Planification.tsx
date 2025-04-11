
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ServiceTemplate from '../ServiceTemplate';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { format, addMonths, differenceInMonths, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Wedding planning tasks with timeline (months before wedding)
const weddingTasks = [
  { id: 1, title: "Choisir le lieu de réception", months: 12, priority: "haute", category: "essentiel" },
  { id: 2, title: "Réserver le traiteur", months: 10, priority: "haute", category: "essentiel" },
  { id: 3, title: "Trouver votre photographe", months: 9, priority: "haute", category: "essentiel" },
  { id: 4, title: "Choisir la robe de mariée", months: 8, priority: "haute", category: "essentiel" },
  { id: 5, title: "Réserver l'animation musicale (DJ/groupe)", months: 8, priority: "moyenne", category: "essentiel" },
  { id: 6, title: "Organiser la cérémonie", months: 7, priority: "haute", category: "essentiel" },
  { id: 7, title: "Choisir les témoins et demoiselles d'honneur", months: 7, priority: "moyenne", category: "organisation" },
  { id: 8, title: "Envoyer les faire-parts", months: 6, priority: "haute", category: "communication" },
  { id: 9, title: "Réserver l'hébergement pour les invités", months: 6, priority: "moyenne", category: "organisation" },
  { id: 10, title: "Choisir les alliances", months: 5, priority: "moyenne", category: "essentiel" },
  { id: 11, title: "Organiser le transport", months: 5, priority: "basse", category: "organisation" },
  { id: 12, title: "Commander le gâteau", months: 4, priority: "moyenne", category: "essentiel" },
  { id: 13, title: "Prévoir la décoration florale", months: 4, priority: "moyenne", category: "déco" },
  { id: 14, title: "Planifier la liste des cadeaux", months: 3, priority: "basse", category: "organisation" },
  { id: 15, title: "Organiser le plan de table", months: 2, priority: "haute", category: "organisation" },
  { id: 16, title: "Derniers essayages", months: 1, priority: "haute", category: "essentiel" },
  { id: 17, title: "Confirmer avec tous les prestataires", months: 1, priority: "haute", category: "organisation" },
  { id: 18, title: "Préparer la valise pour la lune de miel", months: 0.5, priority: "basse", category: "personnel" }
];

const PlanningChecklist = () => {
  const [weddingDate, setWeddingDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  const [tasksWithStatus, setTasksWithStatus] = useState(
    weddingTasks.map(task => ({ ...task, completed: false }))
  );

  const handleDateSelect = (date: Date | undefined) => {
    setWeddingDate(date);
    setShowCalendar(false);
  };

  const getTasksByMonth = () => {
    if (!weddingDate) return {};
    
    const timeline: Record<string, typeof tasksWithStatus> = {};
    
    tasksWithStatus.forEach(task => {
      const taskDate = addMonths(weddingDate, -task.months);
      const monthYear = format(taskDate, 'MMMM yyyy', { locale: fr });
      
      if (!timeline[monthYear]) {
        timeline[monthYear] = [];
      }
      
      timeline[monthYear].push(task);
    });
    
    return timeline;
  };
  
  const toggleTaskCompletion = (taskId: number) => {
    setTasksWithStatus(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
  };
  
  const getProgressPercentage = () => {
    const completed = tasksWithStatus.filter(t => t.completed).length;
    return Math.round((completed / tasksWithStatus.length) * 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Créez votre rétroplanning personnalisé</CardTitle>
          <CardDescription>
            Entrez votre date de mariage pour obtenir un planning sur mesure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="wedding-date">Date de votre mariage</Label>
              <div className="flex space-x-2">
                <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !weddingDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {weddingDate ? format(weddingDate, 'dd MMMM yyyy', { locale: fr }) : "Sélectionner la date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={weddingDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      disabled={(date) => isBefore(date, new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {weddingDate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <span>Votre progression</span>
              <div className="ml-auto text-wedding-olive">{getProgressPercentage()}%</div>
            </CardTitle>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div 
                className="h-full bg-wedding-olive rounded-full" 
                style={{ width: `${getProgressPercentage()}%` }} 
              />
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium text-lg mb-4">Votre rétroplanning complet</h3>
            <div className="space-y-6">
              {Object.entries(getTasksByMonth()).map(([month, tasks]) => (
                <div key={month} className="border-l-2 border-wedding-olive/30 pl-4 ml-2">
                  <h3 className="font-medium text-lg mb-2">{month}</h3>
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-start space-x-2">
                        <Checkbox 
                          id={`timeline-task-${task.id}`} 
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          className="mt-0.5"
                        />
                        <label 
                          htmlFor={`timeline-task-${task.id}`} 
                          className={`cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {task.title}
                          <div className="flex items-center text-xs text-muted-foreground space-x-2 mt-1">
                            <span className={`px-2 py-0.5 rounded-full ${
                              task.priority === 'haute' ? 'bg-red-100 text-red-800' : 
                              task.priority === 'moyenne' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100'
                            }`}>
                              Priorité {task.priority}
                            </span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 text-center">
        <Card className="bg-wedding-cream/20 border-wedding-olive/20">
          <CardContent className="pt-6 pb-6">
            <h3 className="text-2xl font-serif mb-4">Prêt à dire oui à la simplicité ?</h3>
            <p className="mb-6">
              Créez votre compte pour sauvegarder votre planning et accéder à toutes nos fonctionnalités.
            </p>
            <Button 
              size="lg"
              className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
              asChild
            >
              <Link to="/commencer">
                S'inscrire <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const PlanificationContent = () => (
  <>
    <p>
      La planification d'un mariage implique de nombreuses étapes et peut rapidement devenir 
      source de stress. Notre solution de planification vous guide à travers chaque étape avec 
      simplicité et efficacité.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Votre rétroplanning personnalisé</h2>
    
    <PlanningChecklist />
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Avantages</h2>
    
    <p>
      Notre approche simplifiée de la planification vous permet de profiter pleinement 
      des préparatifs sans stress inutile. Vous pouvez vous concentrer sur les aspects 
      créatifs et émotionnels de votre mariage, tandis que nous nous occupons de la logistique.
    </p>
  </>
);

const Planification = () => {
  return (
    <ServiceTemplate 
      title="Planification de votre mariage"
      description="Organisez chaque étape de votre mariage sans stress"
      content={<PlanificationContent />}
    />
  );
};

export default Planification;
