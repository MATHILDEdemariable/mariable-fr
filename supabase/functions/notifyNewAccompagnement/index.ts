
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AccompagnementRecord {
  id: string;
  email: string;
  nom_complet: string;
  telephone_whatsapp: string;
  date_mariage: string;
  montant: number;
  statut: string;
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record }: { record: AccompagnementRecord } = await req.json();
    
    console.log("Nouvelle souscription accompagnement reçue:", record);

    const emailResponse = await resend.emails.send({
      from: "Mariable <notifications@mariable.fr>",
      to: ["mathilde@mariable.fr"],
      subject: `Nouvelle souscription accompagnement - ${record.nom_complet}`,
      html: `
        <h1>Nouvelle souscription à l'accompagnement Mariable</h1>
        
        <h2>Informations du client</h2>
        <p><strong>Nom :</strong> ${record.nom_complet}</p>
        <p><strong>Email :</strong> ${record.email}</p>
        <p><strong>Téléphone WhatsApp :</strong> ${record.telephone_whatsapp}</p>
        <p><strong>Date de mariage :</strong> ${new Date(record.date_mariage).toLocaleDateString('fr-FR')}</p>
        
        <h2>Détails de la souscription</h2>
        <p><strong>Montant :</strong> ${record.montant}€ TTC / mois</p>
        <p><strong>Statut :</strong> ${record.statut}</p>
        
        <hr>
        <p><small>Souscription effectuée le ${new Date(record.created_at).toLocaleString('fr-FR')}</small></p>
        
        <h2>Actions à effectuer</h2>
        <ul>
          <li>Contacter le client via WhatsApp au ${record.telephone_whatsapp}</li>
          <li>Initialiser l'accompagnement personnalisé</li>
          <li>Vérifier le paiement Stripe si nécessaire</li>
        </ul>
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
