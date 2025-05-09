
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Euro, ExternalLink, Heart } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Database } from '@/integrations/supabase/types';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import AuthRequiredModal from '@/components/auth/AuthRequiredModal';

type Prestataire = Database['public']['Tables']['prestataires_rows']['Row'];

interface VendorCardProps {
  vendor: Prestataire;
  onClick: (vendor: Prestataire) => void;
  onWishlistAdd?: (vendor: Prestataire) => void;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, onClick, onWishlistAdd }) => {
  const navigate = useNavigate();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  // Get the main image (first photo) with safety checks
  let mainImage = '/placeholder.svg';
  
  try {
    // Check if styles is already an array
    if (vendor.styles && Array.isArray(vendor.styles) && vendor.styles.length > 0) {
      mainImage = String(vendor.styles[0]);
    } 
    // Check if styles is a string that can be parsed as JSON
    else if (vendor.styles && typeof vendor.styles === 'string') {
      try {
        const parsedStyles = JSON.parse(String(vendor.styles));
        if (Array.isArray(parsedStyles) && parsedStyles.length > 0) {
          mainImage = String(parsedStyles[0]);
        }
      } catch (e) {
        console.warn('Error parsing vendor styles:', e);
        // Use default image
      }
    }
  } catch (error) {
    console.warn('Error processing vendor styles:', error);
    // Use default image
  }
  
  // Get location
  const location = `${vendor.ville || ''}, ${vendor.region || ''}`.trim();
  
  // Get formatted price
  const getFormattedPrice = () => {
    if (vendor.prix_par_personne) {
      return `Environ ${vendor.prix_par_personne}€/pers.`;
    } else if (vendor.prix_a_partir_de) {
      return `À partir de ${vendor.prix_a_partir_de} €`;
    } else {
      return "Prix sur demande";
    }
  };

  // Check if vendor is in wishlist on component mount
  React.useEffect(() => {
    const checkWishlistStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      // Fixed: Use correct query to check if vendor is in wishlist
      const { data } = await supabase
        .from('vendor_wishlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('vendor_id', vendor.id)
        .maybeSingle();
      
      setIsInWishlist(!!data);
    };
    
    checkWishlistStatus();
  }, [vendor.id]);
  
  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      setIsAddingToWishlist(true);
      
      if (isInWishlist) {
        // Remove from wishlist - use correct table name
        await supabase
          .from('vendor_wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('vendor_id', vendor.id);
        
        toast({
          title: "Retiré de votre wishlist",
          description: `${vendor.nom} a été retiré de votre wishlist`,
        });
        
        setIsInWishlist(false);
      } else {
        // Add to wishlist - with correct table and fields
        await supabase
          .from('vendor_wishlist')
          .insert({
            user_id: user.id,
            vendor_id: vendor.id,
            vendor_name: vendor.nom,
            vendor_category: vendor.categorie
          });
        
        toast({
          title: "👍 Ajouté à votre wishlist",
          description: `${vendor.nom} a bien été ajouté à votre wishlist`,
        });
        
        setIsInWishlist(true);
        
        if (onWishlistAdd) {
          onWishlistAdd(vendor);
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // After successful auth, try to add to wishlist again
    setTimeout(() => {
      handleWishlistClick({
        stopPropagation: () => {}
      } as React.MouseEvent);
    }, 300);
  };

  return (
    <>
      <Card className="overflow-hidden border-wedding-olive/20 hover:shadow-md transition-all cursor-pointer" onClick={() => onClick(vendor)}>
        <div className="relative">
          <AspectRatio ratio={16 / 9}>
            <img 
              src={mainImage} 
              alt={vendor.nom || "Prestataire de mariage"} 
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          <Badge 
            className="absolute top-3 left-3 bg-white/80 text-black font-medium"
          >
            {vendor.categorie || "Prestataire"}
          </Badge>
          <Button
            size="sm"
            variant="secondary"
            className={`absolute top-3 right-3 rounded-full p-2 ${isInWishlist ? 'bg-wedding-olive text-white hover:bg-wedding-olive/90' : 'bg-white/80 hover:bg-white text-wedding-olive'}`}
            onClick={handleWishlistClick}
            disabled={isAddingToWishlist}
          >
            <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
            <span className="sr-only">
              {isInWishlist ? "Retirer de ma wishlist" : "Ajouter à ma wishlist"}
            </span>
          </Button>
        </div>
        
        <CardContent className="p-4">
          <h3 className="text-lg font-serif mb-1">{vendor.nom}</h3>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" /> {location}
          </div>
          
          <div className="mt-2 font-medium text-sm">
            <div className="flex items-center">
              <Euro className="h-4 w-4 mr-1" />
              {getFormattedPrice()}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-4 pb-4 pt-0">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onClick(vendor);
            }}
            className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
          >
            <ExternalLink className="h-4 w-4 mr-1" /> En savoir plus
          </Button>
        </CardFooter>
      </Card>
      
      <AuthRequiredModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default VendorCard;
