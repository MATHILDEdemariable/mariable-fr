import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Euro, Heart, Trash2, ExternalLink } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';

type Prestataire = Database['public']['Tables']['prestataires_rows']['Row'];

type WishlistItem = {
  id: string;
  vendor_id: string;
  vendor_name: string;
  vendor_category: string;
  created_at: string;
  vendor?: Prestataire;
};

const WishlistPage = () => {
  const { t } = useTranslation('weddingDay');
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('vendor_wishlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const wishlistWithDetails = await Promise.all(
          data.map(async (item) => {
            const { data: vendorData } = await supabase
              .from('prestataires_rows')
              .select('*')
              .eq('id', item.vendor_id)
              .single();
            return { ...item, vendor: vendorData || undefined } as WishlistItem;
          })
        );
        setWishlistItems(wishlistWithDetails);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: t('wishlist.errorTitle'),
        description: t('wishlist.loadError'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [navigate]);

  const handleRemoveFromWishlist = async (itemId: string, vendorName: string) => {
    try {
      const { error } = await supabase
        .from('vendor_wishlist')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: t('wishlist.removed'),
        description: t('wishlist.removedDesc', { name: vendorName })
      });
      setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: t('wishlist.errorTitle'),
        description: t('wishlist.removeError'),
        variant: "destructive"
      });
    }
  };

  const handleViewVendor = (vendorSlug: string) => {
    navigate(`/prestataire/${vendorSlug}`);
  };

  const getVendorImage = (vendor?: Prestataire) => {
    if (!vendor) return '/placeholder.svg';
    let mainImage = '/placeholder.svg';
    try {
      if (vendor.styles && Array.isArray(vendor.styles) && vendor.styles.length > 0) {
        mainImage = String(vendor.styles[0]);
      } else if (vendor.styles && typeof vendor.styles === 'string') {
        try {
          const parsedStyles = JSON.parse(String(vendor.styles));
          if (Array.isArray(parsedStyles) && parsedStyles.length > 0) {
            mainImage = String(parsedStyles[0]);
          }
        } catch (e) {}
      }
    } catch (error) {}
    return mainImage;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif">{t('wishlist.title')}</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-wedding-olive"></div>
        </div>
      ) : (
        <>
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden border-wedding-olive/20 hover:shadow-md transition-all">
                  <div className="relative">
                    <AspectRatio ratio={16 / 9}>
                      <img src={getVendorImage(item.vendor)} alt={item.vendor_name} className="w-full h-full object-cover" />
                    </AspectRatio>
                    <Badge className="absolute top-3 left-3 bg-white/80 text-black font-medium">
                      {item.vendor_category}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="text-lg font-serif mb-1">{item.vendor_name}</h3>

                    {item.vendor && (
                      <>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {item.vendor.ville || ''}, {((item.vendor.regions as any)?.[0] || '')}
                        </div>

                        <div className="mt-2 font-medium text-sm">
                          <div className="flex items-center">
                            <Euro className="h-4 w-4 mr-1" />
                            {item.vendor.prix_par_personne
                              ? t('wishlist.priceFromPerPerson', { price: item.vendor.prix_par_personne })
                              : item.vendor.prix_a_partir_de
                                ? t('wishlist.priceFrom', { price: item.vendor.prix_a_partir_de })
                                : t('wishlist.priceOnRequest')}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>

                  <CardFooter className="px-4 pb-4 pt-0 flex flex-col gap-2">
                    <div className="flex gap-2 w-full">
                      <Button
                        onClick={() => item.vendor && handleViewVendor(item.vendor.slug)}
                        className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90"
                        disabled={!item.vendor}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" /> {t('wishlist.contact')}
                      </Button>

                      <Button
                        onClick={() => handleRemoveFromWishlist(item.id, item.vendor_name)}
                        variant="outline"
                        className="flex-1 border-wedding-olive/30 text-wedding-olive hover:bg-wedding-olive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> {t('wishlist.remove')}
                      </Button>
                    </div>

                    {item.vendor && (
                      <Button
                        onClick={() => handleViewVendor(item.vendor.slug)}
                        variant="ghost"
                        className="w-full text-muted-foreground"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" /> {t('wishlist.details')}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-wedding-cream/20 rounded-lg">
              <Heart className="mx-auto h-12 w-12 text-wedding-olive mb-4" />
              <h2 className="text-xl font-serif mb-2">{t('wishlist.emptyTitle')}</h2>
              <p className="text-muted-foreground mb-6">{t('wishlist.emptyDesc')}</p>
              <Button
                onClick={() => navigate('/recherche')}
                className="bg-wedding-olive hover:bg-wedding-olive/90"
              >
                {t('wishlist.discover')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WishlistPage;
