
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import PlanningCoordinator from '@/components/wedding-day/PlanningCoordinator';

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
        <title>Planning Jour J | Mariable</title>
        <meta name="description" content="Générateur de planning personnalisé pour votre jour J" />
      </Helmet>
      
      <div className="space-y-4 sm:space-y-6 w-full">
        {!user ? (
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6 text-center">
              <h2 className="text-base sm:text-lg md:text-xl font-serif mb-2">Connectez-vous pour profiter de toutes les fonctionnalités</h2>
              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                Pour sauvegarder votre planning et y accéder ultérieurement, veuillez vous connecter ou créer un compte.
              </p>
              <p className="text-xs sm:text-sm">
                Vous pouvez tout de même générer un planning sans vous connecter, mais il ne sera pas sauvegardé.
              </p>
            </CardContent>
          </Card>
        ) : null}
        
        <PlanningCoordinator user={user} />
      </div>
    </>
  );
};

export default CoordinationPage;
