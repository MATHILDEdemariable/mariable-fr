
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  ListTodo,
  Clock,
  Euro,
  FileText,
  Settings,
  Users,
  Wine,
  Heart
} from 'lucide-react';

const navItems = [
  {
    name: 'Tableau de bord',
    path: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    name: 'Prestataires',
    path: '/dashboard/prestataires',
    icon: <Users className="h-5 w-5" />
  },
  {
    name: 'Ma wishlist',
    path: '/dashboard/wishlist',
    icon: <Heart className="h-5 w-5" />
  },
  {
    name: 'Budget',
    path: '/dashboard/budget',
    icon: <Euro className="h-5 w-5" />
  },
  {
    name: 'Tâches',
    path: '/dashboard/tasks',
    icon: <ListTodo className="h-5 w-5" />
  },
  {
    name: 'Coordination J-J',
    path: '/dashboard/coordination',
    icon: <Clock className="h-5 w-5" />
  },
  {
    name: 'Calculateur boissons',
    path: '/dashboard/drinks',
    icon: <Wine className="h-5 w-5" />
  },
  {
    name: 'Documents',
    path: '/dashboard/documents',
    icon: <FileText className="h-5 w-5" />
  },
  {
    name: 'Paramètres',
    path: '/dashboard/settings',
    icon: <Settings className="h-5 w-5" />
  }
];

const DashboardSidebar = () => {
  return (
    <aside className="w-full lg:w-64 lg:min-w-64 bg-white rounded-lg shadow p-4 lg:sticky lg:top-4 lg:self-start">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink 
            to={item.path} 
            key={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-wedding-cream/20 
              ${isActive ? 'bg-wedding-olive text-white hover:bg-wedding-olive/90' : 'text-wedding-black'}
              `
            }
          >
            {item.icon}
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
