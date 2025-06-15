
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {Database} from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

type VendorContact = Database["public"]["Tables"]["vendors_contact_preprod"]["Row"];
type InsertVendorContact = Database["public"]["Tables"]["vendors_contact_preprod"]["Insert"];

const ContactForm = ({prestataire, dialogClose,user}) => {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast({
        description: `Veuillez écrire un message.`,
        variant: "destructive",
      });
      return;
    }
    //insert to supabase
    const { data, error } = await supabase
      .from("vendors_contact_preprod")
      .insert({ 
        prestataire_id: prestataire.id,
        email_presta: prestataire.email,
        client_id: user.user.id,
        email_client: user.user.email,
        message: trimmedMessage,
        origin_user:true
      });
      if(error){
        toast({
          description: `Erreur lors de l'envoi du message`,
          variant: "destructive",
        });
      }else{
        // Handle tracking
        try {
          const { data: existingTracking } = await supabase
            .from('vendors_tracking_preprod')
            .select('id, status')
            .eq('user_id', user.user.id)
            .eq('prestataire_id', prestataire.id)
            .maybeSingle();

          if (existingTracking) {
            if (existingTracking.status === 'à contacter') {
              const { error: updateError } = await supabase
                .from('vendors_tracking_preprod')
                .update({ status: 'contactés', contact_date: new Date().toISOString() })
                .eq('id', existingTracking.id);
              if (updateError) throw updateError;
            }
          } else {
            const { error: insertError } = await supabase
              .from('vendors_tracking_preprod')
              .insert({
                user_id: user.user.id,
                prestataire_id: prestataire.id,
                vendor_name: prestataire.nom,
                category: prestataire.categorie,
                status: 'contactés',
                contact_date: new Date().toISOString(),
                notes: `Premier contact par message.`,
                email_presta: prestataire.email,
                email_client: user.user.email,
              });
            if (insertError) throw insertError;
          }
        } catch (trackingError) {
          console.error('Erreur lors de la mise à jour du suivi prestataire:', trackingError);
          // This is a non-blocking error for the user
        }

        toast({
          description: `Votre message a été envoyé`,
          variant: "default",
        });
        dialogClose();
      }

  }

  return (
    <>
      <Textarea
        placeholder="Insérer votre message..."
        className="w-full h-32 resize-none mb-4 mt-4"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
        onClick={sendMessage}
      >
        Envoyer
        </Button>
    </>
  );
};
export default ContactForm;
