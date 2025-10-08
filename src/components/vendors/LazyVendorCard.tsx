import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Euro, ExternalLink, Plus } from "lucide-react";
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
  const [isAddingToTracking, setIsAddingToTracking] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isInTracking, setIsInTracking] = useState(false);
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

  // Vérifier si l'utilisateur est connecté et si le prestataire est dans son suivi
  useEffect(() => {
    const checkTrackingStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('vendors_tracking_preprod')
          .select('id')
          .eq('user_id', user.id)
          .eq('vendor_name', vendor.nom)
          .single();
        
        if (!error && data) {
          setIsInTracking(true);
        }
      }
    };

    if (isVisible) {
      checkTrackingStatus();
    }
  }, [vendor.id, isVisible]);

  const handleTrackingClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsAddingToTracking(true);

    try {
      if (isInTracking) {
        const { error } = await supabase
          .from('vendors_tracking_preprod')
          .delete()
          .eq('user_id', user.id)
          .eq('vendor_name', vendor.nom);

        if (error) throw error;
        setIsInTracking(false);
        toast({ title: "Retiré du suivi" });
      } else {
        const { error } = await supabase
          .from('vendors_tracking_preprod')
          .insert({
            user_id: user.id,
            vendor_name: vendor.nom,
            category: vendor.categorie || "Prestataire",
            status: "à contacter",
            location: ((vendor.regions as any)?.[0] || vendor.ville || ''),
            source: "mariable",
          });

        if (error) throw error;
        setIsInTracking(true);
        toast({ title: "Ajouté au suivi" });
        onWishlistAdd?.(vendor);
      }
    } catch (error) {
      console.error('Erreur suivi:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier votre suivi",
        variant: "destructive",
      });
    } finally {
      setIsAddingToTracking(false);
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
              className="absolute bottom-3 right-3 bg-wedding-olive text-white"
            >
              Partenaire
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 bg-white/90 hover:bg-white ${
              isInTracking ? 'text-wedding-olive' : 'text-muted-foreground'
            }`}
            onClick={handleTrackingClick}
            disabled={isAddingToTracking}
          >
            <Plus className={`h-4 w-4 ${isInTracking ? 'fill-current' : ''}`} />
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