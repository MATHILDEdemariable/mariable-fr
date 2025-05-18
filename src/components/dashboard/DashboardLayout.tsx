
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

const DashboardLayout: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        {/* Desktop sidebar - always visible on larger screens */}
        {!isMobile && (
          <div className="w-64 flex-shrink-0">
            <DashboardSidebar />
          </div>
        )}

        {/* Mobile sidebar - using Drawer component for sliding effect, but now always open */}
        {isMobile && (
          <Drawer defaultOpen={true}>
            <DrawerTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="fixed top-4 left-4 z-40 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
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
