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

  // Load tasks and count
  useEffect(() => {
    const loadTasks = async () => {
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
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setTasksLoading(false);
      }
    };
    loadTasks();
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

  // Calculate completion percentage
  const completionPercentage = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
        hasSetBudget={false}
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
