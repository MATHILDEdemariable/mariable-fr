
import { useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccessHandler = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const paymentStatus = searchParams.get('payment');
      const sessionId = searchParams.get('session_id');
      
      console.log('🔍 Payment handler - Status:', paymentStatus, 'Session ID:', sessionId);
      console.log('🌐 Current location:', location.pathname);
      
      if (paymentStatus === 'success') {
        try {
          console.log('🔄 Processing payment success...');
          
          if (sessionId) {
            // Retry logic en cas d'échec temporaire
            let retryCount = 0;
            const maxRetries = 3;
            
            while (retryCount < maxRetries) {
              try {
                // Appeler l'edge function avec le bon nom de paramètre
                const { data, error } = await supabase.functions.invoke('update-premium-status', {
                  body: { session_id: sessionId }
                });

                console.log(`📤 Edge function response (attempt ${retryCount + 1}):`, { data, error });

                if (error) {
                  throw new Error(error.message);
                }

                if (data && !data.success) {
                  throw new Error(data.error || "Edge function failed");
                }

                console.log('✅ Premium status updated successfully');
                
                toast({
                  title: "Paiement confirmé !",
                  description: "Votre compte premium a été activé avec succès. Les fonctionnalités sont maintenant disponibles.",
                  duration: 5000
                });

                // Nettoyer l'URL des paramètres de paiement
                const cleanUrl = new URL(window.location.href);
                cleanUrl.searchParams.delete('payment');
                cleanUrl.searchParams.delete('session_id');
                
                // Forcer un rechargement complet pour rafraîchir le statut premium
                setTimeout(() => {
                  console.log('🔄 Refreshing page to update premium status...');
                  window.location.href = cleanUrl.toString();
                }, 2000);

                return; // Success, exit retry loop
                
              } catch (retryError) {
                console.error(`❌ Attempt ${retryCount + 1} failed:`, retryError);
                retryCount++;
                
                if (retryCount < maxRetries) {
                  console.log(`⏳ Retrying in ${retryCount * 1000}ms...`);
                  await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
                } else {
                  // All retries failed
                  toast({
                    title: "Erreur de validation",
                    description: `Le paiement a été effectué mais la validation a échoué après ${maxRetries} tentatives. Contactez le support.`,
                    variant: "destructive"
                  });
                  return;
                }
              }
            }

          } else {
            console.log('⚠️ No session ID found');
            toast({
              title: "Paiement effectué",
              description: "Votre paiement a été traité. Si les fonctionnalités premium ne sont pas actives, contactez le support.",
              duration: 5000
            });
          }

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
  }, [searchParams, location.pathname, toast]);

  return null;
};

export default PaymentSuccessHandler;
