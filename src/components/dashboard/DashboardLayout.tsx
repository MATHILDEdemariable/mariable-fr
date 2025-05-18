
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/drawer';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        {/* Desktop sidebar - always visible on larger screens */}
        {!isMobile && (
          <div className="hidden lg:block w-64 flex-shrink-0">
            <DashboardSidebar />
          </div>
        )}

        {/* Mobile sidebar - using Sheet component for sliding effect */}
        {isMobile && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="fixed top-4 left-4 z-40 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] sm:max-w-sm bg-white">
              <div className="absolute top-4 right-4 z-50">
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
              <div className="h-full overflow-y-auto">
                <DashboardSidebar />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          <main className="container mx-auto py-6 px-4 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
