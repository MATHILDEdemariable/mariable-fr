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
import DashboardFeatureCards from './DashboardFeatureCards';
import { CheckSquare, ArrowRight, Circle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
interface Task {
  id: string;
  label: string;
  completed: boolean;
  priority?: string;
  category: string;
}
const ProjectSummary = () => {
  const today = new Date();
  const formattedDate = format(today, "EEEE d MMMM yyyy", {
    locale: fr
  });
  const {
    profile,
    loading,
    updateProfile
  } = useUserProfile();
  const [localWeddingDate, setLocalWeddingDate] = useState<Date | undefined>();
  const [localGuestCount, setLocalGuestCount] = useState<string>("");
  const isMobile = useIsMobile();
  const {
    toast
  } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

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

  // Load tasks
  useEffect(() => {
    const loadRecentTasks = async () => {
      try {
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser();
        if (!user) return;
        const {
          data,
          error
        } = await supabase.from('generated_tasks').select('*').eq('user_id', user.id).order('priority', {
          ascending: false
        }).order('position', {
          ascending: true
        }).limit(5);
        if (error) {
          console.error('Error loading tasks:', error);
          return;
        }
        setTasks(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setTasksLoading(false);
      }
    };
    loadRecentTasks();
  }, []);

  // Auto-save wedding date
  const handleWeddingDateChange = async (date: Date | undefined) => {
    setLocalWeddingDate(date);
    if (date && updateProfile) {
      // Préserver la date locale en créant une chaîne YYYY-MM-DD directement
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const localDateString = `${year}-${month}-${day}`;
      
      await updateProfile({
        wedding_date: localDateString
      });
    }
  };

  // Auto-save guest count with debounce
  useEffect(() => {
    if (!localGuestCount || !updateProfile) return;
    const timer = setTimeout(() => {
      const count = parseInt(localGuestCount);
      if (!isNaN(count) && count > 0) {
        updateProfile({
          guest_count: count
        });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [localGuestCount, updateProfile]);

  // Toggle task completion
  const toggleTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      const {
        error
      } = await supabase.from('generated_tasks').update({
        completed: !task.completed
      }).eq('id', taskId);
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la tâche",
          variant: "destructive"
        });
        return;
      }
      setTasks(prev => prev.map(t => t.id === taskId ? {
        ...t,
        completed: !t.completed
      } : t));
      toast({
        title: task.completed ? "Tâche réactivée" : "Tâche complétée",
        description: `"${task.label}" ${task.completed ? 'réactivée' : 'marquée comme complétée'}`
      });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Calculate days until wedding
  const daysUntilWedding = localWeddingDate ? differenceInDays(localWeddingDate, today) : null;

  // Calculate task completion stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = tasks.length > 0 ? Math.round(completedTasks / tasks.length * 100) : 0;

  // Get greeting with first name
  const getGreeting = () => {
    const firstName = profile?.first_name;
    if (firstName) {
      return `Bonjour & bienvenue, ${firstName}`;
    }
    return "Bonjour & bienvenue dans l'univers Mariable";
  };
  if (loading) {
    return <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
      </div>;
  }
  return <div className="space-y-8">
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
                  <CalendarComponent mode="single" selected={localWeddingDate} onSelect={handleWeddingDateChange} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-center gap-2 border rounded-md p-2 w-full sm:w-auto">
              <span className="text-wedding-olive whitespace-nowrap">Invités:</span>
              <Input type="number" value={localGuestCount} onChange={e => setLocalGuestCount(e.target.value)} className="border-none p-0 focus-visible:ring-0 w-16" min="1" placeholder="100" />
            </div>
          </div>
        </div>
        
        {/* Wedding countdown */}
        {daysUntilWedding !== null && localWeddingDate && <div className="mt-2 bg-white/60 p-3 rounded-md inline-block">
            <p className="font-medium">
              {daysUntilWedding > 0 ? <span className="text-wedding-olive">
                  Plus que <span className="text-xl font-bold">{daysUntilWedding}</span> jours avant votre grand jour !
                </span> : daysUntilWedding === 0 ? <span className="text-pink-600 font-bold">C'est aujourd'hui ! Félicitations pour votre mariage !</span> : <span className="text-wedding-olive">
                  Félicitations pour votre mariage qui a eu lieu il y a {Math.abs(daysUntilWedding)} jours !
                </span>}
            </p>
          </div>}
      </div>

      {/* Initiation Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-wedding-olive">Vous ne savez pas par où commencer ?</h2>
      </div>

      {/* Check-list de base Button */}
      <div className="mb-6">
        <Button onClick={() => window.location.href = '/dashboard/tasks'} className="bg-wedding-olive hover:bg-wedding-olive/90 text-white">
          Check-list de base
        </Button>
      </div>
      
      {/* Feature Cards */}
      <div>
        <h2 className="text-xl font-serif mb-4 text-wedding-olive">Vos outils de planification</h2>
        <DashboardFeatureCards />
      </div>
    </div>;
};
export default ProjectSummary;