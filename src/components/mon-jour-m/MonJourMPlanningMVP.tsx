
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { WeddingCoordination } from '@/types/monjourm-mvp';
import SimpleTaskManager from './SimpleTaskManager';
import SimpleTeamManager from './SimpleTeamManager';
import PlanningShareManager from './PlanningShareManager';

const MonJourMPlanningMVP: React.FC = () => {
  const { toast } = useToast();
  const [coordination, setCoordination] = useState<WeddingCoordination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);

  useEffect(() => {
    loadCoordination();
  }, []);

  const loadCoordination = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté",
          variant: "destructive"
        });
        return;
      }

      // Récupérer ou créer la coordination
      let { data: coordinations, error: coordError } = await supabase
        .from('wedding_coordination')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (coordError) throw coordError;

      let activeCoordination: WeddingCoordination;

      if (coordinations && coordinations.length > 0) {
        activeCoordination = coordinations[0];
      } else {
        // Créer une nouvelle coordination
        const { data: newCoordination, error: createError } = await supabase
          .from('wedding_coordination')
          .insert({
            user_id: user.id,
            title: 'Mon Mariage',
            description: 'Organisation de mon mariage'
          })
          .select()
          .single();

        if (createError) throw createError;
        activeCoordination = newCoordination;
      }

      setCoordination(activeCoordination);

      // Charger les rôles disponibles depuis l'équipe
      const { data: teamMembers } = await supabase
        .from('coordination_team')
        .select('role')
        .eq('coordination_id', activeCoordination.id);

      if (teamMembers) {
        const roles = [...new Set(teamMembers.map(member => member.role).filter(Boolean))];
        setAvailableRoles(roles);
      }

    } catch (error) {
      console.error('Erreur chargement coordination:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!coordination) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
          <p className="text-muted-foreground">
            Impossible de charger votre espace Mon Jour-M
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif mb-2">Mon Jour-M</h2>
        <p className="text-muted-foreground">
          Organisez votre équipe et planifiez votre journée parfaite
        </p>
      </div>

      <Tabs defaultValue="planning" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="team">Équipe</TabsTrigger>
          <TabsTrigger value="share">Partager</TabsTrigger>
        </TabsList>
        
        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <SimpleTaskManager coordination={coordination} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <SimpleTeamManager coordination={coordination} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share" className="space-y-4">
          <PlanningShareManager 
            coordination={coordination} 
            availableRoles={availableRoles}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonJourMPlanningMVP;
