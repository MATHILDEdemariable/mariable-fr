import React, { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import PaymentModal from '@/components/pricing/PaymentModal';
import { WhatsAppButton } from '@/components/support/WhatsAppButton';
import ClubMariableModal from './ClubMariableModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PricingContent from './PricingContent';

// Gaming Components
import HeroStats from './gaming/HeroStats';
import QuestCards from './gaming/QuestCards';
import ToolsGrid from './gaming/ToolsGrid';
import AchievementBadges from './gaming/AchievementBadges';
import QuickActions from './gaming/QuickActions';

interface Task {
  id: string;
  label: string;
  completed: boolean;
  priority?: string;
  category: string;
}

const ProjectSummary = () => {
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
  const [hasSetBudget, setHasSetBudget] = useState(false);

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

  // Load tasks and count + check budget
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get recent tasks
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

        // Get total counts
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

        // Check if user has set budget (check budgets_detail table)
        const { count: budgetCount } = await supabase
          .from('budgets_detail')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setHasSetBudget((budgetCount || 0) > 0);
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

  // Module progress states
  const [moduleProgress, setModuleProgress] = useState({
    hasPrestataires: false,
    hasEquipe: false,
    hasPlanning: false,
    hasDocumentsJourJ: false,
    hasRsvp: false,
    hasAccommodations: false,
    hasSeatingPlan: false,
    hasDocuments: false
  });

  // Load module data for progress calculation
  useEffect(() => {
    const loadModuleProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check all modules in parallel
      const [
        prestatairesRes,
        equipeRes,
        planningRes,
        docsJourJRes,
        rsvpRes,
        accommodationsRes,
        seatingRes,
        qrCodesRes
      ] = await Promise.all([
        // Prestataires suivi (via coordination_team with type prestataire)
        supabase.from('coordination_team').select('id', { count: 'exact', head: true }).eq('type', 'prestataire'),
        // Équipe Jour-J
        supabase.from('coordination_team').select('id', { count: 'exact', head: true }).neq('type', 'prestataire'),
        // Planning Jour-J
        supabase.from('coordination_planning').select('id', { count: 'exact', head: true }),
        // Documents Jour-J
        supabase.from('coordination_documents').select('id', { count: 'exact', head: true }),
        // RSVP (wedding_rsvp_responses or guests)
        supabase.from('seating_assignments').select('id', { count: 'exact', head: true }),
        // Accommodations
        supabase.from('wedding_accommodations').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        // Seating Plan
        supabase.from('seating_tables').select('id', { count: 'exact', head: true }),
        // QR Codes/Documents
        supabase.from('qr_codes').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
      ]);

      setModuleProgress({
        hasPrestataires: (prestatairesRes.count || 0) > 0,
        hasEquipe: (equipeRes.count || 0) > 0,
        hasPlanning: (planningRes.count || 0) > 0,
        hasDocumentsJourJ: (docsJourJRes.count || 0) > 0,
        hasRsvp: (rsvpRes.count || 0) > 0,
        hasAccommodations: (accommodationsRes.count || 0) > 0,
        hasSeatingPlan: (seatingRes.count || 0) > 0,
        hasDocuments: (qrCodesRes.count || 0) > 0
      });
    };

    loadModuleProgress();
  }, []);

  // Calculate completion percentage based on 9 modules (100% total)
  const calculateCompletionPercentage = () => {
    let progress = 0;
    
    // 1. Infos de base (10%): date (5%) + invités (5%)
    if (localWeddingDate) progress += 5;
    if (parseInt(localGuestCount) > 0) progress += 5;
    
    // 2. Check-list (15%): basé sur tâches complétées
    if (totalTasksCount > 0) {
      progress += Math.round((completedTasksCount / totalTasksCount) * 15);
    }
    
    // 3. Budget (10%)
    if (hasSetBudget) progress += 10;
    
    // 4. Prestataires Suivi (10%)
    if (moduleProgress.hasPrestataires) progress += 10;
    
    // 5. Jour-J (15%): équipe (5%) + planning (5%) + documents (5%)
    if (moduleProgress.hasEquipe) progress += 5;
    if (moduleProgress.hasPlanning) progress += 5;
    if (moduleProgress.hasDocumentsJourJ) progress += 5;
    
    // 6. RSVP Invités (10%)
    if (moduleProgress.hasRsvp) progress += 10;
    
    // 7. Gestion des logements (10%)
    if (moduleProgress.hasAccommodations) progress += 10;
    
    // 8. Plan de table (10%)
    if (moduleProgress.hasSeatingPlan) progress += 10;
    
    // 9. Documents/QR Code (10%)
    if (moduleProgress.hasDocuments) progress += 10;
    
    return Math.min(100, progress);
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

      {/* Quest Cards */}
      <QuestCards tasks={tasks} />

      {/* Tools Grid */}
      <ToolsGrid />

      {/* Achievement Badges */}
      <AchievementBadges
        completedTasks={completedTasksCount}
        totalTasks={totalTasksCount}
        hasSetBudget={hasSetBudget}
        hasSetDate={!!localWeddingDate}
        guestCount={parseInt(localGuestCount) || 0}
      />

      {/* WhatsApp Support - Premium Only */}
      <WhatsAppButton variant="featured" requirePremium={true} />

      {/* Modal Détail du prix */}
      <Dialog open={showPrixModal} onOpenChange={setShowPrixModal}>
        <DialogContent className="sm:max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détail des tarifs</DialogTitle>
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
