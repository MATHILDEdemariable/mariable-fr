import React, { createContext, useContext, useState, useCallback } from 'react';

// Prix standards par catégorie extraits du livre blanc des tarifs mariage France
export const PRICE_CATALOG: Record<string, { min: number; mid: number; max: number; label: string }> = {
  'Lieu de réception': { min: 3000, mid: 8000, max: 25000, label: 'Location lieu' },
  'Photographe': { min: 1200, mid: 2000, max: 5000, label: 'Reportage photo' },
  'Vidéaste': { min: 1200, mid: 2200, max: 6000, label: 'Film mariage' },
  'Traiteur': { min: 65, mid: 100, max: 200, label: 'Par personne' },
  'DJ': { min: 800, mid: 1500, max: 3000, label: 'Animation soirée' },
  'Fleuriste': { min: 800, mid: 2000, max: 6000, label: 'Décoration florale' },
  'Décoration': { min: 1500, mid: 4000, max: 12000, label: 'Décoration complète' },
  'Mise en beauté': { min: 300, mid: 500, max: 1000, label: 'Coiffure & maquillage' },
  'Robe de mariée': { min: 1000, mid: 2500, max: 6000, label: 'Robe & accessoires' },
  'Voiture': { min: 300, mid: 600, max: 1500, label: 'Location véhicule' },
  'Invités': { min: 200, mid: 500, max: 1500, label: 'Animation invités' },
  'Coordination': { min: 1500, mid: 3500, max: 8000, label: 'Wedding planner' },
};

export interface CartItem {
  vendorId: string;
  vendorName: string;
  category: string;
  price: number | null; // null = prix sur demande
  priceType: 'fixed' | 'catalog' | 'custom';
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (vendorId: string) => void;
  updateItemPrice: (vendorId: string, price: number) => void;
  clearCart: () => void;
  isInCart: (vendorId: string) => boolean;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      if (prev.some(i => i.vendorId === item.vendorId)) {
        return prev;
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((vendorId: string) => {
    setItems(prev => prev.filter(item => item.vendorId !== vendorId));
  }, []);

  const updateItemPrice = useCallback((vendorId: string, price: number) => {
    setItems(prev => prev.map(item => 
      item.vendorId === vendorId 
        ? { ...item, price, priceType: 'custom' as const }
        : item
    ));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback((vendorId: string) => {
    return items.some(item => item.vendorId === vendorId);
  }, [items]);

  const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const itemCount = items.length;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateItemPrice,
      clearCart,
      isInCart,
      total,
      itemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
