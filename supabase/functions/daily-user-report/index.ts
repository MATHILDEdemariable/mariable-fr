import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resendApiKey = Deno.env.get("RESEND")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserExportData {
  email: string;
  nom_complet: string;
  date_inscription: string;
  telephone: string;
  date_mariage: string;
  statut_abonnement: string;
  nombre_invites: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("🚀 daily-user-report started:", new Date().toISOString());

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Récupérer les nouveaux utilisateurs des dernières 24h
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    console.log("📅 Fetching new users since:", yesterday.toISOString());

    const { data: newUsers, error: newUsersError } = await supabase
      .from("profiles")
      .select(`
        *,
        auth_user:id (
          email,
          created_at,
          raw_user_meta_data
        )
      `)
      .gte("created_at", yesterday.toISOString());

    if (newUsersError) {
      console.error("❌ Error fetching new users:", newUsersError);
      throw new Error(`Erreur récupération nouveaux utilisateurs: ${newUsersError.message}`);
    }

    // Récupérer tous les utilisateurs pour l'export complet
    console.log("📋 Fetching all users for complete export...");

    const { data: allUsers, error: allUsersError } = await supabase
      .from("profiles")
      .select(`
        *,
        auth_user:id (
          email,
          created_at,
          raw_user_meta_data
        )
      `)
      .order("created_at", { ascending: false });

    if (allUsersError) {
      console.error("❌ Error fetching all users:", allUsersError);
      throw new Error(`Erreur récupération tous les utilisateurs: ${allUsersError.message}`);
    }

    // Formater les données pour CSV
    const formatUserForCSV = (user: any): UserExportData => {
      const authUser = user.auth_user || {};
      
      return {
        email: authUser.email || 'Non renseigné',
        nom_complet: user.first_name && user.last_name 
          ? `${user.first_name} ${user.last_name}`.trim()
          : authUser.raw_user_meta_data?.first_name && authUser.raw_user_meta_data?.last_name
            ? `${authUser.raw_user_meta_data.first_name} ${authUser.raw_user_meta_data.last_name}`.trim()
            : 'Non renseigné',
        date_inscription: user.created_at 
          ? new Date(user.created_at).toLocaleDateString('fr-FR')
          : 'Non renseigné',
        telephone: user.phone || authUser.raw_user_meta_data?.phone || 'Non renseigné',
        date_mariage: user.wedding_date 
          ? new Date(user.wedding_date).toLocaleDateString('fr-FR')
          : 'Non renseigné',
        statut_abonnement: user.subscription_type || 'Gratuit',
        nombre_invites: user.guest_count?.toString() || 'Non renseigné'
      };
    };

    // Créer le CSV pour l'export complet
    const csvHeaders = [
      'Email',
      'Nom Complet', 
      'Date Inscription',
      'Téléphone',
      'Date Mariage',
      'Statut Abonnement',
      'Nombre Invités'
    ];

    const csvContent = [
      csvHeaders.join(','),
      ...allUsers.map(user => {
        const formattedUser = formatUserForCSV(user);
        return Object.values(formattedUser).map(value => 
          `"${String(value).replace(/"/g, '""')}"`
        ).join(',');
      })
    ].join('\n');

    // Préparer le contenu de l'email
    const newUserCount = newUsers?.length || 0;
    const totalUserCount = allUsers?.length || 0;

    let emailContent = `
      <h1>📊 Rapport Quotidien Mariable - ${new Date().toLocaleDateString('fr-FR')}</h1>
      
      <h2>📈 Résumé</h2>
      <ul>
        <li><strong>Nouveaux inscrits (24h):</strong> ${newUserCount}</li>
        <li><strong>Total utilisateurs:</strong> ${totalUserCount}</li>
      </ul>
    `;

    if (newUserCount > 0) {
      emailContent += `
        <h2>👥 Nouveaux Utilisateurs</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th>Email</th>
              <th>Nom</th>
              <th>Date d'inscription</th>
              <th>Date de mariage</th>
            </tr>
          </thead>
          <tbody>
      `;

      newUsers.forEach(user => {
        const formatted = formatUserForCSV(user);
        emailContent += `
          <tr>
            <td>${formatted.email}</td>
            <td>${formatted.nom_complet}</td>
            <td>${formatted.date_inscription}</td>
            <td>${formatted.date_mariage}</td>
          </tr>
        `;
      });

      emailContent += `
          </tbody>
        </table>
      `;
    }

    emailContent += `
      <h2>📎 Export Complet</h2>
      <p>Vous trouverez en pièce jointe l'export CSV complet de tous les utilisateurs (${totalUserCount} utilisateurs).</p>
      
      <p><em>Rapport généré automatiquement le ${new Date().toLocaleString('fr-FR')}</em></p>
    `;

    // Envoyer l'email avec le CSV en pièce jointe
    console.log("📧 Sending email report...");

    const emailResponse = await resend.emails.send({
      from: "Mariable <noreply@mariable.fr>",
      to: ["mathilde@mariable.fr"],
      subject: `📊 Rapport Quotidien Mariable - ${newUserCount} nouveaux inscrits`,
      html: emailContent,
      attachments: [
        {
          filename: `export_utilisateurs_${new Date().toISOString().split('T')[0]}.csv`,
          content: Buffer.from(csvContent).toString('base64'),
        },
      ],
    });

    if (emailResponse.error) {
      console.error("❌ Email sending error:", emailResponse.error);
      throw new Error(`Erreur envoi email: ${emailResponse.error.message}`);
    }

    console.log("✅ Daily report sent successfully:", {
      newUsers: newUserCount,
      totalUsers: totalUserCount,
      emailId: emailResponse.data?.id
    });

    return new Response(JSON.stringify({
      success: true,
      newUsers: newUserCount,
      totalUsers: totalUserCount,
      emailSent: true,
      emailId: emailResponse.data?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("❌ Error in daily-user-report:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json", 
        ...corsHeaders
      },
    });
  }
};

serve(handler);