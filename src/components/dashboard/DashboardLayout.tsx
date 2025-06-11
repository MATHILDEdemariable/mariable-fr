
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import { PanelLeft } from 'lucide-react';
import { useReaderMode } from '@/contexts/ReaderModeContext';
import ShareDashboardButton from './ShareDashboardButton';

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
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
          <DashboardSidebar isCollapsed={false} />
        </div>

        {/* Main content area - better mobile spacing */}
        <div className="flex-1 flex justify-start items-start transition-all duration-300" 
             style={{ marginLeft: (!isMobile && sidebarVisible) ? '0' : '0' }}>
          <main className="w-full max-w-6xl mx-auto py-4 px-3 sm:py-6 sm:px-4 lg:px-8">
            {!isReaderMode && (
              <div className="flex justify-end mb-4">
                <ShareDashboardButton />
              </div>
            )}
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
    </div>
  );
};

export default DashboardLayout;
