
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  FileText, 
  BarChart3,
  Home,
  Settings,
  Building,
  Heart,
  Globe
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { logout } = useAdminAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: Home,
      current: location.pathname === '/admin/dashboard'
    },
    {
      name: 'Réservations Jour-M',
      href: '/admin/reservations-jour-m',
      icon: Calendar,
      current: location.pathname === '/admin/reservations-jour-m'
    },
    {
      name: 'Inscriptions Utilisateurs',
      href: '/admin/users',
      icon: Users,
      current: location.pathname === '/admin/users'
    },
    {
      name: 'Paiements Accompagnement',
      href: '/admin/paiements',
      icon: Calendar,
      current: location.pathname === '/admin/paiements'
    },
    {
      name: 'CRM Prestataires',
      href: '/admin/prestataires',
      icon: Users,
      current: location.pathname === '/admin/prestataires'
    },
    {
      name: 'Inscriptions Professionnels',
      href: '/admin/professional-registrations',
      icon: Building,
      current: location.pathname === '/admin/professional-registrations'
    },
    {
      name: 'Jeunes Mariés',
      href: '/admin/jeunes-maries',
      icon: Heart,
      current: location.pathname === '/admin/jeunes-maries'
    },
    {
      name: 'Blog',
      href: '/admin/blog',
      icon: FileText,
      current: location.pathname === '/admin/blog'
    },
    {
      name: 'Tests & Diagnostics',
      href: '/admin/system-check',
      icon: Settings,
      current: location.pathname === '/admin/system-check'
    },
    {
      name: 'Pages Personnalisées',
      href: '/admin/custom-pages',
      icon: Globe,
      current: location.pathname === '/admin/custom-pages'
    }
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 px-4 bg-wedding-olive">
            <h1 className="text-xl font-serif text-white">
              Admin Panel
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    item.current
                      ? 'bg-wedding-olive text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        <main className="py-8 px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
