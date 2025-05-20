
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Euro,
  Users,
  Heart,
  Calendar,
  MessageCircle,
  Settings,
  Sparkles,
  Wine,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  to?: string;
  modalName?: string;
  active?: boolean;
  external?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  icon, 
  label, 
  to, 
  modalName,
  active = false, 
  external = false, 
  collapsed = false,
  onClick 
}) => {
  if (external && to) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
          active
            ? 'bg-wedding-olive/10 text-wedding-olive font-medium'
            : 'hover:bg-gray-100'
        }`}
      >
        <span className="mr-3">{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
      </a>
    );
  }
  
  if (to) {
    return (
      <Link
        to={to}
        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
          active
            ? 'bg-wedding-olive/10 text-wedding-olive font-medium'
            : 'hover:bg-gray-100'
        }`}
      >
        <span className="mr-3 flex-shrink-0">{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>
    );
  }
  
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center px-3 py-2 rounded-lg transition-colors text-left ${
        active
          ? 'bg-wedding-olive/10 text-wedding-olive font-medium'
          : 'hover:bg-gray-100'
      }`}
    >
      <span className="mr-3 flex-shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
};

interface DashboardSidebarProps {
  onMenuItemClick?: (modalName: string) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ onMenuItemClick }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/dashboard/';
    }
    return currentPath.startsWith(path);
  };

  const handleMenuItemClick = (modalName: string) => {
    if (onMenuItemClick) {
      onMenuItemClick(modalName);
    }
  };

  return (
    <div className="h-full bg-white border-r w-full relative">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className={cn("text-xl font-serif text-wedding-olive", collapsed ? "hidden" : "block")}>
            Tableau de Bord
          </h2>
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="p-1 rounded-md hover:bg-gray-100"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>
        
        <nav className="space-y-2">
          {/* 1. Tableau de bord principal */}
          <MenuItem
            icon={<LayoutDashboard size={20} />}
            label="Tableau de bord"
            to="/dashboard"
            active={isActive('/dashboard')}
            collapsed={collapsed}
          />
          
          {/* 2. Assistant virtuel */}
          <MenuItem
            icon={<Sparkles size={20} />}
            label="Assistant virtuel"
            to="/assistant-v2"
            active={isActive('/assistant-v2')}
            collapsed={collapsed}
          />
          
          {/* 3. Planning personnalisé */}
          <MenuItem
            icon={<Calendar size={20} />}
            label="Planning personnalisé"
            to="/planning-personnalise"
            active={isActive('/planning-personnalise')}
            collapsed={collapsed}
          />
          
          {/* 4. Tâches - via modale */}
          <MenuItem
            icon={<CheckSquare size={20} />}
            label="Tâches"
            modalName="tasks"
            active={isActive('/dashboard/tasks')}
            collapsed={collapsed}
            onClick={() => handleMenuItemClick('tasks')}
          />
          
          {/* 5. Budget - via modale */}
          <MenuItem
            icon={<Euro size={20} />}
            label="Budget"
            modalName="budget"
            active={isActive('/dashboard/budget')}
            collapsed={collapsed}
            onClick={() => handleMenuItemClick('budget')}
          />
          
          {/* 6. Calculatrice de boissons - via modale */}
          <MenuItem
            icon={<Wine size={20} />}
            label="Calculatrice de boissons"
            modalName="drinks"
            active={isActive('/dashboard/drinks')}
            collapsed={collapsed}
            onClick={() => handleMenuItemClick('drinks')}
          />
          
          {/* 7. Coordination */}
          <MenuItem
            icon={<Calendar size={20} />}
            label="Coordination Jour J"
            to="/dashboard/coordination"
            active={isActive('/dashboard/coordination')}
            collapsed={collapsed}
          />
          
          {/* 8. Prestataires - via modale */}
          <MenuItem
            icon={<Users size={20} />}
            label="Prestataires"
            modalName="prestataires"
            active={isActive('/dashboard/prestataires')}
            collapsed={collapsed}
            onClick={() => handleMenuItemClick('prestataires')}
          />
          
          {/* 9. Wishlist */}
          <MenuItem
            icon={<Heart size={20} />}
            label="Wishlist prestataires"
            to="/dashboard/wishlist"
            active={isActive('/dashboard/wishlist')}
            collapsed={collapsed}
          />
          
          {/* 10. Conseils */}
          <MenuItem
            icon={<MessageCircle size={20} />}
            label="Conseils personnalisés"
            to="/assistant-v2"
            active={isActive('/assistant-v2')}
            collapsed={collapsed}
          />
          
          {/* 11. Paramètres - via modale */}
          <MenuItem
            icon={<Settings size={20} />}
            label="Paramètres"
            modalName="settings"
            active={isActive('/dashboard/settings')}
            collapsed={collapsed}
            onClick={() => handleMenuItemClick('settings')}
          />
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;
