
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, ListChecks, Wallet2, Users, CircleDollarSign, Settings, Crown, BarChart, Heart } from 'lucide-react';
import { useDashboardContext } from '@/contexts/DashboardContext';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  isCollapsed: boolean;
}

const DashboardSidebar = ({ isCollapsed }: DashboardSidebarProps) => {
  const { activeItem, setActiveItem } = useDashboardContext();
  const location = useLocation();

  const handleItemClick = (name: string) => {
    setActiveItem(name);
  };

  const menuItems = [
    {
      name: 'Résumé du projet',
      icon: Home,
      href: '/',
    },
    {
      name: 'Planning',
      icon: Calendar,
      href: '/planning',
    },
    {
      name: 'Checklist',
      icon: ListChecks,
      href: '/tasks',
    },
    {
      name: 'Budget',
      icon: Wallet2,
      href: '/budget',
    },
    {
      name: 'Prestataires',
      icon: Users,
      href: '/prestataires',
    },
    {
      name: 'Liste de souhaits',
      icon: Heart,
      href: '/wishlist',
    },
    {
      name: 'Coordination Jour J',
      icon: BarChart,
      href: '/coordination',
    },
    {
      name: 'Calculateur de boissons',
      icon: CircleDollarSign,
      href: '/drinks',
    },
    {
      name: 'Assistant',
      icon: Settings,
      href: '/assistant',
    },
    {
      name: 'Journée mariage premium',
      icon: Crown,
      href: '/pricing',
      isExternal: true,
      badge: 'Premium',
      className: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'
    }
  ];

  return (
    <div className={cn(
      "flex flex-col w-full h-full bg-secondary border-r border-muted",
      isCollapsed ? "w-20" : "w-60"
    )}>
      <div className="flex flex-col flex-grow p-4">
        <nav className="flex flex-col space-y-1">
          {menuItems.map((item) => (
            <React.Fragment key={item.name}>
              {item.isExternal ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center justify-between py-2 px-3 rounded-md font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    activeItem === item.name ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    item.className
                  )}
                  onClick={() => handleItemClick(item.name)}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  {item.badge && !isCollapsed && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-md bg-secondary text-secondary-foreground">
                      {item.badge}
                    </span>
                  )}
                </a>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 py-2 px-3 rounded-md font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    activeItem === item.name ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                  onClick={() => handleItemClick(item.name)}
                >
                  <item.icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
      <div className="p-4">
        <Link to="/dashboard/settings" className="text-sm text-muted-foreground hover:text-accent-foreground">
          Paramètres du profil
        </Link>
      </div>
    </div>
  );
};

export default DashboardSidebar;
