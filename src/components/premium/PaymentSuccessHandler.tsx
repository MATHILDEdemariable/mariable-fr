
import React, { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';

const PaymentSuccessHandler: React.FC = () => {
  const { toast } = useToast();
  const { refetch } = useUserProfile();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success') {
      console.log('🎉 Payment success detected, refreshing user profile...');
      
      // Attendre un peu que le webhook ait le temps de traiter
      const timer = setTimeout(async () => {
        try {
          await refetch();
          
          toast({
            title: "🎉 Paiement réussi !",
            description: "Félicitations ! Vous avez maintenant accès à toutes les fonctionnalités premium de Mariable.",
            duration: 6000,
          });

          // Nettoyer l'URL pour éviter de redemander
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
          
        } catch (error) {
          console.error('Error refreshing profile after payment:', error);
          toast({
            title: "Paiement réussi",
            description: "Votre paiement a été traité. Actualisez la page si les fonctionnalités premium ne sont pas encore disponibles.",
            variant: "default",
            duration: 8000,
          });
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [refetch, toast]);

  return null;
};

export default PaymentSuccessHandler;
