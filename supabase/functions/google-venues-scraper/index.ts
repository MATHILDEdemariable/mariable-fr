import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuration des villes françaises avec coordonnées
const FRENCH_CITIES = {
  paris: { lat: 48.8566, lng: 2.3522, name: 'Paris' },
  lyon: { lat: 45.7640, lng: 4.8357, name: 'Lyon' },
  marseille: { lat: 43.2965, lng: 5.3698, name: 'Marseille' },
  toulouse: { lat: 43.6047, lng: 1.4442, name: 'Toulouse' },
  bordeaux: { lat: 44.8378, lng: -0.5792, name: 'Bordeaux' },
  nantes: { lat: 47.2184, lng: -1.5536, name: 'Nantes' },
  strasbourg: { lat: 48.5734, lng: 7.7521, name: 'Strasbourg' },
  lille: { lat: 50.6292, lng: 3.0573, name: 'Lille' }
};

// Keywords français spécifiés
const WEDDING_KEYWORDS = [
  "salle de réception",
  "espace événementiel", 
  "lieu de mariage"
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting Google Places scraper...');
    
    const { city = 'paris', testMode = true } = await req.json();
    
    // Initialiser Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    
    if (!googleApiKey) {
      throw new Error('Google Places API key not configured');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ Supabase client initialized');
    
    const cityConfig = FRENCH_CITIES[city as keyof typeof FRENCH_CITIES];
    if (!cityConfig) {
      throw new Error(`City "${city}" not supported`);
    }
    
    console.log(`🎯 Scanning ${cityConfig.name} for wedding venues...`);
    
    let totalInserted = 0;
    let totalFound = 0;
    const results = [];
    
    // Scanner chaque keyword
    for (const keyword of WEDDING_KEYWORDS) {
      console.log(`🔍 Searching for: "${keyword}" in ${cityConfig.name}`);
      
      // Google Places API - Nearby Search
      const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${cityConfig.lat},${cityConfig.lng}&` +
        `radius=100000&` + // 100km en mètres
        `type=restaurant|event_planning&` +
        `keyword=${encodeURIComponent(keyword)}&` +
        `key=${googleApiKey}`;
      
      const placesResponse = await fetch(placesUrl);
      const placesData = await placesResponse.json();
      
      if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
        console.error('❌ Google Places API error:', placesData.status, placesData.error_message);
        continue;
      }
      
      console.log(`📍 Found ${placesData.results?.length || 0} places for "${keyword}"`);
      
      if (!placesData.results || placesData.results.length === 0) {
        continue;
      }
      
      // Filtrer par rating >= 4.5
      const highRatedVenues = placesData.results.filter((place: any) => 
        place.rating && place.rating >= 4.5
      );
      
      console.log(`⭐ ${highRatedVenues.length} venues with rating >= 4.5`);
      totalFound += highRatedVenues.length;
      
      // Traitement de chaque venue
      for (const place of highRatedVenues) {
        try {
          // Vérifier si le lieu existe déjà
          const { data: existingVenue } = await supabase
            .from('prestataires_rows')
            .select('id')
            .eq('google_place_id', place.place_id)
            .single();
          
          if (existingVenue) {
            console.log(`⚠️ Venue already exists: ${place.name}`);
            continue;
          }
          
          // Récupérer les détails et photos
          let photoUrl = null;
          if (place.photos && place.photos.length > 0) {
            const photoReference = place.photos[0].photo_reference;
            photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${googleApiKey}`;
          }
          
          // Préparer les données pour insertion
          const venueData = {
            nom: place.name,
            ville: place.vicinity || cityConfig.name,
            region: getRegionFromCity(city),
            categorie: 'Lieu de réception',
            description: `${keyword} trouvé via Google Places`,
            google_rating: place.rating,
            google_place_id: place.place_id,
            latitude: place.geometry?.location?.lat,
            longitude: place.geometry?.location?.lng,
            source_inscription: 'google_api',
            visible: false, // Nécessite validation manuelle
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          // Insérer en base
          const { data: insertedVenue, error: insertError } = await supabase
            .from('prestataires_rows')
            .insert(venueData)
            .select('id, nom')
            .single();
          
          if (insertError) {
            console.error('❌ Insert error for', place.name, ':', insertError);
            continue;
          }
          
          // Ajouter la photo si disponible
          if (photoUrl && insertedVenue) {
            const { error: photoError } = await supabase
              .from('prestataires_photos_preprod')
              .insert({
                prestataire_id: insertedVenue.id,
                url: photoUrl,
                principale: true,
                ordre: 1,
                created_at: new Date().toISOString()
              });
            
            if (photoError) {
              console.error('⚠️ Photo insert error:', photoError);
            }
          }
          
          console.log(`✅ Inserted: ${place.name} (${place.rating}⭐)`);
          totalInserted++;
          
          results.push({
            name: place.name,
            rating: place.rating,
            address: place.vicinity,
            place_id: place.place_id,
            photo: !!photoUrl
          });
          
          // Limite pour le test
          if (testMode && totalInserted >= 10) {
            console.log('🚦 Test mode: stopping at 10 venues');
            break;
          }
          
        } catch (venueError) {
          console.error('❌ Error processing venue:', place.name, venueError);
        }
      }
      
      if (testMode && totalInserted >= 10) break;
    }
    
    console.log(`🎉 Scraping completed! Found: ${totalFound}, Inserted: ${totalInserted}`);
    
    return new Response(JSON.stringify({
      success: true,
      city: cityConfig.name,
      totalFound,
      totalInserted,
      results: results.slice(0, 5) // Afficher les 5 premiers
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('❌ Error in google-venues-scraper:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper pour déterminer la région depuis la ville
function getRegionFromCity(city: string): string {
  const cityRegions: Record<string, string> = {
    paris: 'Île-de-France',
    lyon: 'Auvergne-Rhône-Alpes',
    marseille: 'Provence-Alpes-Côte d\'Azur',
    toulouse: 'Occitanie',
    bordeaux: 'Nouvelle-Aquitaine',
    nantes: 'Pays de la Loire',
    strasbourg: 'Grand Est',
    lille: 'Hauts-de-France'
  };
  
  return cityRegions[city] || 'France entière';
}