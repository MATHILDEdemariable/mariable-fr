
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import PremiumHeader from '@/components/home/PremiumHeader';
import { PanelLeft } from 'lucide-react';
import { useReaderMode } from '@/contexts/ReaderModeContext';
import SatisfactionModal from './SatisfactionModal';
import { supabase } from '@/integrations/supabase/client';

import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarVisible, setSidebarVisible] = useState(!isMobile);
  const [showSatisfactionModal, setShowSatisfactionModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();
  const { isReaderMode } = useReaderMode();

  // Vérifier si l'utilisateur doit voir la modal de satisfaction
  useEffect(() => {
    const checkSatisfactionModal = async () => {
      try {
        // Vérifier si l'utilisateur est connecté
        const { data: { user } } = await supabase.auth.getUser();
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
  
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <PremiumHeader />
        
        <div className="flex flex-1 relative">
        {/* Mobile toggle button - using PanelLeft icon for dashboard */}
        {isMobile && (
          <button 
            onClick={toggleSidebar} 
            className="fixed z-50 bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-full bg-wedding-olive text-white shadow-2xl hover:shadow-3xl transition-all hover:scale-105 active:scale-95"
            aria-label={sidebarVisible ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <PanelLeft size={20} />
            <span className="font-medium text-sm">Menu</span>
          </button>
        )}
        
        {/* Sidebar - conditionally visible */}
        <div 
          className={`${isMobile ? 'fixed z-40 h-full overflow-y-auto transition-transform duration-300 transform' : 'flex-shrink-0'} 
                    ${(isMobile && !sidebarVisible) ? '-translate-x-full' : 'translate-x-0'}`}
          style={{ width: isMobile ? '280px' : '250px' }}
        >
          <DashboardSidebar isReaderMode={isReaderMode} />
        </div>

        {/* Main content area - better mobile spacing */}
        <div className="flex-1 flex justify-start items-start transition-all duration-300" 
             style={{ marginLeft: (!isMobile && sidebarVisible) ? '0' : '0' }}>
          <main className="w-full pb-4 px-2 sm:pb-6 sm:px-3 lg:px-4 pt-28" data-page-root>
            {children || <Outlet />}
          </main>
        </div>
        
        {/* Overlay to close sidebar on mobile */}
        {isMobile && sidebarVisible && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarVisible(false)}
          />
        )}
        </div>

        {/* Tour d'onboarding */}
        <OnboardingTour />

        {/* Modal de satisfaction */}
        {showSatisfactionModal && currentUser && (
          <SatisfactionModal
            isOpen={showSatisfactionModal}
            onClose={handleCloseSatisfactionModal}
            userId={currentUser.id}
          />
        )}
      </div>
    </OnboardingProvider>
  );
};

export default DashboardLayout;
