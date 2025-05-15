import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
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
import { set } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RdvForm from "@/components/forms/RdvForm";
import ContactForm from "@/components/forms/ContactForm";

// At the beginning of the file, import the extended Prestataire type
import { PrestataireRow } from "@/components/wedding-day/utils";

type Prestataire = Database["public"]["Tables"]["prestataires_rows"]["Row"];
type PrestatairePhoto =
  Database["public"]["Tables"]["prestataires_photos_preprod"]["Row"];
type VendorsTrackingPreprod =
  Database["public"]["Tables"]["vendors_tracking_preprod"]["Row"];

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

const SinglePrestataire = () => {
  const { slug } = useParams();
  const [vendorId, setVendorId] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<number>(100);
  const [packages, setPackages] = useState<Package[]>(DEFAULT_PACKAGES);
  const [selectedPackage, setSelectedPackage] = useState<Package>(
    DEFAULT_PACKAGES[0]
  );
  const [open, setOpen] = useState(false);
  const [openContact, setOpenContact] = useState(false);

  //check if user is connected
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const disabledDates = [
    new Date(2025, 5, 15),
    new Date(2025, 5, 16),
    new Date(2025, 5, 17),
    new Date(2025, 6, 1),
  ];

  const { data: vendor, isLoading } = useQuery({
    queryKey: ["vendor", slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from("prestataires_rows")
        .select("*, prestataires_photos_preprod(*)")
        .eq("slug", slug)
        .single();

      if (data) {
        const { data: metas } = await supabase
          .from("prestataires_meta")
          .select("*")
          .eq("prestataire_id", data.id);

        data.prestataires_meta = metas;
      }
      if (data) {
        const { data: brochures } = await supabase
          .from("prestataires_brochures_preprod")
          .select("*")
          .eq("prestataire_id", data.id);

        data.prestataires_brochures = brochures;
      }

      if (error) {
        toast({
          description: `Erreur lors du chargement du prestataire: ${error.message}`,
          variant: "destructive",
        });
        throw new Error(error.message);
      }
      return data as Prestataire;
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (vendor?.id) {
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
    queryKey: ["vendor-photos", slug],
    queryFn: async () => {
      if (!slug) return [];

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
      if (vendor.prix_a_partir_de) {
        // Pour les traiteurs, on utilise plutôt le prix par personne
        if (vendor.categorie === "Traiteur" && vendor.prix_par_personne) {
          const basePrice = vendor.prix_par_personne;
          const newPackages = [
            {
              name: "Menu Standard",
              basePrice: basePrice,
              description: "Menu basique",
            },
            {
              name: "Menu Premium",
              basePrice: basePrice * 1.4,
              description: "Menu intermédiaire",
            },
            {
              name: "Menu Gastronomique",
              basePrice: basePrice * 1.8,
              description: "Menu complet",
            },
          ];
          setPackages(newPackages);
          setSelectedPackage(newPackages[0]);
        } else {
          const basePrice = vendor.prix_a_partir_de;
          const newPackages = [
            {
              name: "Classique",
              basePrice: basePrice,
              description: "Formule de base",
            },
            {
              name: "Premium",
              basePrice: basePrice * 1.4,
              description: "Formule intermédiaire",
            },
            {
              name: "Luxe",
              basePrice: basePrice * 1.8,
              description: "Formule complète",
            },
          ];
          setPackages(newPackages);
          setSelectedPackage(newPackages[0]);
        }
      }
      const hasAllThreePrices = [
        "first_price_package",
        "second_price_package",
        "third_price_package",
      ].every((key) =>
        vendor.prestataires_meta.some((meta) => meta.meta_key === key)
      );

      if (hasAllThreePrices) {
        const getMetaValue = (key: string) => {
          const meta = vendor.prestataires_meta.find(
            (meta) => meta.meta_key === key
          );
          return meta ? parseFloat(meta.meta_value) : 0;
        };

        const newPackages = [
          {
            name: "Classique",
            basePrice: getMetaValue("first_price_package"),
            description: "Formule de base",
          },
          {
            name: "Premium",
            basePrice: getMetaValue("second_price_package"),
            description: "Formule intermédiaire",
          },
          {
            name: "Luxe",
            basePrice: getMetaValue("third_price_package"),
            description: "Formule complète",
          },
        ];

        setPackages(newPackages);
        setSelectedPackage(newPackages[0]);
      }
    }
  }, [vendor]);

  // Effet pour recalculer le prix lorsque le nombre d'invités change (pour les traiteurs)
  useEffect(() => {
    if (vendor?.categorie === "Traiteur") {
      // Mise à jour de la formule sélectionnée pour forcer le recalcul des prix
      setSelectedPackage((prev) => ({ ...prev }));
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
    const basePrice = selectedPackage.basePrice;

    // Calcul spécifique pour les traiteurs (prix par personne × nombre d'invités)
    let calculatedBasePrice = basePrice;
    if (vendor?.categorie === "Traiteur") {
      calculatedBasePrice = basePrice * guests;
    }

    const commission = calculatedBasePrice * 0.04; // 4% de commission
    return {
      basePrice: calculatedBasePrice,
      commission,
      total: calculatedBasePrice + commission,
    };
  };

  const prices = calculateTotal();

  const fetchCurrentRDV = async (
    userId: string | null | undefined,
    vendorId: string | null | undefined
  ) => {
    if (!userId || !vendorId || vendorId.trim() === "") {
      console.warn("ID(s) manquant(s) pour fetchCurrentRDV", {
        userId,
        vendorId,
      });
      return null;
    }

    const { data, error } = await supabase
      .from("vendors_tracking_preprod")
      .select("*")
      .eq("user_id", userId)
      .eq("prestataire_id", vendorId)
      .maybeSingle();

    if (error) {
      return null;
    }

    return data;
  };

  const checkCurrentRDV = async () => {
    if (!session || !vendorId || vendorId.trim() === "") {
      toast({
        description: "Vous devez être connecté pour effectuer cette action.",
      });
      return null;
    }

    const data = await fetchCurrentRDV(session.user.id, vendorId);

    if (!data || data.status === "annuler") {
      setOpen(true);
      return data;
    } else {
      toast({
        description: "Vous devez être connecté pour effectuer cette action.",
      });
      return null;
    }
  };
  const [hasCurrentRDV, setHasCurrentRDV] = useState(false);

  useEffect(() => {
    if (!session || !vendorId || vendorId.trim() === "") return;

    const fetchRDV = async () => {
      const data = await fetchCurrentRDV(session.user.id, vendorId);
      console.log(data);

      setHasCurrentRDV(!!data && data.status !== "annuler");
    };

    fetchRDV();
  }, [session, vendorId]);

  const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGuests = parseInt(e.target.value) || 0;
    setGuests(newGuests);
  };

  const sendMessage = async () => {
    if (!session) {
      toast({
        description: "Vous devez être connecté pour effectuer cette action.",
      });
    } else {
      setOpenContact(true);
    }
  };

  if (!slug && !isLoading) {
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
        <div className="relative h-[25vh] w-full hidden">
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
                        index === 1 ? "border-wedding-olive" : ""
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
              <div className="space-y-4">
                <h2 className="text-xl font-serif">Galerie photo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vendor.prestataires_photos_preprod ? (
                    Array.isArray(vendor.prestataires_photos_preprod) &&
                    vendor.prestataires_photos_preprod.map((photo) => (
                      <Dialog key={photo.id}>
                        <DialogTrigger asChild>
                          <Card>
                            <img
                              src={photo.url}
                              alt={vendor.nom}
                              className="w-full h-auto cursor-pointer"
                            />
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="max-w-[80vw] max-h-[90vh] overflow-y-auto">
                          <img
                            src={photo.url}
                            alt={vendor.nom}
                            className="w-full h-auto"
                          />
                        </DialogContent>
                      </Dialog>
                    ))
                  ) : (
                    <p>Aucune photo disponible pour ce prestataire.</p>
                  )}
                </div>
              </div>
              {vendor.prestataires_brochures.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-serif">Brochures</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vendor.prestataires_brochures.map((brochure) =>
                      brochure.url ? (
                        <Card key={brochure.id}>
                          <p>
                            <a
                              href={brochure.url}
                              target="_blank"
                              className="p-4 block"
                              rel="noopener noreferrer"
                            >
                              Télécharger la brochure
                            </a>
                          </p>
                        </Card>
                      ) : (
                        <p>Aucune brochure disponible pour ce prestataire.</p>
                      )
                    )}
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

                <div className="mt-4">
                  <Label>
                    {vendor.categorie === "Traiteur" ? "Menu" : "Formule"}
                  </Label>
                  <RadioGroup
                    value={selectedPackage.name}
                    onValueChange={(value) =>
                      setSelectedPackage(
                        packages.find((p) => p.name === value) || packages[0]
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

                <div className="mt-6 border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>
                      {vendor.categorie === "Traiteur"
                        ? `Prix du menu (${guests} pers.)`
                        : "Prix de base"}
                    </span>
                    <span>{Math.round(prices.basePrice)}€</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Frais de réservation (4%)</span>
                    <span>{Math.round(prices.commission)}€</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg border-t pt-2">
                    <span>Total</span>
                    <span>{Math.round(prices.total)}€</span>
                  </div>
                </div>
                 <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={sendMessage}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contacter
                </Button>
                <Dialog open={openContact} onOpenChange={setOpenContact}>
                  <DialogTrigger asChild></DialogTrigger>
                  <DialogContent className="max-w-[95%] md:max-w-[70%] md:max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        Demande de contact avec {vendor.nom}
                      </DialogTitle>
                    </DialogHeader>
                    <ContactForm
                      prestataire={vendor}
                      user={session ?? session}
                      dialogClose={() => setOpenContact(false)}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  id="button-rdv"
                  className="w-full mt-4 bg-wedding-olive hover:bg-wedding-olive/90"
                  disabled={hasCurrentRDV}
                  onClick={checkCurrentRDV}
                >
                  Prendre RDV
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogContent className="max-w-[95%] md:max-w-[70%] md:max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        Demande de rendez-vous avec {vendor.nom}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                      <RdvForm
                        prestataire_id={vendor.id}
                        prestataire_name={vendor.nom}
                        contact_date={date}
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
