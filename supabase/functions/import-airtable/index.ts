
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const AIRTABLE_API_KEY = Deno.env.get("AIRTABLE_API_KEY");
const AIRTABLE_BASE_ID = "app6YR8d1UIVu4KQG";
const AIRTABLE_TABLE_ID = "shrb1zsZBdhDdQ2Bn"; 
const AIRTABLE_VIEW = "Grid%20view";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fonction pour mapper un champ Airtable vers sa correspondance Supabase
function mapAirtableToSupabase(record) {
  try {
    const fields = record.fields;
    
    // Préparer les styles en format JSON compatible
    let styles = null;
    if (fields["Style"] && Array.isArray(fields["Style"])) {
      styles = fields["Style"];
    }
    
    // Mappage des champs Airtable vers les champs Supabase
    return {
      nom: fields["Nom"] || "Prestataire sans nom",
      categorie: mapCategorie(fields["Catégorie"]) || "Lieu de réception",
      description: fields["Description"] || null,
      adresse: fields["Adresse"] || null,
      ville: fields["Ville"] || null,
      code_postal: fields["Code postal"] ? String(fields["Code postal"]) : null,
      region: mapRegion(fields["Région"]) || null,
      email: fields["Email"] || null,
      telephone: fields["Téléphone"] || null,
      site_web: fields["Site web"] || null,
      prix_a_partir_de: fields["Prix à partir de"] ? Number(fields["Prix à partir de"]) : null,
      prix_par_personne: fields["Prix par personne"] ? Number(fields["Prix par personne"]) : null,
      responsable_nom: fields["Responsable Nom"] || null,
      responsable_bio: fields["Responsable Bio"] || null,
      styles: styles,
      visible: fields["Visible"] !== false, // Par défaut visible
      distance: fields["Distance"] || null,
    };
  } catch (error) {
    console.error("Erreur de mapping pour la fiche:", record, error);
    return null;
  }
}

// Fonction pour mapper la catégorie Airtable vers l'enum Supabase
function mapCategorie(categorie: string | undefined) {
  if (!categorie) return "Lieu de réception";
  
  const categorieMap = {
    "Lieu de réception": "Lieu de réception",
    "Traiteur": "Traiteur",
    "Photographe": "Photographe",
    "Vidéaste": "Vidéaste",
    "Coordination": "Coordination",
    "DJ": "DJ",
    "Fleuriste": "Fleuriste",
    "Robe de mariée": "Robe de mariée",
    "Décoration": "Décoration",
  };
  
  return categorieMap[categorie] || "Lieu de réception";
}

// Fonction pour mapper la région Airtable vers l'enum Supabase
function mapRegion(region: string | undefined) {
  if (!region) return null;
  
  const regionMap = {
    "Île-de-France": "Île-de-France",
    "Auvergne-Rhône-Alpes": "Auvergne-Rhône-Alpes",
    "Bourgogne-Franche-Comté": "Bourgogne-Franche-Comté",
    "Bretagne": "Bretagne",
    "Centre-Val de Loire": "Centre-Val de Loire",
    "Corse": "Corse",
    "Grand Est": "Grand Est",
    "Hauts-de-France": "Hauts-de-France",
    "Normandie": "Normandie",
    "Nouvelle-Aquitaine": "Nouvelle-Aquitaine",
    "Occitanie": "Occitanie",
    "Pays de la Loire": "Pays de la Loire",
    "Provence-Alpes-Côte d'Azur": "Provence-Alpes-Côte d'Azur",
  };
  
  return regionMap[region] || null;
}

// Fonction pour récupérer les photos d'Airtable et les mapper pour Supabase
async function processPhotos(records, supabase) {
  const photoPromises = [];
  let photoCount = 0;
  
  for (const record of records) {
    if (record.fields.Photos && Array.isArray(record.fields.Photos)) {
      const prestataire_id = record.id;
      
      // Trouver l'ID du prestataire dans Supabase
      const { data: prestataireData, error: prestataireError } = await supabase
        .from('prestataires')
        .select('id')
        .eq('nom', record.fields.Nom)
        .limit(1);
        
      if (prestataireError || !prestataireData || prestataireData.length === 0) {
        console.error("Erreur lors de la récupération du prestataire:", prestataireError);
        continue;
      }
      
      const supabasePrestataire_id = prestataireData[0].id;
      
      for (let i = 0; i < record.fields.Photos.length; i++) {
        const photo = record.fields.Photos[i];
        
        const photoData = {
          prestataire_id: supabasePrestataire_id,
          url: photo.url,
          filename: photo.filename,
          size: photo.size,
          type: photo.type,
          principale: i === 0, // Première photo comme principale
          ordre: i
        };
        
        const { error: photoError } = await supabase
          .from('prestataires_photos')
          .insert([photoData]);
          
        if (photoError) {
          console.error("Erreur lors de l'insertion d'une photo:", photoError);
        } else {
          photoCount++;
        }
      }
    }
  }
  
  return photoCount;
}

// Fonction pour récupérer les brochures d'Airtable et les mapper pour Supabase
async function processBrochures(records, supabase) {
  const brochurePromises = [];
  let brochureCount = 0;
  
  for (const record of records) {
    if (record.fields.Brochure && Array.isArray(record.fields.Brochure)) {
      // Trouver l'ID du prestataire dans Supabase
      const { data: prestataireData, error: prestataireError } = await supabase
        .from('prestataires')
        .select('id')
        .eq('nom', record.fields.Nom)
        .limit(1);
        
      if (prestataireError || !prestataireData || prestataireData.length === 0) {
        console.error("Erreur lors de la récupération du prestataire:", prestataireError);
        continue;
      }
      
      const supabasePrestataire_id = prestataireData[0].id;
      
      for (const brochure of record.fields.Brochure) {
        const brochureData = {
          prestataire_id: supabasePrestataire_id,
          url: brochure.url,
          filename: brochure.filename,
          size: brochure.size,
          type: brochure.type
        };
        
        const { error: brochureError } = await supabase
          .from('prestataires_brochures')
          .insert([brochureData]);
          
        if (brochureError) {
          console.error("Erreur lors de l'insertion d'une brochure:", brochureError);
        } else {
          brochureCount++;
        }
      }
    }
  }
  
  return brochureCount;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 200 });
  }
  
  if (!AIRTABLE_API_KEY) {
    return new Response(JSON.stringify({ error: "API_KEY Airtable manquante" }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500 
    });
  }
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Informations d'authentification Supabase manquantes" }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500 
    });
  }

  try {
    // Création du client Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Fonction pour récupérer toutes les données d'Airtable (avec pagination)
    const fetchAllRecords = async () => {
      let allRecords = [];
      let offset = null;
      
      do {
        const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}?view=${AIRTABLE_VIEW}${offset ? `&offset=${offset}` : ''}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur API Airtable: ${response.status}`);
        }
        
        const data = await response.json();
        allRecords = [...allRecords, ...data.records];
        offset = data.offset;
      } while (offset);
      
      return allRecords;
    };
    
    // Récupération des données d'Airtable
    const records = await fetchAllRecords();
    
    // Initialisation des résultats
    const results = {
      total: records.length,
      success: 0,
      errors: 0,
      errorDetails: []
    };
    
    // Itération sur chaque enregistrement et insertion dans Supabase
    for (const record of records) {
      // Création du prestataire mappé
      const prestataireData = mapAirtableToSupabase(record);
      
      if (!prestataireData) {
        results.errors++;
        results.errorDetails.push({
          id: record.id,
          error: "Erreur de mapping"
        });
        continue;
      }
      
      // Insertion dans Supabase
      const { error } = await supabase
        .from('prestataires')
        .insert([prestataireData]);
      
      if (error) {
        console.error("Erreur d'insertion:", error);
        results.errors++;
        results.errorDetails.push({
          id: record.id,
          name: prestataireData.nom,
          error: error.message
        });
      } else {
        results.success++;
      }
    }
    
    // Traiter les photos et brochures une fois tous les prestataires insérés
    const photoCount = await processPhotos(records, supabase);
    const brochureCount = await processBrochures(records, supabase);
    
    results.photoCount = photoCount;
    results.brochureCount = brochureCount;
    
    // Retourner le résultat
    return new Response(JSON.stringify({
      message: "Importation terminée",
      results,
      suggestions: [
        "Vérifiez les erreurs d'insertion pour les cas problématiques",
        "Validez que les catégories et régions ont été correctement mappées",
        "Assurez-vous que les liens vers les photos sont toujours actifs"
      ]
    }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200 
    });
    
  } catch (error) {
    console.error("Erreur globale:", error);
    
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500 
    });
  }
});
