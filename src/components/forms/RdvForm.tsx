
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "../ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

type DateTime = {
  date: Date | undefined;
  hour: Date | undefined;
};

const HOURS = [
  "09:00:00",
  "10:00:00",
  "11:00:00",
  "12:00:00",
  "13:00:00",
  "14:00:00",
  "15:00:00",
  "16:00:00",
  "17:00:00",
  "18:00:00",
];

const DateTimePicker = ({
  value,
  onChange,
  placeHolder,
}: {
  value: DateTime;
  onChange: (value: DateTime) => void;
  placeHolder: string;
}) => {
  const [open, setOpen] = useState(false);

  const handleDateChange = (selectedDate: Date | undefined) => {
    const updated = { ...value, date: selectedDate };
    onChange(updated);
    if (updated.hour) setOpen(false);
  };

  const handleHourChange = (timeString: string) => {
    if (value.date) {
      const [hours, minutes, seconds] = timeString.split(":").map(Number);
      const newDate = new Date(value.date);
      newDate.setHours(hours, minutes, seconds);
      const updated = { ...value, hour: newDate };
      onChange(updated);
      if (updated.date) setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          {value.date && value.hour
            ? `${value.date.toLocaleDateString()} à ${value.hour.toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}`
            : `${placeHolder}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value.date}
          onSelect={handleDateChange}
          className="pointer-events-auto"
        />
        <Select onValueChange={handleHourChange} required>
          <SelectTrigger className="w-full font-bold">
            <SelectValue placeholder="Sélectionner une heure" />
          </SelectTrigger>
          <SelectContent className="mt-4 w-full">
            {HOURS.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour.slice(0, 5)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  );
};

type RdvFormProps = {
  prestataire_id: string;
  prestataire_name: string;
  contact_date: string | undefined;
  email_prestataire: string;
  dialogClose: () => void;
};

const RdvForm = ({prestataire_id, prestataire_name, contact_date, email_prestataire, dialogClose}: RdvFormProps) => {
  const [date1, setDate1] = useState<DateTime>({
    date: undefined,
    hour: undefined,
  });
  const [date2, setDate2] = useState<DateTime>({
    date: undefined,
    hour: undefined,
  });
  const [date3, setDate3] = useState<DateTime>({
    date: undefined,
    hour: undefined,
  });

  const [userData, setUserData] = useState({
    id: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserData({
          id: user.id,
          email: user.email || "",
          first_name: user.user_metadata?.first_name || "",
          last_name: user.user_metadata?.last_name || "",
        });
      }
    };

    getUserData();
  }, []);

  const handleBookingClick = async () => {
    console.log('🚀 handleBookingClick démarré');
    
    const message = document.querySelector("textarea")?.value;

    if (!date1.hour || !date2.hour || !date3.hour) {
      console.log('❌ Dates manquantes');
      toast({
        description: "Veuillez sélectionner toutes les propositions de dates.",
        variant: "destructive",
      });
      return;
    }

    if (!prestataire_id) {
      console.log('❌ prestataire_id manquant');
      return;
    }

    console.log('📝 Insertion RDV dans la base de données...');
    // Create a single object for the insert instead of an array
    const { data, error } = await supabase.from("vendors_tracking_preprod").insert({
      contact_date: contact_date,
      user_id: userData.id,
      prestataire_id: prestataire_id,
      status: "en attente",
      email_client: userData.email,
      email_presta: email_prestataire,
      vendor_name: prestataire_name,
      category: "Rendez-vous",
      first_date_rdv: date1.hour ? date1.hour.toISOString() : null,
      second_date_rdv: date2.hour ? date2.hour.toISOString() : null,
      third_date_rdv: date3.hour ? date3.hour.toISOString() : null,
      valide_date_rdv: 0
    })
    .select();

    if (error) {
      console.error('❌ Erreur DB RDV:', error);
      toast({
        description: `Erreur lors de la réservation: ${error.message}`,
        variant: "destructive",
      });
      return;
    } 

    console.log('✅ RDV inséré:', data);
    
    // Appeler directement la fonction Edge pour envoyer l'email
    console.log('📧 Appel de la fonction Edge notifyNewProspect...');
    try {
      const { data: emailData, error: emailError } = await supabase.functions.invoke('notifyNewProspect', {
        body: {
          record: {
            id: data && data.length > 0 ? data[0].id : null,
            email_presta: email_prestataire,
            status: "en attente"
          }
        }
      });
      
      if (emailError) {
        console.error('❌ Erreur envoi email RDV:', emailError);
        toast({
          description: "RDV enregistré mais erreur lors de l'envoi de l'email",
          variant: "destructive",
        });
      } else {
        console.log('✅ Email RDV envoyé avec succès:', emailData);
      }
    } catch (emailError) {
      console.error('❌ Erreur fonction Edge RDV:', emailError);
      toast({
        description: "RDV enregistré mais erreur lors de l'envoi de l'email",
        variant: "destructive",
      });
    }
      const currentButton = document.querySelector("#button-rdv");
      currentButton?.setAttribute("disabled", "true");
      
    toast({
      description: `Votre demande de prise de rendez-vous été envoyé au prestataire.`,
      variant: "default",
    });
    dialogClose();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center items-start gap-4 mb-2">
        <Input
          type="text"
          placeholder="Nom et prénom"
          className="mb-4"
          defaultValue={
            userData?.first_name && userData?.last_name
              ? `${userData.first_name} ${userData.last_name}`
              : ""
          }
          required
        />

        <Input
          type="text"
          placeholder="Téléphone"
          className="mb-4"
          required
        />
      </div>

      <div className="flex flex-col md:flex-row justify-center items-start gap-4 mb-2">
        <DateTimePicker
          value={date1}
          onChange={setDate1}
          placeHolder="Sélectionner une premiere date"
        />
        <DateTimePicker
          value={date2}
          onChange={setDate2}
          placeHolder="Sélectionner une deuxième date"
        />
        <DateTimePicker
          value={date3}
          onChange={setDate3}
          placeHolder="Sélectionner une troisième date"
        />
      </div>
      <p className="text-wedding-olive text-sm mb-4">
        Merci de choisir trois dates et heures qui vous conviennent le mieux.
      </p>
      <Textarea
        placeholder="Insérer votre message... (facultatif)"
        className="w-full h-32 resize-none mb-4"
      />
      <Button
        id="button-rdv"
        className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
        onClick={handleBookingClick}
      >
        Prendre RDV
      </Button>
    </div>
  );
};

export default RdvForm;
