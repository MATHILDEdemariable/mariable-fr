
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProjectSummary from '@/components/dashboard/ProjectSummary';
import ReaderBanner from '@/components/dashboard/ReaderBanner';
import { useReaderMode } from '@/contexts/ReaderModeContext';
import { useToast } from '@/components/ui/use-toast';
import { validateShareToken, setShareTokenHeader } from '@/utils/tokenUtils';
import { supabase } from '@/integrations/supabase/client';

const ReaderView = () => {
  const { token } = useParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setReaderMode, setShareToken, setUserId } = useReaderMode();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const validateAndSetupToken = async () => {
      try {
        setIsLoading(true);
        
        if (!token) {
          setError('Token invalide');
          return;
        }
        
        // Validate the token
        const { isValid, userId } = await validateShareToken(token);
          
        if (!isValid || !userId) {
          setError('Ce lien de partage a expiré ou est invalide');
          return;
        }

        // Store the token for future requests
        setShareToken(token);
        setUserId(userId);
        
        // Set up the custom header for share token
        setShareTokenHeader(token);
        
        // Activate reader mode
        setReaderMode(true);
        
      } catch (err) {
        console.error('Erreur lors de la validation du token:', err);
        setError('Une erreur est survenue lors de la validation du lien de partage');
      } finally {
        setIsLoading(false);
      }
    };

    validateAndSetupToken();

    // Cleanup when unmounting
    return () => {
      setReaderMode(false);
      setShareToken(null);
      setUserId(null);
      
      // Reset headers by using a compatible approach
      if (supabase.functions && typeof supabase.functions.setAuth === 'function') {
        // For newer Supabase clients - remove auth
        supabase.functions.setAuth(null);
      }
      
      // Reset any custom headers we might have set
      (supabase as any).headers = {};
    };
  }, [token, setReaderMode, setShareToken, setUserId]);

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
      
      <div>
        <DashboardLayout />
        <main className="w-full max-w-6xl mx-auto py-6 px-4 lg:px-8">
          <ReaderBanner />
          <ProjectSummary />
        </main>
      </div>
    </>
  );
};

export default ReaderView;
