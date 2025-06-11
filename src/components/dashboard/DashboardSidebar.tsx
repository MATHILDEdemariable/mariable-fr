
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Coins, 
  Store, 
  Heart, 
  Settings,
  LogOut,
  Wine,
  MessageCircleQuestion,
  MessageSquare,
  Users,
  Crown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  isReaderMode?: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isReaderMode = false }) => {
  const location = useLocation();
  
  const navigationItems = [
    {
      label: 'Tableau de bord',
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: '/dashboard',
    },
    {
      label: 'Initiation Mariage',
      icon: <Calendar className="h-4 w-4" />,
      path: '/dashboard/planning',
    },
    {
      label: 'Check-list',
      icon: <CheckSquare className="h-4 w-4" />,
      path: '/dashboard/tasks',
    },
    {
      label: 'Budget',
      icon: <Coins className="h-4 w-4" />,
      path: '/dashboard/budget',
    },
    {
      label: 'Prestataires',
      icon: <Store className="h-4 w-4" />,
      path: '/dashboard/prestataires',
    },
    {
      label: 'Wishlist',
      icon: <Heart className="h-4 w-4" />,
      path: '/dashboard/wishlist',
    },
    {
      label: 'Coordination Jour J',
      icon: <Calendar className="h-4 w-4" />,
      path: '/dashboard/coordination',
    },
    {
      label: 'Calculatrice de boisson',
      icon: <Wine className="h-4 w-4" />,
      path: '/dashboard/drinks',
    },
    {
      label: 'Des questions ?',
      icon: <MessageCircleQuestion className="h-4 w-4" />,
      path: '/dashboard/assistant',
    },
    {
      label: 'CHATGPT Mariage',
      icon: <MessageSquare className="h-4 w-4" />,
      path: 'https://chatgpt.com/g/g-684071f00100819199b7b11839db48d4-assistant-mariage-by-mariable',
      external: true,
    },
    {
      label: 'Accès à la communauté WhatsApp',
      icon: <Users className="h-4 w-4" />,
      path: 'https://chat.whatsapp.com/Gc5zeFsJYdDKTqsQqEOTzf',
      external: true,
    },
    {
      label: 'Upgrade / Premium',
      icon: <Crown className="h-4 w-4" />,
      path: '/pricing',
      premium: true,
    },
    {
      label: 'Paramètres',
      icon: <Settings className="h-4 w-4" />,
      path: '/dashboard/settings',
    },
  ];
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-full min-h-screen bg-white border-r border-gray-200">
      <div className="flex items-center px-4 sm:px-6 py-3 sm:py-4">
        <span className="font-bold text-lg sm:text-xl">Mon espace</span>
      </div>
      
      <nav className="py-2 sm:py-4 px-2 sm:px-3 space-y-1">
        {navigationItems.map((item) => {
          if (item.external) {
            return (
              <a
                key={item.path}
                href={isReaderMode ? '#' : item.path}
                target={isReaderMode ? undefined : "_blank"}
                rel={isReaderMode ? undefined : "noopener noreferrer"}
                onClick={(e) => {
                  if (isReaderMode) {
                    e.preventDefault();
                  }
                }}
                className={cn(
                  "flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors",
                  'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive',
                  isReaderMode ? 'pointer-events-none opacity-70' : ''
                )}
              >
                {item.icon}
                <span className="ml-2 sm:ml-3 leading-tight">{item.label}</span>
                {isReaderMode && (
                  <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>
                )}
              </a>
            );
          }

          return (
            <Link
              key={item.path}
              to={isReaderMode ? '#' : item.path}
              onClick={(e) => {
                if (isReaderMode) {
                  e.preventDefault();
                }
              }}
              className={cn(
                "flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors",
                isActive(item.path)
                  ? 'bg-wedding-olive text-white shadow-sm'
                  : item.premium
                  ? 'text-wedding-olive font-semibold hover:bg-wedding-olive/20 border border-wedding-olive/30'
                  : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive',
                isReaderMode ? 'pointer-events-none opacity-70' : ''
              )}
            >
              {item.icon}
              <span className="ml-2 sm:ml-3 leading-tight">{item.label}</span>
              {item.premium && !isReaderMode && (
                <span className="ml-auto text-xs bg-wedding-olive text-white px-1.5 sm:px-2 py-0.5 rounded-full hidden sm:inline">
                  PREMIUM
                </span>
              )}
              {isReaderMode && item.path !== '/dashboard' && (
                <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto px-2 sm:px-3 py-2">
        <button 
          onClick={handleLogout} 
          className="flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 w-full justify-start"
          disabled={isReaderMode}
        >
          <LogOut className="h-4 w-4" />
          <span className="ml-2 sm:ml-3">Déconnexion</span>
        </button>
      </div>
      
      {isReaderMode && (
        <div className="px-2 sm:px-3 py-4 mt-auto border-t border-gray-200">
          <div className="bg-wedding-olive/10 p-3 rounded-md text-xs text-gray-700">
            Vous êtes en mode lecture seule. Les modifications ne sont pas possibles dans ce mode.
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSidebar;
