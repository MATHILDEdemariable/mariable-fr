
import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import SEO from '@/components/SEO';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ProjectSummary from '@/components/dashboard/ProjectSummary';
import VendorTracking from '@/components/dashboard/VendorTracking';
import TasksList from '@/components/dashboard/TasksList';
import BudgetSummary from '@/components/dashboard/BudgetSummary';
import DocumentsSection from '@/components/dashboard/DocumentsSection';

const DashboardHome = () => {
  // Sample project data - will be replaced with real data from Supabase
  const projectData = {
    name: "Notre mariage",
    date: "12 juin 2025",
    guestCount: 150,
    budget: 25000,
    daysRemaining: 365, // Would be calculated from date
    progress: 35
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <ProjectSummary 
          projectName={projectData.name}
          weddingDate={projectData.date}
          guestCount={projectData.guestCount}
          budget={projectData.budget}
          daysRemaining={projectData.daysRemaining}
          progress={projectData.progress}
        />
      </div>
      
      <div className="md:col-span-2">
        <VendorTracking />
      </div>
      
      <TasksList />
      
      <BudgetSummary />
      
      <div className="md:col-span-2">
        <DocumentsSection />
      </div>
    </div>
  );
};

const PrestatairesPage = () => (
  <VendorTracking />
);

const BudgetPage = () => (
  <div className="space-y-6">
    <BudgetSummary />
    <p className="text-center py-6 bg-wedding-cream/20 rounded-lg">
      Détail complet du budget à venir...
    </p>
  </div>
);

const TasksPage = () => (
  <TasksList />
);

const DocumentsPage = () => (
  <DocumentsSection />
);

const SettingsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });
  
  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
  
      if (user) {
        setUserData({
          email: user.email || '',
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
        });
      } else {
        // FAKE USER POUR DEV
        setUserData({
          email: 'test@exemple.com',
          first_name: 'Marie',
          last_name: 'Dupont',
        });
      }
    };
  
    getUserData();
  }, []);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-serif mb-4">Informations personnelles</h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Email</p>
            <p>{userData.email}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Prénom</p>
            <p>{userData.first_name || '-'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Nom</p>
            <p>{userData.last_name || '-'}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-serif mb-4">Paramètres du compte</h2>
        <Button variant="destructive" onClick={handleLogout}>
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
        setIsLoading(false);
      }
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      } else if (session && event === 'SIGNED_IN') {
        setUser(session.user);
        setIsLoading(false);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-wedding-olive"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-wedding-cream/5">
      <SEO
        title="Dashboard | Mariable"
        description="Gérez votre projet de mariage dans votre espace personnel."
      />
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <DashboardSidebar />
          
          <main className="flex-1 space-y-6">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/prestataires" element={<PrestatairesPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
