import React from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const TrackingPage = () => {
  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get("id");
  const isUser = searchParams.get("edit") === "user" ? true : false;
  const LOGO_URL = "/lovable-uploads/a13321ac-adeb-489a-911e-3a88b1411ac2.png";
  const [date, setDate] = useState<Date | undefined>(undefined);

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

      return { vendorData: data, project };
    },
    enabled: !!vendorId,
  });
  let vendor = queryData?.vendorData;
  let project = queryData?.project;

  let dateCreated = null;
  let dateMariage = null;
  if (vendor && project) {
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

  const sendRequest = async () => {
    //get data in textarea
    const message = document.querySelector("textarea")?.value;

    if (!vendorId) return;
    if (!date) {
      toast({
        description: "Veuillez sélectionner une date.",
        variant: "destructive",
      });
      return;
    }
    const { data, error } = await supabase
      .from("vendors_tracking_preprod")
      .update({
        notes: message,
        response_date: date.toISOString(),
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

  //sendValidation
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

      {vendor && (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Suivi de la demande</h1>
          <p className="text-sm text-gray-500">
            Prestataire contacté : {vendor.vendor_name}
          </p>
          <p className="text-sm text-gray-500">
            Type de prestation :{vendor.category}
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
              <p>Nom du projet : {project.title}</p>
              <p>Date du mariage : {dateMariage}</p>
              <p>Lieu du mariage : {project.location}</p>
              <p>Budget dédié : {project.budget}€</p>
              <p>Nombre d'invités : {project.guest_count}</p>
            </div>
          )}
          {vendor.status === "à valider" && (
            <div className="text-center mb-4 mt-4">
              <h2 className="text-lg font-bold">
                Demande en cours de validation
              </h2>
              <p className="text-sm text-gray-500">
                La demande est en attente de validation par les futurs mariés.
              </p>
              <p className="text-sm text-gray-500  mt-4">
                Date en cours de validation :{" "}
                <strong>
                  {vendor.response_date &&
                    new Date(vendor.response_date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                </strong>
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Informations complémentaires :<br />
                <span className="bg-gray-100 mt-2 block p-4">
                  {vendor.notes}
                </span>
              </p>
              {isUser && (
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={sendValidation}
                >
                  Valider le rendez-vous
                </Button>
              )}
            </div>
          )}
          {vendor.status === "en attente" && (
            <>
              <h2 className="mt-4">Proposer une date de rendez-vous</h2>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[220px] justify-start text-left font-normal"
                  >
                    {date
                      ? date.toLocaleDateString("fr-FR")
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
              <Textarea
                placeholder="Ajouter un message pour le prestataire..."
                className="mt-4 max-w-[500px] mx-auto"
                rows={4}
                style={{ resize: "none" }}
              />
              <Button
                className="mt-4"
                variant="outline"
                onClick={sendRequest}
              >
                Envoyer la demande
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
                Date de rendez-vous :{" "}
                <strong>
                  {vendor.response_date &&
                    new Date(vendor.response_date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                </strong>
              </p>
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
