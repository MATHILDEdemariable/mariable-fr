
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import PremiumHeader from '@/components/home/PremiumHeader';
import { PanelLeft } from 'lucide-react';
import { useReaderMode } from '@/contexts/ReaderModeContext';

import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarVisible, setSidebarVisible] = useState(!isMobile);
  const location = useLocation();
  const { isReaderMode } = useReaderMode();
  
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
            className="fixed z-50 bottom-5 right-5 p-3 rounded-full bg-wedding-olive text-white shadow-lg"
            aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
          >
            <PanelLeft size={24} />
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
          <main className="w-full pb-4 px-2 sm:pb-6 sm:px-3 lg:px-4" data-page-root>
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
      </div>
    </OnboardingProvider>
  );
};

export default DashboardLayout;
