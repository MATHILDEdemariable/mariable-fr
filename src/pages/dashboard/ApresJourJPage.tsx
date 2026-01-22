import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, Plus, Download, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePremiumAction } from "@/hooks/usePremiumAction";
import PremiumModal from "@/components/premium/PremiumModal";
import AfterWeddingAdvice from '@/components/apres-jour-j/AfterWeddingAdvice';
import { SuggestionsModal } from '@/components/apres-jour-j/SuggestionsModal';
import { ApresJourJShareButton } from '@/components/apres-jour-j/ApresJourJShareButton';
import ApresJourJManuelle from '@/components/dashboard/ApresJourJManuelle';
import { exportApresJourJToPDF } from '@/services/apresJourJExportService';

interface Task {
  id: string;
  label: string;
  description?: string;
  priority: "low" | "medium" | "high";
  category: string;
  icon?: string;
}

interface ChecklistData {
  id: string;
  title: string;
  original_text: string;
  tasks: Task[];
  completed_tasks: string[];
  created_at: string;
  icon?: string;
  category?: string;
}

interface DatabaseChecklist {
  id: string;
  title: string;
  original_text: string;
  tasks: Task[] | any;
  completed_tasks: string[] | any;
  created_at: string;
  icon?: string;
  category?: string;
}

const ApresJourJPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [checklistData, setChecklistData] = useState<ChecklistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState('manuelle');
  const printRef = useRef<HTMLDivElement>(null);
  const { executeAction: handlePremiumAction, showPremiumModal, closePremiumModal } = usePremiumAction({
    feature: "Checklist après le jour-J",
    description: "Générez votre checklist personnalisée après le mariage"
  });
  const { toast } = useToast();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await loadExistingChecklist(user.id);
      }
      setIsLoading(false);
    };

    getCurrentUser();
  }, []);

  const loadExistingChecklist = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('planning_apres_jour_j')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Erreur lors du chargement de la checklist:', error);
        return;
      }

      if (data && data.length > 0) {
        const checklist = data[0] as DatabaseChecklist;
        setChecklistData({
          id: checklist.id,
          title: checklist.title,
          original_text: checklist.original_text,
          tasks: Array.isArray(checklist.tasks) ? checklist.tasks as unknown as Task[] : [],
          completed_tasks: (Array.isArray(checklist.completed_tasks) ? checklist.completed_tasks : []) as string[],
          created_at: checklist.created_at,
          icon: checklist.icon,
          category: checklist.category
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la checklist:', error);
    }
  };

  const generateChecklist = async () => {
    if (!inputText.trim() || !user) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-checklist-ai', {
        body: { 
          prompt: `Génère une checklist pour APRÈS le jour J du mariage basée sur ces informations: ${inputText}`,
          context: 'apres-jour-j'
        }
      });

      if (error) throw error;

      const newChecklist = {
        title: data.title || 'Ma checklist après le jour-J',
        original_text: inputText,
        tasks: data.tasks || [],
        completed_tasks: [],
        user_id: user.id,
        icon: data.icon,
        category: data.category
      };

      const { data: insertedData, error: insertError } = await supabase
        .from('planning_apres_jour_j')
        .insert([newChecklist])
        .select()
        .single();

      if (insertError) throw insertError;

      setChecklistData({
        id: insertedData.id,
        title: insertedData.title,
        original_text: insertedData.original_text,
        tasks: (Array.isArray(insertedData.tasks) ? insertedData.tasks as unknown as Task[] : []),
        completed_tasks: (Array.isArray(insertedData.completed_tasks) ? insertedData.completed_tasks : []) as string[],
        created_at: insertedData.created_at,
        icon: insertedData.icon,
        category: insertedData.category
      });

      toast({
        title: "Checklist générée !",
        description: "Votre checklist après le jour-J a été créée avec succès.",
      });

    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la checklist. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    if (!checklistData || !user) return;

    const newCompletedTasks = checklistData.completed_tasks.includes(taskId)
      ? checklistData.completed_tasks.filter(id => id !== taskId)
      : [...checklistData.completed_tasks, taskId];

    try {
      const { error } = await supabase
        .from('planning_apres_jour_j')
        .update({ completed_tasks: newCompletedTasks })
        .eq('id', checklistData.id);

      if (error) throw error;

      setChecklistData(prev => prev ? {
        ...prev,
        completed_tasks: newCompletedTasks
      } : null);

    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la tâche.",
        variant: "destructive",
      });
    }
  };

  const addManualTask = async () => {
    if (!newTaskTitle.trim() || !checklistData || !user) return;

    const newTask: Task = {
      id: `manual-${Date.now()}`,
      label: newTaskTitle.trim(),
      description: '',
      priority: 'medium',
      category: 'AUTRE',
      icon: ''
    };

    const updatedTasks = [...checklistData.tasks, newTask];

    try {
      const { error } = await supabase
        .from('planning_apres_jour_j')
        .update({ tasks: updatedTasks as any })
        .eq('id', checklistData.id);

      if (error) throw error;

      setChecklistData(prev => prev ? {
        ...prev,
        tasks: updatedTasks
      } : null);

      setNewTaskTitle('');
      
      toast({
        title: "Tâche ajoutée !",
        description: "La nouvelle tâche a été ajoutée à votre checklist.",
      });

    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la tâche.",
        variant: "destructive",
      });
    }
  };

  const addSuggestedTasks = async (tasks: Task[]) => {
    if (!checklistData || !user) return;

    const updatedTasks = [...checklistData.tasks, ...tasks];

    try {
      const { error } = await supabase
        .from('planning_apres_jour_j')
        .update({ tasks: updatedTasks as any })
        .eq('id', checklistData.id);

      if (error) throw error;

      setChecklistData(prev => prev ? {
        ...prev,
        tasks: updatedTasks
      } : null);

      toast({
        title: "Tâches ajoutées !",
        description: `${tasks.length} tâche(s) suggérée(s) ont été ajoutées à votre checklist.`,
      });

    } catch (error) {
      console.error('Erreur lors de l\'ajout des tâches:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les tâches suggérées.",
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'NETTOYAGE': 'bg-blue-100 text-blue-800',
      'RÉCUPÉRATION': 'bg-green-100 text-green-800',
      'RETOURS': 'bg-orange-100 text-orange-800',
      'DISTRIBUTION': 'bg-pink-100 text-pink-800',
      'COMMUNICATION': 'bg-purple-100 text-purple-800',
      'PAIEMENTS': 'bg-yellow-100 text-yellow-800',
      'AUTRE': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors['AUTRE'];
  };

  const getProgressPercentage = () => {
    if (!checklistData || checklistData.tasks.length === 0) return 0;
    return Math.round((checklistData.completed_tasks.length / checklistData.tasks.length) * 100);
  };

  const handleExportPDF = async () => {
    if (!checklistData) return;

    setIsExporting(true);
    try {
      await exportApresJourJToPDF(checklistData);
      toast({
        title: "Export réussi !",
        description: "Votre checklist a été exportée en PDF.",
      });
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter la checklist en PDF.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const resetChecklist = async () => {
    if (!checklistData || !user) return;

    try {
      const { error } = await supabase
        .from('planning_apres_jour_j')
        .delete()
        .eq('id', checklistData.id);

      if (error) throw error;

      setChecklistData(null);
      setInputText('');
      
      toast({
        title: "Checklist supprimée",
        description: "Votre checklist a été supprimée avec succès.",
      });

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la checklist.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Après le jour-J | Mariable</title>
        <meta name="description" content="Gérez vos tâches post-mariage avec notre checklist intelligente" />
      </Helmet>
      
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Après le jour-J</h1>
          <p className="text-muted-foreground">
            Gérez vos tâches post-mariage et profitez de conseils personnalisés
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-auto">
            <TabsTrigger value="manuelle">Version manuelle</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manuelle" className="space-y-6">
            <ApresJourJManuelle />
          </TabsContent>
        </Tabs>

        <PremiumModal
          isOpen={showPremiumModal}
          onClose={closePremiumModal}
          feature="Checklist après le jour-J"
        />
      </div>
    </>
  );
};

export default ApresJourJPage;