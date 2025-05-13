import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {Database} from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

type VendorContact = Database["public"]["Tables"]["vendors_contact_preprod"]["Row"];
type InsertVendorContact = Database["public"]["Tables"]["vendors_contact_preprod"]["Insert"];

const ContactForm = ({prestataire, dialogClose,user}) => {

  const sendMessage = async () => {
    const message = document.querySelector("textarea")?.value;
    //insert to supabase
    const { data, error } = await supabase
      .from("vendors_contact_preprod")
      .insert({ 
        prestataire_id: prestataire.id,
        email_presta: prestataire.email,
        client_id: user.user.id,
        email_client: user.user.email,
        message: message,
        origin_user:true
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
        dialogClose();
      }

  }

  return (
    <>
      <Textarea
        placeholder="Insérer votre message..."
        className="w-full h-32 resize-none mb-4 mt-4"
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
