
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Calendar,
  Shield,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
  const location = useLocation();

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'CRM Prestataires',
      href: '/admin/prestataires',
      icon: Users,
    },
    {
      title: 'Blog',
      href: '/admin/blog',
      icon: FileText,
    },
    {
      title: 'Formulaires',
      href: '/admin/form',
      icon: Settings,
    },
    {
      title: 'Réservations Jour-M',
      href: '/admin/reservations-jour-m',
      icon: Calendar,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-wedding-olive" />
            <h1 className="text-xl font-serif font-bold">Admin Panel</h1>
          </div>
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to="/" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Retour au site
            </Link>
          </Button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                isActive(item.href)
                  ? "bg-wedding-olive text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
