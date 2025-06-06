import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
const TrackingPage = () => {
  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get("id");
  const isUser = searchParams.get("edit") === "user" ? true : false;
  const keyPresta = searchParams.get("key");
  const LOGO_URL = "/lovable-uploads/a13321ac-adeb-489a-911e-3a88b1411ac2.png";
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedSwitch, setSelectedSwitch] = useState(null);
  const [selectedFileDocument, setSelectedFileDocument] = useState<File | null>(
    null
  );

  const disabledDates = [
    new Date(2025, 5, 15),
    new Date(2025, 5, 16),
    new Date(2025, 5, 17),
    new Date(2025, 6, 1),
  ];

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

  const { data: queryData, isLoading } = useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: async () => {
      if (!vendorId) return null;

      const { data, error } = await supabase
        .from("vendors_tracking_preprod")
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
      if (!data) {
        toast({
          description: "Aucun prestataire trouvé.",
          variant: "destructive",
        });
        return null;
      }

      const { data: project, error: userError } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", data.user_id)
        .single();

      if (userError) {
        toast({
          description: `Erreur lors du chargement de l'utilisateur: ${userError.message}`,
          variant: "destructive",
        });
        throw new Error(userError.message);
      }
      if (!project) {
        toast({
          description: "Aucun utilisateur trouvé.",
          variant: "destructive",
        });
        return null;
      }

      const { data: documents, error: documentsError } = await supabase
        .from("prestataires_documents_preprod")
        .select("*")
        .eq("item_id", data.id);

      if (documentsError) {
        toast({
          description: `Erreur lors du chargement des documents: ${documentsError.message}`,
          variant: "destructive",
        });
        throw new Error(documentsError.message);
      }
      
      // Add documents to data object to make it available in the component
      const vendorData = {
        ...data,
        documents: documents || []
      };

      return { vendorData, project };
    },
    enabled: !!vendorId,
  });
  let vendor = queryData?.vendorData;
  let project = queryData?.project;

  let dateCreated = null;
  let dateMariage = null;
  if (vendor || project) {
    dateCreated = new Date(vendor.created_at).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    dateMariage = new Date(project.wedding_date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  const handleSwitchChange = (value) => {
    setSelectedSwitch(value === selectedSwitch ? null : value); // toggle si on clique encore
  };

  const sendRequest = async () => {
    const message = document.querySelector("textarea")?.value;
    const selectedDate = selectedSwitch;

    if (!selectedDate) {
      toast({
        description: "Veuillez sélectionner une date.",
        variant: "destructive",
      });
      return;
    }

    if (!vendorId) return;

    const { data, error } = await supabase
      .from("vendors_tracking_preprod")
      .update({
        notes: message,
        response_date: new Date().toISOString(),
        valide_date_rdv: selectedDate,
        status: "à valider",
      })
      .eq("id", vendorId);
    if (error) {
      toast({
        description: `Erreur lors de l'envoi de la demande: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        description: "Demande envoyée avec succès !",
        variant: "default",
      });
    }
  };

  const sendValidation = async () => {
    if (!vendorId) return;

    const { data, error } = await supabase
      .from("vendors_tracking_preprod")
      .update({
        status: "réponse reçue",
      })
      .eq("id", vendorId);
    if (error) {
      toast({
        description: `Erreur lors de l'envoi de la demande: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        description: "Demande envoyée avec succès !",
        variant: "default",
      });
    }
  };

  const displayDate = (validate: number) => {
    if (!validate || validate === 0) return "Date non disponible";

    const getFormattedDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Europe/Paris",
      });
    };

    if (validate === 1) return getFormattedDate(vendor.first_date_rdv);
    if (validate === 2) return getFormattedDate(vendor.second_date_rdv);
    if (validate === 3) return getFormattedDate(vendor.third_date_rdv);
  };

  // For the displayDateOrHour function, fix the type conversion issues:
  const displayDateOrHour = (dateStr: string, type: string) => {
    const getFormattedDate = (dateStr: string, type: string) => {
      const date = new Date(dateStr);
      if (type === "date") {
        return date
          .toLocaleString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            // hour: "2-digit",
            // minute: "2-digit",
            // hour12: false,
            timeZone: "Europe/Paris",
          })
          .replace(",", " à");
      }
      if (type === "hour") {
        return date
          .toLocaleString("fr-FR", {
            // year: "numeric",
            // month: "2-digit",
            // day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Europe/Paris",
          })
          .replace(",", " à");
      }
      return "";
    };

    return getFormattedDate(dateStr, type);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFileDocument(files[0]);
    }
  };

  const uploadDocument = async (itemId: string): Promise<string | null> => {
    if (!selectedFileDocument) return null;

    try {
      const fileExt = selectedFileDocument.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${itemId}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("documents")
        .upload(filePath, selectedFileDocument);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(filePath);

      await supabase.from("prestataires_documents_preprod").insert({
        item_id: itemId,
        url: publicUrl,
        filename: selectedFileDocument.name,
        type: selectedFileDocument.type,
        size: selectedFileDocument.size,
      });

      return publicUrl;
    } catch (error) {
      console.error("Erreur lors du téléchargement du document:", error);
      return null;
    }
  };

  const handleUpload = async (itemId: string) => {
    const result = await uploadDocument(itemId);
    if (result) {
      console.log("Fichier envoyé avec succès :", result);
      const uploadInput = document.querySelector(
        "#upload-document"
      ) as HTMLInputElement | null;
      if (uploadInput) {
        uploadInput.value = "";
      }
      toast({
        description: "Fichier envoyé avec succès !",
        variant: "default",
      });
    } else {
      console.error("Échec de l'envoi du fichier.");
    }
  };

  const cancelRdv = async () => {
    // vendor.id
    if (!vendorId) return;
    const { data, error } = await supabase
      .from("vendors_tracking_preprod")
      .update({
        status: "annuler",
      })
      .eq("id", vendorId);
    if (data) {
      toast({
        description: "Rendez-vous annulé !",
        variant: "default",
      });
    }
    if (error) {
      toast({
        description: `Erreur lors de l'annulation du rendez-vous: ${error.message}, celui ci n'a pas été annulé.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="tracking-page max-w-[720px] mx-auto p-4 mt-8 border border-stone-300 rounded-lg shadow-md">
      <img
        src={LOGO_URL}
        alt="Mariable Logo"
        className="h-14 w-14 md:h-32 md:w-32 object-contain"
        draggable={false}
        loading="eager"
        style={{
          minWidth: "3.5rem",
          minHeight: "3.5rem",
          margin: "0 auto",
          marginBottom: "1rem",
        }}
      />

      {isLoading && <p className="text-center">Loading...</p>}

      <div className="flex flex-row flex-wrap items-center justify-center gap-4 mb-4">
        <a href="/">
          <Badge className="bg-wedding-olive  text-white " color="green">
            Accueil
          </Badge>
        </a>
        {isUser && (
          <a href="/dashboard">
            <Badge className="bg-wedding-cream text-black">Dashboard</Badge>
          </a>
        )}
      </div>

      {vendor && (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Suivi de la demande</h1>
          <p className="text-sm text-gray-500">
            Prestataire contacté : {vendor.vendor_name}
          </p>
          <p className="text-sm text-gray-500">
            Status de la demande : {vendor.status}{" "}
            {vendor.status === "à valider" && <span>par le client</span>}
          </p>
          <p className="text-sm text-gray-500">
            Date de la demande : {dateCreated}
          </p>
          <h2 className="mt-4">Informations</h2>
          {project && (
            <div className="text-sm text-gray-500">
              {project.title && (
                <p>Nom du projet : {project.title}</p>
              )}
              {dateMariage && (
                <p>Date du mariage : {dateMariage}</p>
              )}
              {project.location && (
                <p>Lieu du mariage : {project.location}</p>
              )}
              {project.budget && (
                <p>Budget dédié : {project.budget}€</p>
              )}
              {project.guest_count && (
                <p>Nombre d'invités : {project.guest_count}</p>
              )}
            </div>
          )}
          {vendor.status === "à valider" && (
            <div className="text-center mb-4 mt-4">
              <h2 className="text-lg font-bold">
                Demande en cours de validation{" "}
              </h2>
              <p className="text-sm text-gray-500">
                <strong>{displayDate(vendor.valide_date_rdv || 0)}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Informations complémentaires :<br />
                <span className="bg-gray-100 mt-2 block p-4">
                  {vendor.notes}
                </span>
              </p>
              {isUser && (
                <Button
                  className="mt-4 bg-green-500 text-white"
                  variant="outline"
                  onClick={sendValidation}
                >
                  Valider le rendez-vous
                </Button>
              )}
            </div>
          )}
         {(vendor.status === "en attente" && keyPresta!==vendor.key_prestataire) && (
          <p className="mt-4 font-bold">Date en attente de validation par la pretataire.</p>
         )}
          {(vendor.status === "en attente" && keyPresta===vendor.key_prestataire) && (
            <>
              <h2 className="text-lg font-bold mt-4">Demande en attente</h2>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-4">
                {vendor.first_date_rdv && (
                <Card className="pt-6">
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">
                      Date : <br />
                      <strong>
                        {displayDateOrHour(vendor.first_date_rdv, "date")}
                      </strong>
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Heure :<br />
                      <strong>
                        {displayDateOrHour(vendor.first_date_rdv, "hour")}
                      </strong>
                    </p>
                    <Switch
                      checked={selectedSwitch === 1}
                      onCheckedChange={() => handleSwitchChange(1)}
                    />
                  </CardContent>
                </Card>
                )}
                {vendor.second_date_rdv && (
                <Card className="pt-6">
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">
                      Date :<br />
                      <strong>
                        {displayDateOrHour(vendor.second_date_rdv, "date")}
                      </strong>
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Heure :<br />
                      <strong>
                        {displayDateOrHour(vendor.second_date_rdv, "hour")}
                      </strong>
                    </p>
                    <Switch
                      checked={selectedSwitch === 2}
                      onCheckedChange={() => handleSwitchChange(2)}
                    />
                  </CardContent>
                </Card>
                )}
                {vendor.third_date_rdv && (
                <Card className="pt-6">
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">
                      Date :<br />
                      <strong>
                        {displayDateOrHour(vendor.third_date_rdv, "date")}
                      </strong>
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Heure :<br />
                      <strong>
                        {displayDateOrHour(vendor.third_date_rdv, "hour")}
                      </strong>
                    </p>
                    <Switch
                      checked={selectedSwitch === 3}
                      onCheckedChange={() => handleSwitchChange(3)}
                    />
                  </CardContent>
                </Card>
                )}
              </div>

              <Textarea
                placeholder="Ajouter un message pour le client... (Facultatif)"
                className="mt-4 max-w-[500px] mx-auto"
                rows={4}
                style={{ resize: "none" }}
              />
              <Button
                className="mt-4 bg-green-500 text-white"
                variant="outline"
                onClick={sendRequest}
              >
                Envoyer la réponse
              </Button>
            </>
          )}
          {vendor.status === "réponse reçue" && (
            <div className="text-center mb-4 mt-4">
              <h2 className="text-lg font-bold">Demande validée</h2>
              <p className="text-sm text-gray-500">
                La demande a été validée par le prestataire & les futurs mariés.
              </p>
              <p className="text-sm text-gray-500  mt-4">
                Date de rendez-vous :<br />
                <strong className="block mt-2">
                  <Badge
                    className="bg-green-500 text-white text-md"
                    color="green"
                  >
                    {displayDate(vendor.valide_date_rdv || 0)}
                  </Badge>
                </strong>
                <Button
                  className="mt-4 bg-red-500 text-white"
                  variant="outline"
                  onClick={cancelRdv}
                >
                  Annuler le rdv
                </Button>
              </p>
              <div className="mt-4 ">
                <h2 className="text-lg font-bold">Documents</h2>
                {vendor?.documents && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 mb-4">
                      {Array.isArray(vendor.documents) &&
                        vendor.documents.map((item) => (
                          <div
                            key={item.id}
                            id={`brochure-${item.id}`}
                            className="relative w-full  py-4 overflow-hidden rounded-lg border flex flex-col items-center justify-center"
                          >
                            <p className="text-center">
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {item.filename}
                              </a>
                            </p>
                          </div>
                        ))}
                    </div>
                  </>
                )}
                {!isUser && (
                  <>
                                 <Input
                  type="file"
                  id="upload-document"
                  className="max-w-full"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                />
                <Button
                  className="mt-4"
                  onClick={() => handleUpload(vendor.id)}
                >
                  Envoyer le fichier
                </Button>
                  </>

                ) }
 
              </div>
            </div>
          )}
        </div>
      )}
      {!isLoading && !vendor && (
        <p className="text-center">Aucune demande en cours...</p>
      )}
    </div>
  );
};
export default TrackingPage;
