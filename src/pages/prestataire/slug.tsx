import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Session } from "@supabase/supabase-js";
import PremiumHeader from "@/components/home/PremiumHeader";
import VendorContactModal from "@/components/vendors/VendorContactModal";
import VendorMessageModal from "@/components/vendors/VendorMessageModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Users, Star, Euro, MessageSquare, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RdvForm from "@/components/forms/RdvForm";
import ContactForm from "@/components/forms/ContactForm";
import GoogleReviews from "@/components/vendors/GoogleReviews";
import PhotoGalleryViewer from "@/components/vendors/PhotoGalleryViewer";
import VendorMoreInfo from "@/components/vendors/VendorMoreInfo";

import { Prestataire, PrestatairePhoto } from "@/components/admin/types";

type VendorsTrackingPreprod = Database["public"]["Tables"]["vendors_tracking_preprod"]["Row"];

const SinglePrestataire = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [vendorId, setVendorId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [openContact, setOpenContact] = useState(false);
  const [openVendorContact, setOpenVendorContact] = useState(false);
  const [openMessageModal, setOpenMessageModal] = useState(false);
  

  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
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
        toast({
          description: `Erreur lors du chargement du prestataire: ${error.message}`,
          variant: "destructive",
        });
        throw new Error(error.message);
      }

      if (!data) {
        toast({
          description: `Ce prestataire n'existe pas ou a été supprimé.`,
          variant: "destructive",
        });
        return null;
      }

      const prestataireData = data as unknown as Prestataire;

      const { data: metas } = await supabase
        .from("prestataires_meta")
        .select("*")
        .eq("prestataire_id", prestataireData.id);
      prestataireData.prestataires_meta = metas || [];

      const { data: brochures } = await supabase
        .from("prestataires_brochures_preprod")
        .select("*")
        .eq("prestataire_id", prestataireData.id);
      prestataireData.prestataires_brochures = brochures || [];

      return prestataireData;
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (vendor) {
      if (vendor.visible === false) {
        toast({
          description: `Preview du prestataire ${vendor.nom} en cours.`,
          variant: "success",
          duration: 999999,
        });
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

  const sendMessage = async () => {
    if (session) {
      setOpenMessageModal(true);
    } else {
      setOpenVendorContact(true);
    }
  };

  if (!slug && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PremiumHeader />
        <div className="container max-w-6xl px-4 py-12 flex justify-center">
          <Card className="p-8 text-center rounded-none">
            <h1 className="text-2xl font-serif mb-4">Aucun prestataire sélectionné</h1>
            <p className="mb-6">Veuillez sélectionner un prestataire depuis notre moteur de recherche.</p>
            <Button
              className="bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none"
              onClick={() => navigate("/recherche")}
            >
              Retour à la recherche
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PremiumHeader />
        <div className="container max-w-6xl px-4 py-12 flex justify-center items-center">
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
        <div className="container max-w-6xl px-4 py-12 flex justify-center">
          <Card className="p-8 text-center rounded-none">
            <h1 className="text-2xl font-serif mb-4">Prestataire non trouvé</h1>
            <p className="mb-6">Ce prestataire n'existe pas ou a été supprimé.</p>
            <Button
              className="bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none"
              onClick={() => navigate("/recherche")}
            >
              Retour à la recherche
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const mainImage =
    photos && photos.length > 0
      ? photos.find((p) => p.principale)?.url ||
        photos[0].url
      : "/placeholder.svg";

  const regionDisplay = (vendor.regions as any)?.[0] || "";

  const prixDisplay = vendor.categorie === "Traiteur" && vendor.prix_par_personne
    ? `À partir de ${vendor.prix_par_personne}€/pers.`
    : vendor.prix_a_partir_de
      ? `À partir de ${vendor.prix_a_partir_de}€`
      : "Prix sur demande";

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
              <Badge key={index} variant="outline" className="rounded-none">
                {String(style)}
              </Badge>
            ));
          }
        } catch (e) {
          return <Badge variant="outline" className="rounded-none">{String(vendor.styles)}</Badge>;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PremiumHeader />

      <main className="flex-grow">
        {/* Hero Photo - Full width cover */}
        <div className="relative h-[50vh] md:h-[60vh] w-full">
          <img 
            src={mainImage} 
            alt={vendor?.nom || "Prestataire de mariage"} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate("/professionnelsmariable")} 
            className="absolute top-4 left-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          {/* Vendor info overlay */}
          <div className="absolute bottom-8 left-4 md:left-8 text-white max-w-2xl">
            <Badge className="bg-white/20 text-white border-white/30 mb-3 rounded-none">
              {vendor?.categorie}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-serif mb-3">{vendor?.nom}</h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="h-4 w-4" />
              <span>
                {vendor?.ville ? `${vendor.ville}, ${regionDisplay}` : regionDisplay || "Non spécifié"}
              </span>
            </div>
          </div>
        </div>


        {/* Main Content */}
        <div className="container max-w-6xl px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Content */}
            <div className="flex-grow space-y-8">
              {/* Description */}
              <section>
                <h2 className="text-2xl font-serif text-editorial-noir mb-4">À propos</h2>
                <p className="text-editorial-noir/70 leading-relaxed">
                  {vendor.description || "Aucune description disponible pour ce prestataire."}
                </p>
                
                {/* Styles */}
                {vendor.styles && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {renderStyleBadges()}
                  </div>
                )}
              </section>

              {/* Formules / Packages */}
              {vendor.show_prices && (vendor.first_price_package || vendor.second_price_package || vendor.third_price_package || vendor.fourth_price_package) && (
                <section>
                  <h2 className="text-2xl font-serif text-editorial-noir mb-6">
                    {vendor.categorie === "Traiteur" ? "Nos menus" : "Nos formules"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vendor.first_price_package_name && vendor.first_price_package && (
                      <Card className="p-6 rounded-none border-editorial-noir/10">
                        <h3 className="font-medium text-editorial-noir mb-2">{vendor.first_price_package_name}</h3>
                        <p className="text-sm text-editorial-noir/60 mb-4">{vendor.first_price_package_description}</p>
                        <p className="font-medium text-editorial-noir">
                          {Math.round(vendor.first_price_package)}€{vendor.categorie === "Traiteur" ? "/pers" : ""}
                        </p>
                      </Card>
                    )}
                    {vendor.second_price_package_name && vendor.second_price_package && (
                      <Card className="p-6 rounded-none border-editorial-noir/10">
                        <h3 className="font-medium text-editorial-noir mb-2">{vendor.second_price_package_name}</h3>
                        <p className="text-sm text-editorial-noir/60 mb-4">{vendor.second_price_package_description}</p>
                        <p className="font-medium text-editorial-noir">
                          {Math.round(vendor.second_price_package)}€{vendor.categorie === "Traiteur" ? "/pers" : ""}
                        </p>
                      </Card>
                    )}
                    {vendor.third_price_package_name && vendor.third_price_package && (
                      <Card className="p-6 rounded-none border-editorial-noir/10">
                        <h3 className="font-medium text-editorial-noir mb-2">{vendor.third_price_package_name}</h3>
                        <p className="text-sm text-editorial-noir/60 mb-4">{vendor.third_price_package_description}</p>
                        <p className="font-medium text-editorial-noir">
                          {Math.round(vendor.third_price_package)}€{vendor.categorie === "Traiteur" ? "/pers" : ""}
                        </p>
                      </Card>
                    )}
                    {vendor.fourth_price_package_name && vendor.fourth_price_package && (
                      <Card className="p-6 rounded-none border-editorial-noir/10">
                        <h3 className="font-medium text-editorial-noir mb-2">{vendor.fourth_price_package_name}</h3>
                        <p className="text-sm text-editorial-noir/60 mb-4">{vendor.fourth_price_package_description}</p>
                        <p className="font-medium text-editorial-noir">
                          {Math.round(vendor.fourth_price_package)}€{vendor.categorie === "Traiteur" ? "/pers" : ""}
                        </p>
                      </Card>
                    )}
                  </div>
                </section>
              )}

              {/* Google Reviews */}
              <GoogleReviews
                rating={vendor.google_rating}
                reviewsCount={vendor.google_reviews_count}
                businessUrl={vendor.google_business_url}
              />

              {/* Full Gallery - Always visible */}
              {photos && photos.length > 0 && (
                <section>
                  <h2 className="text-2xl font-serif text-editorial-noir mb-6">Galerie photo</h2>
                  <PhotoGalleryViewer photos={photos || []} vendorName={vendor.nom} />
                </section>
              )}

              {/* Section Avantages - Après la galerie */}
              <section className="py-8 px-6 bg-editorial-beige/30 -mx-6">
                <h2 className="text-2xl font-serif text-editorial-noir mb-8 text-center">
                  Les Avantages
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Capacité */}
                  {vendor.capacite_invites && (
                    <div className="bg-white p-6 text-center">
                      <Users className="w-8 h-8 text-premium-sage mx-auto mb-3" />
                      <p className="font-medium text-editorial-noir">Capacité</p>
                      <p className="text-sm text-editorial-noir/70">Jusqu'à {vendor.capacite_invites} invités</p>
                    </div>
                  )}
                  {/* Prix */}
                  <div className="bg-white p-6 text-center">
                    <Euro className="w-8 h-8 text-premium-sage mx-auto mb-3" />
                    <p className="font-medium text-editorial-noir">Prix</p>
                    <p className="text-sm text-editorial-noir/70">{prixDisplay}</p>
                  </div>
                  {/* Club Mariable */}
                  <div className="bg-white p-6 text-center">
                    <Sparkles className="w-8 h-8 text-premium-sage mx-auto mb-3" />
                    <p className="font-medium text-editorial-noir">Club Mariable</p>
                    <p className="text-sm text-editorial-noir/70">
                      {vendor.avantage_propose || "Avantage exclusif"}
                    </p>
                  </div>
                  {/* Avis Google */}
                  {vendor.google_rating && (
                    <div className="bg-white p-6 text-center">
                      <Star className="w-8 h-8 text-premium-sage mx-auto mb-3" />
                      <p className="font-medium text-editorial-noir">{vendor.google_rating}/5</p>
                      <p className="text-sm text-editorial-noir/70">{vendor.google_reviews_count} avis Google</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Documents */}
              {vendor && vendor.prestataires_brochures && vendor.prestataires_brochures.length > 0 && (
                <section>
                  <h2 className="text-2xl font-serif text-editorial-noir mb-6">Documents utiles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vendor.prestataires_brochures.map((brochure) =>
                      brochure.url ? (
                        <Card key={brochure.id} className="rounded-none">
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
            </div>

            {/* Right Column - Simplified Contact Sidebar */}
            <div className="w-full lg:w-80 space-y-4">
              <Card className="p-6 rounded-none sticky top-4">
                <h3 className="text-lg font-serif text-editorial-noir mb-4">Demander les disponibilités</h3>
                
                <Button 
                  className="w-full bg-editorial-noir text-white hover:bg-editorial-noir/90 rounded-none" 
                  onClick={sendMessage}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contacter
                </Button>

                {/* Contact Modals */}
                <VendorContactModal
                  isOpen={openVendorContact}
                  onClose={() => setOpenVendorContact(false)}
                  vendorId={vendorId}
                  vendorName={vendor?.nom || ""}
                />

                <VendorMessageModal
                  isOpen={openMessageModal}
                  onClose={() => setOpenMessageModal(false)}
                  vendorId={vendorId}
                  vendorName={vendor?.nom || ""}
                />

                <Dialog open={openContact} onOpenChange={setOpenContact}>
                  <DialogTrigger asChild></DialogTrigger>
                  <DialogContent className="max-w-[95%] md:max-w-[70%] md:max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Demande de contact avec {vendor.nom}</DialogTitle>
                    </DialogHeader>
                    <ContactForm
                      prestataire={vendor}
                      user={session ?? session}
                      dialogClose={() => setOpenContact(false)}
                    />
                  </DialogContent>
                </Dialog>

                {/* Club Mariable Alert */}
                <Alert className="bg-premium-sage/10 border-premium-sage mt-4 rounded-none">
                  <Sparkles className="h-4 w-4 text-premium-sage" />
                  <AlertDescription className="text-sm">
                    <strong>✨ Club Mariable :</strong> Découvrez l'avantage exclusif 
                    via notre formulaire de contact
                  </AlertDescription>
                </Alert>

                {/* RDV Dialog */}
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogContent className="max-w-[95%] md:max-w-[70%] md:max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Demande de rendez-vous avec {vendor.nom}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                      <RdvForm
                        prestataire_id={vendor.id}
                        prestataire_name={vendor.nom}
                        contact_date={undefined}
                        email_prestataire={vendor.email}
                        dialogClose={() => setOpen(false)}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SinglePrestataire;
