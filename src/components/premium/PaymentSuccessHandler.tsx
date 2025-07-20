
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccessHandler = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const paymentStatus = searchParams.get('payment');
      const sessionId = searchParams.get('session_id');
      
      if (paymentStatus === 'success' && sessionId) {
        try {
          console.log('🔄 Processing payment success...');
          
          // Appeler l'edge function pour mettre à jour le statut premium
          const { data, error } = await supabase.functions.invoke('update-premium-status', {
            body: { session_id: sessionId }
          });

          if (error) {
            console.error('❌ Error updating premium status:', error);
            toast({
              title: "Erreur de validation",
              description: "Le paiement a été effectué mais la validation a échoué. Contactez le support.",
              variant: "destructive"
            });
            return;
          }

          console.log('✅ Premium status updated successfully');
          
          toast({
            title: "Paiement confirmé !",
            description: "Votre compte premium a été activé avec succès. Toutes les fonctionnalités sont maintenant disponibles.",
            duration: 5000
          });

          // Forcer un rechargement de la page pour rafraîchir l'état premium
          setTimeout(() => {
            window.location.reload();
          }, 2000);

        } catch (error) {
          console.error('❌ Payment success handling error:', error);
          toast({
            title: "Erreur de traitement",
            description: "Une erreur s'est produite lors de la validation du paiement.",
            variant: "destructive"
          });
        }
      }
    };

    handlePaymentSuccess();
  }, [searchParams, toast]);

  return null;
};

export default PaymentSuccessHandler;
