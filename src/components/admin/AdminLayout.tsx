
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  Home,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      icon: Calendar,
      label: 'Réservations Jour-M',
      path: '/admin/reservations-jour-m',
    },
    {
      icon: Users,
      label: 'CRM Prestataires',
      path: '/admin/prestataires',
    },
    {
      icon: FileText,
      label: 'Blog',
      path: '/admin/blog',
    },
    {
      icon: Settings,
      label: 'Formulaires',
      path: '/admin/form',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white shadow-md"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/c5ca128d-6c6f-4f09-a990-f6f16d47e231.png" 
                alt="Mariable Logo" 
                className="h-8 w-auto" 
              />
              <div>
                <h2 className="text-lg font-semibold text-wedding-black">Admin</h2>
                <p className="text-sm text-gray-500">Tableau de bord</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActive 
                          ? 'bg-wedding-olive text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-wedding-olive transition-colors"
            >
              <Home className="h-4 w-4" />
              Retour au site
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
