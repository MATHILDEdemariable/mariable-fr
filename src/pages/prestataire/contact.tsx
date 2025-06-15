
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery,useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const LOGO_URL = "/lovable-uploads/a13321ac-adeb-489a-911e-3a88b1411ac2.png";

const ContactTracking = () => {
  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get("id");
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");


  const { data: queryData, isLoading } = useQuery({
    queryKey: ["contact", vendorId],
    queryFn: async () => {
      if (!vendorId) return null;

      const { data, error } = await supabase
        .from("vendors_contact_preprod")
        .select("*")
        .or(`id.eq.${vendorId},origin_id.eq.${vendorId}`);

      if (data) {
        data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        data.forEach((item) => {
          item.created_at = new Date(item.created_at)
            .toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: "Europe/Paris",
            })
            .replace(",", " à ");
        });
      }
      //

      if (error) {
        toast({
          description: `Erreur lors du chargement des messages: ${error.message}`,
          variant: "destructive",
        });
        throw new Error(error.message);
      }

      return { vendorData: data };
    },
    enabled: !!vendorId,
  });

  let vendor = queryData?.vendorData;

   const sendMessage = async () => {
    const message = newMessage.trim();
    if (!message) {
      toast({ description: "Veuillez saisir un message.", variant: "destructive" });
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const isConnected = !!sessionData?.session;
    //insert to supabase
    const { data, error } = await supabase
      .from("vendors_contact_preprod")
      .insert({ 
        prestataire_id: vendor?.[0]?.prestataire_id,
        email_presta: vendor?.[0]?.email_presta,
        client_id: vendor?.[0]?.client_id,
        email_client: vendor?.[0]?.email_client,
        message: message,
        origin_user: isConnected,
        origin_id: vendor?.[0]?.id
      });

      if(error){
        toast({
          description: `Erreur lors de l'envoi du message`,
          variant: "destructive",
        });
      }else{
        toast({
          description: `Votre message a été envoyé`,
          variant: "default",
        });
        
        // If a vendor (not connected user) sends a message, update tracking
        if (!isConnected && vendor?.[0]?.client_id && vendor?.[0]?.prestataire_id) {
          try {
            const { error: updateError } = await supabase
              .from('vendors_tracking_preprod')
              .update({ status: 'réponse reçue', response_date: new Date().toISOString() })
              .eq('user_id', vendor[0].client_id)
              .eq('prestataire_id', vendor[0].prestataire_id);
            
            if (updateError) throw updateError;
          } catch(e) {
            console.error("Erreur de mise à jour du statut de suivi:", e);
          }
        }
      }

    queryClient.invalidateQueries({ queryKey: ["contact", vendorId] });

    setNewMessage("");
  
    }

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
        <>
          <h1 className="text-2xl font-bold mb-4">Suivi des messages</h1>
          {vendor.map((item, index) => (
            <div key={item.id} className="bg-stone-100 border border-solid border-stone-200 rounded-sm p-4 mb-4">
              {item.origin_user ? (
                <>
                  <Badge variant="client">Futurs Mariés</Badge>
                  <span className="text-sm text-gray-400">
                    {" "}
                    - {item.created_at}
                  </span>
                </>
              ) : (
                <>
                <Badge variant="presta">Prestataire</Badge>
                                      <span className="text-sm text-gray-400">
                    {" "}
                    - {item.created_at}
                  </span>
                </>
              )}
              <p className="text-sm mt-4 pl-4">{item.message}</p>
            </div>
          ))}
          <div className="flex flex-col md:flex-col gap-4 justify-center items-center mt-4 ">
            <Textarea
              placeholder="Ajouter un message ..."
              className="mt-4 max-w-[500px] mx-auto"
              rows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button className="mt-4 mx-auto w-[150px]" variant="outline" onClick={sendMessage}>
              Envoyer le message
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
export default ContactTracking;
