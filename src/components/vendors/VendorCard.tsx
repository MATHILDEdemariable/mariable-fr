import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Euro, ExternalLink, Plus, ShoppingCart, Check } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Database } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import FeaturedImage from "@/components/ui/featured-image";
import AuthRequiredModal from "@/components/auth/AuthRequiredModal";
import { useCart, PRICE_CATALOG } from "@/components/cart/CartProvider";

type Prestataire = Database["public"]["Tables"]["prestataires_rows"]["Row"];

interface VendorCardProps {
  vendor: Prestataire;
  onClick: (vendor: Prestataire) => void;
  onWishlistAdd?: (vendor: Prestataire) => void;
}

const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  onClick,
  onWishlistAdd,
}) => {
  const navigate = useNavigate();
  const [isAddingToTracking, setIsAddingToTracking] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isInTracking, setIsInTracking] = useState(false);
  const [isPartner, setIsPartner] = useState(vendor.partner);
  const [pendingAction, setPendingAction] = useState<'cart' | 'tracking' | null>(null);
  const { addItem, removeItem, isInCart } = useCart();
  const inCart = isInCart(vendor.id);

  const handleCartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setPendingAction('cart');
      setShowAuthModal(true);
      return;
    }
    
    if (inCart) {
      removeItem(vendor.id);
      toast({
        title: "Retiré du panier",
        description: `${vendor.nom} a été retiré de votre estimation`,
      });
    } else {
      const catalog = PRICE_CATALOG[vendor.categorie || ''];
      const price = vendor.first_price_package || vendor.prix_a_partir_de || (catalog?.mid) || null;
      
      addItem({
        vendorId: vendor.id,
        vendorName: vendor.nom,
        category: vendor.categorie || 'Autre',
        price,
        priceType: price ? 'fixed' : 'catalog',
      });
      toast({
        title: "Ajouté au panier",
        description: `${vendor.nom} ajouté à votre estimation budget`,
      });
    }
  };

  // Get location
  const firstRegion = (vendor.regions as any)?.[0] || '';
  const location = `${vendor.ville || ""}${firstRegion ? `, ${firstRegion}` : ''}`.trim();

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

  // Check if vendor is in tracking on component mount
  React.useEffect(() => {
    const checkTrackingStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("vendors_tracking_preprod")
        .select("id")
        .eq("user_id", user.id)
        .eq("vendor_name", vendor.nom)
        .maybeSingle();

      setIsInTracking(!!data);
    };

    checkTrackingStatus();
  }, [vendor.id, vendor.nom]);

  const handleTrackingClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setPendingAction('tracking');
      setShowAuthModal(true);
      return;
    }

    try {
      setIsAddingToTracking(true);

      if (isInTracking) {
        await supabase
          .from("vendors_tracking_preprod")
          .delete()
          .eq("user_id", user.id)
          .eq("vendor_name", vendor.nom);

        toast({
          title: "Retiré du suivi",
          description: `${vendor.nom} a été retiré de votre suivi`,
        });

        setIsInTracking(false);
      } else {
        await supabase.from("vendors_tracking_preprod").insert({
          user_id: user.id,
          vendor_name: vendor.nom,
          category: vendor.categorie || "Prestataire",
          status: "à contacter",
          location: ((vendor.regions as any)?.[0] || vendor.ville || ''),
          source: "mariable",
        });

        toast({
          title: "Ajouté au suivi",
          description: `${vendor.nom} a bien été ajouté à votre suivi`,
        });

        setIsInTracking(true);

        if (onWishlistAdd) {
          onWishlistAdd(vendor);
        }
      }
    } catch (error) {
      console.error("Error updating tracking:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToTracking(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    
    // Retry the pending action after successful auth
    setTimeout(() => {
      if (pendingAction === 'cart') {
        handleCartClick({ stopPropagation: () => {} } as React.MouseEvent);
      } else if (pendingAction === 'tracking') {
        handleTrackingClick({ stopPropagation: () => {} } as React.MouseEvent);
      }
      setPendingAction(null);
    }, 300);
  };

  return (
    <>
      <Card
        className="overflow-hidden border-editorial-border hover:shadow-md transition-all cursor-pointer h-full flex flex-col rounded-none w-full max-w-full"
        onClick={() => onClick(vendor)}
      >
        <div className="relative flex-shrink-0">
          <AspectRatio ratio={16 / 9}>
            <FeaturedImage presta={vendor} />
          </AspectRatio>
          <Badge className="absolute top-3 left-3 bg-white/90 text-editorial-noir font-medium rounded-none">
            {vendor.categorie || "Prestataire"}
          </Badge>
          {/* Boutons en haut à droite */}
          <div className="absolute top-3 right-3 flex gap-2">
            {/* Bouton panier */}
            <Button
              size="sm"
              variant="secondary"
              className={`rounded-none p-2 ${
                inCart
                  ? "bg-editorial-olive text-white hover:bg-editorial-noir"
                  : "bg-white/90 hover:bg-white text-editorial-olive"
              }`}
              onClick={handleCartClick}
            >
              {inCart ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
              <span className="sr-only">{inCart ? "Dans le panier" : "Ajouter au panier"}</span>
            </Button>
            {/* Bouton suivi */}
            <Button
              size="sm"
              variant="secondary"
              className={`rounded-none p-2 ${
                isInTracking
                  ? "bg-editorial-olive text-white hover:bg-editorial-noir"
                  : "bg-white/90 hover:bg-white text-editorial-olive"
              }`}
              onClick={handleTrackingClick}
              disabled={isAddingToTracking}
            >
              <Plus className={`h-5 w-5 ${isInTracking ? "fill-current" : ""}`} />
              <span className="sr-only">{isInTracking ? "Retirer du suivi" : "Ajouter au suivi"}</span>
            </Button>
          </div>
          {isPartner && (
            <Badge className="absolute bottom-3 right-3 bg-editorial-olive text-white font-medium rounded-none">
              Partenaire
            </Badge>
          )}
        </div>

        <CardContent className="p-4 flex-grow">
          <h3 className="text-lg font-serif mb-1 line-clamp-1 text-editorial-noir">{vendor.nom}</h3>

          <div className="flex items-center text-sm text-editorial-gray min-h-[24px]">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" /> 
            <span className="line-clamp-1">{location || 'France'}</span>
          </div>

          <div className="mt-2 font-medium text-sm min-h-[24px] text-editorial-noir">
            <div className="flex items-center">
              <Euro className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{getFormattedPrice()}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 mt-auto">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onClick(vendor);
            }}
            className="w-full bg-editorial-olive hover:bg-editorial-olive/90 text-white rounded-none"
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
