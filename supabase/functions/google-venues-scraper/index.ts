import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

// Import slug generation utility
async function slugify(text: string): Promise<string> {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function generateUniqueSlug(nom: string, excludeId?: string, supabaseClient?: any): Promise<string> {
  const supabaseToUse = supabaseClient || supabase;
  let baseSlug = await slugify(nom) || "prestataire";
  let uniqueSlug = baseSlug;
  let i = 1;
  
  while (true) {
    const { data, error } = await supabaseToUse
      .from("prestataires_rows")
      .select("id")
      .eq("slug", uniqueSlug);

    if (error) {
      console.error("Error checking slug uniqueness, using timestamp fallback", error);
      return `${baseSlug}-${Date.now()}`;
    }

    // Si aucun résultat ou uniquement le même prestataire, c'est OK
    if (
      !data ||
      data.length === 0 ||
      (excludeId && data.length === 1 && data[0].id === excludeId)
    ) {
      return uniqueSlug;
    }
    i += 1;
    uniqueSlug = `${baseSlug}-${i}`;
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const googlePlacesApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// French regions mapping based on postal code first 2 digits
const REGION_MAPPING: { [key: string]: string } = {
  '01': 'Auvergne-Rhône-Alpes', '02': 'Hauts-de-France', '03': 'Auvergne-Rhône-Alpes',
  '04': 'Provence-Alpes-Côte d\'Azur', '05': 'Provence-Alpes-Côte d\'Azur', '06': 'Provence-Alpes-Côte d\'Azur',
  '07': 'Auvergne-Rhône-Alpes', '08': 'Grand Est', '09': 'Occitanie',
  '10': 'Grand Est', '11': 'Occitanie', '12': 'Occitanie',
  '13': 'Provence-Alpes-Côte d\'Azur', '14': 'Normandie', '15': 'Auvergne-Rhône-Alpes',
  '16': 'Nouvelle-Aquitaine', '17': 'Nouvelle-Aquitaine', '18': 'Centre-Val de Loire',
  '19': 'Nouvelle-Aquitaine', '20': 'Corse', '21': 'Bourgogne-Franche-Comté',
  '22': 'Bretagne', '23': 'Nouvelle-Aquitaine', '24': 'Nouvelle-Aquitaine',
  '25': 'Bourgogne-Franche-Comté', '26': 'Auvergne-Rhône-Alpes', '27': 'Normandie',
  '28': 'Centre-Val de Loire', '29': 'Bretagne', '30': 'Occitanie',
  '31': 'Occitanie', '32': 'Occitanie', '33': 'Nouvelle-Aquitaine',
  '34': 'Occitanie', '35': 'Bretagne', '36': 'Centre-Val de Loire',
  '37': 'Centre-Val de Loire', '38': 'Auvergne-Rhône-Alpes', '39': 'Bourgogne-Franche-Comté',
  '40': 'Nouvelle-Aquitaine', '41': 'Centre-Val de Loire', '42': 'Auvergne-Rhône-Alpes',
  '43': 'Auvergne-Rhône-Alpes', '44': 'Pays de la Loire', '45': 'Centre-Val de Loire',
  '46': 'Occitanie', '47': 'Nouvelle-Aquitaine', '48': 'Occitanie',
  '49': 'Pays de la Loire', '50': 'Normandie', '51': 'Grand Est',
  '52': 'Grand Est', '53': 'Pays de la Loire', '54': 'Grand Est',
  '55': 'Grand Est', '56': 'Bretagne', '57': 'Grand Est',
  '58': 'Bourgogne-Franche-Comté', '59': 'Hauts-de-France', '60': 'Hauts-de-France',
  '61': 'Normandie', '62': 'Hauts-de-France', '63': 'Auvergne-Rhône-Alpes',
  '64': 'Nouvelle-Aquitaine', '65': 'Occitanie', '66': 'Occitanie',
  '67': 'Grand Est', '68': 'Grand Est', '69': 'Auvergne-Rhône-Alpes',
  '70': 'Bourgogne-Franche-Comté', '71': 'Bourgogne-Franche-Comté', '72': 'Pays de la Loire',
  '73': 'Auvergne-Rhône-Alpes', '74': 'Auvergne-Rhône-Alpes', '75': 'Île-de-France',
  '76': 'Normandie', '77': 'Île-de-France', '78': 'Île-de-France',
  '79': 'Nouvelle-Aquitaine', '80': 'Hauts-de-France', '81': 'Occitanie',
  '82': 'Occitanie', '83': 'Provence-Alpes-Côte d\'Azur', '84': 'Provence-Alpes-Côte d\'Azur',
  '85': 'Pays de la Loire', '86': 'Nouvelle-Aquitaine', '87': 'Nouvelle-Aquitaine',
  '88': 'Grand Est', '89': 'Bourgogne-Franche-Comté', '90': 'Bourgogne-Franche-Comté',
  '91': 'Île-de-France', '92': 'Île-de-France', '93': 'Île-de-France',
  '94': 'Île-de-France', '95': 'Île-de-France'
};

function extractVenueNameFromUrl(url: string): string | null {
  try {
    console.log(`🔍 Processing URL: ${url}`);
    
    // Handle various Google Maps URL formats
    let venueName: string | null = null;
    
    // Format: /place/Venue+Name/
    const placeMatch = url.match(/\/place\/([^\/\?]+)/);
    if (placeMatch) {
      venueName = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
    }
    
    if (!venueName) {
      console.log(`❌ Could not extract venue name from URL: ${url}`);
      return null;
    }
    
    console.log(`✅ Extracted venue name: "${venueName}"`);
    return venueName;
  } catch (error) {
    console.error(`❌ Error parsing URL ${url}:`, error);
    return null;
  }
}

function extractCityAndRegionFromAddress(address: string): { city: string; region: string } {
  try {
    console.log(`📍 Parsing address: ${address}`);
    
    // Extract postal code and city from formatted_address
    // Format typically: "Street, Postal Code City, Country"
    const postalCodeMatch = address.match(/(\d{5})\s+([^,]+)/);
    
    if (postalCodeMatch) {
      const postalCode = postalCodeMatch[1];
      const city = postalCodeMatch[2].trim();
      const regionCode = postalCode.substring(0, 2);
      const region = REGION_MAPPING[regionCode] || 'Région inconnue';
      
      console.log(`✅ Parsed: City="${city}", PostalCode="${postalCode}", Region="${region}"`);
      return { city, region };
    }
    
    // Fallback: try to extract city from last part before country
    const parts = address.split(',').map(part => part.trim());
    if (parts.length >= 2) {
      const cityPart = parts[parts.length - 2];
      const postalMatch = cityPart.match(/\d{5}/);
      if (postalMatch) {
        const region = REGION_MAPPING[postalMatch[0].substring(0, 2)] || 'Région inconnue';
        return { city: cityPart.replace(/\d{5}\s*/, ''), region };
      }
    }
    
    console.log(`⚠️ Could not parse city/region from address: ${address}`);
    return { city: 'Ville inconnue', region: 'Région inconnue' };
  } catch (error) {
    console.error(`❌ Error parsing address ${address}:`, error);
    return { city: 'Ville inconnue', region: 'Région inconnue' };
  }
}

async function findPlaceFromText(venueName: string): Promise<string | null> {
  try {
    console.log(`🔍 Searching Google Places for: "${venueName}"`);
    
    const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(venueName)}&inputtype=textquery&fields=place_id,name&key=${googlePlacesApiKey}`;
    
    const response = await fetch(findPlaceUrl);
    const data = await response.json();
    
    if (data.status === 'OK' && data.candidates && data.candidates.length > 0) {
      const placeId = data.candidates[0].place_id;
      console.log(`✅ Found place_id: ${placeId}`);
      return placeId;
    }
    
    console.log(`⚠️ No place found for: "${venueName}"`);
    return null;
  } catch (error) {
    console.error(`❌ Error finding place for "${venueName}":`, error);
    return null;
  }
}

async function getPlaceDetails(placeId: string): Promise<any | null> {
  try {
    console.log(`📋 Fetching details for place_id: ${placeId}`);
    
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,geometry,rating,user_ratings_total,website,photos&key=${googlePlacesApiKey}`;
    
    const response = await fetch(detailsUrl);
    const data = await response.json();
    
    if (data.status === 'OK' && data.result) {
      console.log(`✅ Retrieved details for: ${data.result.name}`);
      return data.result;
    }
    
    console.log(`⚠️ No details found for place_id: ${placeId}`);
    return null;
  } catch (error) {
    console.error(`❌ Error getting place details for ${placeId}:`, error);
    return null;
  }
}

async function getGooglePhotoUrl(photoReference: string): Promise<string | null> {
  try {
    // Generate the photo URL with max width 1600px
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${photoReference}&key=${googlePlacesApiKey}`;
    
    console.log(`📸 Generated photo URL for reference: ${photoReference}`);
    return photoUrl;
  } catch (error) {
    console.error(`❌ Error generating photo URL:`, error);
    return null;
  }
}

async function processGoogleMapsUrl(urlRecord: any): Promise<boolean> {
  try {
    console.log(`\n🚀 Processing URL record: ${urlRecord.id}`);
    
    // Extract venue name from URL
    const venueName = extractVenueNameFromUrl(urlRecord.url);
    if (!venueName) {
      await supabase
        .from('google_maps_urls')
        .update({
          status: 'error',
          error_message: 'Impossible d\'extraire le nom du lieu depuis l\'URL',
          processed_at: new Date().toISOString()
        })
        .eq('id', urlRecord.id);
      return false;
    }
    
    // Find place using Google Places Find Place From Text
    const placeId = await findPlaceFromText(venueName);
    if (!placeId) {
      await supabase
        .from('google_maps_urls')
        .update({
          status: 'error',
          error_message: 'Lieu introuvable via l\'API Google Places',
          processed_at: new Date().toISOString()
        })
        .eq('id', urlRecord.id);
      return false;
    }
    
    // Get detailed information
    const placeDetails = await getPlaceDetails(placeId);
    if (!placeDetails) {
      await supabase
        .from('google_maps_urls')
        .update({
          status: 'error',
          error_message: 'Impossible de récupérer les détails du lieu',
          processed_at: new Date().toISOString()
        })
        .eq('id', urlRecord.id);
      return false;
    }
    
    // Check if venue already exists
    const { data: existingVenue } = await supabase
      .from('prestataires_rows')
      .select('id')
      .eq('google_place_id', placeDetails.place_id)
      .single();
    
    if (existingVenue) {
      console.log(`⚠️ Venue already exists: ${placeDetails.name}`);
      await supabase
        .from('google_maps_urls')
        .update({
          status: 'error',
          error_message: 'Ce lieu existe déjà dans la base de données',
          processed_at: new Date().toISOString()
        })
        .eq('id', urlRecord.id);
      return false;
    }
    
    // Parse city and region from address
    const { city, region } = extractCityAndRegionFromAddress(placeDetails.formatted_address || '');
    
    // Generate unique slug
    const slug = await generateUniqueSlug(placeDetails.name, undefined, supabase);
    
    // Prepare venue data for insertion
    const venueData = {
      nom: placeDetails.name,
      slug: slug,
      description: placeDetails.formatted_address || '', // Store full address in description
      ville: city,
      region: region,
      categorie: urlRecord.categorie || 'Lieu de réception',
      google_rating: placeDetails.rating || null,
      google_reviews_count: placeDetails.user_ratings_total || null,
      latitude: placeDetails.geometry?.location?.lat || null,
      longitude: placeDetails.geometry?.location?.lng || null,
      site_web: placeDetails.website || null,
      google_place_id: placeDetails.place_id,
      source_inscription: 'google_api',
      visible: false // Hidden by default for review
    };
    
    // Insert into prestataires_rows
    const { data: insertedVenue, error: insertError } = await supabase
      .from('prestataires_rows')
      .insert([venueData])
      .select()
      .single();
    
    if (insertError) {
      console.error(`❌ Error inserting venue:`, insertError);
      await supabase
        .from('google_maps_urls')
        .update({
          status: 'error',
          error_message: `Erreur lors de l'insertion: ${insertError.message}`,
          processed_at: new Date().toISOString()
        })
        .eq('id', urlRecord.id);
      return false;
    }

    // Insert Google photo if available
    if (placeDetails.photos && placeDetails.photos.length > 0 && insertedVenue) {
      try {
        const firstPhoto = placeDetails.photos[0];
        const photoUrl = await getGooglePhotoUrl(firstPhoto.photo_reference);
        
        if (photoUrl) {
          const { error: photoError } = await supabase
            .from('prestataires_photos_preprod')
            .insert([{
              prestataire_id: insertedVenue.id,
              url: photoUrl,
              ordre: 0,
              principale: true,
              filename: `google_photo_${insertedVenue.id}`,
              type: 'image/jpeg'
            }]);
          
          if (photoError) {
            console.error(`⚠️ Error inserting photo:`, photoError);
          } else {
            console.log(`📸 Successfully added Google photo for: ${placeDetails.name}`);
          }
        }
      } catch (photoError) {
        console.error(`⚠️ Error processing photo:`, photoError);
      }
    }
    
    // Mark URL as processed
    await supabase
      .from('google_maps_urls')
      .update({
        status: 'processed',
        processed_at: new Date().toISOString()
      })
      .eq('id', urlRecord.id);
    
    console.log(`✅ Successfully processed: ${placeDetails.name} (${placeDetails.rating}⭐)`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing URL record:`, error);
    await supabase
      .from('google_maps_urls')
      .update({
        status: 'error',
        error_message: `Erreur technique: ${error.message}`,
        processed_at: new Date().toISOString()
      })
      .eq('id', urlRecord.id);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting Google Maps URL processor...');
    
    if (!googlePlacesApiKey) {
      throw new Error('Google Places API key not configured');
    }
    
    console.log('✅ Supabase client initialized');
    
    // Fetch pending URLs from the database
    const { data: pendingUrls, error: fetchError } = await supabase
      .from('google_maps_urls')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(20); // Process max 20 at a time to avoid rate limits
    
    if (fetchError) {
      throw new Error(`Error fetching URLs: ${fetchError.message}`);
    }
    
    if (!pendingUrls || pendingUrls.length === 0) {
      console.log('📭 No pending URLs to process');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No pending URLs to process',
          processed: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`📋 Found ${pendingUrls.length} URLs to process`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each URL
    for (const urlRecord of pendingUrls) {
      const success = await processGoogleMapsUrl(urlRecord);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
      
      // Add a small delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`🎉 Processing completed! Success: ${successCount}, Errors: ${errorCount}`);
    
    return new Response(
      JSON.stringify({
        success: true,
        processed: pendingUrls.length,
        success_count: successCount,
        error_count: errorCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Error in google-venues-scraper function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});