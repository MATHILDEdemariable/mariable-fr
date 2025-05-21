
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProjectSummary from '@/components/dashboard/ProjectSummary';
import ReaderBanner from '@/components/dashboard/ReaderBanner';
import { useReaderMode } from '@/contexts/ReaderModeContext';
import { useToast } from '@/components/ui/use-toast';

const ReaderView = () => {
  const { token } = useParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setReaderMode } = useReaderMode();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const validateToken = async () => {
      try {
        setIsLoading(true);
        
        if (!token) {
          setError('Token invalide');
          return;
        }
        
        // Utiliser la fonction RPC pour valider le token
        const { data, error } = await supabase
          .rpc('validate_share_token', { token_value: token });
          
        if (error) throw error;
        
        // Si le token n'est pas valide ou qu'aucun résultat n'est retourné
        if (!data || data.length === 0 || !data[0].is_valid) {
          setError('Ce lien de partage a expiré ou est invalide');
          return;
        }

        // Activer le mode lecteur
        setReaderMode(true);
        
      } catch (err) {
        console.error('Erreur lors de la validation du token:', err);
        setError('Une erreur est survenue lors de la validation du lien de partage');
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();

    // Nettoyage lors du démontage du composant
    return () => {
      setReaderMode(false);
    };
  }, [token, setReaderMode]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [error, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-wedding-olive rounded-full border-t-transparent mx-auto"></div>
          <p className="mt-2 text-wedding-olive">Chargement du tableau de bord partagé...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Tableau de bord partagé | Mariable</title>
      </Helmet>
      
      <DashboardLayout>
        <>
          <ReaderBanner />
          <ProjectSummary />
        </>
      </DashboardLayout>
    </>
  );
};

export default ReaderView;
