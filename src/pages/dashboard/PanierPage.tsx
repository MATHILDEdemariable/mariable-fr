import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Euro } from 'lucide-react';

interface CartItem {
  vendorId: string;
  vendorName: string;
  category: string;
  price: number | null;
  guestCount?: number;
}

const PanierPage: React.FC = () => {
  const location = useLocation();
  const { cartItems = [], total = 0 } = (location.state as { cartItems?: CartItem[]; total?: number }) || {};

  const getItemTotal = (item: CartItem) => {
    if (!item.price) return 0;
    if (item.category === 'Traiteur' && item.guestCount) {
      return item.price * item.guestCount;
    }
    return item.price;
  };

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
              {cartItems.map((item: CartItem) => {
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
