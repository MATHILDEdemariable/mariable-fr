import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ServiceTemplate from '../ServiceTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, UserPlus, Calendar, Play, CheckCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

// Liste des tâches initiales pour les utilisateurs non connectés
const initialWeddingTasks = [
  { 
    id: 1, 
    label: "Posez les bases", 
    description: "Définissez la vision de votre mariage : style, ambiance, type de cérémonie.", 
    priority: "haute", 
    category: "essentiel" 
  },
  { 
    id: 2, 
    label: "Estimez le nombre d'invités", 
    description: "Même approximatif, cela guidera vos choix logistiques et budgétaires.", 
    priority: "haute", 
    category: "organisation" 
  },
  { 
    id: 3, 
    label: "Calibrez votre budget", 
    description: "Évaluez vos moyens et priorisez les postes les plus importants selon vos envies.", 
    priority: "haute", 
    category: "essentiel" 
  },
  { 
    id: 4, 
    label: "Choisissez une période ou une date cible", 
    description: "Cela conditionne les disponibilités des lieux et prestataires.", 
    priority: "haute", 
    category: "essentiel" 
  },
  { 
    id: 5, 
    label: "Réservez les prestataires clés", 
    description: "Lieu, traiteur, photographe en priorité. Puis DJ, déco, animation, etc.", 
    priority: "haute", 
    category: "essentiel" 
  },
  { 
    id: 6, 
    label: "Gérez les démarches officielles", 
    description: "Mairie, cérémonies religieuses ou laïques, contrats, assurances, etc.", 
    priority: "moyenne", 
    category: "essentiel" 
  },
  { 
    id: 7, 
    label: "Anticipez la coordination du jour J", 
    description: "Prévoyez une coordinatrice (recommandée), les préparatifs beauté, la logistique (transport, hébergements) et les temps forts.", 
    priority: "moyenne", 
    category: "organisation" 
  },
  { 
    id: 8, 
    label: "Préparez vos éléments personnels", 
    description: "Tenues, alliances, accessoires, papeterie, DIY ou détails personnalisés.", 
    priority: "moyenne", 
    category: "personnel" 
  },
  { 
    id: 9, 
    label: "Consolidez votre organisation", 
    description: "Revoyez chaque point avec vos prestataires : timing, livraisons, besoins techniques, derniers ajustements.", 
    priority: "haute", 
    category: "organisation" 
  },
  { 
    id: 10, 
    label: "Vivez pleinement votre journée", 
    description: "Vous avez tout prévu : il ne reste plus qu'à profiter à 100% !", 
    priority: "haute", 
    category: "personnel" 
  }
];

const PlanningStageCard = ({ 
  icon: Icon, 
  emoji, 
  title, 
  description, 
  content, 
  ctaText, 
  ctaAction, 
  variant = "default" 
}: { 
  icon: React.ElementType;
  emoji: string;
  title: string;
  description: string;
  content: string[];
  ctaText: string;
  ctaAction: () => void;
  variant?: "default" | "primary";
}) => (
  <div className="group bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-105">
    <div className="flex items-center mb-4">
      <span className="text-3xl mr-3">{emoji}</span>
      <div>
        <h3 className="text-xl font-serif font-medium text-wedding-olive">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    
    <div className="mb-6">
      <ul className="space-y-2">
        {content.map((item, index) => (
          <li key={index} className="flex items-center text-sm">
            <CheckCircle className="h-4 w-4 text-wedding-olive mr-2 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
    
    <Button 
      variant={variant === "primary" ? "wedding" : "outline"}
      className={`w-full group-hover:shadow-lg transition-all ${
        variant === "default" ? "border-wedding-olive text-wedding-olive hover:bg-wedding-olive/10" : ""
      }`}
      onClick={ctaAction}
    >
      {ctaText}
      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
    </Button>
  </div>
);

const PlanningChecklist = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    checkAuthAndLoadTasks();
    
    // S'abonner aux mises à jour en temps réel
    const channel = supabase
      .channel('todos_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos_planification',
        },
        () => {
          checkAuthAndLoadTasks();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const checkAuthAndLoadTasks = async () => {
    setIsLoading(true);
    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsAuthenticated(true);
        
        // Récupérer les tâches depuis Supabase
        const { data: userTasks, error } = await supabase
          .from('todos_planification')
          .select('*')
          .order('position', { ascending: true });
          
        if (error) throw error;
        
        if (userTasks && userTasks.length > 0) {
          setTasks(userTasks);
        } else {
          // Si l'utilisateur n'a pas encore de tâches, importer les tâches initiales
          await importInitialTasks(user.id);
        }
      } else {
        // Utilisateur non connecté, utiliser les tâches initiales avec statut local
        setIsAuthenticated(false);
        
        // Récupérer l'état des tâches depuis le localStorage s'il existe
        const savedTaskStatuses = localStorage.getItem('weddingTasksStatus');
        const statuses = savedTaskStatuses ? JSON.parse(savedTaskStatuses) : {};
        
        const tasksWithStatus = initialWeddingTasks.map(task => ({
          ...task,
          completed: statuses[task.id] || false
        }));
        
        setTasks(tasksWithStatus);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les tâches de planification",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Importer les tâches initiales pour un nouvel utilisateur
  const importInitialTasks = async (userId: string) => {
    try {
      // Convertir les tâches initiales au format de la base de données
      const tasksToInsert = initialWeddingTasks.map((task, index) => ({
        user_id: userId,
        label: task.label,
        description: task.description,
        priority: task.priority as 'haute' | 'moyenne' | 'basse',
        category: task.category,
        position: index + 1,
        completed: false
      }));
      
      // Insérer les tâches dans Supabase
      const { data: insertedTasks, error } = await supabase
        .from('todos_planification')
        .insert(tasksToInsert)
        .select();
        
      if (error) throw error;
      
      // Mettre à jour l'état local avec les tâches insérées
      setTasks(insertedTasks || []);
      
    } catch (error) {
      console.error('Erreur lors de l\'importation des tâches initiales:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser les tâches",
        variant: "destructive"
      });
    }
  };
  
  const toggleTaskCompletion = async (taskId: number | string) => {
    // Convert taskId to string for consistent comparison
    const taskIdStr = taskId.toString();
    
    // Trouver la tâche à mettre à jour
    const taskIndex = tasks.findIndex(t => t.id.toString() === taskIdStr);
    if (taskIndex === -1) return;
    
    const taskToUpdate = tasks[taskIndex];
    const newCompletedState = !taskToUpdate.completed;
    
    // Mettre à jour l'état local d'abord
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = { ...taskToUpdate, completed: newCompletedState };
    setTasks(updatedTasks);
    
    if (isAuthenticated) {
      // Utilisateur connecté, mettre à jour dans Supabase
      try {
        const { error } = await supabase
          .from('todos_planification')
          .update({ completed: newCompletedState })
          .eq('id', taskIdStr);
          
        if (error) throw error;
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la tâche:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la tâche",
          variant: "destructive"
        });
        
        // Restaurer l'état précédent en cas d'erreur
        checkAuthAndLoadTasks();
      }
    } else {
      // Utilisateur non connecté, mettre à jour le localStorage
      const savedTaskStatuses = localStorage.getItem('weddingTasksStatus');
      const statuses = savedTaskStatuses ? JSON.parse(savedTaskStatuses) : {};
      
      statuses[taskIdStr] = newCompletedState;
      localStorage.setItem('weddingTasksStatus', JSON.stringify(statuses));
    }
  };
  
  const getProgressPercentage = () => {
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const handleSignUpClick = () => {
    navigate('/register');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Félicitations et bienvenue dans l'univers du mariage</CardTitle>
          <CardDescription>
            Organisez votre mariage en 10 étapes clés (même sans rien y connaître)
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <span>Votre progression</span>
            <div className="ml-auto text-wedding-olive">{getProgressPercentage()}%</div>
          </CardTitle>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
            <div 
              className="h-full bg-wedding-olive rounded-full" 
              style={{ width: `${getProgressPercentage()}%` }} 
            />
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-medium text-lg mb-4">Organiser son mariage en 10 étapes clés</h3>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wedding-olive"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border-l-2 border-wedding-olive/30 pl-4 ml-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id={`task-${task.id}`} 
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-0.5"
                    />
                    <div>
                      <label 
                        htmlFor={`task-${task.id}`} 
                        className={`cursor-pointer font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {typeof task.position === 'number' ? `${task.position}.` : ''} {task.label}
                      </label>
                      <p className={`mt-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                        {task.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bouton pour planifier le Jour J - maintenant le seul bouton d'appel à l'action */}
      <div className="flex justify-center mt-8">
        <Button
          variant="wedding"
          size="lg"
          className="gap-2"
          onClick={() => {
            if (isAuthenticated) {
              navigate('/services/jour-j');
            } else {
              navigate('/login', { state: { redirectAfterLogin: '/services/jour-j' } });
            }
          }}
        >
          <Calendar size={18} />
          Planifier votre Jour J
        </Button>
      </div>
    </div>
  );
};

const PlanificationContent = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    
    checkAuth();
  }, []);
  
  const planningStages = [
    {
      emoji: "🕊️",
      title: "Je démarre tout juste",
      description: "Les premiers pas de votre organisation",
      content: ["Inspiration", "Étapes clés", "Budget"],
      ctaText: "Créer mon tableau de bord",
      ctaAction: () => navigate(isAuthenticated ? '/dashboard' : '/register')
    },
    {
      emoji: "📋",
      title: "Je suis en pleine organisation",
      description: "L'organisation bat son plein",
      content: ["Réservations de prestataires", "Suivi", "Conseils"],
      ctaText: "Accéder à mon tableau de bord",
      ctaAction: () => navigate(isAuthenticated ? '/dashboard' : '/login')
    },
    {
      emoji: "🎉",
      title: "Le grand jour approche",
      description: "Les derniers préparatifs",
      content: ["Planning détaillé", "Coordination", "Partage"],
      ctaText: "Générer mon jour J",
      ctaAction: () => navigate('/services/jour-j')
    }
  ];

  return (
    <>
      {/* Introduction section */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-serif mb-4 text-wedding-olive">
          À chaque étape, Mariable vous aide
        </h2>
        <p className="text-lg text-muted-foreground mb-6">
          Une organisation fluide et intelligente, structurée autour de vous.
        </p>
        
        {/* Quiz section */}
        <div className="bg-wedding-cream/20 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-serif mb-3 text-wedding-olive">Quizz - Où en êtes vous ?</h3>
          <p className="text-muted-foreground mb-4">
            Découvrez un planning personnalisé selon votre niveau d'avancement
          </p>
          <Button 
            variant="wedding" 
            onClick={() => navigate('/planning-personnalise')}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            Commencer le quiz
          </Button>
        </div>
      </div>

      {/* Three interactive blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {planningStages.map((stage, index) => (
          <PlanningStageCard
            key={index}
            icon={CheckCircle}
            emoji={stage.emoji}
            title={stage.title}
            description={stage.description}
            content={stage.content}
            ctaText={stage.ctaText}
            ctaAction={stage.ctaAction}
            variant={index === 1 ? "primary" : "default"}
          />
        ))}
      </div>

      {/* Planning checklist */}
      <div className="border-t pt-12">
        <h2 className="text-2xl font-serif mt-8 mb-4">Votre checklist de mariage simplifiée</h2>
        <PlanningChecklist />
      </div>
    </>
  );
};

const Planification = () => {
  return (
    <ServiceTemplate 
      title="Planification de mariage"
      description="Organisez chaque étape de votre mariage sans stress"
      content={<PlanificationContent />}
    >
      <SEO 
        title="Planification mariage étape par étape"
        description="Un rétroplanning mariage simple et personnalisé."
      />
    </ServiceTemplate>
  );
};

export default Planification;
