
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';

const MonJourM: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        toast({
          title: "Non connecté",
          description: "Vous devez être connecté pour accéder à Mon Jour-M",
          variant: "destructive"
        });
        navigate('/login', { state: { from: location.pathname } });
      }
    };

    checkAuth();
  }, [navigate, location.pathname, toast]);

  return (
    <>
      <Helmet>
        <title>Mon Jour-M | Mariable</title>
        <meta name="description" content="Organisez et coordonnez tous les détails de votre mariage" />
      </Helmet>

      <MonJourMLayout />
    </>
  );
};

export default MonJourM;
