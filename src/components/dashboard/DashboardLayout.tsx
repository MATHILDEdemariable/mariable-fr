
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';

const DashboardLayout: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar - always visible */}
        <div className={`${isMobile ? 'w-64 fixed z-40 h-full overflow-y-auto' : 'w-64 flex-shrink-0'}`}>
          <DashboardSidebar />
        </div>

        {/* Main content area - adjusted margin for mobile */}
        <div className={`flex-1 overflow-auto pt-6 ${isMobile ? 'ml-64' : ''}`}>
          <main className="container mx-auto py-6 px-4 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
