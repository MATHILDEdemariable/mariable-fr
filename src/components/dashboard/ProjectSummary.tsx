
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ListTodo, Euro, Users, MessageCircle, ArrowRight, Calendar } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

// Define interfaces for budget data
interface BudgetCategory {
  name: string;
  items: any[];
  totalEstimated: number;
  totalActual: number;
  totalDeposit: number;
  totalRemaining: number;
}

interface BudgetBreakdown {
  categories: BudgetCategory[];
  totalEstimated: number;
  totalActual: number;
  totalDeposit: number;
  totalRemaining: number;
}

interface Budget {
  id: string;
  user_id: string;
  breakdown: string | BudgetBreakdown;
  total_budget: number;
  created_at: string;
  updated_at: string;
  guests_count: number;
  project_id: string | null;
  region: string;
  season: string;
  service_level: string;
  selected_vendors: string[];
}

const ProjectSummary: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [weddingDate, setWeddingDate] = useState<string>('');
  const [guestCount, setGuestCount] = useState<string>('');
  
  // Récupérer les tâches principales
  const { data: tasks } = useQuery({
    queryKey: ['tasksSummary'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return [];
      
      const { data, error } = await supabase
        .from('todos_planification')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('completed', false)
        .order('due_date', { ascending: true })
        .limit(5);
        
      if (error) throw error;
      return data;
    }
  });
  
  // Récupérer le budget
  const { data: budget } = useQuery<Budget | null>({
    queryKey: ['budgetSummary'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;
      
      const { data, error } = await supabase
        .from('budgets_dashboard')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      return data as Budget | null;
    }
  });
  
  // Récupérer les prestataires
  const { data: vendors } = useQuery({
    queryKey: ['vendorsSummary'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return [];
      
      const { data, error } = await supabase
        .from('vendors_tracking')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('updated_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      return data;
    }
  });

  // Parse budget breakdown safely
  const parseBudgetBreakdown = (): BudgetBreakdown | null => {
    if (!budget || !budget.breakdown) return null;
    
    try {
      if (typeof budget.breakdown === 'string') {
        return JSON.parse(budget.breakdown) as BudgetBreakdown;
      }
      return budget.breakdown as BudgetBreakdown;
    } catch (e) {
      console.error('Error parsing budget breakdown:', e);
      return null;
    }
  };
  
  const budgetBreakdown = parseBudgetBreakdown();

  const saveWeddingInfo = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      
      // Check if a project exists for this user
      const { data: existingProject } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();
      
      if (existingProject) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update({
            wedding_date: weddingDate || null,
            guest_count: guestCount ? parseInt(guestCount) : null,
            // Fix here: Change 'new Date()' to a string using ISO format
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProject.id);
          
        if (error) throw error;
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert({
            user_id: userData.user.id,
            title: 'Mon Mariage',
            wedding_date: weddingDate || null,
            guest_count: guestCount ? parseInt(guestCount) : null
          });
          
        if (error) throw error;
      }
      
      toast({
        title: "Information sauvegardée",
        description: "Les détails de votre mariage ont été mis à jour",
      });
    } catch (error) {
      console.error('Error saving wedding info:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les informations",
        variant: "destructive"
      });
    }
  };

  // Load existing project data
  useQuery({
    queryKey: ['projectData'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        if (data.wedding_date) setWeddingDate(data.wedding_date);
        if (data.guest_count) setGuestCount(data.guest_count.toString());
      }
      return data;
    }
  });

  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-3xl font-serif mb-6 text-wedding-olive">Tableau de Bord</h1>
      
      {/* Section Wedding Info */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg font-serif">Informations de Mariage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="wedding-date" className="block text-sm font-medium mb-1">
                Date de mariage (fixe ou en cours de réflexion)
              </label>
              <Input
                id="wedding-date"
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
            <div>
              <label htmlFor="guest-count" className="block text-sm font-medium mb-1">
                Nombre d'invités estimatif
              </label>
              <Input
                id="guest-count"
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
            <Button 
              onClick={saveWeddingInfo} 
              className="bg-wedding-olive hover:bg-wedding-olive/90"
            >
              Enregistrer
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Sections suivantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section Tâches */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg font-serif">Suivi des Tâches</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/tasks')} className="text-wedding-olive hover:text-wedding-olive/70">
              Voir tout
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {tasks && tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="flex items-center justify-between pb-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{task.label}</p>
                      {task.due_date && (
                        <p className="text-sm text-muted-foreground">
                          Échéance: {new Date(task.due_date).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                    <Badge priority={task.priority} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Aucune tâche en cours</p>
            )}
          </CardContent>
        </Card>
        
        {/* Section Budget */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg font-serif">Aperçu du Budget</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/budget')} className="text-wedding-olive hover:text-wedding-olive/70">
              Voir détails
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {budget && budgetBreakdown ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">Budget total</p>
                    <p className="font-bold">{budget.total_budget?.toLocaleString()} €</p>
                  </div>
                  
                  {budgetBreakdown.totalEstimated !== undefined && (
                    <>
                      <ProgressBar 
                        progress={(budgetBreakdown.totalEstimated / budget.total_budget) * 100} 
                        maxValue={100}
                        className="h-2.5" 
                      />
                      <div className="flex justify-between text-sm mt-1">
                        <p>Prévu: {budgetBreakdown.totalEstimated?.toLocaleString()} €</p>
                        <p>Restant: {(budget.total_budget - budgetBreakdown.totalEstimated)?.toLocaleString()} €</p>
                      </div>
                    </>
                  )}
                </div>
                
                {budgetBreakdown.categories && budgetBreakdown.categories.slice(0, 3).map((category, index) => (
                  <div key={index} className="pt-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{category.name}</p>
                      <p>{(category.totalEstimated || 0)?.toLocaleString()} €</p>
                    </div>
                    <ProgressBar 
                      progress={category.totalActual || 0} 
                      maxValue={category.totalEstimated || 1}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Aucun budget configuré</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Deuxième rangée */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section Prestataires */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg font-serif">Suivi des Prestataires</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/prestataires')} className="text-wedding-olive hover:text-wedding-olive/70">
              Voir tout
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {vendors && vendors.length > 0 ? (
              <div className="space-y-3">
                {vendors.slice(0, 4).map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between pb-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{vendor.vendor_name}</p>
                      <p className="text-sm text-muted-foreground">{vendor.category}</p>
                    </div>
                    <StatusBadge status={vendor.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Aucun prestataire suivi</p>
            )}
          </CardContent>
        </Card>
        
        {/* Section Questions/Réponses */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg font-serif">Questions & Réponses</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => window.open('https://chat.whatsapp.com/In5xf3ZMJNvJkhy4F9g5C5', '_blank')} className="text-wedding-olive hover:text-wedding-olive/70">
              Poser une question
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center py-2">
                Besoin de conseils personnalisés pour votre mariage ?
              </p>
              <div className="grid place-items-center">
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => window.open('https://chat.whatsapp.com/In5xf3ZMJNvJkhy4F9g5C5', '_blank')}>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Rejoindre le groupe WhatsApp
                </Button>
              </div>
              <p className="text-sm text-center text-muted-foreground pt-2">
                Notre équipe d'experts est disponible pour répondre à toutes vos questions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Composant Badge pour la priorité
const Badge: React.FC<{ priority: string }> = ({ priority }) => {
  const getPriorityColor = () => {
    switch(priority) {
      case 'haute': return 'bg-red-100 text-red-800';
      case 'moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor()}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

// Composant StatusBadge pour le statut du prestataire
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = () => {
    switch(status) {
      case 'à contacter': return 'bg-yellow-100 text-yellow-800';
      case 'contacté': return 'bg-blue-100 text-blue-800';
      case 'rendez-vous fixé': return 'bg-purple-100 text-purple-800';
      case 'réservé': return 'bg-green-100 text-green-800';
      case 'annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default ProjectSummary;
