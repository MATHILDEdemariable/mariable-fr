import React, { useState } from 'react';
import { ShoppingCart, X, Trash2, Euro, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart, PRICE_CATALOG } from './CartProvider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const CartIcon = () => {
  const { items, removeItem, updateItemPrice, clearCart, total, itemCount } = useCart();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customPrice, setCustomPrice] = useState<string>('');

  const handlePriceSelect = (vendorId: string, priceType: string) => {
    const item = items.find(i => i.vendorId === vendorId);
    if (!item) return;
    
    const catalog = PRICE_CATALOG[item.category];
    if (!catalog) return;

    let price = 0;
    if (priceType === 'min') price = catalog.min;
    else if (priceType === 'mid') price = catalog.mid;
    else if (priceType === 'max') price = catalog.max;

    updateItemPrice(vendorId, price);
  };

  const handleCustomPrice = (vendorId: string) => {
    const price = parseFloat(customPrice);
    if (!isNaN(price) && price > 0) {
      updateItemPrice(vendorId, price);
      setEditingId(null);
      setCustomPrice('');
    }
  };

  if (itemCount === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-24 right-4 z-50 bg-white shadow-lg border-premium-sage hover:bg-premium-sage-very-light h-12 w-12 rounded-full"
        >
          <ShoppingCart className="h-5 w-5 text-premium-sage" />
          <Badge className="absolute -top-2 -right-2 bg-premium-sage text-white text-xs h-6 w-6 flex items-center justify-center rounded-full p-0">
            {itemCount}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Mon panier indicatif</h3>
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Estimation de budget basée sur les standards du marché</p>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {items.map((item) => {
            const catalog = PRICE_CATALOG[item.category];
            
            return (
              <div key={item.vendorId} className="p-3 border-b border-border last:border-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{item.vendorName}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive flex-shrink-0"
                    onClick={() => removeItem(item.vendorId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {/* Prix section */}
                <div className="mt-2">
                  {item.price ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-premium-sage flex items-center gap-1">
                        <Euro className="h-3 w-3" />
                        {item.price.toLocaleString()}€
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-muted-foreground"
                        onClick={() => {
                          setEditingId(item.vendorId);
                          setCustomPrice(item.price?.toString() || '');
                        }}
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Modifier
                      </Button>
                    </div>
                  ) : editingId === item.vendorId ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Prix"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        className="h-8 text-sm"
                      />
                      <Button
                        size="sm"
                        className="h-8 bg-premium-sage hover:bg-premium-sage-dark"
                        onClick={() => handleCustomPrice(item.vendorId)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : catalog ? (
                    <Select onValueChange={(value) => handlePriceSelect(item.vendorId, value)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Choisir un budget estimé" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="min">
                          Entrée de gamme: {catalog.min.toLocaleString()}€
                        </SelectItem>
                        <SelectItem value="mid">
                          Milieu de gamme: {catalog.mid.toLocaleString()}€
                        </SelectItem>
                        <SelectItem value="max">
                          Haut de gamme: {catalog.max.toLocaleString()}€
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Entrez le prix"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        className="h-8 text-sm"
                        onFocus={() => setEditingId(item.vendorId)}
                      />
                      {editingId === item.vendorId && (
                        <Button
                          size="sm"
                          className="h-8 bg-premium-sage hover:bg-premium-sage-dark"
                          onClick={() => handleCustomPrice(item.vendorId)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="p-4 bg-premium-sage-very-light border-t border-border">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">Budget estimé total</span>
            <span className="text-xl font-bold text-premium-sage">
              {total.toLocaleString()}€
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            * Estimation indicative basée sur les tarifs standards du marché français
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CartIcon;
