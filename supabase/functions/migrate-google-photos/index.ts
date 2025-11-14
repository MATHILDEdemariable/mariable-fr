import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fonction pour compresser et redimensionner une image
async function compressImage(imageBuffer: ArrayBuffer, maxWidth: number, quality: number = 80): Promise<Uint8Array> {
  try {
    const image = await Image.decode(new Uint8Array(imageBuffer));
    
    // Calculer les nouvelles dimensions en gardant le ratio
    let newWidth = maxWidth;
    let newHeight = Math.round((image.height / image.width) * maxWidth);
    
    if (image.width <= maxWidth) {
      newWidth = image.width;
      newHeight = image.height;
    }
    
    // Redimensionner l'image
    const resized = image.resize(newWidth, newHeight);
    
    // Encoder en JPEG avec qualité spécifiée
    return await resized.encodeJPEG(quality);
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const googlePlacesApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🔄 Starting optimized photo migration process...');

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

        const photoArrayBuffer = await photoResponse.arrayBuffer();
        const originalSizeKB = Math.round(photoArrayBuffer.byteLength / 1024);
        console.log(`📊 Original size: ${originalSizeKB} KB`);

        // 2.3 Générer les deux versions compressées
        console.log(`🔧 Compressing images...`);
        
        // Version thumbnail (400px width, 80% quality)
        const thumbnailBuffer = await compressImage(photoArrayBuffer, 400, 80);
        const thumbnailSizeKB = Math.round(thumbnailBuffer.byteLength / 1024);
        console.log(`📐 Thumbnail size: ${thumbnailSizeKB} KB (${Math.round((thumbnailSizeKB/originalSizeKB)*100)}% of original)`);
        
        // Version full size (1200px width, 85% quality)
        const fullBuffer = await compressImage(photoArrayBuffer, 1200, 85);
        const fullSizeKB = Math.round(fullBuffer.byteLength / 1024);
        console.log(`📐 Full size: ${fullSizeKB} KB (${Math.round((fullSizeKB/originalSizeKB)*100)}% of original)`);

        // 2.4 Générer les noms de fichiers
        const uuid = crypto.randomUUID();
        const thumbnailFilename = `${prestataire.id}/thumbnail_${uuid}.jpg`;
        const fullFilename = `${prestataire.id}/full_${uuid}.jpg`;
        
        console.log(`☁️ Uploading thumbnail to Supabase Storage...`);

        // 2.5 Upload thumbnail
        const { error: thumbnailUploadError } = await supabase
          .storage
          .from('prestataires-photos')
          .upload(thumbnailFilename, thumbnailBuffer, {
            contentType: 'image/jpeg',
            upsert: false
          });

        if (thumbnailUploadError) {
          throw new Error(`Thumbnail upload failed: ${thumbnailUploadError.message}`);
        }

        console.log(`☁️ Uploading full size to Supabase Storage...`);

        // 2.6 Upload full size
        const { error: fullUploadError } = await supabase
          .storage
          .from('prestataires-photos')
          .upload(fullFilename, fullBuffer, {
            contentType: 'image/jpeg',
            upsert: false
          });

        if (fullUploadError) {
          throw new Error(`Full size upload failed: ${fullUploadError.message}`);
        }

        // 2.7 Générer les URLs publiques
        const { data: thumbnailUrlData } = supabase
          .storage
          .from('prestataires-photos')
          .getPublicUrl(thumbnailFilename);

        const { data: fullUrlData } = supabase
          .storage
          .from('prestataires-photos')
          .getPublicUrl(fullFilename);

        console.log(`✅ Images uploaded successfully`);
        console.log(`   Thumbnail: ${thumbnailUrlData.publicUrl}`);
        console.log(`   Full: ${fullUrlData.publicUrl}`);

        // 2.8 Mettre à jour la table prestataires_photos_preprod
        const { error: updateError } = await supabase
          .from('prestataires_photos_preprod')
          .update({ 
            url: fullUrlData.publicUrl,
            thumbnail_url: thumbnailUrlData.publicUrl,
            filename: fullFilename.split('/').pop()
          })
          .eq('id', photo.id);

        if (updateError) {
          throw updateError;
        }

        const totalSavings = originalSizeKB - fullSizeKB;
        const savingsPercent = Math.round((totalSavings / originalSizeKB) * 100);
        
        console.log(`✅ Database updated for ${prestataire.nom}`);
        console.log(`💾 Space saved: ${totalSavings} KB (${savingsPercent}% reduction)`);
        
        successCount++;
        results.push({ 
          name: prestataire.nom, 
          success: true,
          original_size: originalSizeKB,
          thumbnail_size: thumbnailSizeKB,
          full_size: fullSizeKB,
          savings_kb: totalSavings,
          savings_percent: savingsPercent
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

    // Calculer les économies totales
    const totalSavings = results
      .filter(r => r.success)
      .reduce((sum, r) => sum + (r.savings_kb || 0), 0);

    console.log(`\n📊 Migration complete:`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`🔄 Remaining: ${remainingCount || 0}`);
    console.log(`💾 Total space saved: ${totalSavings} KB (${Math.round(totalSavings/1024)} MB)`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        migrated: successCount, 
        errors: errorCount,
        remaining: remainingCount || 0,
        total_savings_kb: totalSavings,
        total_savings_mb: Math.round(totalSavings/1024),
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
