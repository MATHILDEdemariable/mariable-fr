
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Calendar, 
  CheckSquare, 
  DollarSign, 
  Users,
  Heart,
  CalendarDays,
  GlassWater,
  MessageSquare,
  Settings,
  Sparkles
} from 'lucide-react';

interface DashboardSidebarProps {
  isReaderMode?: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isReaderMode = false }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: Home },
    { name: 'Mon Jour-M', href: '/dashboard/mon-jour-m', icon: Sparkles },
    { name: 'Planning', href: '/dashboard/planning', icon: Calendar },
    { name: 'Tâches', href: '/dashboard/tasks', icon: CheckSquare },
    { name: 'Budget', href: '/dashboard/budget', icon: DollarSign },
    { name: 'Prestataires', href: '/dashboard/prestataires', icon: Users },
    { name: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
    { name: 'Coordination', href: '/dashboard/coordination', icon: CalendarDays },
    { name: 'Calculette Boissons', href: '/dashboard/drinks', icon: GlassWater },
    { name: 'Assistant', href: '/dashboard/assistant', icon: MessageSquare },
  ];

  if (!isReaderMode) {
    navigation.push({ name: 'Paramètres', href: '/dashboard/settings', icon: Settings });
  }

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-serif text-wedding-black">Mariable</span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-wedding-olive text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {isReaderMode && (
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Mode lecture uniquement
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardSidebar;
