
import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock, Euro, Layout, Plus, Users } from 'lucide-react';
import Header from '@/components/Header';
import SEO from '@/components/SEO';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ProjectSummary from '@/components/dashboard/ProjectSummary';
import VendorTracking from '@/components/dashboard/VendorTracking';
import TasksList from '@/components/dashboard/TasksList';
import BudgetSummary from '@/components/dashboard/BudgetSummary';
import DocumentsSection from '@/components/dashboard/DocumentsSection';
import CreateProjectDialog from '@/components/dashboard/CreateProjectDialog';

// Types for our project data
interface Project {
  id: string;
  title: string;
  wedding_date: string | null;
  location: string | null;
  guest_count: number | null;
  budget: number | null;
  created_at: string;
}

const DashboardHome = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Calculate days remaining until wedding
  const calculateDaysRemaining = (weddingDate: string | null) => {
    if (!weddingDate) return null;
    
    const today = new Date();
    const wedding = new Date(weddingDate);
    const diffTime = wedding.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // Fetch user's project
  const fetchUserProject = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (projects && projects.length > 0) {
        setProject(projects[0]);
      } else {
        // No project found, show dialog to create one
        setCreateDialogOpen(true);
      }
    } catch (error: any) {
      console.error('Error fetching project:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos données de projet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load project data on component mount
  useEffect(() => {
    fetchUserProject();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-wedding-olive"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <>
        <div className="bg-wedding-cream/20 p-6 rounded-lg text-center">
          <h2 className="text-xl font-serif mb-4">Bienvenue sur votre espace mariage</h2>
          <p className="mb-6">Commencez par créer votre projet de mariage pour accéder à toutes les fonctionnalités.</p>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-wedding-olive hover:bg-wedding-olive/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Créer mon projet de mariage
          </Button>
        </div>
        <CreateProjectDialog 
          open={createDialogOpen} 
          onOpenChange={setCreateDialogOpen}
          onProjectCreated={fetchUserProject}
        />
      </>
    );
  }

  // Calculate project data
  const projectData = {
    name: project.title,
    date: project.wedding_date ? new Date(project.wedding_date).toLocaleDateString('fr-FR', {
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    }) : "Non définie",
    guestCount: project.guest_count || 0,
    budget: project.budget || 0,
    location: project.location || "Non défini",
    daysRemaining: calculateDaysRemaining(project.wedding_date),
    progress: 35 // Default progress value, would be calculated based on tasks completion
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <ProjectSummary 
          projectName={projectData.name}
          weddingDate={projectData.date}
          guestCount={projectData.guestCount}
          budget={projectData.budget}
          daysRemaining={projectData.daysRemaining || 0}
          progress={projectData.progress}
        />
      </div>
      
      <div className="md:col-span-2">
        <VendorTracking projectId={project.id} />
      </div>
      
      <TasksList />
      
      <BudgetSummary />
      
      <div className="md:col-span-2">
        <DocumentsSection />
      </div>
    </div>
  );
};

const PrestatairesPage = () => {
  const [project, setProject] = useState<Project | null>(null);
  
  // Fetch user's project
  const fetchUserProject = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (projects && projects.length > 0) {
        setProject(projects[0]);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  useEffect(() => {
    fetchUserProject();
  }, []);

  return (
    <VendorTracking projectId={project?.id} />
  );
};

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
