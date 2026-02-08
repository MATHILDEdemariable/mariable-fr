import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type ServiceLevel = 'economique' | 'abordable' | 'premium' | 'luxe';

// Prix standards par catégorie avec niveaux de service
export const PRICE_CATALOG: Record<string, { 
  min: number; 
  mid: number; 
  max: number; 
  label: string;
  byLevel: Record<ServiceLevel, number>;
}> = {
  'Lieu de réception': { 
    min: 3000, mid: 8000, max: 25000, label: 'Location lieu',
    byLevel: { economique: 2000, abordable: 5000, premium: 8000, luxe: 15000 }
  },
  'Photographe': { 
    min: 1200, mid: 2000, max: 5000, label: 'Reportage photo',
    byLevel: { economique: 800, abordable: 1200, premium: 1800, luxe: 3000 }
  },
  'Vidéaste': { 
    min: 1200, mid: 2200, max: 6000, label: 'Film mariage',
    byLevel: { economique: 800, abordable: 1200, premium: 1800, luxe: 3000 }
  },
  'Traiteur': { 
    min: 65, mid: 100, max: 200, label: 'Par personne',
    byLevel: { economique: 50, abordable: 70, premium: 100, luxe: 150 }
  },
  'DJ': { 
    min: 800, mid: 1500, max: 3000, label: 'Animation soirée',
    byLevel: { economique: 600, abordable: 1000, premium: 1800, luxe: 2500 }
  },
  'Fleuriste': { 
    min: 800, mid: 2000, max: 6000, label: 'Décoration florale',
    byLevel: { economique: 500, abordable: 1200, premium: 2000, luxe: 4000 }
  },
  'Décoration': { 
    min: 1500, mid: 4000, max: 12000, label: 'Décoration complète',
    byLevel: { economique: 800, abordable: 2000, premium: 4000, luxe: 10000 }
  },
  'Mise en beauté': { 
    min: 300, mid: 500, max: 1000, label: 'Coiffure & maquillage',
    byLevel: { economique: 200, abordable: 400, premium: 600, luxe: 1000 }
  },
  'Robe de mariée': { 
    min: 1000, mid: 2500, max: 6000, label: 'Robe & accessoires',
    byLevel: { economique: 800, abordable: 1500, premium: 2500, luxe: 5000 }
  },
  'Voiture': { 
    min: 300, mid: 600, max: 1500, label: 'Location véhicule',
    byLevel: { economique: 200, abordable: 400, premium: 600, luxe: 1200 }
  },
  'Invités': { 
    min: 200, mid: 500, max: 1500, label: 'Animation invités',
    byLevel: { economique: 200, abordable: 400, premium: 600, luxe: 1200 }
  },
  'Coordination': { 
    min: 1500, mid: 3500, max: 8000, label: 'Wedding planner',
    byLevel: { economique: 1000, abordable: 2000, premium: 3500, luxe: 7000 }
  },
};

export interface CartItem {
  vendorId: string;
  vendorName: string;
  category: string;
  price: number | null;
  priceType: 'fixed' | 'catalog' | 'custom';
  image?: string;
  guestCount?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (vendorId: string) => void;
  updateItemPrice: (vendorId: string, price: number) => void;
  updateGuestCount: (vendorId: string, guestCount: number) => void;
  clearCart: () => void;
  isInCart: (vendorId: string) => boolean;
  total: number;
  itemCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);
  const mountedRef = useRef(true);
  const { user } = useAuth();

  // Fonction pour charger le panier d'un utilisateur
  const loadCartForUser = useCallback(async (uid: string) => {
    if (!mountedRef.current) return;
    
    try {
      const { data } = await supabase
        .from('user_cart_items')
        .select('*')
        .eq('user_id', uid);
      
      if (!mountedRef.current) return;
      
      if (data && data.length > 0) {
        setItems(data.map(item => ({
          vendorId: item.vendor_id,
          vendorName: item.vendor_name,
          category: item.category,
          price: item.price ? Number(item.price) : null,
          priceType: (item.price_type as 'fixed' | 'catalog' | 'custom') || 'catalog',
          image: item.image || undefined,
          guestCount: item.guest_count || undefined,
        })));
      }
    } catch (error) {
      console.error('❌ CartProvider: Failed to load cart', error);
    }
  }, []);

  // Utiliser user du contexte Auth au lieu de gérer l'auth localement
  useEffect(() => {
    mountedRef.current = true;
    
    if (user) {
      loadCartForUser(user.id);
    } else {
      setItems([]);
    }
    
    setIsLoading(false);
    setIsInitialLoadDone(true);

    return () => {
      mountedRef.current = false;
    };
  }, [user, loadCartForUser]);

  // Synchroniser avec Supabase (debounced)
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const syncToSupabase = useCallback(async (newItems: CartItem[]) => {
    if (!user || !isInitialLoadDone) return;

    // Debounce pour éviter les appels multiples
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        // Supprimer tous les items existants et réinsérer
        await supabase
          .from('user_cart_items')
          .delete()
          .eq('user_id', user.id);

        if (newItems.length > 0) {
          await supabase
            .from('user_cart_items')
            .insert(newItems.map(item => ({
              user_id: user.id,
              vendor_id: item.vendorId,
              vendor_name: item.vendorName,
              category: item.category,
              price: item.price,
              price_type: item.priceType,
              image: item.image,
              guest_count: item.guestCount,
            })));
        }
      } catch (error) {
        console.error('❌ CartProvider: Failed to sync cart', error);
      }
    }, 300);
  }, [user, isInitialLoadDone]);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      if (prev.some(i => i.vendorId === item.vendorId)) {
        return prev;
      }
      const newItems = [...prev, item];
      syncToSupabase(newItems);
      return newItems;
    });
  }, [syncToSupabase]);

  const removeItem = useCallback((vendorId: string) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.vendorId !== vendorId);
      syncToSupabase(newItems);
      return newItems;
    });
  }, [syncToSupabase]);

  const updateItemPrice = useCallback((vendorId: string, price: number) => {
    setItems(prev => {
      const newItems = prev.map(item => 
        item.vendorId === vendorId 
          ? { ...item, price, priceType: 'custom' as const }
          : item
      );
      syncToSupabase(newItems);
      return newItems;
    });
  }, [syncToSupabase]);

  const updateGuestCount = useCallback((vendorId: string, guestCount: number) => {
    setItems(prev => {
      const newItems = prev.map(item => 
        item.vendorId === vendorId 
          ? { ...item, guestCount }
          : item
      );
      syncToSupabase(newItems);
      return newItems;
    });
  }, [syncToSupabase]);

  const clearCart = useCallback(() => {
    setItems([]);
    syncToSupabase([]);
  }, [syncToSupabase]);

  const isInCart = useCallback((vendorId: string) => {
    return items.some(item => item.vendorId === vendorId);
  }, [items]);

  const total = items.reduce((sum, item) => {
    if (item.category === 'Traiteur' && item.guestCount && item.price) {
      return sum + (item.price * item.guestCount);
    }
    return sum + (item.price || 0);
  }, 0);
  const itemCount = items.length;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateItemPrice,
      updateGuestCount,
      clearCart,
      isInCart,
      total,
      itemCount,
      isLoading,
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
