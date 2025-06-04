
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
  documents_links?: string;
  prestataires_reserves?: any;
  deroulement_mariage?: string;
  contact_jour_j?: any;
  services_souhaites?: string[];
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record }: { record: ReservationRecord } = await req.json();
    
    console.log("Nouvelle réservation Le Jour M reçue:", record);

    // Format prestataires section
    let prestatairesSection = '';
    if (record.prestataires_reserves) {
      prestatairesSection = `
        <h2>Prestataires déjà réservés</h2>
        ${record.prestataires_reserves.photographe ? `<p><strong>Photographe :</strong> ${record.prestataires_reserves.photographe}</p>` : ''}
        ${record.prestataires_reserves.dj_musique ? `<p><strong>DJ/Musique :</strong> ${record.prestataires_reserves.dj_musique}</p>` : ''}
        ${record.prestataires_reserves.traiteur ? `<p><strong>Traiteur :</strong> ${record.prestataires_reserves.traiteur}</p>` : ''}
        ${record.prestataires_reserves.fleuriste ? `<p><strong>Fleuriste :</strong> ${record.prestataires_reserves.fleuriste}</p>` : ''}
        ${record.prestataires_reserves.maquillage_coiffure ? `<p><strong>Maquillage/Coiffure :</strong> ${record.prestataires_reserves.maquillage_coiffure}</p>` : ''}
        ${record.prestataires_reserves.autres ? `<p><strong>Autres :</strong> ${record.prestataires_reserves.autres}</p>` : ''}
      `;
    }

    // Format contact jour J section
    let contactSection = '';
    if (record.contact_jour_j && record.contact_jour_j.nom) {
      contactSection = `
        <h2>Personne de contact jour J</h2>
        <p><strong>Nom :</strong> ${record.contact_jour_j.nom}</p>
        ${record.contact_jour_j.telephone ? `<p><strong>Téléphone :</strong> ${record.contact_jour_j.telephone}</p>` : ''}
        ${record.contact_jour_j.role ? `<p><strong>Rôle :</strong> ${record.contact_jour_j.role}</p>` : ''}
        ${record.contact_jour_j.commentaire ? `<p><strong>Commentaire :</strong> ${record.contact_jour_j.commentaire}</p>` : ''}
      `;
    }

    // Format services souhaités section
    let servicesSection = '';
    if (record.services_souhaites && record.services_souhaites.length > 0) {
      const serviceLabels = {
        'presence_physique': 'Présence physique le jour J (11h-21h)',
        'presence_2_jours': 'Présence physique 2 jours'
      };
      
      servicesSection = `
        <h2>Services complémentaires souhaités</h2>
        <ul>
          ${record.services_souhaites.map(service => `<li>${serviceLabels[service] || service}</li>`).join('')}
        </ul>
      `;
    }

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
        
        ${prestatairesSection}
        
        ${record.deroulement_mariage ? `
        <h2>Déroulé global du mariage</h2>
        <p>${record.deroulement_mariage}</p>
        ` : ''}
        
        ${contactSection}
        
        ${servicesSection}
        
        <h2>Organisation actuelle</h2>
        <p>${record.current_organization}</p>
        
        ${record.specific_needs ? `
        <h2>Besoins spécifiques</h2>
        <p>${record.specific_needs}</p>
        ` : ''}
        
        ${record.documents_links ? `
        <h2>Documents partagés</h2>
        <p><strong>Lien :</strong> <a href="${record.documents_links}">${record.documents_links}</a></p>
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
