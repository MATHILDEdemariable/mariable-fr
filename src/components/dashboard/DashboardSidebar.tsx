
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  ListTodo,
  Clock,
  Euro,
  Settings,
  Users,
  Wine,
  Heart,
  MessageCircle
} from 'lucide-react';

// Custom WhatsApp icon component
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
    <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
    <path d="M9.5 13.5c.5 1.5 2.5 2 3.5 0" />
  </svg>
);

const navItems = [
  {
    name: 'Conseils Personnalisés',
    path: 'https://chat.whatsapp.com/In5xf3ZMJNvJkhy4F9g5C5',
    icon: <WhatsAppIcon />,
    external: true
  },
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
          item.external ? (
            <a 
              href={item.path} 
              key={item.path}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-wedding-cream/20 text-wedding-black"
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </a>
          ) : (
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
          )
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
