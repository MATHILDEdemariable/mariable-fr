
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import PlanningCoordinator from '@/components/wedding-day/PlanningCoordinator';
import TeamTasksManager from '@/components/wedding-day/components/TeamTasksManager';

const CoordinationPage = () => {
  const [user, setUser] = useState<User | null>(null);
  
  // Check for the current user
  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUserData();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Coordination Jour J | Mariable</title>
        <meta name="description" content="Coordination et gestion d'équipe pour votre jour J" />
      </Helmet>
      
      <div className="space-y-6 max-w-7xl mx-auto">
        {!user ? (
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-serif mb-2">Connectez-vous pour profiter de toutes les fonctionnalités</h2>
              <p className="text-gray-600">
                Pour sauvegarder votre planning et gérer votre équipe, veuillez vous connecter ou créer un compte.
              </p>
              <p className="text-sm mt-4">
                Vous pouvez tout de même utiliser les outils sans vous connecter, mais ils ne seront pas sauvegardés.
              </p>
            </CardContent>
          </Card>
        ) : null}

        <div className="mb-6">
          <h1 className="text-3xl font-serif text-wedding-olive mb-2">Coordination Jour J</h1>
          <p className="text-muted-foreground">
            Gérez votre planning et coordonnez votre équipe pour le jour J
          </p>
        </div>
        
        <Tabs defaultValue="planning" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger 
              value="planning"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white"
            >
              Planning
            </TabsTrigger>
            <TabsTrigger 
              value="team"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white"
            >
              Équipe
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="planning">
            <PlanningCoordinator user={user} />
          </TabsContent>
          
          <TabsContent value="team">
            <TeamTasksManager user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default CoordinationPage;
