
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import LoadingState from '@/components/mon-jour-m/LoadingState';
import ErrorBoundary from '@/components/mon-jour-m/ErrorBoundary';

const MonJourM: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Auth error:', error);
          setIsLoading(false);
          return;
        }

        if (!data.session) {
          toast({
            title: "Non connecté",
            description: "Vous devez être connecté pour accéder à Mon Jour-M",
            variant: "destructive"
          });
          navigate('/login', { state: { from: location.pathname } });
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error checking auth:', error);
        if (mounted) {
          toast({
            title: "Erreur",
            description: "Une erreur s'est produite lors de la vérification de l'authentification",
            variant: "destructive"
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [navigate, location.pathname, toast]);

  // Afficher le loading pendant la vérification d'authentification
  if (isLoading) {
    return <LoadingState />;
  }

  // Ne rien afficher si pas authentifié (la redirection va se faire)
  if (!isAuthenticated) {
    return <LoadingState />;
  }

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Mon Jour-M | Mariable</title>
        <meta name="description" content="Organisez et coordonnez tous les détails de votre mariage" />
      </Helmet>

      <MonJourMLayout />
    </ErrorBoundary>
  );
};

export default MonJourM;
