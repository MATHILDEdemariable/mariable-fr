import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { usePlanning } from '../context/PlanningContext';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Download,
  Share2,
  GripVertical,
  Check,
  ChevronDown,
  ChevronRight,
  Eye,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TeamTask {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  responsible_person?: string;
  is_custom?: boolean;
  is_hidden?: boolean;
  position?: number;
}

const TEAM_TASKS: TeamTask[] = [
  // Préparatifs et installation
  { id: '1', title: 'Accueillir les prestataires à leur arrivée', category: 'Préparatifs', completed: false, position: 0 },
  { id: '2', title: 'Vérifier l\'installation de la décoration', category: 'Préparatifs', completed: false, position: 1 },
  { id: '3', title: 'Coordonner l\'installation du mobilier ou des éléments techniques', category: 'Préparatifs', completed: false, position: 2 },
  { id: '4', title: 'Faire le lien avec le personnel du lieu (accès, clés, consignes)', category: 'Préparatifs', completed: false, position: 3 },
  { id: '5', title: 'Gérer les livraisons de dernière minute (gâteau, fleurs, cadeaux…)', category: 'Préparatifs', completed: false, position: 4 },
  { id: '6', title: 'Installer la signalétique et le plan de table', category: 'Préparatifs', completed: false, position: 5 },
  { id: '7', title: 'Apporter ou installer les éléments oubliés (alliances, accessoires…)', category: 'Préparatifs', completed: false, position: 6 },
  
  // Cérémonie
  { id: '8', title: 'Accueillir les invités à l\'entrée de la cérémonie', category: 'Cérémonie', completed: false, position: 0 },
  { id: '9', title: 'Distribuer les livrets, confettis, pétales ou accessoires', category: 'Cérémonie', completed: false, position: 1 },
  { id: '10', title: 'Guider les intervenants : officiant, musiciens, témoins', category: 'Cérémonie', completed: false, position: 2 },
  { id: '11', title: 'Gérer le timing de la cérémonie (entrée des mariés, musique, discours)', category: 'Cérémonie', completed: false, position: 3 },
  { id: '12', title: 'Coordonner le passage entre deux cérémonies si besoin', category: 'Cérémonie', completed: false, position: 4 },
  
  // Cocktail et photos
  { id: '13', title: 'S\'assurer que les mariés boivent et mangent pendant la journée', category: 'Cocktail', completed: false, position: 0 },
  { id: '14', title: 'Aider la mariée à faire des retouches beauté ou ajuster sa tenue', category: 'Cocktail', completed: false, position: 1 },
  { id: '15', title: 'Organiser les photos de groupe (suivi de la liste, appels des groupes)', category: 'Cocktail', completed: false, position: 2 },
  { id: '16', title: 'Vérifier que les prestataires prennent leur pause repas', category: 'Cocktail', completed: false, position: 3 },
  { id: '17', title: 'Guider les invités vers les animations (photobooth, jeux, livre d\'or…)', category: 'Cocktail', completed: false, position: 4 },
  { id: '18', title: 'Gérer les trajets invités (navettes, taxis, itinéraires)', category: 'Cocktail', completed: false, position: 5 },
  { id: '19', title: 'Prévoir un moment calme pour les mariés avant la soirée', category: 'Cocktail', completed: false, position: 6 },
  
  // Repas et soirée
  { id: '20', title: 'Vérifier les placements selon le plan de table', category: 'Repas', completed: false, position: 0 },
  { id: '21', title: 'Coordonner l\'entrée des mariés dans la salle de réception', category: 'Repas', completed: false, position: 1 },
  { id: '22', title: 'Introduire les discours et les surprises des invités', category: 'Repas', completed: false, position: 2 },
  { id: '23', title: 'Gérer le déroulé du repas, des animations et de l\'ouverture du bal', category: 'Repas', completed: false, position: 3 },
  { id: '24', title: 'Être l\'interlocuteur du DJ, traiteur, ou photographe pour les ajustements', category: 'Repas', completed: false, position: 4 },
  { id: '25', title: 'Distribuer les cadeaux ou petits présents aux invités', category: 'Repas', completed: false, position: 5 },
  
  // Gestion générale
  { id: '26', title: 'Gérer les imprévus (retards, météo, incidents techniques…)', category: 'Gestion', completed: false, position: 0 },
  { id: '27', title: 'Préparer une trousse d\'urgence (kit couture, mouchoirs, pansements…)', category: 'Gestion', completed: false, position: 1 },
  { id: '28', title: 'Aider à ranger et récupérer les affaires personnelles des mariés', category: 'Gestion', completed: false, position: 2 },
  { id: '29', title: 'Vérifier qu\'aucun objet n\'a été oublié (déco, accessoires, vêtements…)', category: 'Gestion', completed: false, position: 3 },
  { id: '30', title: 'Encadrer le rangement et la récupération du matériel loué', category: 'Gestion', completed: false, position: 4 },
  { id: '31', title: 'Organiser les retours ou départs en fin de soirée (chauffeurs, navettes)', category: 'Gestion', completed: false, position: 5 },
  { id: '32', title: 'Vérifier les derniers paiements ou pourboires aux prestataires', category: 'Gestion', completed: false, position: 6 },
  { id: '33', title: 'Être disponible pour rassurer, adapter, ou résoudre les imprévus en toute discrétion', category: 'Gestion', completed: false, position: 7 },
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
  const [openHiddenCategories, setOpenHiddenCategories] = useState<Record<string, boolean>>({});
  const [exportLoading, setExportLoading] = useState(false);
  const [newTaskInputs, setNewTaskInputs] = useState<Record<string, { title: string; assignedTo: string; visible: boolean }>>({});
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee_id: '', due_date: '', priority: 'medium', category: 'general' });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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
        // Map database tasks to our format, handling potential missing fields
        const dbTasks = data.map(task => ({
          id: task.id,
          title: task.task_name,
          category: task.phase,
          completed: false,
          responsible_person: task.responsible_person || undefined,
          is_custom: task.is_custom || false,
          is_hidden: (task as any).is_hidden || false, // Type assertion to handle the missing field
          position: task.position || 0
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
        position: task.position || index,
        is_custom: false,
        ...(typeof (task as any).is_hidden !== 'undefined' && { is_hidden: false })
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

  const hideTask = async (taskId: string) => {
    if (!user) return;

    try {
      const updateData: any = { is_hidden: true };
      
      const { error } = await supabase
        .from('team_tasks')
        .update(updateData)
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error hiding task:', error);
        toast({
          title: "Erreur",
          description: "Impossible de masquer la tâche",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, is_hidden: true } : task
        )
      );

      toast({
        title: "Tâche masquée",
        description: "La tâche a été masquée de votre vue"
      });
    } catch (error) {
      console.error('Error hiding task:', error);
    }
  };

  const showTask = async (taskId: string) => {
    if (!user) return;

    try {
      const updateData: any = { is_hidden: false };
      
      const { error } = await supabase
        .from('team_tasks')
        .update(updateData)
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error showing task:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'afficher la tâche",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, is_hidden: false } : task
        )
      );

      toast({
        title: "Tâche réaffichée",
        description: "La tâche a été réaffichée dans votre liste"
      });
    } catch (error) {
      console.error('Error showing task:', error);
    }
  };

  const addCustomTask = async (category: string) => {
    if (!user) return;

    const taskInput = newTaskInputs[category];
    if (!taskInput?.title.trim()) return;

    try {
      const categoryTasks = getTasksByCategory(category);
      const maxPosition = Math.max(...categoryTasks.map(t => t.position || 0), -1);

      const insertData: any = {
        user_id: user.id,
        task_name: taskInput.title,
        phase: category,
        position: maxPosition + 1,
        is_custom: true,
        responsible_person: taskInput.assignedTo || null
      };

      // Only add is_hidden if the field exists in the schema
      if (typeof (tasks[0] as any)?.is_hidden !== 'undefined') {
        insertData.is_hidden = false;
      }

      const { data, error } = await supabase
        .from('team_tasks')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error adding custom task:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter la tâche",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      const newTask: TeamTask = {
        id: data.id,
        title: data.task_name,
        category: data.phase,
        completed: false,
        responsible_person: data.responsible_person || undefined,
        is_custom: true,
        is_hidden: false,
        position: data.position
      };

      setTasks(prev => [...prev, newTask]);

      // Reset input
      setNewTaskInputs(prev => ({
        ...prev,
        [category]: { title: '', assignedTo: '', visible: false }
      }));

      toast({
        title: "Tâche ajoutée",
        description: "La nouvelle tâche a été ajoutée avec succès"
      });
    } catch (error) {
      console.error('Error adding custom task:', error);
    }
  };

  const deleteCustomTask = async (taskId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('team_tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id)
        .eq('is_custom', true);

      if (error) {
        console.error('Error deleting custom task:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la tâche",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setTasks(prev => prev.filter(task => task.id !== taskId));

      toast({
        title: "Tâche supprimée",
        description: "La tâche personnalisée a été supprimée"
      });
    } catch (error) {
      console.error('Error deleting custom task:', error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !newTask.assignee_id) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const taskData = {
        user_id: userData.user.id,
        task_name: newTask.title,
        phase: newTask.category,
        position: 0,
        is_custom: true,
        responsible_person: newTask.assignee_id
      };

      const { error } = await supabase
        .from('team_tasks')
        .insert([taskData]);

      if (error) throw error;

      toast({
        title: "Tâche créée",
        description: "La tâche a été assignée avec succès."
      });

      setNewTask({
        title: '',
        description: '',
        assignee_id: '',
        due_date: '',
        priority: 'medium',
        category: 'general'
      });
      setIsCreateDialogOpen(false);
      loadTasksFromDatabase();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la tâche.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<TeamTask>) => {
    try {
      // Convert any number values to strings if needed
      const sanitizedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (key === 'assignee_id' && typeof value === 'number') {
          acc[key] = value.toString();
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      const { error } = await supabase
        .from('team_tasks')
        .update(sanitizedUpdates)
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Tâche mise à jour",
        description: "Les modifications ont été sauvegardées."
      });

      loadTasksFromDatabase();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la tâche.",
        variant: "destructive"
      });
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || !user) return;

    const { source, destination } = result;
    
    // If dropped in the same position, do nothing
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceCategory = source.droppableId;
    const destCategory = destination.droppableId;
    
    const sourceTasks = getTasksByCategory(sourceCategory);
    const destTasks = sourceCategory === destCategory ? sourceTasks : getTasksByCategory(destCategory);
    
    const draggedTask = sourceTasks[source.index];
    
    // Update local state optimistically
    const newTasks = [...tasks];
    
    // Remove from source
    const sourceTaskIndex = newTasks.findIndex(t => t.id === draggedTask.id);
    if (sourceTaskIndex > -1) {
      newTasks[sourceTaskIndex] = { ...draggedTask, category: destCategory };
    }
    
    // Reorder positions within the destination category
    const destCategoryTasks = newTasks.filter(t => t.category === destCategory && !t.is_hidden);
    destCategoryTasks.forEach((task, index) => {
      const taskIndex = newTasks.findIndex(t => t.id === task.id);
      if (taskIndex > -1) {
        newTasks[taskIndex] = { ...task, position: index };
      }
    });
    
    setTasks(newTasks);

    // Update database
    try {
      const updates = destCategoryTasks.map((task, index) => 
        supabase
          .from('team_tasks')
          .update({ 
            phase: destCategory, 
            position: index 
          })
          .eq('id', task.id)
          .eq('user_id', user.id)
      );

      await Promise.all(updates);
    } catch (error) {
      console.error('Error updating task order:', error);
      // Revert local state on error
      loadTasksFromDatabase();
    }
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleHiddenCategory = (category: string) => {
    setOpenHiddenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getTasksByCategory = (category: string) => {
    return tasks
      .filter(task => task.category === category && !task.is_hidden)
      .sort((a, b) => (a.position || 0) - (b.position || 0));
  };

  const getHiddenTasksByCategory = (category: string) => {
    return tasks
      .filter(task => task.category === category && task.is_hidden)
      .sort((a, b) => (a.position || 0) - (b.position || 0));
  };

  const showNewTaskInput = (category: string) => {
    setNewTaskInputs(prev => ({
      ...prev,
      [category]: { title: '', assignedTo: '', visible: true }
    }));
  };

  const hideNewTaskInput = (category: string) => {
    setNewTaskInputs(prev => ({
      ...prev,
      [category]: { title: '', assignedTo: '', visible: false }
    }));
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
      
      // Helper function to safely convert formData values to strings
      const getStringValue = (value: string | string[] | undefined): string | undefined => {
        if (Array.isArray(value)) {
          return value.length > 0 ? value[0] : undefined;
        }
        return value;
      };
      
      const success = await exportCoordinationToPDF({
        tasks: tasks.filter(t => !t.is_hidden),
        weddingDate: formData?.date_mariage ? new Date(getStringValue(formData.date_mariage) || '').toLocaleDateString('fr-FR') : undefined,
        coupleNames: getStringValue(formData?.nom_couple) || "Votre mariage"
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
    <DragDropContext onDragEnd={onDragEnd}>
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
            const hiddenTasks = getHiddenTasksByCategory(category);
            const isOpen = openCategories[category];
            const isHiddenOpen = openHiddenCategories[category];
            const newTaskInput = newTaskInputs[category];
            
            return (
              <div key={category} className="space-y-2">
                <Collapsible open={isOpen} onOpenChange={() => toggleCategory(category)}>
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
                    <Droppable droppableId={category}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {categoryTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                                    snapshot.isDragging ? 'shadow-lg' : ''
                                  } ${
                                    task.responsible_person ? 'bg-green-50 border-green-200' : 'bg-card'
                                  }`}
                                >
                                  <div
                                    {...provided.dragHandleProps}
                                    className="mt-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
                                  >
                                    <GripVertical className="h-4 w-4" />
                                  </div>
                                  
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm block flex-1">
                                        {task.title}
                                      </span>
                                      {task.responsible_person && (
                                        <Check className="h-4 w-4 text-green-600" />
                                      )}
                                    </div>
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
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => task.is_custom ? deleteCustomTask(task.id) : hideTask(task.id)}
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    
                    {/* Add new task section */}
                    {newTaskInput?.visible ? (
                      <div className="p-3 rounded-lg border border-dashed border-wedding-olive/50 bg-wedding-olive/5 space-y-3">
                        <Input
                          placeholder="Nom de la nouvelle tâche"
                          value={newTaskInput.title}
                          onChange={(e) => setNewTaskInputs(prev => ({
                            ...prev,
                            [category]: { ...newTaskInput, title: e.target.value }
                          }))}
                          className="text-sm"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Assigné à:</span>
                          <Input
                            placeholder="Nom de la personne (optionnel)"
                            value={newTaskInput.assignedTo}
                            onChange={(e) => setNewTaskInputs(prev => ({
                              ...prev,
                              [category]: { ...newTaskInput, assignedTo: e.target.value }
                            }))}
                            className="text-xs h-7 flex-1 max-w-48"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => addCustomTask(category)}
                            className="bg-wedding-olive hover:bg-wedding-olive/80"
                          >
                            Ajouter
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => hideNewTaskInput(category)}
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => showNewTaskInput(category)}
                        className="w-full border-dashed border-wedding-olive/50 text-wedding-olive hover:bg-wedding-olive/5"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une tâche
                      </Button>
                    )}
                  </CollapsibleContent>
                </Collapsible>

                {/* Hidden tasks section */}
                {hiddenTasks.length > 0 && (
                  <Collapsible open={isHiddenOpen} onOpenChange={() => toggleHiddenCategory(category)}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-2 h-auto text-sm text-muted-foreground ml-4"
                      >
                        <div className="flex items-center gap-2">
                          {isHiddenOpen ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                          <span>Tâches masquées ({hiddenTasks.length})</span>
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="space-y-1 pl-8">
                      {hiddenTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-2 p-2 rounded bg-gray-50 border border-gray-200"
                        >
                          <span className="text-sm text-gray-600 flex-1">{task.title}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => showTask(task.id)}
                            className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </DragDropContext>
  );
};

export default TeamTasksSection;
