
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Calculator, 
  Store, 
  Heart, 
  Settings,
  LogOut,
  Wine,
  MessageCircleQuestion,
  MessageSquare,
  Users,
  Lightbulb,
  ChevronDown,
  Coins
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardSidebarProps {
  isReaderMode?: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isReaderMode = false }) => {
  const location = useLocation();
  
  // Menu déroulant Tableau de bord
  const dashboardItems = [
    {
      label: 'Tableau de bord',
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: '/dashboard',
    },
    {
      label: 'Check-list',
      icon: <CheckSquare className="h-4 w-4" />,
      path: '/dashboard/tasks',
    },
    {
      label: 'Initiation Mariage',
      icon: <Calendar className="h-4 w-4" />,
      path: '/dashboard/planning',
    },
  ];

  // Menu déroulant Calculatrice
  const calculatriceItems = [
    {
      label: 'Calculatrice Budget',
      icon: <Coins className="h-4 w-4" />,
      path: '/dashboard/budget',
    },
    {
      label: 'Calculatrice Boisson',
      icon: <Wine className="h-4 w-4" />,
      path: '/dashboard/drinks',
    },
  ];

  // Menu déroulant Prestataires
  const prestatairesItems = [
    {
      label: 'Sélection Mariable',
      icon: <Store className="h-4 w-4" />,
      path: '/selection',
    },
    {
      label: 'Suivi',
      icon: <Settings className="h-4 w-4" />,
      path: '/dashboard/prestataires',
    },
    {
      label: 'Historique Message',
      icon: <MessageSquare className="h-4 w-4" />,
      path: '/dashboard/message-history',
    },
    {
      label: 'Wishlist',
      icon: <Heart className="h-4 w-4" />,
      path: '/dashboard/wishlist',
    },
  ];

  // Menu déroulant Jour M
  const jourMItems = [
    {
      label: 'Jour M',
      icon: <Calendar className="h-4 w-4" />,
      path: '/mon-jour-m',
    },
    {
      label: 'Coordinateurs',
      icon: <Users className="h-4 w-4" />,
      path: '/coordinateurs-mariage',
    },
    {
      label: 'Conseils Jour M',
      icon: <Lightbulb className="h-4 w-4" />,
      path: '/dashboard/coordination',
    },
  ];

  // Menu déroulant Besoin d'aide ?
  const helpItems = [
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
      label: 'Communauté WhatsApp',
      icon: <Users className="h-4 w-4" />,
      path: 'https://chat.whatsapp.com/Gc5zeFsJYdDKTqsQqEOTzf',
      external: true,
    },
    {
      label: 'Mode d\'emploi',
      icon: <MessageCircleQuestion className="h-4 w-4" />,
      path: '/dashboard/help',
    },
  ];

  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Redirection vers la page d'accueil après déconnexion
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // En cas d'erreur, rediriger quand même vers l'accueil
      window.location.href = '/';
    }
  };
  
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    if (path === '/mon-jour-m') {
      return location.pathname.startsWith('/mon-jour-m');
    }
    return location.pathname.startsWith(path);
  };

  // Vérifier si le menu Tableau de bord doit être actif
  const isDashboardActive = () => {
    return dashboardItems.some(item => isActive(item.path));
  };

  // Vérifier si le menu Calculatrice doit être actif
  const isCalculatriceActive = () => {
    return calculatriceItems.some(item => isActive(item.path));
  };

  // Vérifier si le menu Prestataires doit être actif
  const isPrestatairesActive = () => {
    return prestatairesItems.some(item => isActive(item.path));
  };

  // Vérifier si le menu Jour M doit être actif
  const isJourMActive = () => {
    return jourMItems.some(item => isActive(item.path));
  };

  // Vérifier si le menu Aide doit être actif
  const isHelpActive = () => {
    return helpItems.some(item => !item.external && isActive(item.path));
  };

  return (
    <div className="h-full min-h-screen bg-white border-r border-gray-200">
      <div className="flex items-center px-4 sm:px-6 py-3 sm:py-4">
        <span className="font-bold text-lg sm:text-xl">Mon espace</span>
      </div>
      
      <nav className="py-2 sm:py-4 px-2 sm:px-3 space-y-1">
        {/* Menu déroulant Tableau de bord */}
        <DropdownMenu>
          <DropdownMenuTrigger 
            className={cn(
              "flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors w-full justify-start",
              isDashboardActive()
                ? 'bg-wedding-olive text-white shadow-sm'
                : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive',
              isReaderMode ? 'pointer-events-none opacity-70' : ''
            )}
            disabled={isReaderMode}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="ml-2 sm:ml-3 leading-tight">Tableau de bord</span>
            <ChevronDown className="ml-auto h-4 w-4" />
            {isReaderMode && (
              <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200" align="end">
            {dashboardItems.map((subItem) => (
              <DropdownMenuItem key={subItem.path} asChild>
                <Link
                  to={isReaderMode ? '#' : subItem.path}
                  onClick={(e) => {
                    if (isReaderMode) {
                      e.preventDefault();
                    }
                  }}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm w-full",
                    isActive(subItem.path)
                      ? 'bg-wedding-olive/10 text-wedding-olive font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {subItem.icon}
                  <span className="ml-2">{subItem.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menu déroulant Calculatrice */}
        <DropdownMenu>
          <DropdownMenuTrigger 
            className={cn(
              "flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors w-full justify-start",
              isCalculatriceActive()
                ? 'bg-wedding-olive text-white shadow-sm'
                : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive',
              isReaderMode ? 'pointer-events-none opacity-70' : ''
            )}
            disabled={isReaderMode}
          >
            <Calculator className="h-4 w-4" />
            <span className="ml-2 sm:ml-3 leading-tight">Calculatrice</span>
            <ChevronDown className="ml-auto h-4 w-4" />
            {isReaderMode && (
              <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200" align="end">
            {calculatriceItems.map((subItem) => (
              <DropdownMenuItem key={subItem.path} asChild>
                <Link
                  to={isReaderMode ? '#' : subItem.path}
                  onClick={(e) => {
                    if (isReaderMode) {
                      e.preventDefault();
                    }
                  }}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm w-full",
                    isActive(subItem.path)
                      ? 'bg-wedding-olive/10 text-wedding-olive font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {subItem.icon}
                  <span className="ml-2">{subItem.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menu déroulant Prestataires */}
        <DropdownMenu>
          <DropdownMenuTrigger 
            className={cn(
              "flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors w-full justify-start",
              isPrestatairesActive()
                ? 'bg-wedding-olive text-white shadow-sm'
                : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive',
              isReaderMode ? 'pointer-events-none opacity-70' : ''
            )}
            disabled={isReaderMode}
          >
            <Store className="h-4 w-4" />
            <span className="ml-2 sm:ml-3 leading-tight">Prestataires</span>
            <ChevronDown className="ml-auto h-4 w-4" />
            {isReaderMode && (
              <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200" align="end">
            {prestatairesItems.map((subItem) => (
              <DropdownMenuItem key={subItem.path} asChild>
                <Link
                  to={isReaderMode ? '#' : subItem.path}
                  onClick={(e) => {
                    if (isReaderMode) {
                      e.preventDefault();
                    }
                  }}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm w-full",
                    isActive(subItem.path)
                      ? 'bg-wedding-olive/10 text-wedding-olive font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {subItem.icon}
                  <span className="ml-2">{subItem.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menu déroulant Besoin d'aide ? */}
        <DropdownMenu>
          <DropdownMenuTrigger 
            className={cn(
              "flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors w-full justify-start",
              isHelpActive()
                ? 'bg-wedding-olive text-white shadow-sm'
                : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive',
              isReaderMode ? 'pointer-events-none opacity-70' : ''
            )}
            disabled={isReaderMode}
          >
            <MessageCircleQuestion className="h-4 w-4" />
            <span className="ml-2 sm:ml-3 leading-tight">Besoin d'aide ?</span>
            <ChevronDown className="ml-auto h-4 w-4" />
            {isReaderMode && (
              <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200" align="end">
            {helpItems.map((subItem) => (
              <DropdownMenuItem key={subItem.path} asChild>
                {subItem.external ? (
                  <a
                    href={isReaderMode ? '#' : subItem.path}
                    target={isReaderMode ? undefined : "_blank"}
                    rel={isReaderMode ? undefined : "noopener noreferrer"}
                    onClick={(e) => {
                      if (isReaderMode) {
                        e.preventDefault();
                      }
                    }}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm w-full",
                      'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {subItem.icon}
                    <span className="ml-2">{subItem.label}</span>
                  </a>
                ) : (
                  <Link
                    to={isReaderMode ? '#' : subItem.path}
                    onClick={(e) => {
                      if (isReaderMode) {
                        e.preventDefault();
                      }
                    }}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm w-full",
                      isActive(subItem.path)
                        ? 'bg-wedding-olive/10 text-wedding-olive font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {subItem.icon}
                    <span className="ml-2">{subItem.label}</span>
                  </Link>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>


        {/* Menu déroulant Jour M */}
        <DropdownMenu>
          <DropdownMenuTrigger 
            className={cn(
              "flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors w-full justify-start",
              isJourMActive()
                ? 'bg-wedding-olive text-white shadow-sm'
                : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive',
              isReaderMode ? 'pointer-events-none opacity-70' : ''
            )}
            disabled={isReaderMode}
          >
            <Calendar className="h-4 w-4" />
            <span className="ml-2 sm:ml-3 leading-tight">Jour M</span>
            <ChevronDown className="ml-auto h-4 w-4" />
            {isReaderMode && (
              <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200" align="end">
            {jourMItems.map((subItem) => (
              <DropdownMenuItem key={subItem.path} asChild>
                <Link
                  to={isReaderMode ? '#' : subItem.path}
                  onClick={(e) => {
                    if (isReaderMode) {
                      e.preventDefault();
                    }
                  }}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm w-full",
                    isActive(subItem.path)
                      ? 'bg-wedding-olive/10 text-wedding-olive font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {subItem.icon}
                  <span className="ml-2">{subItem.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Paramètres */}
        <Link
          to={isReaderMode ? '#' : '/dashboard/settings'}
          onClick={(e) => {
            if (isReaderMode) {
              e.preventDefault();
            }
          }}
          className={cn(
            "flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors",
            isActive('/dashboard/settings')
              ? 'bg-wedding-olive text-white shadow-sm'
              : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive',
            isReaderMode ? 'pointer-events-none opacity-70' : ''
          )}
        >
          <Settings className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">Paramètres</span>
          {isReaderMode && (
            <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>
          )}
        </Link>

        {/* Mission Mariage */}
        <Link
          to={isReaderMode ? '#' : '/dashboard/project-management'}
          onClick={(e) => {
            if (isReaderMode) {
              e.preventDefault();
            }
          }}
          className={cn(
            "flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors",
            isActive('/dashboard/project-management')
              ? 'bg-wedding-olive text-white shadow-sm'
              : 'text-blue-600 font-semibold hover:bg-blue-50 border border-blue-200',
            isReaderMode ? 'pointer-events-none opacity-70' : ''
          )}
        >
          <Calendar className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">Mission Mariage</span>
          {!isReaderMode && (
            <span className="ml-auto text-xs bg-blue-600 text-white px-1.5 sm:px-2 py-0.5 rounded-full hidden sm:inline">
              BETA
            </span>
          )}
          {isReaderMode && (
            <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>
          )}
        </Link>
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
