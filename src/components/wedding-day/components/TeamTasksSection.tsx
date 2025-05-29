
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Users, CheckCircle, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { usePlanning } from '../context/PlanningContext';

interface TeamTask {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  responsible_person?: string;
}

const TEAM_TASKS: TeamTask[] = [
  // Préparatifs et installation
  { id: '1', title: 'Accueillir les prestataires à leur arrivée', category: 'Préparatifs', completed: false },
  { id: '2', title: 'Vérifier l\'installation de la décoration', category: 'Préparatifs', completed: false },
  { id: '3', title: 'Coordonner l\'installation du mobilier ou des éléments techniques', category: 'Préparatifs', completed: false },
  { id: '4', title: 'Faire le lien avec le personnel du lieu (accès, clés, consignes)', category: 'Préparatifs', completed: false },
  { id: '5', title: 'Gérer les livraisons de dernière minute (gâteau, fleurs, cadeaux…)', category: 'Préparatifs', completed: false },
  { id: '6', title: 'Installer la signalétique et le plan de table', category: 'Préparatifs', completed: false },
  { id: '7', title: 'Apporter ou installer les éléments oubliés (alliances, accessoires…)', category: 'Préparatifs', completed: false },
  
  // Cérémonie
  { id: '8', title: 'Accueillir les invités à l\'entrée de la cérémonie', category: 'Cérémonie', completed: false },
  { id: '9', title: 'Distribuer les livrets, confettis, pétales ou accessoires', category: 'Cérémonie', completed: false },
  { id: '10', title: 'Guider les intervenants : officiant, musiciens, témoins', category: 'Cérémonie', completed: false },
  { id: '11', title: 'Gérer le timing de la cérémonie (entrée des mariés, musique, discours)', category: 'Cérémonie', completed: false },
  { id: '12', title: 'Coordonner le passage entre deux cérémonies si besoin', category: 'Cérémonie', completed: false },
  
  // Cocktail et photos
  { id: '13', title: 'S\'assurer que les mariés boivent et mangent pendant la journée', category: 'Cocktail', completed: false },
  { id: '14', title: 'Aider la mariée à faire des retouches beauté ou ajuster sa tenue', category: 'Cocktail', completed: false },
  { id: '15', title: 'Organiser les photos de groupe (suivi de la liste, appels des groupes)', category: 'Cocktail', completed: false },
  { id: '16', title: 'Vérifier que les prestataires prennent leur pause repas', category: 'Cocktail', completed: false },
  { id: '17', title: 'Guider les invités vers les animations (photobooth, jeux, livre d\'or…)', category: 'Cocktail', completed: false },
  { id: '18', title: 'Gérer les trajets invités (navettes, taxis, itinéraires)', category: 'Cocktail', completed: false },
  { id: '19', title: 'Prévoir un moment calme pour les mariés avant la soirée', category: 'Cocktail', completed: false },
  
  // Repas et soirée
  { id: '20', title: 'Vérifier les placements selon le plan de table', category: 'Repas', completed: false },
  { id: '21', title: 'Coordonner l\'entrée des mariés dans la salle de réception', category: 'Repas', completed: false },
  { id: '22', title: 'Introduire les discours et les surprises des invités', category: 'Repas', completed: false },
  { id: '23', title: 'Gérer le déroulé du repas, des animations et de l\'ouverture du bal', category: 'Repas', completed: false },
  { id: '24', title: 'Être l\'interlocuteur du DJ, traiteur, ou photographe pour les ajustements', category: 'Repas', completed: false },
  { id: '25', title: 'Distribuer les cadeaux ou petits présents aux invités', category: 'Repas', completed: false },
  
  // Gestion générale
  { id: '26', title: 'Gérer les imprévus (retards, météo, incidents techniques…)', category: 'Gestion', completed: false },
  { id: '27', title: 'Préparer une trousse d\'urgence (kit couture, mouchoirs, pansements…)', category: 'Gestion', completed: false },
  { id: '28', title: 'Aider à ranger et récupérer les affaires personnelles des mariés', category: 'Gestion', completed: false },
  { id: '29', title: 'Vérifier qu\'aucun objet n\'a été oublié (déco, accessoires, vêtements…)', category: 'Gestion', completed: false },
  { id: '30', title: 'Encadrer le rangement et la récupération du matériel loué', category: 'Gestion', completed: false },
  { id: '31', title: 'Organiser les retours ou départs en fin de soirée (chauffeurs, navettes)', category: 'Gestion', completed: false },
  { id: '32', title: 'Vérifier les derniers paiements ou pourboires aux prestataires', category: 'Gestion', completed: false },
  { id: '33', title: 'Être disponible pour rassurer, adapter, ou résoudre les imprévus en toute discrétion', category: 'Gestion', completed: false },
];

const TeamTasksSection: React.FC = () => {
  const [tasks, setTasks] = useState<TeamTask[]>(TEAM_TASKS);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Préparatifs': true,
    'Cérémonie': false,
    'Cocktail': false,
    'Repas': false,
    'Gestion': false,
  });
  const [exportLoading, setExportLoading] = useState(false);
  const { user, formData } = usePlanning();
  const { toast } = useToast();

  // Load tasks from database on mount
  useEffect(() => {
    loadTasksFromDatabase();
  }, [user]);

  const loadTasksFromDatabase = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('team_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('position');

      if (error) {
        console.error('Error loading team tasks:', error);
        return;
      }

      if (data && data.length > 0) {
        // Map database tasks to our format
        const dbTasks = data.map(task => ({
          id: task.id,
          title: task.task_name,
          category: task.phase,
          completed: false, // Team tasks don't have completion status
          responsible_person: task.responsible_person || undefined
        }));
        setTasks(dbTasks);
      } else {
        // Initialize with default tasks if none exist
        await initializeDefaultTasks();
      }
    } catch (error) {
      console.error('Error loading team tasks:', error);
    }
  };

  const initializeDefaultTasks = async () => {
    if (!user) return;

    try {
      const tasksToInsert = TEAM_TASKS.map((task, index) => ({
        user_id: user.id,
        task_name: task.title,
        phase: task.category,
        position: index,
        is_custom: false
      }));

      const { error } = await supabase
        .from('team_tasks')
        .insert(tasksToInsert);

      if (error) {
        console.error('Error initializing team tasks:', error);
      } else {
        loadTasksFromDatabase();
      }
    } catch (error) {
      console.error('Error initializing team tasks:', error);
    }
  };

  const updateTaskAssignment = async (taskId: string, assignedTo: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('team_tasks')
        .update({ responsible_person: assignedTo || null })
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating task assignment:', error);
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder l'assignation",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, responsible_person: assignedTo || undefined } : task
        )
      );
    } catch (error) {
      console.error('Error updating task assignment:', error);
    }
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => task.category === category);
  };

  const exportCoordinationPDF = async () => {
    setExportLoading(true);
    
    try {
      toast({
        title: "Export PDF en cours",
        description: "Préparation de votre fiche de coordination..."
      });

      // Dynamic import for PDF export
      const { exportCoordinationToPDF } = await import('@/services/coordinationExportService');
      
      const success = await exportCoordinationToPDF({
        tasks,
        weddingDate: formData?.date_mariage ? new Date(formData.date_mariage).toLocaleDateString('fr-FR') : undefined,
        coupleNames: formData?.nom_couple || "Votre mariage"
      });
      
      if (success) {
        toast({
          title: "Export réussi",
          description: "Votre fiche de coordination a été exportée en PDF"
        });
      } else {
        toast({
          title: "Erreur d'export",
          description: "Une erreur s'est produite lors de l'export en PDF",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de l'export en PDF",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  const categories = ['Préparatifs', 'Cérémonie', 'Cocktail', 'Repas', 'Gestion'];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-serif flex items-center gap-2">
          <Users className="h-5 w-5 text-wedding-olive" />
          Équipe de coordination
        </CardTitle>
        <Button
          onClick={exportCoordinationPDF}
          disabled={exportLoading}
          className="bg-wedding-olive hover:bg-wedding-olive/80"
        >
          {exportLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Export...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Exporter en PDF
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => {
          const categoryTasks = getTasksByCategory(category);
          const isOpen = openCategories[category];
          
          return (
            <Collapsible key={category} open={isOpen} onOpenChange={() => toggleCategory(category)}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto"
                >
                  <div className="flex items-center gap-3">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="font-medium">{category}</span>
                    <span className="text-sm text-muted-foreground">
                      ({categoryTasks.length} tâches)
                    </span>
                  </div>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-2 pl-4">
                {categoryTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                  >
                    <div className="flex-1 space-y-2">
                      <span className="text-sm block">
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Assigné à:</span>
                        <Input
                          placeholder="Nom de la personne"
                          value={task.responsible_person || ''}
                          onChange={(e) => updateTaskAssignment(task.id, e.target.value)}
                          className="text-xs h-7 flex-1 max-w-48"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TeamTasksSection;
