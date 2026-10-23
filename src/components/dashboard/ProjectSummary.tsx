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
import PushNotificationBanner from './PushNotificationBanner';
import { useWeddingScope } from '@/hooks/useWeddingScope';

// Gaming Components
import HeroStats from './gaming/HeroStats';
import { Calendar, Users, Heart, Table, Wine, FileText, Home, CalendarRange, Calculator, UserCheck, Store, ListChecks, Sparkles, Contact } from 'lucide-react';

// Tous les outils du couple, même présentation que la vue pro.
const COUPLE_TOOLS = [
  { fr: 'Rétroplanning', en: 'Timeline', icon: CalendarRange, path: '/dashboard/mon-mariage/retroplanning' },
  { fr: 'Checklist', en: 'Checklist', icon: ListChecks, path: '/dashboard/checklist-mariage' },
  { fr: 'Budget & acomptes', en: 'Budget & deposits', icon: Calculator, path: '/dashboard/budget' },
  { fr: 'Invités & RSVP', en: 'Guests & RSVP', icon: UserCheck, path: '/dashboard/rsvp' },
  { fr: 'Prestataires', en: 'Vendors', icon: Store, path: '/dashboard/suivi' },
  { fr: 'Décoration', en: 'Decor', icon: Sparkles, path: '/dashboard/decoration' },
  { fr: 'Trombinoscope', en: 'Who’s who', icon: Contact, path: '/dashboard/trombinoscope' },
  { fr: 'Planning Jour J', en: 'Day-of schedule', icon: Calendar, path: '/mon-jour-m/planning' },
  { fr: 'Équipe & contacts', en: 'Team & contacts', icon: Users, path: '/mon-jour-m/equipe' },
  { fr: 'Cérémonie', en: 'Ceremony', icon: Heart, path: '/dashboard/ceremonie' },
  { fr: 'Plan de table', en: 'Seating plan', icon: Table, path: '/dashboard/seating-plan' },
  { fr: 'Boissons', en: 'Drinks', icon: Wine, path: '/dashboard/drinks' },
  { fr: 'Hébergements', en: 'Accommodation', icon: Home, path: '/dashboard/accommodations' },
  { fr: 'Documents', en: 'Documents', icon: FileText, path: '/mon-jour-m/documents' },
];
import QuickActions from './gaming/QuickActions';
import { useWedding } from '@/contexts/WeddingContext';
import ProWeddingOverview from '@/components/pro/ProWeddingOverview';
import coupleHeroPhoto from '@/assets/editorial/baiser-arche-oliviers.png.asset.json';

interface Task {
  id: string;
  label: string;
  completed: boolean;
  priority?: string;
  category: string;
}

const ProjectSummary = () => {
  const { t, i18n } = useTranslation('dashboard');
  const isEnglish = i18n.language?.startsWith('en');
  const { profile, loading, updateProfile } = useUserProfile();
  const [localWeddingDate, setLocalWeddingDate] = useState<Date | undefined>();
  const [localGuestCount, setLocalGuestCount] = useState<string>("");
  const { toast } = useToast();
  const { weddingId } = useWeddingScope();
  const { accountType, currentWedding } = useWedding();
  const scope = <T,>(query: T): T =>
    weddingId ? ((query as any).eq('wedding_id', weddingId) as T) : query;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showClubMariableModal, setShowClubMariableModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showPrixModal, setShowPrixModal] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);
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

  // Date et invités : la fiche mariage (renseignée par le wedding planner si partagée) prime sur le profil
  useEffect(() => {
    const sharedWeddingDate = currentWedding?.wedding_date || profile?.wedding_date;
    const sharedGuestCount = currentWedding?.guest_count ?? profile?.guest_count;
    if (sharedWeddingDate) setLocalWeddingDate(new Date(sharedWeddingDate));
    if (sharedGuestCount) setLocalGuestCount(sharedGuestCount.toString());
  }, [profile, currentWedding?.wedding_date, currentWedding?.guest_count]);

  // Load all module progress data
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get recent tasks for display
        const { data: recentTasks, error } = await scope(
          supabase
            .from('generated_tasks')
            .select('*')
            .eq('user_id', user.id)
        )
          .order('priority', { ascending: false })
          .order('position', { ascending: true })
          .limit(5);

        if (error) {
          console.error('Error loading tasks:', error);
          return;
        }
        setTasks(recentTasks || []);

        // Get tasks counts for checklist progress
        const { count: total } = await scope(
          supabase
            .from('generated_tasks')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
        );

        const { count: completed } = await scope(
          supabase
            .from('generated_tasks')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
        ).eq('completed', true);

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
          scope(supabase.from('budgets_detail').select('*', { count: 'exact', head: true }).eq('user_id', user.id)),
          // Prestataires (10%) - check coordination_team
          supabase.from('coordination_team').select('id', { count: 'exact', head: true }).limit(1),
          // Jour-J (15%) - check wedding_coordination
          scope(supabase.from('wedding_coordination').select('id', { count: 'exact', head: true }).eq('user_id', user.id)),
          // RSVP (10%) - check wedding_rsvp_responses
          supabase.from('wedding_rsvp_responses').select('id', { count: 'exact', head: true }).limit(1),
          // Logements (10%) - check wedding_accommodations
          scope(supabase.from('wedding_accommodations').select('id', { count: 'exact', head: true }).limit(1)),
          // Plan de table (10%) - check seating_plans
          scope(supabase.from('seating_plans').select('id', { count: 'exact', head: true }).eq('user_id', user.id)),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);

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

  // Pro : vue d'ensemble dédiée au mariage ouvert (pas la vue couple).
  if (accountType === 'b2b' && currentWedding) {
    return <ProWeddingOverview wedding={currentWedding} />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7F9474]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Bandeau éditorial */}
      <section className="relative overflow-hidden min-h-[220px] sm:min-h-[280px] flex items-end">
        <img src={coupleHeroPhoto.url} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-[center_35%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-editorial-noir/80 via-editorial-noir/30 to-transparent" aria-hidden="true" />
        <div className="relative p-6 sm:p-8 text-editorial-beige">
          <p className="text-xs uppercase tracking-[0.25em] opacity-80">Mariable · {t('header.myWorkspace')}</p>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl leading-tight">
            {profile?.first_name ? `${profile.first_name}, ` : ''}{t('editorialHero.title', { defaultValue: 'votre plus beau jour se prépare ici.' })}
          </h1>
        </div>
      </section>

      {/* Hero Section with Stats */}
      <HeroStats
        firstName={profile?.first_name}
        weddingDate={localWeddingDate}
        guestCount={localGuestCount}
        completionPercentage={completionPercentage}
        onWeddingDateChange={handleWeddingDateChange}
        onGuestCountChange={setLocalGuestCount}
      />

      {/* Push Notifications opt-in banner */}
      <PushNotificationBanner />

      {/* Tools Grid */}
      <section aria-labelledby="couple-tools">
        <h2 id="couple-tools" className="font-serif text-2xl text-foreground mb-3">{isEnglish ? 'All your tools' : 'Tous vos outils'}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {COUPLE_TOOLS.map((tool) => (
            <Link key={tool.path} to={tool.path} className="group bg-background border border-border p-4 min-h-[96px] transition-all hover:border-wedding-olive hover:shadow-md">
              <tool.icon className="h-6 w-6 text-wedding-olive" aria-hidden="true" />
              <h3 className="font-semibold text-sm mt-3 text-foreground">{isEnglish ? tool.en : tool.fr}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Ressources d'aide regroupées en bas de page */}
      <section aria-label={t('support.title')} className="border-t border-border pt-6 space-y-4">
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
        className="block bg-gradient-to-r from-wedding-olive to-wedding-olive/80 text-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
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

      </section>

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
