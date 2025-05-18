
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ListTodo, Euro, Users, MessageCircle, ArrowRight } from 'lucide-react';
import ProgressBar from './ProgressBar';

const ProjectSummary: React.FC = () => {
  const navigate = useNavigate();
  
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
  const { data: budget } = useQuery({
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
      return data;
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

  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-3xl font-serif mb-6 text-wedding-olive">Tableau de Bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Tâches à faire
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {tasks ? tasks.filter(task => !task.completed).length : '-'}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Euro className="h-5 w-5" />
              Budget Total
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {budget?.total_budget ? `${budget.total_budget.toLocaleString()} €` : '-'}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5" />
              Prestataires
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {vendors ? vendors.length : '-'}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conseils personnalisés
            </CardTitle>
          </CardHeader>
          <CardContent className="text-base">
            <Button className="bg-green-600 hover:bg-green-700 w-full" onClick={() => window.open('https://chat.whatsapp.com/In5xf3ZMJNvJkhy4F9g5C5', '_blank')}>
              Groupe WhatsApp
            </Button>
          </CardContent>
        </Card>
      </div>
      
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
            {budget && budget.breakdown ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">Budget total</p>
                    <p className="font-bold">{budget.total_budget?.toLocaleString()} €</p>
                  </div>
                  
                  {typeof budget.breakdown === 'object' && budget.breakdown.totalEstimated && (
                    <>
                      <ProgressBar 
                        value={(budget.breakdown.totalEstimated / budget.total_budget) * 100} 
                        max={100}
                        className="h-2.5" 
                      />
                      <div className="flex justify-between text-sm mt-1">
                        <p>Prévu: {budget.breakdown.totalEstimated?.toLocaleString()} €</p>
                        <p>Restant: {(budget.total_budget - budget.breakdown.totalEstimated)?.toLocaleString()} €</p>
                      </div>
                    </>
                  )}
                </div>
                
                {typeof budget.breakdown === 'object' && budget.breakdown.categories && 
                 budget.breakdown.categories.slice(0, 3).map((category, index) => (
                  <div key={index} className="pt-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{category.name}</p>
                      <p>{category.totalEstimated?.toLocaleString()} €</p>
                    </div>
                    <ProgressBar 
                      value={category.totalActual} 
                      max={category.totalEstimated || 1}
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
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/vendor-tracking')} className="text-wedding-olive hover:text-wedding-olive/70">
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
