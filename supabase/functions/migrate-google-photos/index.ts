import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const googlePlacesApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🔄 Starting photo migration process...');

    // 1. Récupérer les prestataires avec google_place_id et photos temporaires
    const { data: photosToMigrate, error: photosError } = await supabase
      .from('prestataires_photos_preprod')
      .select(`
        id,
        prestataire_id,
        url,
        prestataires_rows!inner(
          id,
          nom,
          google_place_id
        )
      `)
      .like('url', '%maps.googleapis.com%')
      .eq('principale', true)
      .not('prestataires_rows.google_place_id', 'is', null)
      .limit(20);

    if (photosError) {
      throw new Error(`Error fetching photos: ${photosError.message}`);
    }

    if (!photosToMigrate || photosToMigrate.length === 0) {
      console.log('✅ No photos to migrate');
      return new Response(
        JSON.stringify({ 
          success: true, 
          migrated: 0, 
          errors: 0,
          message: 'No photos to migrate'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📋 Found ${photosToMigrate.length} photos to migrate`);

    let successCount = 0;
    let errorCount = 0;
    const results: any[] = [];

    // 2. Migrer chaque photo
    for (const photo of photosToMigrate) {
      try {
        const prestataire = (photo as any).prestataires_rows;
        console.log(`\n🔄 Processing: ${prestataire.nom}`);

        // 2.1 Récupérer les détails depuis Google Places API
        const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prestataire.google_place_id}&fields=photos&key=${googlePlacesApiKey}`;
        
        const placeResponse = await fetch(placeDetailsUrl);
        const placeData = await placeResponse.json();

        if (placeData.status !== 'OK' || !placeData.result?.photos?.[0]) {
          console.error(`⚠️ No photo found for ${prestataire.nom}`);
          errorCount++;
          results.push({ 
            name: prestataire.nom, 
            success: false, 
            error: 'No photo available from Google' 
          });
          continue;
        }

        const photoReference = placeData.result.photos[0].photo_reference;
        console.log(`📸 Photo reference found: ${photoReference.substring(0, 20)}...`);

        // 2.2 Télécharger la photo depuis Google
        const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${photoReference}&key=${googlePlacesApiKey}`;
        
        console.log(`📥 Downloading photo from Google...`);
        const photoResponse = await fetch(googlePhotoUrl);
        
        if (!photoResponse.ok) {
          throw new Error(`Failed to download photo: ${photoResponse.statusText}`);
        }

        const photoBlob = await photoResponse.blob();
        const photoArrayBuffer = await photoBlob.arrayBuffer();

        // 2.3 Générer un nom de fichier unique
        const filename = `${prestataire.id}/${crypto.randomUUID()}.jpg`;
        
        console.log(`☁️ Uploading to Supabase Storage: ${filename}`);

        // 2.4 Upload vers Supabase Storage
        const { error: uploadError } = await supabase
          .storage
          .from('prestataires-photos')
          .upload(filename, photoArrayBuffer, {
            contentType: 'image/jpeg',
            upsert: false
          });

        if (uploadError) {
          throw uploadError;
        }

        // 2.5 Générer l'URL publique permanente
        const { data: publicUrlData } = supabase
          .storage
          .from('prestataires-photos')
          .getPublicUrl(filename);

        console.log(`✅ Photo uploaded: ${publicUrlData.publicUrl}`);

        // 2.6 Mettre à jour la table prestataires_photos_preprod
        const { error: updateError } = await supabase
          .from('prestataires_photos_preprod')
          .update({ 
            url: publicUrlData.publicUrl,
            filename: filename.split('/').pop()
          })
          .eq('id', photo.id);

        if (updateError) {
          throw updateError;
        }

        console.log(`✅ Database updated for ${prestataire.nom}`);
        successCount++;
        results.push({ 
          name: prestataire.nom, 
          success: true 
        });

        // Rate limiting pour respecter les quotas Google
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`❌ Error processing photo:`, error);
        errorCount++;
        results.push({ 
          name: (photo as any).prestataires_rows.nom, 
          success: false, 
          error: error.message 
        });
      }
    }

    // 3. Compter le nombre de photos restantes
    const { count: remainingCount } = await supabase
      .from('prestataires_photos_preprod')
      .select('*', { count: 'exact', head: true })
      .like('url', '%maps.googleapis.com%')
      .eq('principale', true);

    console.log(`\n📊 Migration complete:`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`🔄 Remaining: ${remainingCount || 0}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        migrated: successCount, 
        errors: errorCount,
        remaining: remainingCount || 0,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Migration error:', error);
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
