import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import PaymentModal from '@/components/pricing/PaymentModal';
import ClubMariableModal from './ClubMariableModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PricingContent from './PricingContent';
import { Smartphone, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProblemModal } from '@/components/support/ProblemModal';

// Gaming Components
import HeroStats from './gaming/HeroStats';
import ToolsGrid from './gaming/ToolsGrid';
import QuickActions from './gaming/QuickActions';

interface Task {
  id: string;
  label: string;
  completed: boolean;
  priority?: string;
  category: string;
}

const ProjectSummary = () => {
  const { t } = useTranslation('dashboard');
  const { profile, loading, updateProfile } = useUserProfile();
  const [localWeddingDate, setLocalWeddingDate] = useState<Date | undefined>();
  const [localGuestCount, setLocalGuestCount] = useState<string>("");
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showClubMariableModal, setShowClubMariableModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showPrixModal, setShowPrixModal] = useState(false);
  const [totalTasksCount, setTotalTasksCount] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  
  // Module progress states for 9 categories
  const [moduleProgress, setModuleProgress] = useState({
    infosBase: false,      // 10% - date + invités
    checklist: 0,          // 15% - % tâches complétées
    budget: false,         // 10% - budget configuré
    prestataires: false,   // 10% - au moins 1 prestataire
    jourJ: false,          // 15% - coordination créée
    rsvp: false,           // 10% - au moins 1 réponse RSVP
    logements: false,      // 10% - hébergements configurés
    planTable: false,      // 10% - plan de table créé
    documents: false,      // 10% - au moins 1 document
  });

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

  // Load all module progress data
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get recent tasks for display
        const { data: recentTasks, error } = await supabase
          .from('generated_tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('priority', { ascending: false })
          .order('position', { ascending: true })
          .limit(5);

        if (error) {
          console.error('Error loading tasks:', error);
          return;
        }
        setTasks(recentTasks || []);

        // Get tasks counts for checklist progress
        const { count: total } = await supabase
          .from('generated_tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { count: completed } = await supabase
          .from('generated_tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('completed', true);

        setTotalTasksCount(total || 0);
        setCompletedTasksCount(completed || 0);

        // Check all 9 modules in parallel
        const [
          budgetResult,
          prestatairesResult,
          coordinationResult,
          rsvpResult,
          logementsResult,
          planTableResult,
          documentsResult
        ] = await Promise.all([
          // Budget (10%)
          supabase.from('budgets_detail').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
          // Prestataires (10%) - check coordination_team
          supabase.from('coordination_team').select('id', { count: 'exact', head: true }).limit(1),
          // Jour-J (15%) - check wedding_coordination
          supabase.from('wedding_coordination').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
          // RSVP (10%) - check wedding_rsvp_responses
          supabase.from('wedding_rsvp_responses').select('id', { count: 'exact', head: true }).limit(1),
          // Logements (10%) - check wedding_accommodations
          supabase.from('wedding_accommodations').select('id', { count: 'exact', head: true }).limit(1),
          // Plan de table (10%) - check seating_plans
          supabase.from('seating_plans').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
          // Documents (10%) - check coordination_documents
          supabase.from('coordination_documents').select('id', { count: 'exact', head: true }).limit(1),
        ]);

        // Calculate checklist percentage (0-100)
        const checklistPercentage = total && total > 0 ? Math.round((completed || 0) / total * 100) : 0;

        setModuleProgress({
          infosBase: false, // Will be calculated from localWeddingDate and localGuestCount
          checklist: checklistPercentage,
          budget: (budgetResult.count || 0) > 0,
          prestataires: (prestatairesResult.count || 0) > 0,
          jourJ: (coordinationResult.count || 0) > 0,
          rsvp: (rsvpResult.count || 0) > 0,
          logements: (logementsResult.count || 0) > 0,
          planTable: (planTableResult.count || 0) > 0,
          documents: (documentsResult.count || 0) > 0,
        });

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setTasksLoading(false);
      }
    };
    loadData();
  }, []);

  // Auto-save wedding date
  const handleWeddingDateChange = async (date: Date | undefined) => {
    setLocalWeddingDate(date);
    if (date && updateProfile) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const localDateString = `${year}-${month}-${day}`;
      await updateProfile({ wedding_date: localDateString });
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

  // Calculate completion percentage based on 9 modules
  // Infos base 10%, Checklist 15%, Budget 10%, Prestataires 10%, 
  // Jour-J 15%, RSVP 10%, Logements 10%, Plan de table 10%, Documents 10%
  const calculateCompletionPercentage = () => {
    let total = 0;
    
    // 1. Infos de base (10%) - date ET invités renseignés
    const hasInfosBase = localWeddingDate && parseInt(localGuestCount) > 0;
    if (hasInfosBase) total += 10;
    
    // 2. Checklist (15%) - proportionnel au % de tâches complétées
    total += Math.round((moduleProgress.checklist / 100) * 15);
    
    // 3. Budget (10%)
    if (moduleProgress.budget) total += 10;
    
    // 4. Prestataires (10%)
    if (moduleProgress.prestataires) total += 10;
    
    // 5. Jour-J / Coordination (15%)
    if (moduleProgress.jourJ) total += 15;
    
    // 6. RSVP (10%)
    if (moduleProgress.rsvp) total += 10;
    
    // 7. Logements (10%)
    if (moduleProgress.logements) total += 10;
    
    // 8. Plan de table (10%)
    if (moduleProgress.planTable) total += 10;
    
    // 9. Documents (10%)
    if (moduleProgress.documents) total += 10;
    
    return Math.min(100, total);
  };

  const completionPercentage = calculateCompletionPercentage();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7F9474]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Section with Stats */}
      <HeroStats
        firstName={profile?.first_name}
        weddingDate={localWeddingDate}
        guestCount={localGuestCount}
        completionPercentage={completionPercentage}
        onWeddingDateChange={handleWeddingDateChange}
        onGuestCountChange={setLocalGuestCount}
      />

      {/* Quick Actions (Guide, Video, Instagram) */}
      <QuickActions
        showVideoModal={showVideoModal}
        setShowVideoModal={setShowVideoModal}
        showGuideModal={showGuideModal}
        setShowGuideModal={setShowGuideModal}
      />

      {/* Install App Banner */}
      <Link
        to="/dashboard/installer-app"
        className="block bg-gradient-to-r from-wedding-olive to-wedding-olive/80 text-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-start sm:items-center gap-4">
          <div className="bg-white/15 p-3 rounded-lg shrink-0">
            <Smartphone className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-serif font-medium">
              {t('installBanner.title')}
            </h3>
            <p className="text-xs sm:text-sm text-white/85 mt-1 leading-relaxed">
              {t('installBanner.subtitle')}
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center px-4 py-2 rounded-md bg-white text-wedding-olive text-sm font-medium shrink-0">
            {t('installBanner.cta')}
          </span>
        </div>
      </Link>

      {/* Tools Grid */}
      <ToolsGrid />

      {/* Contact Support */}
      <div className="bg-muted/30 border border-border rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-serif text-foreground">
            {t('support.title')}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {t('support.subtitle')}
          </p>
        </div>
        <Button
          onClick={() => setShowProblemModal(true)}
          className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
        >
          <LifeBuoy className="h-4 w-4 mr-2" />
          {t('support.cta')}
        </Button>
      </div>

      <ProblemModal isOpen={showProblemModal} onClose={() => setShowProblemModal(false)} />

      {/* Modal Détail du prix */}
      <Dialog open={showPrixModal} onOpenChange={setShowPrixModal}>
        <DialogContent className="sm:max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('summary.priceModalTitle')}</DialogTitle>
          </DialogHeader>
          <PricingContent />
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} />

      {/* Club Mariable Modal */}
      <ClubMariableModal isOpen={showClubMariableModal} onClose={() => setShowClubMariableModal(false)} />
    </div>
  );
};

export default ProjectSummary;
