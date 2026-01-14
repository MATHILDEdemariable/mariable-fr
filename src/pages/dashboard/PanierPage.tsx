import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Euro, AlertCircle } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PanierPage: React.FC = () => {
  const { items: cartItems, total } = useCart();

  // Récupérer le budget estimé depuis Supabase
  const { data: budgetData } = useQuery({
    queryKey: ['budgetDashboard'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;
      
      const { data, error } = await supabase
        .from('budgets_dashboard')
        .select('total_budget, guests_count, service_level')
        .eq('user_id', userData.user.id)
        .maybeSingle();
        
      if (error) return null;
      return data;
    }
  });

  const getItemTotal = (item: typeof cartItems[0]) => {
    if (!item.price) return 0;
    if (item.category === 'Traiteur' && item.guestCount) {
      return item.price * item.guestCount;
    }
    return item.price;
  };

  const estimatedBudget = budgetData?.total_budget || 0;
  const difference = total - estimatedBudget;
  const hasComparison = estimatedBudget > 0 && total > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="h-8 w-8 text-editorial-noir" />
        <h1 className="text-2xl font-serif text-editorial-noir">Mon Panier</h1>
      </div>

      <Card className="rounded-none border-editorial-border">
        <CardHeader>
          <CardTitle className="font-serif text-editorial-noir">Prestataires sélectionnés</CardTitle>
        </CardHeader>
        <CardContent>
          {cartItems.length === 0 ? (
            <p className="text-editorial-noir/60">Aucun prestataire dans votre panier. Ajoutez des prestataires depuis la page d'accueil ou l'annuaire.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const itemTotal = getItemTotal(item);
                return (
                  <div key={item.vendorId} className="flex justify-between items-center p-4 border border-editorial-border bg-white">
                    <div>
                      <p className="font-medium text-editorial-noir">{item.vendorName}</p>
                      <p className="text-sm text-editorial-noir/60">{item.category}</p>
                      {item.category === 'Traiteur' && item.guestCount && (
                        <p className="text-xs text-editorial-noir/50">{item.guestCount} invités</p>
                      )}
                    </div>
                    {itemTotal > 0 && (
                      <span className="font-semibold flex items-center gap-1 text-editorial-noir">
                        <Euro className="h-4 w-4" />
                        {itemTotal.toLocaleString()}€
                      </span>
                    )}
                  </div>
                );
              })}
              <div className="pt-4 border-t border-editorial-border flex justify-between items-center">
                <span className="font-semibold text-editorial-noir">Budget total estimé</span>
                <span className="text-xl font-bold text-editorial-noir">{total.toLocaleString()}€</span>
              </div>
              
              {/* Comparatif avec le budget estimé */}
              {hasComparison && (
                <div className="mt-4 p-4 bg-gray-50 border border-editorial-border">
                  <h4 className="font-medium text-editorial-noir mb-3">Comparatif Budget</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-editorial-noir/70">Budget calculé (calculatrice)</span>
                      <span className="font-medium">{estimatedBudget.toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-editorial-noir/70">Total panier</span>
                      <span className="font-medium">{total.toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-editorial-border">
                      <span className="font-medium text-editorial-noir">Différence</span>
                      <span className={`font-bold ${difference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {difference > 0 ? '+' : ''}{difference.toLocaleString()}€
                      </span>
                    </div>
                  </div>
                  {difference > 0 && (
                    <Alert className="mt-3 bg-orange-50 border-orange-200">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800 text-xs">
                        Votre panier dépasse le budget estimé de {difference.toLocaleString()}€
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
              
              <p className="text-xs text-editorial-noir/50">
                * Estimation indicative basée sur les tarifs standards du marché français
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PanierPage;
