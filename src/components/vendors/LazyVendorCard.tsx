import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Euro, ExternalLink, Heart } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Database } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useVendorPhotos } from "@/hooks/useOptimizedVendors";
import AuthRequiredModal from "@/components/auth/AuthRequiredModal";

type Prestataire = Database["public"]["Tables"]["prestataires_rows"]["Row"];

interface LazyVendorCardProps {
  vendor: Prestataire;
  onClick: (vendor: Prestataire) => void;
  onWishlistAdd?: (vendor: Prestataire) => void;
}

const LazyVendorCard: React.FC<LazyVendorCardProps> = ({
  vendor,
  onClick,
  onWishlistAdd,
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection Observer pour détecter la visibilité
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Charger les photos seulement quand la carte devient visible
  const { data: photos, isLoading: photosLoading } = useVendorPhotos(vendor.id, isVisible);

  // Vérifier si l'utilisateur est connecté et si le prestataire est dans sa wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('vendor_wishlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('vendor_id', vendor.id)
          .single();
        
        if (!error && data) {
          setIsInWishlist(true);
        }
      }
    };

    if (isVisible) {
      checkWishlistStatus();
    }
  }, [vendor.id, isVisible]);

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsAddingToWishlist(true);

    try {
      if (isInWishlist) {
        const { error } = await supabase
          .from('vendor_wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('vendor_id', vendor.id);

        if (error) throw error;
        setIsInWishlist(false);
        toast({ title: "Retiré de vos favoris" });
      } else {
        const { error } = await supabase
          .from('vendor_wishlist')
          .insert({
            user_id: user.id,
            vendor_id: vendor.id,
            vendor_name: vendor.nom,
            vendor_category: vendor.categorie,
          });

        if (error) throw error;
        setIsInWishlist(true);
        toast({ title: "Ajouté à vos favoris" });
        onWishlistAdd?.(vendor);
      }
    } catch (error) {
      console.error('Erreur wishlist:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier vos favoris",
        variant: "destructive",
      });
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Recharger pour vérifier le statut de connexion
    window.location.reload();
  };

  const getFormattedPrice = () => {
    if (vendor.prix_a_partir_de) {
      return `À partir de ${vendor.prix_a_partir_de.toLocaleString()}€`;
    }
    if (vendor.prix_par_personne) {
      return `${vendor.prix_par_personne.toLocaleString()}€/pers`;
    }
    return "Prix sur demande";
  };

  const getMainImage = () => {
    if (photos && photos.length > 0) {
      const mainPhoto = photos.find(p => p.is_cover || p.principale) || photos[0];
      return mainPhoto.url;
    }
    return "/placeholder.svg";
  };

  return (
    <>
      <Card 
        ref={cardRef}
        className="overflow-hidden border-wedding-olive/20 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onClick(vendor)}
      >
        <div className="relative">
          <AspectRatio ratio={16 / 9}>
            {isVisible ? (
              <img
                src={getMainImage()}
                alt={vendor.nom}
                className="w-full h-full object-cover transition-transform hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            ) : (
              <div className="w-full h-full bg-muted animate-pulse" />
            )}
          </AspectRatio>
          
          {vendor.categorie && (
            <Badge
              variant="secondary"
              className="absolute top-3 left-3 bg-white/90 text-wedding-olive hover:bg-white"
            >
              {vendor.categorie}
            </Badge>
          )}
          
          {vendor.featured && (
            <Badge
              variant="default"
              className="absolute bottom-3 right-3 bg-wedding-gold text-white"
            >
              Premium
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 bg-white/90 hover:bg-white ${
              isInWishlist ? 'text-red-500' : 'text-muted-foreground'
            }`}
            onClick={handleWishlistClick}
            disabled={isAddingToWishlist}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {vendor.nom}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{vendor.ville}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Euro className="h-4 w-4 mr-1" />
            <span>{getFormattedPrice()}</span>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0">
          <Button 
            className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
            onClick={(e) => {
              e.stopPropagation();
              if (vendor.slug) {
                navigate(`/prestataire/${vendor.slug}`);
              } else {
                navigate(`/prestataire/${vendor.id}`);
              }
            }}
          >
            Voir le profil
            <ExternalLink className="ml-2 h-4 w-4" />
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

export default LazyVendorCard;