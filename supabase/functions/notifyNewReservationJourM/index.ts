
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReservationRecord {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  partner_name?: string;
  wedding_date: string;
  wedding_location: string;
  guest_count: number;
  budget?: string;
  current_organization: string;
  specific_needs?: string;
  hear_about_us?: string;
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record }: { record: ReservationRecord } = await req.json();
    
    console.log("Nouvelle réservation Le Jour M reçue:", record);

    const emailResponse = await resend.emails.send({
      from: "Mariable <notifications@mariable.fr>",
      to: ["mathilde@mariable.fr"],
      subject: `Nouvelle réservation Le Jour M - ${record.first_name} ${record.last_name}`,
      html: `
        <h1>Nouvelle demande de réservation Le Jour M</h1>
        
        <h2>Informations du couple</h2>
        <p><strong>Nom :</strong> ${record.first_name} ${record.last_name}</p>
        <p><strong>Email :</strong> ${record.email}</p>
        <p><strong>Téléphone :</strong> ${record.phone}</p>
        ${record.partner_name ? `<p><strong>Partenaire :</strong> ${record.partner_name}</p>` : ''}
        
        <h2>Détails du mariage</h2>
        <p><strong>Date :</strong> ${new Date(record.wedding_date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Lieu :</strong> ${record.wedding_location}</p>
        <p><strong>Nombre d'invités :</strong> ${record.guest_count}</p>
        ${record.budget ? `<p><strong>Budget :</strong> ${record.budget}</p>` : ''}
        
        <h2>Organisation actuelle</h2>
        <p>${record.current_organization}</p>
        
        ${record.specific_needs ? `
        <h2>Besoins spécifiques</h2>
        <p>${record.specific_needs}</p>
        ` : ''}
        
        ${record.hear_about_us ? `
        <h2>Comment nous ont-ils connus</h2>
        <p>${record.hear_about_us}</p>
        ` : ''}
        
        <hr>
        <p><small>Demande reçue le ${new Date(record.created_at).toLocaleString('fr-FR')}</small></p>
      `,
    });

    console.log("Email envoyé avec succès:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
