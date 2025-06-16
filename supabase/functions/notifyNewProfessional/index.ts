
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ProfessionalRecord {
  id: string;
  nom: string;
  categorie: string;
  region: string;
  email: string;
  telephone?: string;
  site_web?: string;
  siret: string;
  assurance_nom: string;
  description?: string;
  prix_minimum: number;
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record }: { record: ProfessionalRecord } = await req.json();
    
    console.log("Nouvelle demande professionnel reçue:", record);

    const emailResponse = await resend.emails.send({
      from: "Mariable <notifications@mariable.fr>",
      to: ["mathilde@mariable.fr"],
      subject: `Nouvelle demande d'inscription prestataire - ${record.nom}`,
      html: `
        <h1>Nouvelle demande d'inscription prestataire</h1>
        
        <h2>Informations de l'entreprise</h2>
        <p><strong>Nom :</strong> ${record.nom}</p>
        <p><strong>Catégorie :</strong> ${record.categorie}</p>
        <p><strong>Région :</strong> ${record.region}</p>
        <p><strong>Email :</strong> ${record.email}</p>
        ${record.telephone ? `<p><strong>Téléphone :</strong> ${record.telephone}</p>` : ''}
        ${record.site_web ? `<p><strong>Site web :</strong> ${record.site_web}</p>` : ''}
        
        <h2>Informations légales</h2>
        <p><strong>SIRET :</strong> ${record.siret}</p>
        <p><strong>Assurance :</strong> ${record.assurance_nom}</p>
        <p><strong>Prix minimum :</strong> ${record.prix_minimum}€</p>
        
        ${record.description ? `
        <h2>Description des services</h2>
        <p>${record.description}</p>
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
