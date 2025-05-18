import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock, Euro, Layout, Plus, Users, Download, CheckCircle, HelpCircle } from 'lucide-react';
import Header from '@/components/Header';
import SEO from '@/components/SEO';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ProjectSummary from '@/components/dashboard/ProjectSummary';
import VendorTracking from '@/components/dashboard/VendorTracking';
import TasksList from '@/components/dashboard/TasksList';
import BudgetSummary from '@/components/dashboard/BudgetSummary';
import DocumentsSection from '@/components/dashboard/DocumentsSection';
import CreateProjectDialog from '@/components/dashboard/CreateProjectDialog';
import CoordinationPage from './CoordinationPage';
import DrinksCalculatorWidget from '@/components/dashboard/DrinksCalculatorWidget';
import { exportDashboardToPDF } from '@/services/pdfExportService';
import { useIsMobile } from '@/hooks/use-mobile';

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

// Component to show top priority tasks
interface TopTasksProps {
  projectId?: string;
}

const TopTasks: React.FC<TopTasksProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopTasks = async () => {
      try {
        setIsLoading(true);
        
        // Vérifier si l'utilisateur est connecté
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Récupérer les 3 tâches prioritaires non complétées
          const { data: tasksData, error } = await supabase
            .from('todos_planification')
            .select('*')
            .eq('user_id', user.id)
            .eq('completed', false)
            .order('priority', { ascending: false })
            .order('position', { ascending: true })
            .limit(3);
            
          if (error) throw error;
          
          setTasks(tasksData || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des tâches prioritaires:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopTasks();
  }, []);

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos_planification')
        .update({ completed: !completed })
        .eq('id', taskId);
        
      if (error) throw error;
      
      // Update the local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, completed: !completed } : task
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tâches prioritaires</h3>
        <Button 
          variant="ghost" 
          className="text-wedding-olive"
          onClick={() => navigate('/dashboard/tasks')}
        >
          Voir tout
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-wedding-olive"></div>
        </div>
      ) : tasks.length > 0 ? (
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  className="h-6 w-6 p-0 rounded-full"
                  onClick={() => handleToggleComplete(task.id, task.completed)}
                >
                  <div className={`h-5 w-5 rounded-full border ${task.completed ? 'bg-wedding-olive border-wedding-olive' : 'border-gray-300'} flex items-center justify-center`}>
                    {task.completed && <CheckCircle className="h-4 w-4 text-white" />}
                  </div>
                </Button>
                <span className={`${task.completed ? 'line-through text-gray-400' : ''}`}>
                  {task.label}
                </span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                task.priority === 'haute' ? 'bg-red-100 text-red-800' :
                task.priority === 'moyenne' ? 'bg-amber-100 text-amber-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {task.priority === 'haute' ? 'Haute' :
                 task.priority === 'moyenne' ? 'Moyenne' : 'Basse'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-4 text-muted-foreground">
          Aucune tâche prioritaire pour le moment.
        </p>
      )}
    </div>
  );
};

// Component for FAQ/Help section
const FAQSection: React.FC = () => {
  const navigate = useNavigate();
  
  const commonQuestions = [
    {
      question: "Comment ajouter un prestataire à mon suivi ?",
      answer: "Allez dans la section 'Prestataires' et cliquez sur 'Ajouter un prestataire'."
    },
    {
      question: "Comment modifier mon budget ?",
      answer: "Dans la section 'Budget', vous pouvez ajuster les montants alloués à chaque catégorie."
    },
    {
      question: "Comment exporter mon planning ?",
      answer: "Utilisez le bouton 'Exporter en PDF' en haut du tableau de bord."
    }
  ];
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">FAQ & Aide</h3>
      <div className="space-y-3">
        {commonQuestions.map((item, index) => (
          <div key={index} className="bg-white p-3 rounded-md shadow-sm">
            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-wedding-olive" />
                  {item.question}
                </span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" width="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <p className="text-sm text-neutral-600 mt-3 group-open:animate-fadeIn">
                {item.answer}
              </p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardHome = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Fonction pour exporter le dashboard en PDF
  const handleExportPDF = async () => {
    toast({
      title: "Export PDF en cours",
      description: "Préparation de votre document...",
    });
    
    // Attendre que le DOM soit complètement chargé
    setTimeout(async () => {
      const success = await exportDashboardToPDF();
      
      if (success) {
        toast({
          title: "Export réussi",
          description: "Votre dashboard a été exporté en PDF",
        });
      } else {
        toast({
          title: "Erreur d'export",
          description: "Une erreur s'est produite lors de l'export en PDF",
          variant: "destructive"
        });
      }
    }, 500);
  };

  // Calculer les jours restants jusqu'au mariage
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

  // Charger les données du localStorage
  const savedProject = localStorage.getItem('weddingProject');
  let localWeddingDate = "";
  let localGuestCount = 0;
  let localBudget = 0;
  
  if (savedProject) {
    const parsedProject = JSON.parse(savedProject);
    localWeddingDate = parsedProject.weddingDate || "";
    localGuestCount = parsedProject.guestCount || 0;
    localBudget = parsedProject.budget || 0;
  }

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
    date: localWeddingDate || project.wedding_date || "Non définie",
    guestCount: localGuestCount || project.guest_count || 0,
    budget: localBudget || project.budget || 0,
    location: project.location || "Non défini",
    daysRemaining: calculateDaysRemaining(localWeddingDate || project.wedding_date),
    progress: 35 // Default progress value, would be calculated based on tasks completion
  };

  return (
    <div id="dashboard-content" className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <h1 className="text-2xl font-serif">Tableau de bord</h1>
        <Button
          variant="outline"
          className="bg-wedding-olive/10 hover:bg-wedding-olive/20 text-wedding-olive w-full sm:w-auto"
          onClick={handleExportPDF}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter en PDF
        </Button>
      </div>
      
      {/* Notre mariage section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <ProjectSummary 
            projectName={projectData.name}
            weddingDate={typeof projectData.date === 'string' ? projectData.date : undefined}
            guestCount={projectData.guestCount}
            budget={projectData.budget}
            daysRemaining={projectData.daysRemaining || 0}
            progress={projectData.progress}
          />
        </div>
      </div>
      
      {/* Tasks section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 bg-white p-5 rounded-lg shadow-sm">
          <TopTasks projectId={project.id} />
        </div>
      </div>
      
      {/* Budget summary */}
      <div className="grid grid-cols-1 gap-6">
        <BudgetSummary />
      </div>
      
      {/* Vendor tracking */}
      <div className="grid grid-cols-1 gap-6">
        <div className="md:col-span-2">
          <VendorTracking project_id={project.id} />
        </div>
      </div>
      
      {/* FAQ & Help section (replacing Documents) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 bg-white p-5 rounded-lg shadow-sm">
          <FAQSection />
        </div>
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
    <VendorTracking project_id={project?.id} />
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

const DrinksCalculatorPage = () => (
  <DrinksCalculatorWidget />
);

// Nouvelle page pour la wishlist 
const WishlistPage = React.lazy(() => import('./WishlistPage'));

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-wedding-cream/5">
      <SEO
        title="Dashboard | Mariable"
        description="Gérez votre projet de mariage dans votre espace personnel."
      />
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {isMobile && (
          <Button 
            onClick={toggleSidebar} 
            className="mb-4 w-full bg-wedding-olive hover:bg-wedding-olive/90"
          >
            <Layout className="mr-2 h-4 w-4" />
            {sidebarOpen ? "Masquer le menu" : "Afficher le menu"}
          </Button>
        )}
        
        <div className="flex flex-col lg:flex-row gap-6">
          {(!isMobile || sidebarOpen) && (
            <DashboardSidebar />
          )}
          
          <main className={`flex-1 space-y-6 transition-all duration-300 ${isMobile && sidebarOpen ? "mt-4" : ""}`}>
            {(!isMobile || !sidebarOpen) && (
              <Routes>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/prestataires" element={<PrestatairesPage />} />
                <Route path="/budget" element={<BudgetPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/coordination" element={<CoordinationPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/wishlist" element={
                  <React.Suspense fallback={<div className="flex justify-center items-center h-32"><div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-wedding-olive rounded-full"></div></div>}>
                    <WishlistPage />
                  </React.Suspense>
                } />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/drinks" element={<DrinksCalculatorPage />} />
              </Routes>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
