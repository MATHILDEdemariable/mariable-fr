
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import AdviceSidebar from '@/components/wedding-day/components/AdviceSidebar';
import TeamTasksSection from '@/components/wedding-day/components/TeamTasksSection';
import { useToast } from '@/components/ui/use-toast';

const CoordinationPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  // Check for the current user
  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations utilisateur",
          variant: "destructive"
        });
      }
    };
    
    getUserData();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [toast]);
  
  return (
    <>
      <Helmet>
        <title>Conseils Jour M | Mariable</title>
        <meta name="description" content="Conseils et coordination pour votre jour M" />
      </Helmet>
      
      <div className="space-y-4 sm:space-y-6 w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Conseils Jour M
          </h1>
          <p className="text-gray-600">
            Tous nos conseils pratiques et outils de coordination pour votre jour J
          </p>
        </div>

        {!user ? (
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6 text-center">
              <h2 className="text-base sm:text-lg md:text-xl font-serif mb-2">
                Connectez-vous pour accéder aux conseils personnalisés
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                Pour profiter de tous nos conseils et outils de coordination, veuillez vous connecter.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="conseils" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="conseils">Conseils Pratiques</TabsTrigger>
              <TabsTrigger value="coordination">Coordination Équipe</TabsTrigger>
            </TabsList>
            
            <TabsContent value="conseils" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Conseils pour votre Jour M</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdviceSidebar />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="coordination" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Coordination d'Équipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <TeamTasksSection user={user} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default CoordinationPage;
