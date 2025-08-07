import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import AdviceSidebar from '@/components/wedding-day/components/AdviceSidebar';
import { Card, CardContent } from '@/components/ui/card';

const MonJourMConseils: React.FC = () => {
  const [coordinationId, setCoordinationId] = useState<string>('');

  useEffect(() => {
    const loadCoordination = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: coordinations } = await supabase
            .from('wedding_coordination')
            .select('id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (coordinations && coordinations.length > 0) {
            setCoordinationId(coordinations[0].id);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la coordination:', error);
      }
    };

    loadCoordination();
  }, []);

  return (
    <>
      <Helmet>
        <title>Conseils Jour-J - Mon Jour-M | Mariable</title>
        <meta name="description" content="Découvrez nos conseils d'experts pour bien organiser votre jour de mariage. Timing, photos, gestion des invités et moments clés." />
      </Helmet>

      <MonJourMLayout coordinationId={coordinationId}>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <AdviceSidebar />
            </CardContent>
          </Card>
        </div>
      </MonJourMLayout>
    </>
  );
};

export default MonJourMConseils;