import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Palette,
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
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Accueil', path: '/dashboard' },
  { icon: CheckSquare, label: 'Check-list', path: '/dashboard/checklist-mariage' },
  { icon: Calculator, label: 'Budget', path: '/dashboard/budget' },
  { icon: Calendar, label: 'Jour-J', path: '/mon-jour-m/planning' },
];

const drawerNavItems: NavItem[] = [
  { icon: ClipboardList, label: 'Rétroplanning', path: '/dashboard/mon-mariage/retroplanning' },
  { icon: Users, label: 'RSVP', path: '/dashboard/rsvp' },
  { icon: Utensils, label: 'Plan de table', path: '/dashboard/seating-plan' },
  { icon: Hotel, label: 'Hébergements', path: '/dashboard/accommodations' },
  { icon: Church, label: 'Cérémonie', path: '/dashboard/ceremonie' },
  { icon: Building2, label: 'Mairie', path: '/dashboard/mairie-civil' },
  { icon: Users, label: 'Prestataires', path: '/dashboard/suivi' },
  { icon: FileText, label: 'Documents', path: '/dashboard/documents' },
  { icon: QrCode, label: 'QR Code', path: '/dashboard/qr-code' },
  { icon: BookOpen, label: 'Guides', path: '/dashboard/guides' },
];

const bonusItems: NavItem[] = [
  { icon: Palette, label: 'Moodboard', path: '/dashboard/moodboard' },
  { icon: Sparkles, label: 'Assistant IA', path: '/dashboard/assistant' },
  { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages' },
];

// Routes où on masque la nav (marketing, admin, embeds, auth)
const HIDDEN_PATTERNS = [
  /^\/mariable/,
  /^\/partenariat/,
  /^\/professionnels$/,
  /^\/landing/,
  /^\/admin/,
  /^\/auth/,
  /^\/login/,
  /^\/register/,
  /^\/paiement/,
  /^\/proposition/,
  /^\/reservation-jour-m/,
  /^\/jour-m-vue/,
  /^\/wedding\//,
  /^\/site\//,
  /^\/mariage\//,
  /^\/blog/,
  /^\/preview/,
  /-embed/i,
  /^\/oauth/,
  /^\/\.lovable/,
];

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (loading || !isAuthenticated) return null;
  if (HIDDEN_PATTERNS.some((r) => r.test(location.pathname))) return null;

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/mon-jour-m/planning') return location.pathname.startsWith('/mon-jour-m');
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDrawerOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav
        role="navigation"
        aria-label="Navigation principale mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around h-16">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full py-2 relative transition-colors',
                  active ? 'text-wedding-olive' : 'text-gray-500'
                )}
              >
                <Icon className={cn('h-5 w-5', active && 'stroke-[2.5]')} />
                <span className={cn('text-[10px] mt-1 font-medium', active && 'font-semibold')}>
                  {item.label}
                </span>
                {active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-wedding-olive" />
                )}
              </Link>
            );
          })}

          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full py-2 text-gray-500 transition-colors hover:text-wedding-olive"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] mt-1 font-medium">Plus</span>
          </button>
        </div>
      </nav>

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
                      'flex flex-col items-center justify-center p-4 rounded-xl transition-all',
                      active
                        ? 'bg-wedding-olive/10 text-wedding-olive border border-wedding-olive/20'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-xs text-center font-medium leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Bonus & IA</h3>
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
                        'flex items-center gap-3 p-3 rounded-xl transition-all',
                        active
                          ? 'bg-wedding-olive/10 text-wedding-olive border border-wedding-olive/20'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <Link
                to="/dashboard/settings"
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
