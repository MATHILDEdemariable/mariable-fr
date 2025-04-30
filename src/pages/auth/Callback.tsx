
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Gérer le retour après confirmation d'email
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Erreur lors du callback d\'authentification:', error);
        navigate('/login');
      } else {
        // Vérifier si l'utilisateur est connecté
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-wedding-cream/10 flex items-center justify-center">
      <SEO
        title="Connexion en cours | Mariable"
        description="Finalisation de votre authentification sur Mariable."
      />
      
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-wedding-olive mx-auto mb-4" />
        <h1 className="text-2xl font-serif mb-2">Connexion en cours...</h1>
        <p className="text-muted-foreground">Veuillez patienter pendant que nous finalisons votre authentification.</p>
      </div>
    </div>
  );
};

export default Callback;
