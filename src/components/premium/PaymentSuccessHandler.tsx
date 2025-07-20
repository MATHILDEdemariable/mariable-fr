import React, { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';

const PaymentSuccessHandler: React.FC = () => {
  const { toast } = useToast();
  const { refetch } = useUserProfile();

  useEffect(() => {
    const updatePremiumStatus = async () => {
      try {
        // Appeler l'edge function pour mettre à jour le statut premium
        const { data, error } = await supabase.functions.invoke('update-premium-status');
        
        if (error) {
          throw error;
        }

        // Rafraîchir le profil utilisateur
        await refetch();

        toast({
          title: "Paiement réussi !",
          description: "Votre compte a été mis à niveau vers Premium. Profitez de vos nouvelles fonctionnalités !",
          variant: "default"
        });
      } catch (error) {
        console.error('Error updating premium status:', error);
        toast({
          title: "Paiement traité",
          description: "Votre paiement a été accepté. Si votre statut premium n'apparaît pas, contactez le support.",
          variant: "default"
        });
      }
    };

    // Vérifier si l'URL contient des paramètres de succès Stripe
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success' || window.location.pathname.includes('success')) {
      updatePremiumStatus();
    }
  }, [toast, refetch]);

  return null; // Ce composant ne rend rien visuellement
};

export default PaymentSuccessHandler;