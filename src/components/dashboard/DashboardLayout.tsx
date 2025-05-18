
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerClose } from '@/components/ui/drawer';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

const DashboardLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        {/* Desktop sidebar - always visible on larger screens */}
        {!isMobile && (
          <div className="hidden lg:block w-64 flex-shrink-0">
            <DashboardSidebar />
          </div>
        )}

        {/* Mobile sidebar - modified to always be open initially and stay open */}
        {isMobile && (
          <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <div className="fixed top-14 left-4 z-40 lg:hidden">
              <Button 
                variant="outline" 
                size="icon"
                className="bg-white shadow-sm"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </Button>
            </div>
            <DrawerContent className="p-0 w-[280px] sm:max-w-sm bg-white">
              <div className="absolute top-4 right-4 z-50">
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </DrawerClose>
              </div>
              <div className="h-full overflow-y-auto">
                <DashboardSidebar />
              </div>
            </DrawerContent>
          </Drawer>
        )}

        {/* Main content area */}
        <div className="flex-1 overflow-auto pt-6">
          <main className="container mx-auto py-6 px-4 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
