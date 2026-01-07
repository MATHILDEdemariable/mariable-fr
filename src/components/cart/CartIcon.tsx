import React, { useState } from 'react';
import { ShoppingCart, X, Trash2, Euro, Edit2, Check, Users, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart, PRICE_CATALOG } from './CartProvider';
import jsPDF from 'jspdf';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const CartIcon = () => {
  const { items, removeItem, updateItemPrice, updateGuestCount, clearCart, total, itemCount } = useCart();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customPrice, setCustomPrice] = useState<string>('');

  // Fonction pour générer le PDF du panier
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Mon Panier Mariable', 20, 20);
    doc.setFontSize(10);
    doc.text('Estimation indicative', 20, 28);
    doc.setFontSize(12);
    
    let y = 45;
    items.forEach((item, index) => {
      const itemTotal = getItemTotal(item);
      doc.text(`${index + 1}. ${item.vendorName}`, 20, y);
      doc.setFontSize(10);
      doc.text(`   ${item.category}`, 20, y + 5);
      if (itemTotal > 0) {
        doc.text(`${itemTotal.toLocaleString()} EUR`, 160, y, { align: 'right' });
      }
      doc.setFontSize(12);
      y += 15;
    });
    
    doc.setFontSize(14);
    doc.text(`Budget total estime: ${total.toLocaleString()} EUR`, 20, y + 10);
    doc.setFontSize(8);
    doc.text('* Estimation basee sur les tarifs standards du marche francais', 20, y + 20);
    
    doc.save('panier-mariable.pdf');
  };


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

  const handleGuestCountChange = (vendorId: string, value: string) => {
    const count = parseInt(value);
    if (!isNaN(count) && count > 0) {
      updateGuestCount(vendorId, count);
    }
  };

  // Calculer le prix total pour un item (pour Traiteur: prix × invités)
  const getItemTotal = (item: typeof items[0]) => {
    if (!item.price) return 0;
    if (item.category === 'Traiteur' && item.guestCount) {
      return item.price * item.guestCount;
    }
    return item.price;
  };

  if (itemCount === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-24 right-6 z-50 bg-white shadow-xl border-2 border-editorial-noir hover:bg-editorial-beige h-14 w-14 rounded-none transition-all duration-300"
        >
          <ShoppingCart className="h-6 w-6 text-editorial-noir" />
          <Badge className="absolute -top-1 -right-1 bg-editorial-noir text-white text-xs h-6 w-6 flex items-center justify-center rounded-none p-0 font-bold">
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
            const isTraiteur = item.category === 'Traiteur';
            const itemTotal = getItemTotal(item);
            
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
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-editorial-noir flex items-center gap-1">
                          <Euro className="h-3 w-3" />
                          {item.price.toLocaleString()}€{isTraiteur ? '/pers' : ''}
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
                      
                      {/* Champ nombre d'invités pour Traiteur */}
                      {isTraiteur && (
                        <div className="bg-editorial-beige p-2">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-editorial-noir" />
                            <span className="text-xs text-editorial-noir">Invités:</span>
                            <Input
                              type="number"
                              min="1"
                              value={item.guestCount || ''}
                              onChange={(e) => handleGuestCountChange(item.vendorId, e.target.value)}
                              placeholder="100"
                              className="h-7 w-20 text-sm text-center"
                            />
                          </div>
                          {item.guestCount && item.price && (
                            <p className="text-xs text-editorial-noir mt-1 font-medium">
                              {item.price}€ × {item.guestCount} = {itemTotal.toLocaleString()}€
                            </p>
                          )}
                        </div>
                      )}
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
                        className="h-8 bg-editorial-noir hover:bg-editorial-noir/80"
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
                          Entrée de gamme: {catalog.min.toLocaleString()}€{isTraiteur ? '/pers' : ''}
                        </SelectItem>
                        <SelectItem value="mid">
                          Milieu de gamme: {catalog.mid.toLocaleString()}€{isTraiteur ? '/pers' : ''}
                        </SelectItem>
                        <SelectItem value="max">
                          Haut de gamme: {catalog.max.toLocaleString()}€{isTraiteur ? '/pers' : ''}
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
                          className="h-8 bg-editorial-noir hover:bg-editorial-noir/80"
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
        <div className="p-4 bg-editorial-beige border-t border-border">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-editorial-noir">Budget estimé total</span>
            <span className="text-xl font-bold text-editorial-noir">
              {total.toLocaleString()}€
            </span>
          </div>
          <p className="text-xs text-editorial-noir/70 mt-2">
            * Estimation indicative basée sur les tarifs standards du marché français
          </p>
        </div>

        {/* Bouton d'action */}
        <div className="p-4 border-t border-border">
          <Button
            onClick={handleDownloadPDF}
            className="w-full bg-editorial-noir hover:bg-editorial-noir/80 text-white rounded-none"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CartIcon;