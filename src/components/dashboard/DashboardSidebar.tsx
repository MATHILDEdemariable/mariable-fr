
import React from 'react';
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
  Palette,
  Wine
} from 'lucide-react';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  external?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, to, active = false, external = false }) => {
  if (external) {
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
        <span>{label}</span>
      </a>
    );
  }
  
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-wedding-olive/10 text-wedding-olive font-medium'
          : 'hover:bg-gray-100'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/dashboard/';
    }
    return currentPath.startsWith(path);
  };

  return (
    <div className="h-full bg-white border-r w-full">
      <div className="p-4">
        <h2 className="text-xl font-serif text-wedding-olive mb-6">Tableau de Bord</h2>
        
        <nav className="space-y-2">
          {/* Tableau de bord principal */}
          <MenuItem
            icon={<LayoutDashboard size={20} />}
            label="Tableau de bord"
            to="/dashboard"
            active={isActive('/dashboard')}
          />
          
          {/* Tâches */}
          <MenuItem
            icon={<CheckSquare size={20} />}
            label="Tâches"
            to="/dashboard/tasks"
            active={isActive('/dashboard/tasks')}
          />
          
          {/* Budget */}
          <MenuItem
            icon={<Euro size={20} />}
            label="Budget"
            to="/dashboard/budget"
            active={isActive('/dashboard/budget')}
          />
          
          {/* Prestataires */}
          <MenuItem
            icon={<Users size={20} />}
            label="Prestataires"
            to="/dashboard/prestataires"
            active={isActive('/dashboard/prestataires')}
          />
          
          {/* Wishlist */}
          <MenuItem
            icon={<Heart size={20} />}
            label="Wishlist prestataires"
            to="/dashboard/wishlist"
            active={isActive('/dashboard/wishlist')}
          />
          
          {/* Coordination */}
          <MenuItem
            icon={<Calendar size={20} />}
            label="Coordination Jour J"
            to="/dashboard/coordination"
            active={isActive('/dashboard/coordination')}
          />
          
          {/* NEW: Calculatrice de boissons */}
          <MenuItem
            icon={<Wine size={20} />}
            label="Calculatrice de boissons"
            to="/dashboard/drinks"
            active={isActive('/dashboard/drinks')}
          />
          
          {/* Assistant virtuel - Updated to go directly to the "Conseils" tab */}
          <MenuItem
            icon={<Sparkles size={20} />}
            label="Assistant virtuel"
            to="/assistant-v2?tab=conseils"
            active={isActive('/assistant-v2')}
          />
          
          {/* Style de mariage */}
          <MenuItem
            icon={<Palette size={20} />}
            label="Style de mariage"
            to="/test-formulaire"
            active={isActive('/test-formulaire')}
          />
          
          {/* Conseils */}
          <MenuItem
            icon={<MessageCircle size={20} />}
            label="Conseils personnalisés"
            to="https://chat.whatsapp.com/In5xf3ZMJNvJkhy4F9g5C5"
            external={true}
          />
          
          {/* Paramètres */}
          <MenuItem
            icon={<Settings size={20} />}
            label="Paramètres"
            to="/dashboard/settings"
            active={isActive('/dashboard/settings')}
          />
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;
