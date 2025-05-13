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

const RdvForm = ({prestataire_id,prestataire_name,contact_date,email_prestataire,dialogClose}) => {
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
      console.log(userData);
    };

    getUserData();
  }, []);

  const handleBookingClick = async () => {
    const currentButton = document.querySelector("#button-rdv");
    const newGuests = 100;
    const newPackage = {
      name: "Nom du package",
      price: 100,
    };

    // console.log(date1);
    // console.log(date2);
    // console.log(date3);
    if (date1 && date2 && date3  ) {
      const { error } = await supabase.from("vendors_tracking_preprod").insert([
        {
          contact_date: contact_date,
          user_id: userData.id,
          prestataire_id: prestataire_id,
          status: "en attente",
					email_client: userData.email,
					email_presta: email_prestataire,
					vendor_name: prestataire_name,
					category: "Rendez-vous",
					first_date_rdv: date1.hour,
					second_date_rdv: date2.hour,
					third_date_rdv: date3.hour,
					valide_date_rdv:0
        },
      ]);

      if (error) {
        toast({
          description: `Erreur lors de la réservation: ${error.message}`,
          variant: "destructive",
        });
        return;
      } else {
        currentButton?.setAttribute("disabled", "true");
				
        toast({
          description: `Votre demande de prise de rendez-vous été envoyé au prestataire.`,
          variant: "default",
        });
        dialogClose();
      }
    } else {
      toast({
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
    }
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
        <p className=" text-wedding-olive text-sm mb-4 ">
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
