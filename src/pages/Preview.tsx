import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Session } from "@supabase/supabase-js";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Users,
  Star,
  Award,
  CalendarCheck,
  Euro,
  MessageSquare,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { se } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

type Prestataire = Database["public"]["Tables"]["prestataires_rows"]["Row"];
type PrestatairePhoto = Database["public"]["Tables"]["prestataires_photos_preprod"]["Row"];
type VendorsTrackingPreprod =  Database["public"]["Tables"]["vendors_tracking_preprod"]["Row"];
type SupabaseAdminUser = Database["public"]["Tables"]["admin_users"]["Row"];

interface Package {
  name: string;
  basePrice: number;
  description: string;
}

const DEFAULT_PACKAGES: Package[] = [
  {
    name: "Classique",
    basePrice: 3200,
    description: "Location simple du domaine",
  },
  { name: "Premium", basePrice: 4500, description: "Location + coordination" },
  { name: "Luxe", basePrice: 6000, description: "Service tout inclus" },
];

const Preview = () => {
  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get("id");

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<number>(100);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  //check if user is connected
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user?.id) {
        checkIfAdmin(newSession.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        checkIfAdmin(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkIfAdmin = async (userId: string) => {
    const { data, error } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", userId)
      .single<SupabaseAdminUser>();
    setIsAdmin(!error && !!data);
  };



  const disabledDates = [
    new Date(2025, 5, 15),
    new Date(2025, 5, 16),
    new Date(2025, 5, 17),
    new Date(2025, 6, 1),
  ];

  const { data: vendor, isLoading } = useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: async () => {
      if (!vendorId) return null;

      const { data, error } = await supabase
        .from("prestataires_rows")
        .select("*")
        .eq("id", vendorId)
        .single();

      if (error) {
        toast({
          description: `Erreur lors du chargement du prestataire: ${error.message}`,
          variant: "destructive",
        });
        throw new Error(error.message);
      }

      return data as Prestataire;
    },
    enabled: !!vendorId,
  });

  const { data: photos } = useQuery({
    queryKey: ["vendor-photos", vendorId],
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

  useEffect(() => {
    if (vendor) {
      const newPackages: Package[] = [];

      if (vendor.show_prices) {
          if (vendor.first_price_package_name && vendor.first_price_package) {
              newPackages.push({
                  name: vendor.first_price_package_name,
                  basePrice: vendor.first_price_package,
                  description: vendor.first_price_package_description || "",
              });
          }
          if (vendor.second_price_package_name && vendor.second_price_package) {
              newPackages.push({
                  name: vendor.second_price_package_name,
                  basePrice: vendor.second_price_package,
                  description: vendor.second_price_package_description || "",
              });
          }
          if (vendor.third_price_package_name && vendor.third_price_package) {
              newPackages.push({
                  name: vendor.third_price_package_name,
                  basePrice: vendor.third_price_package,
                  description: vendor.third_price_package_description || "",
              });
          }
      }

      setPackages(newPackages);

      if (newPackages.length > 0) {
        setSelectedPackage(newPackages[0]);
      } else {
        setSelectedPackage(null);
      }
    }
  }, [vendor]);

  // Effet pour recalculer le prix lorsque le nombre d'invités change (pour les traiteurs)
  useEffect(() => {
    if (vendor?.categorie === "Traiteur") {
      // Mise à jour de la formule sélectionnée pour forcer le recalcul des prix
      setSelectedPackage((prev) => (prev ? { ...prev } : null));
    }
  }, [guests, vendor?.categorie]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      const isDisabled = disabledDates.some(
        (disabled) => disabled.toDateString() === newDate.toDateString()
      );
      if (isDisabled) {
        toast({
          description: "Cette date n'est pas disponible",
          variant: "destructive",
        });
      } else {
        toast({
          description:
            "Date disponible ! Vous pouvez poursuivre votre réservation.",
        });
      }
    }
  };

  const calculateTotal = () => {
    if (!selectedPackage) {
      return { basePrice: 0, total: 0 };
    }
    const basePrice = selectedPackage.basePrice;

    // Calcul spécifique pour les traiteurs (prix par personne × nombre d'invités)
    let calculatedBasePrice = basePrice;
    if (vendor?.categorie === "Traiteur") {
      calculatedBasePrice = basePrice * guests;
    }

    // Removed the 4% commission calculation
    return {
      basePrice: calculatedBasePrice,
      total: calculatedBasePrice
    };
  };

  const prices = calculateTotal();

  const checkCurrentRDV = async () => {
    if (session) {
      const { data, error } = await supabase
        .from("vendors_tracking_preprod")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("prestataire_id", vendorId)
        .single();

      return data;
    }
    return null;
  };

  const handleBookingClick = async () => {
    const currentButton = document.querySelector("#button-rdv");
    const newDate = date?.toLocaleDateString();
    const newGuests = guests;
    const newPackage = selectedPackage;

    const currentRDV = await checkCurrentRDV();
    if (session) {
      if (currentRDV) {
        toast({
          description:
            "Vous avez déjà une réservation en attente pour ce prestataire.",
          variant: "destructive",
        });
        return;
      }
      if (newDate && newGuests && newPackage) {
        const { data, error } = await supabase
          .from("vendors_tracking_preprod")
          .insert([
            {
              contact_date: new Date().toISOString(),
              user_id: session.user.id,
              prestataire_id: vendorId,
              category: vendor?.categorie || "Non spécifié",
              vendor_name: vendor?.nom || "Non spécifié",
              status: "en attente",
            },
          ]);
        currentButton?.setAttribute("disabled", "true");

        toast({
          description: `Votre réservation pour ${newGuests} invités le ${newDate} avec le package ${newPackage.name} à bien été envoyée.`,
          variant: "default",
        });
      } else {
        toast({
          description: "Veuillez sélectionner une date et une formule.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        description: "Merci de vous connecter pour réserver",
      });
    }
  };

  const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGuests = parseInt(e.target.value) || 0;
    setGuests(newGuests);
  };

  if (isAdmin === null || isAdmin === false) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Vous n'avez pas accès à cette page...</p>
      </div>
    );
  }

  if (!vendorId && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="container max-w-6xl px-4 py-12 flex justify-center">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-serif mb-4">
              Aucun prestataire sélectionné
            </h1>
            <p className="mb-6">
              Veuillez sélectionner un prestataire depuis notre moteur de
              recherche.
            </p>
            <Button
              className="bg-wedding-olive hover:bg-wedding-olive/90"
              onClick={() => (window.location.href = "/recherche")}
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
        <Header />
        <div className="container max-w-6xl px-4 py-12 flex justify-center items-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-wedding-olive mx-auto mb-4" />
            <p>Chargement des informations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="container max-w-6xl px-4 py-12 flex justify-center">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-serif mb-4">Prestataire non trouvé</h1>
            <p className="mb-6">
              Ce prestataire n'existe pas ou a été supprimé.
            </p>
            <Button
              className="bg-wedding-olive hover:bg-wedding-olive/90"
              onClick={() => (window.location.href = "/recherche")}
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
      ? photos.find((p) => p.principale)?.url || photos[0].url
      : "/placeholder.svg";

  const renderStyleBadges = () => {
    try {
      if (vendor?.styles && Array.isArray(vendor.styles)) {
        return vendor.styles.map((style, index) => (
          <Badge key={index} variant="outline">
            {String(style)}
          </Badge>
        ));
      } else if (vendor?.styles && typeof vendor.styles === "string") {
        try {
          const styles = JSON.parse(String(vendor.styles));
          if (Array.isArray(styles)) {
            return styles.map((style, index) => (
              <Badge key={index} variant="outline">
                {String(style)}
              </Badge>
            ));
          }
        } catch (e) {
          console.warn("Error parsing vendor styles in Demo:", e);
          return <Badge variant="outline">{String(vendor.styles)}</Badge>;
        }
      }
      return <Badge variant="outline">Style non spécifié</Badge>;
    } catch (error) {
      console.warn("Error processing vendor styles:", error);
      return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        <div className="relative h-[60vh] w-full">
          <img
            src={mainImage}
            alt={vendor?.nom || "Prestataire de mariage"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="container max-w-6xl px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow space-y-6">
              <div>
                <h1 className="text-3xl font-serif mb-2">{vendor?.nom}</h1>
                <div className="flex items-center text-muted-foreground gap-2 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {vendor?.ville
                      ? `${vendor.ville}, ${vendor.region || ""}`
                      : vendor?.region || "Non spécifié"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Award className="h-3 w-3" />
                    {vendor?.categorie}
                  </Badge>
                  {vendor?.styles && renderStyleBadges()}
                </div>
              </div>

              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-wedding-olive" />
                    <div>
                      <p className="font-medium">Capacité</p>
                      <p className="text-sm text-muted-foreground">
                        Variable selon prestation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Euro className="h-5 w-5 text-wedding-olive" />
                    <div>
                      <p className="font-medium">Prix</p>
                      <p className="text-sm text-muted-foreground">
                        {vendor.categorie === "Traiteur" &&
                        vendor.prix_par_personne
                          ? `À partir de ${vendor.prix_par_personne}€/pers.`
                          : vendor.prix_a_partir_de
                          ? `À partir de ${vendor.prix_a_partir_de}€`
                          : "Prix sur demande"}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-muted-foreground">
                  {vendor.description ||
                    "Aucune description disponible pour ce prestataire."}
                </p>
              </Card>

              {packages.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-serif">
                    {vendor.categorie === "Traiteur"
                      ? "Nos menus"
                      : "Nos formules"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {packages.map((pkg, index) => (
                      <Card
                        key={index}
                        className={`p-4 ${
                          selectedPackage?.name === pkg.name
                            ? "border-wedding-olive"
                            : ""
                        }`}
                      >
                        <h3 className="font-medium mb-2">{pkg.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {pkg.description}
                        </p>
                        <p className="font-medium">
                          {Math.round(pkg.basePrice)}€
                          {vendor.categorie === "Traiteur" ? "/pers" : ""}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full lg:w-80 space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-4">
                  Vérifier les disponibilités
                </h3>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {date
                        ? date.toLocaleDateString()
                        : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      disabled={disabledDates}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <div className="mt-4">
                  <Label htmlFor="guests">Nombre d'invités</Label>
                  <Input
                    id="guests"
                    type="number"
                    value={guests}
                    onChange={handleGuestsChange}
                    min={1}
                    max={200}
                    className="mt-1"
                  />
                </div>

                {packages.length > 0 && (
                  <div className="mt-4">
                    <Label>
                      {vendor.categorie === "Traiteur" ? "Menu" : "Formule"}
                    </Label>
                    <RadioGroup
                      value={selectedPackage?.name || ""}
                      onValueChange={(value) =>
                        setSelectedPackage(
                          packages.find((p) => p.name === value) || null
                        )
                      }
                      className="mt-2"
                    >
                      {packages.map((pkg) => (
                        <div
                          key={pkg.name}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem value={pkg.name} id={pkg.name} />
                          <Label htmlFor={pkg.name}>{pkg.name}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                <div className="mt-6 border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>
                      {vendor.categorie === "Traiteur"
                        ? `Prix du menu (${guests} pers.)`
                        : "Prix de base"}
                    </span>
                    <span>{Math.round(prices.basePrice)}€</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg border-t pt-2">
                    <span>Total</span>
                    <span>{Math.round(prices.total)}€</span>
                  </div>
                </div>

                <Button
                  id="button-rdv"
                  className="w-full mt-4 bg-wedding-olive hover:bg-wedding-olive/90"
                  onClick={handleBookingClick}
                  disabled={!selectedPackage}
                >
                  Prendre RDV
                </Button>
              </Card>

              <Card className="p-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast({
                      description: "La messagerie sera bientôt disponible",
                    });
                    window.open(`mailto:${vendor.email || ""}`, "_blank");
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contacter
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Preview;
