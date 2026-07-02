import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardSidebar from './DashboardSidebar';
import MobileBottomNav from './MobileBottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import PremiumHeader from '@/components/home/PremiumHeader';
import { Home, Users, Info, X, Crown } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useReaderMode } from '@/contexts/ReaderModeContext';
import SatisfactionModal from './SatisfactionModal';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
interface DashboardLayoutProps {
  children?: React.ReactNode;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children
}) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('dashboard');
  const { isPremium } = useUserProfile();
  const [showSatisfactionModal, setShowSatisfactionModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();
  const {
    isReaderMode
  } = useReaderMode();
  const [showMobileBanner, setShowMobileBanner] = useState(() => {
    return !localStorage.getItem('dashboard_mobile_banner_dismissed');
  });

  // Vérifier si l'utilisateur doit voir la modal de satisfaction
  useEffect(() => {
    const checkSatisfactionModal = async () => {
      try {
        // Vérifier si l'utilisateur est connecté
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser();
        if (!user) return;
        setCurrentUser(user);

        // Vérifier si l'utilisateur a déjà donné son feedback
        const feedbackCompleted = localStorage.getItem('satisfaction_feedback_completed');
        if (feedbackCompleted) return;

        // Vérifier si l'utilisateur a déjà vu la modal récemment (éviter spam)
        const lastShown = localStorage.getItem('satisfaction_modal_last_shown');
        if (lastShown) {
          const lastShownDate = new Date(lastShown);
          const now = new Date();
          const daysSinceLastShown = (now.getTime() - lastShownDate.getTime()) / (1000 * 3600 * 24);
          if (daysSinceLastShown < 7) return; // Attendre 7 jours avant de re-proposer
        }

        // Vérifier depuis quand l'utilisateur est inscrit (attendre au moins 7 jours)
        const userCreatedAt = new Date(user.created_at);
        const now = new Date();
        const daysSinceRegistration = (now.getTime() - userCreatedAt.getTime()) / (1000 * 3600 * 24);
        if (daysSinceRegistration >= 7 && location.pathname.includes('/dashboard')) {
          // Attendre 30 secondes après le chargement de la page
          setTimeout(() => {
            setShowSatisfactionModal(true);
            localStorage.setItem('satisfaction_modal_last_shown', now.toISOString());
          }, 30000);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la modal de satisfaction:', error);
      }
    };
    checkSatisfactionModal();
  }, [location.pathname]);
  const handleCloseSatisfactionModal = () => {
    setShowSatisfactionModal(false);
  };
  
  return <OnboardingProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <PremiumHeader />
        
        {/* Quick navigation bar */}
        <div className="fixed top-[88px] left-4 z-40 flex gap-2">
          <Link to="/">
            <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm shadow-sm hover:bg-premium-sage hover:text-white">
              <Home className="h-4 w-4 mr-1" />
              {t('header.home')}
            </Button>
          </Link>
          <Link to="/professionnelsmariable">
            <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm shadow-sm hover:bg-premium-sage hover:text-white">
              <Users className="h-4 w-4 mr-1" />
              {t('header.vendorSelection')}
            </Button>
          </Link>
          {!isPremium && (
            <Link to="/paiement">
              <Button
                size="sm"
                className="bg-wedding-gold hover:bg-wedding-gold/90 text-white shadow-md animate-pulse"
              >
                <Crown className="h-4 w-4 mr-1" />
                {t('header.upgradePremium')}
              </Button>
            </Link>
          )}
        </div>
        
        <div className="flex flex-1 relative">
        {/* Sidebar - only visible on desktop */}
        {!isMobile && (
          <div className="flex-shrink-0 pt-32" style={{ width: '250px' }}>
            <DashboardSidebar isReaderMode={isReaderMode} />
          </div>
        )}

        {/* Main content area - with bottom padding for mobile nav */}
        <div className="flex-1 flex justify-start items-start transition-all duration-300">
          <main className={`w-full px-2 sm:px-3 lg:px-4 pt-44 ${isMobile ? 'pb-24' : 'pb-6'}`} data-page-root>
            {isMobile && showMobileBanner && (
              <div className="mb-4 p-3 bg-editorial-beige border border-editorial-noir/10 flex items-start gap-3">
                <Info className="h-5 w-5 text-editorial-noir shrink-0 mt-0.5" />
                <p className="text-sm text-editorial-noir/80 flex-1">
                  {t('banner.mobileTip')}
                </p>
                <button
                  onClick={() => {
                    setShowMobileBanner(false);
                    localStorage.setItem('dashboard_mobile_banner_dismissed', 'true');
                  }}
                  className="shrink-0"
                >
                  <X className="h-4 w-4 text-editorial-noir/50" />
                </button>
              </div>
            )}
            {children || <Outlet />}
          </main>
        </div>
        
        {/* Mobile Bottom Navigation */}
        {isMobile && <MobileBottomNav />}
        </div>

        {/* Tour d'onboarding */}
        <OnboardingTour />

        {/* Modal de satisfaction */}
        {showSatisfactionModal && currentUser && <SatisfactionModal isOpen={showSatisfactionModal} onClose={handleCloseSatisfactionModal} userId={currentUser.id} />}
      </div>
    </OnboardingProvider>;
};
export default DashboardLayout;