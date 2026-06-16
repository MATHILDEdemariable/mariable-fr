import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calculator, 
  Calendar, 
  Menu,
  Users,
  ClipboardList,
  Utensils,
  Hotel,
  Church,
  Building2,
  FileText,
  QrCode,
  BookOpen,
  Settings,
  LogOut,
  X,
  Sparkles,
  MessageSquare,
  Palette
} from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  isMain?: boolean;
}

const useNavData = () => {
  const { t } = useTranslation('dashboard');
  const mainNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: t('mobileNav.home'), path: '/dashboard', isMain: true },
    { icon: CheckSquare, label: t('mobileNav.checklist'), path: '/dashboard/checklist-mariage', isMain: true },
    { icon: Calculator, label: t('mobileNav.budget'), path: '/dashboard/budget', isMain: true },
    { icon: Calendar, label: t('mobileNav.weddingDay'), path: '/mon-jour-m', isMain: true },
  ];
  const drawerNavItems: NavItem[] = [
    { icon: ClipboardList, label: t('mobileNav.retroplanning'), path: '/dashboard/mon-mariage/retroplanning' },
    { icon: Users, label: t('mobileNav.rsvp'), path: '/dashboard/rsvp' },
    { icon: Utensils, label: t('mobileNav.seatingPlan'), path: '/dashboard/seating-plan' },
    { icon: Hotel, label: t('mobileNav.accommodations'), path: '/dashboard/accommodations' },
    { icon: Church, label: t('mobileNav.ceremony'), path: '/dashboard/ceremonie' },
    { icon: Building2, label: t('mobileNav.civil'), path: '/dashboard/mairie-civil' },
    { icon: Users, label: t('mobileNav.vendors'), path: '/dashboard/suivi' },
    { icon: FileText, label: t('mobileNav.documents'), path: '/dashboard/documents' },
    { icon: QrCode, label: t('mobileNav.qrCode'), path: '/dashboard/qr-code' },
    { icon: BookOpen, label: t('mobileNav.guides'), path: '/dashboard/guides' },
  ];
  const bonusItems: NavItem[] = [
    { icon: Palette, label: t('mobileNav.moodboard'), path: '/dashboard/moodboard' },
    { icon: Sparkles, label: t('mobileNav.chatGPT'), path: '/dashboard/chat-gpt-mariage' },
    { icon: MessageSquare, label: t('mobileNav.aiAssistant'), path: '/dashboard/assistant-mariage' },
  ];
  return { mainNavItems, drawerNavItems, bonusItems };
};

const MobileBottomNav: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const { mainNavItems, drawerNavItems, bonusItems } = useNavData();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full py-2 relative transition-colors",
                  active ? "text-wedding-olive" : "text-gray-500"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                <span className={cn(
                  "text-[10px] mt-1 font-medium",
                  active && "font-semibold"
                )}>
                  {item.label}
                </span>
                {active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-wedding-olive" />
                )}
              </Link>
            );
          })}
          
          {/* More Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full py-2 text-gray-500 transition-colors hover:text-wedding-olive"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] mt-1 font-medium">Plus</span>
          </button>
        </div>
      </nav>

      {/* Drawer with all other modules */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="flex items-center justify-between border-b pb-4">
            <DrawerTitle className="text-lg font-semibold">Tous les outils</DrawerTitle>
            <DrawerClose asChild>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </DrawerClose>
          </DrawerHeader>
          
          <div className="overflow-y-auto px-4 py-4 pb-8">
            {/* Main Modules */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {drawerNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-xl transition-all",
                      active 
                        ? "bg-wedding-olive/10 text-wedding-olive border border-wedding-olive/20" 
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-xs text-center font-medium leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Bonus Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Bonus IA</h3>
              <div className="grid grid-cols-2 gap-3">
                {bonusItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setDrawerOpen(false)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-all",
                        active 
                          ? "bg-wedding-olive/10 text-wedding-olive border border-wedding-olive/20" 
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Settings & Logout */}
            <div className="border-t pt-4 space-y-2">
              <Link
                to="/dashboard/parametres"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
              >
                <Settings className="h-5 w-5" />
                <span className="text-sm font-medium">Paramètres</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 transition-all w-full text-left"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileBottomNav;
