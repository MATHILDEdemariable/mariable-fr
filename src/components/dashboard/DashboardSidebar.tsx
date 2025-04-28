
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  CheckSquare, 
  FileText,
  Settings, 
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, isActive }: SidebarItemProps) => {
  return (
    <Link 
      to={href} 
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
        isActive 
          ? "bg-wedding-olive text-white" 
          : "hover:bg-wedding-olive/10"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

const DashboardSidebar = () => {
  const location = useLocation();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Accueil du projet", href: "/dashboard" },
    { icon: Users, label: "Prestataires", href: "/dashboard/prestataires" },
    { icon: BarChart3, label: "Budget", href: "/dashboard/budget" },
    { icon: CheckSquare, label: "Tâches & To-Do", href: "/dashboard/tasks" },
    { icon: FileText, label: "Documents & Devis", href: "/dashboard/documents" },
    { icon: Settings, label: "Paramètres", href: "/dashboard/settings" }
  ];
  
  return (
    <div className="min-w-[240px] border-r p-4 h-full bg-wedding-cream/5">
      <div className="space-y-4">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold">Mon mariage</h2>
          <p className="text-sm text-muted-foreground">Tableau de bord</p>
        </div>
        
        <div className="space-y-1">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={location.pathname === item.href}
            />
          ))}
        </div>
        
        <div className="pt-4 border-t mt-6">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
