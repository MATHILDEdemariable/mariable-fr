
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tag } from 'lucide-react';

const StripeButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setLoading(true);
      console.log('🚀 Creating checkout session...');

      const { data, error } = await supabase.functions.invoke('create-checkout-session');

      if (error) {
        console.error('❌ Error creating checkout session:', error);
        toast({
          title: "Erreur",
          description: "Impossible de créer la session de paiement. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      if (!data?.url) {
        console.error('❌ No checkout URL received');
        toast({
          title: "Erreur",
          description: "URL de paiement invalide. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Redirecting to Stripe checkout:', data.url);
      
      // Rediriger vers Stripe Checkout
      window.location.href = data.url;

    } catch (error) {
      console.error('❌ Payment initiation failed:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button 
        onClick={handlePayment}
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? 'Préparation...' : 'Passer à Premium - 39€'}
      </Button>
      
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        <Tag className="h-4 w-4" />
        <span>Vous avez un code promo ? Vous pourrez le saisir à l'étape suivante</span>
      </div>
    </div>
  );
};

export default StripeButton;
