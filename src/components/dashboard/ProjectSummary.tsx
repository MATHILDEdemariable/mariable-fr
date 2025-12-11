import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, Gift, ArrowRight, Play, BookOpen, Info } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserProfile } from '@/hooks/useUserProfile';
import DashboardFeatureCards from './DashboardFeatureCards';
import { CheckSquare, Circle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import PaymentModal from '@/components/pricing/PaymentModal';
import { WhatsAppButton } from '@/components/support/WhatsAppButton';
import { LoomVideoEmbed } from '@/components/tutorials/LoomVideoEmbed';
import { TUTORIAL_VIDEOS } from '@/config/tutorialVideos';
import ClubMariableModal from './ClubMariableModal';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showClubMariableModal, setShowClubMariableModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showPrixModal, setShowPrixModal] = useState(false);
  const [notifyClub, setNotifyClub] = useState(false);

  // Initialize local state from profile
  useEffect(() => {
    if (profile) {
      if (profile.wedding_date) {
        setLocalWeddingDate(new Date(profile.wedding_date));
      }
      if (profile.guest_count) {
        setLocalGuestCount(profile.guest_count.toString());
      }
      if (profile.notify_club_mariable !== undefined) {
        setNotifyClub(profile.notify_club_mariable ?? false);
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

        {/* Club Mariable avec fond vert sauge */}
        <div className="bg-premium-sage text-white rounded-lg p-4 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Club Mariable</span>
              <span className="px-2 py-0.5 text-xs bg-white/20 text-white rounded font-medium">Bientôt</span>
            </div>
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => setShowClubMariableModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              En savoir plus
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
            <Checkbox 
              id="notify-club" 
              checked={notifyClub}
              onCheckedChange={async (checked) => {
                setNotifyClub(checked === true);
                if (updateProfile) {
                  await updateProfile({ notify_club_mariable: checked === true });
                }
              }}
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-premium-sage" 
            />
            <label htmlFor="notify-club" className="text-sm cursor-pointer">
              Me notifier dès l'ouverture du Club Mariable
            </label>
          </div>
        </div>

        {/* Outils d'organisation - ligne séparée */}
        <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
          <ArrowRight className="w-4 h-4" />
          Outils d'organisation via le menu à gauche
        </p>
      </div>

      {/* Guide de démarrage + Vidéo tutorielle */}
      <div className="bg-white rounded-xl shadow-sm border border-wedding-olive/20 p-4 space-y-3">
        {/* Guide de démarrage */}
        <button
          onClick={() => setShowGuideModal(true)}
          className="flex items-center gap-3 w-full text-left hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2"
        >
          <div className="w-12 h-12 rounded-lg bg-premium-sage/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-premium-sage" />
          </div>
          <div>
            <h3 className="text-lg font-serif text-wedding-olive flex items-center gap-2">
              📖 Guide de démarrage
            </h3>
            <p className="text-gray-500 text-sm">
              Cliquez pour découvrir le concept Mariable
            </p>
          </div>
        </button>

        <div className="border-t border-gray-100" />

        {/* Vidéo tutorielle */}
        <button
          onClick={() => setShowVideoModal(true)}
          className="flex items-center gap-3 w-full text-left hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2"
        >
          <div className="w-12 h-12 rounded-lg bg-wedding-olive/10 flex items-center justify-center">
            <Play className="w-6 h-6 text-wedding-olive" />
          </div>
          <div>
            <h3 className="text-lg font-serif text-wedding-olive flex items-center gap-2">
              🎬 Guide vidéo de démarrage
            </h3>
            <p className="text-gray-500 text-sm">
              Cliquez pour voir la vidéo
            </p>
          </div>
        </button>
        
        {/* Bandeau Instagram */}
        <div className="mt-3 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border border-purple-200 rounded-lg p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-2 rounded-lg">
              <svg 
                className="h-5 w-5 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Suivez-nous sur Instagram pour plus d'inspirations & conseils
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                @mariable.fr
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://www.instagram.com/mariable.fr/', '_blank', 'noopener,noreferrer')}
            className="shrink-0 border-purple-300 hover:bg-purple-50"
          >
            Suivre
          </Button>
        </div>
      </div>

      {/* Modal Vidéo */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Guide vidéo de démarrage</DialogTitle>
          </DialogHeader>
          <LoomVideoEmbed
            videoId={TUTORIAL_VIDEOS.welcome.loomId}
            title={TUTORIAL_VIDEOS.welcome.title}
            description={TUTORIAL_VIDEOS.welcome.description}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Guide de démarrage */}
      <Dialog open={showGuideModal} onOpenChange={setShowGuideModal}>
        <DialogContent className="sm:max-w-6xl h-[85vh] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Guide de démarrage - Découvrez Mariable</DialogTitle>
          </DialogHeader>
          <iframe 
            src="/accueil" 
            className="w-full h-full border-0"
            title="Guide de démarrage"
          />
        </DialogContent>
      </Dialog>

      {/* Modal Détail du prix */}
      <Dialog open={showPrixModal} onOpenChange={setShowPrixModal}>
        <DialogContent className="sm:max-w-6xl h-[85vh] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Détail des tarifs</DialogTitle>
          </DialogHeader>
          <iframe 
            src="/prix" 
            className="w-full h-full border-0"
            title="Détail du prix"
          />
        </DialogContent>
      </Dialog>

      {/* Initiation Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-wedding-olive">Vous ne savez pas par où commencer ?</h2>
      </div>

      {/* Bloc 1: Vous ne savez pas par où commencer ? */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-wedding-olive/20 p-6 mb-6">
          <h3 className="text-xl font-serif text-wedding-olive mb-4">
            Vous ne savez pas par où commencer ?
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Commencez par les outils essentiels pour organiser votre mariage
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[{
            title: 'Quiz Mariage',
            description: 'Les premières questions',
            icon: '❓',
            path: '/dashboard/planning'
          }, {
            title: 'Budget',
            description: 'Gérez vos dépenses',
            icon: '💰',
            path: '/dashboard/budget'
          }, {
            title: 'Prestataires',
            description: 'Trouvez vos fournisseurs',
            icon: '🏪',
            path: '/dashboard/professionnelsmariable'
          }, {
            title: 'RSVP Invités',
            description: 'Gérez les confirmations',
            icon: '✉️',
            path: '/dashboard/rsvp'
          }, {
            title: 'Check-list',
            description: 'Suivez vos préparatifs',
            icon: '✅',
            path: '/dashboard/checklist-mariage'
          }, {
            title: 'Calculatrice Boissons',
            description: 'Estimez les quantités',
            icon: '🥂',
            path: '/dashboard/drinks'
          }].map((feature, index) => <div key={index} onClick={() => window.location.href = feature.path} className="cursor-pointer transition-all duration-200 border border-wedding-olive/20 bg-wedding-olive/5 hover:bg-wedding-olive/15 hover:shadow-md hover:scale-105 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h4 className="font-medium text-sm text-wedding-olive mb-1 font-serif">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-600">
                  {feature.description}
                </p>
              </div>)}
          </div>
        </div>

        {/* Support WhatsApp - Premium uniquement */}
        <WhatsAppButton variant="featured" requirePremium={true} />

        {/* Bloc 2: Vous avez tout organisé ? */}
        <div className="bg-gradient-to-r from-wedding-olive/10 to-wedding-cream/20 rounded-xl shadow-sm border border-wedding-olive/20 p-6">
          <h3 className="text-xl font-serif text-wedding-olive mb-4">
            Vous avez tout organisé ? Dernière ligne droite jour J
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Finalisez votre préparation avec nos outils avancés
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[{
            title: 'Coordination Jour J',
            description: 'Planning détaillé et coordination',
            icon: '📅',
            path: '/mon-jour-m',
            bgColor: 'bg-wedding-cream/40',
            hoverColor: 'hover:bg-wedding-cream/60'
          }, {
            title: 'Après le mariage',
            description: 'Conseils pour l\'après jour J',
            icon: '💕',
            path: '/dashboard/apres-jour-j',
            bgColor: 'bg-wedding-olive/10',
            hoverColor: 'hover:bg-wedding-olive/20'
          }].map((feature, index) => <div key={index} onClick={() => window.location.href = feature.path} className={`cursor-pointer transition-all duration-200 border border-wedding-olive/20 ${feature.bgColor} ${feature.hoverColor} hover:shadow-md hover:scale-105 p-6 rounded-lg`}>
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{feature.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-lg text-wedding-olive mb-2 font-serif">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>)}
           </div>
        </div>
      </div>

      {/* Bloc Premium - Visible uniquement si l'utilisateur n'est pas premium - EN DERNIER */}
      {profile && profile.subscription_type !== 'premium' && (
        <div className="bg-premium-sage border-2 border-premium-sage-dark rounded-xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-3 rounded-full">
                <Sparkles className="w-6 h-6 text-premium-sage-dark" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white font-bold">
                  Profitez de toutes les fonctionnalités
                </h3>
                <p className="text-white/90 text-sm mt-1">Pour 9€ par mois ou demandez votre code Club Mariable à votre lieu</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowPrixModal(true)} 
                size="lg" 
                className="bg-transparent border-white text-white hover:bg-white/20 font-semibold transition-all duration-200 whitespace-nowrap"
              >
                <Info className="w-4 h-4 mr-2" />
                Détail du prix
              </Button>
              <Button onClick={() => setShowPaymentModal(true)} size="lg" className="bg-white hover:bg-gray-100 text-premium-sage-dark font-semibold shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap">
                <Sparkles className="w-4 h-4 mr-2" />
                Passer premium
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} />

      {/* Club Mariable Modal */}
      <ClubMariableModal isOpen={showClubMariableModal} onClose={() => setShowClubMariableModal(false)} />
    </div>;
};


export default ProjectSummary;