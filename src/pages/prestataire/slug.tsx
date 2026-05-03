import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import PremiumHeader from "@/components/home/PremiumHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import GoogleReviews from "@/components/vendors/GoogleReviews";
import PhotoGalleryViewer from "@/components/vendors/PhotoGalleryViewer";
import VendorMoreInfo from "@/components/vendors/VendorMoreInfo";

import { Prestataire, PrestatairePhoto } from "@/components/admin/types";

const SinglePrestataire = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [vendorId, setVendorId] = useState<string>("");
  const [, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, newSession) => setSession(newSession));
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
  }, []);

  const { data: vendor, isLoading } = useQuery({
    queryKey: ["vendor", slug],
    queryFn: async () => {
      if (!slug) return null;

      let { data, error } = await supabase
        .from("prestataires_rows")
        .select("*, prestataires_photos_preprod(*)")
        .eq("slug", slug)
        .maybeSingle();

      if (!data && !error) {
        const result = await supabase
          .from("prestataires_rows")
          .select("*, prestataires_photos_preprod(*)")
          .eq("id", slug)
          .maybeSingle();
        data = result.data;
        error = result.error;
      }

      if (error) {
        toast({ description: `Erreur lors du chargement: ${error.message}`, variant: "destructive" });
        throw new Error(error.message);
      }

      if (!data) {
        toast({ description: `Ce prestataire n'existe pas ou a été supprimé.`, variant: "destructive" });
        return null;
      }

      const prestataireData = data as unknown as Prestataire;

      const { data: metas } = await supabase.from("prestataires_meta").select("*").eq("prestataire_id", prestataireData.id);
      prestataireData.prestataires_meta = metas || [];

      const { data: brochures } = await supabase.from("prestataires_brochures_preprod").select("*").eq("prestataire_id", prestataireData.id);
      prestataireData.prestataires_brochures = brochures || [];

      return prestataireData;
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (vendor) {
      if (vendor.visible === false) {
        toast({ description: `Preview du prestataire ${vendor.nom} en cours.`, variant: "success", duration: 999999 });
      }
      setVendorId(vendor.id);
    }
  }, [vendor]);

  const { data: photos } = useQuery({
    queryKey: ["vendor-photos", slug, vendorId],
    queryFn: async () => {
      if (!vendorId) return [];
      const { data, error } = await supabase
        .from("prestataires_photos_preprod")
        .select("*")
        .eq("prestataire_id", vendorId)
        .order("ordre", { ascending: true });
      if (error) {
        console.error("Error fetching photos:", error);
        return [];
      }
      return data as PrestatairePhoto[];
    },
    enabled: !!vendorId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PremiumHeader />
        <div className="container max-w-6xl px-4 py-12 flex justify-center items-center pt-32">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-editorial-noir mx-auto mb-4" />
            <p>Chargement des informations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PremiumHeader />
        <div className="container max-w-6xl px-4 py-12 flex justify-center pt-32">
          <Card className="p-8 text-center rounded-none">
            <h1 className="text-2xl font-serif mb-4">Prestataire non trouvé</h1>
            <p className="mb-6">Ce prestataire n'existe pas ou a été supprimé.</p>
            <Button
              className="bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none"
              onClick={() => navigate("/professionnelsmariable")}
            >
              Retour au guide
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const mainImage =
    photos && photos.length > 0
      ? photos.find((p) => p.principale)?.url || photos[0].url
      : "/placeholder.svg";

  const regionDisplay = (vendor.regions as any)?.[0] || "";

  const renderStyleBadges = () => {
    try {
      if (vendor?.styles && Array.isArray(vendor.styles)) {
        return vendor.styles.map((style, index) => (
          <Badge key={index} variant="outline" className="rounded-none">
            {String(style)}
          </Badge>
        ));
      } else if (vendor?.styles && typeof vendor.styles === "string") {
        try {
          const styles = JSON.parse(String(vendor.styles));
          if (Array.isArray(styles)) {
            return styles.map((style, index) => (
              <Badge key={index} variant="outline" className="rounded-none">{String(style)}</Badge>
            ));
          }
        } catch {
          return <Badge variant="outline" className="rounded-none">{String(vendor.styles)}</Badge>;
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  const hasPackages = vendor.show_prices && (vendor.first_price_package || vendor.second_price_package || vendor.third_price_package || vendor.fourth_price_package);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PremiumHeader />

      {/* Sticky Back bar — sous le header pour éviter qu'il soit caché */}
      <div className="sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur border-b border-editorial-noir/10">
        <div className="container max-w-5xl mx-auto px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/professionnelsmariable")}
            className="text-editorial-noir hover:bg-editorial-beige/50 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au guide
          </Button>
        </div>
      </div>

      <main className="flex-grow">
        {/* Hero Photo full width */}
        <div className="relative h-[55vh] md:h-[70vh] w-full">
          <img
            src={mainImage}
            alt={vendor?.nom || "Prestataire de mariage"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <div className="absolute bottom-8 left-4 md:left-12 text-white max-w-2xl">
            <Badge className="bg-white/20 text-white border-white/30 mb-3 rounded-none">
              {vendor?.categorie}
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-3">{vendor?.nom}</h1>
            <div className="flex items-center gap-2 text-white/90 text-sm md:text-base">
              <MapPin className="h-4 w-4" />
              <span>
                {vendor?.ville ? `${vendor.ville}, ${regionDisplay}` : regionDisplay || "Non spécifié"}
              </span>
            </div>
          </div>
        </div>

        {/* Editorial single column */}
        <div className="container max-w-4xl mx-auto px-4 py-16 md:py-20 space-y-16">
          {/* À propos */}
          <section>
            <p className="text-xs uppercase tracking-[0.3em] text-premium-sage mb-4">À propos</p>
            <h2 className="text-3xl md:text-4xl font-serif text-editorial-noir mb-6">
              {vendor.nom}
            </h2>
            <div className="prose prose-lg max-w-none text-editorial-noir/80 leading-relaxed font-serif">
              <p>{vendor.description || "Aucune description disponible pour ce prestataire."}</p>
            </div>
            {vendor.styles && (
              <div className="flex flex-wrap gap-2 mt-8">
                {renderStyleBadges()}
              </div>
            )}
          </section>

          {/* Galerie photo */}
          {photos && photos.length > 0 && (
            <section>
              <p className="text-xs uppercase tracking-[0.3em] text-premium-sage mb-4">Galerie</p>
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-8">
                L'univers en images
              </h2>
              <PhotoGalleryViewer photos={photos || []} vendorName={vendor.nom} />
            </section>
          )}

          {/* Avis Google */}
          {vendor.google_rating && (
            <section>
              <p className="text-xs uppercase tracking-[0.3em] text-premium-sage mb-4">Témoignages</p>
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-6">
                Ce que disent les couples
              </h2>
              <GoogleReviews
                rating={vendor.google_rating}
                reviewsCount={vendor.google_reviews_count}
                businessUrl={vendor.google_business_url}
              />
            </section>
          )}

          {/* Documents */}
          {vendor.prestataires_brochures && vendor.prestataires_brochures.length > 0 && (
            <section>
              <p className="text-xs uppercase tracking-[0.3em] text-premium-sage mb-4">Documentation</p>
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-6">
                Documents utiles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendor.prestataires_brochures.map((brochure) =>
                  brochure.url ? (
                    <Card key={brochure.id} className="rounded-none border-editorial-noir/10">
                      <a href={brochure.url} target="_blank" className="p-4 block hover:bg-editorial-beige/20 transition-colors" rel="noopener noreferrer">
                        {brochure.filename || "Télécharger le document"}
                      </a>
                    </Card>
                  ) : null,
                )}
              </div>
            </section>
          )}

          {/* More Info */}
          <VendorMoreInfo website={vendor.site_web} vendorName={vendor.nom} />

          {/* Prix / Formules — EN DERNIER */}
          {hasPackages && (
            <section className="pt-8 border-t border-editorial-noir/10">
              <p className="text-xs uppercase tracking-[0.3em] text-premium-sage mb-4">Tarifs</p>
              <h2 className="text-2xl md:text-3xl font-serif text-editorial-noir mb-8">
                {vendor.categorie === "Traiteur" ? "Nos menus" : "Nos formules"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: vendor.first_price_package_name, desc: vendor.first_price_package_description, price: vendor.first_price_package },
                  { name: vendor.second_price_package_name, desc: vendor.second_price_package_description, price: vendor.second_price_package },
                  { name: vendor.third_price_package_name, desc: vendor.third_price_package_description, price: vendor.third_price_package },
                  { name: vendor.fourth_price_package_name, desc: vendor.fourth_price_package_description, price: vendor.fourth_price_package },
                ].map((p, i) =>
                  p.name && p.price ? (
                    <Card key={i} className="p-6 rounded-none border-editorial-noir/10">
                      <h3 className="font-medium text-editorial-noir mb-2">{p.name}</h3>
                      <p className="text-sm text-editorial-noir/60 mb-4">{p.desc}</p>
                      <p className="font-serif text-xl text-editorial-noir">
                        {Math.round(p.price)}€{vendor.categorie === "Traiteur" ? "/pers" : ""}
                      </p>
                    </Card>
                  ) : null
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default SinglePrestataire;
