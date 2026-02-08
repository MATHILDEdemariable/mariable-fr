
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
      <div className="text-center space-y-2">
        <p className="text-2xl font-bold text-wedding-olive">29€</p>
        <p className="text-sm text-gray-600">
          Paiement unique • Accès permanent
        </p>
      </div>
      
      <Button 
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white"
        size="lg"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            Préparation...
          </span>
        ) : (
          "Accéder au Premium"
        )}
      </Button>
      
      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center justify-center gap-2">
          <Tag className="h-4 w-4" />
          <span>Code promo disponible à l'étape suivante</span>
        </div>
      </div>
    </div>
  );
};

export default StripeButton;
