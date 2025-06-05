
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
  Users
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
      path: 'https://chatgpt.com/g/g-67b5d482dd208191ae458763db0bb08c-mariable',
      external: true,
    },
    {
      label: 'Accès à la communauté WhatsApp',
      icon: <Users className="h-4 w-4" />,
      path: 'https://chat.whatsapp.com/Gc5zeFsJYdDKTqsQqEOTzf',
      external: true,
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
      <div className="flex items-center px-6 py-4">
        <span className="font-bold text-xl">Mon espace</span>
      </div>
      
      <nav className="py-4 px-3 space-y-1">
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
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                  'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive',
                  isReaderMode ? 'pointer-events-none opacity-70' : ''
                )}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
                {isReaderMode && (
                  <span className="ml-auto text-xs text-gray-400">(Lecture seule)</span>
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
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                isActive(item.path)
                  ? 'bg-wedding-olive text-white shadow-sm'
                  : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive',
                isReaderMode ? 'pointer-events-none opacity-70' : ''
              )}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
              {isReaderMode && item.path !== '/dashboard' && (
                <span className="ml-auto text-xs text-gray-400">(Lecture seule)</span>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto px-3 py-2">
        <button 
          onClick={handleLogout} 
          className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 w-full justify-start"
          disabled={isReaderMode}
        >
          <LogOut className="h-4 w-4" />
          <span className="ml-3">Déconnexion</span>
        </button>
      </div>
      
      {isReaderMode && (
        <div className="px-3 py-4 mt-auto border-t border-gray-200">
          <div className="bg-wedding-olive/10 p-3 rounded-md text-xs text-gray-700">
            Vous êtes en mode lecture seule. Les modifications ne sont pas possibles dans ce mode.
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSidebar;
