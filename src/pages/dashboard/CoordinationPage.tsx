import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import AdviceSidebar from '@/components/wedding-day/components/AdviceSidebar';
import { useToast } from '@/components/ui/use-toast';

const CoordinationPage = () => {
  const { t } = useTranslation('weddingDay');
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        toast({
          title: t('coordination.errorTitle'),
          description: t('coordination.loadError'),
          variant: "destructive"
        });
      }
    };
    getUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [toast, t]);

  return (
    <>
      <Helmet>
        <title>{t('coordination.pageTitle')}</title>
        <meta name="description" content={t('coordination.pageDescription')} />
      </Helmet>

      <div className="space-y-4 sm:space-y-6 w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t('coordination.title')}</h1>
          <p className="text-gray-600">{t('coordination.subtitle')}</p>
        </div>

        {!user ? (
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6 text-center">
              <h2 className="text-base sm:text-lg md:text-xl font-serif mb-2">
                {t('coordination.loginTitle')}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                {t('coordination.loginDesc')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t('coordination.cardTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <AdviceSidebar />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default CoordinationPage;
