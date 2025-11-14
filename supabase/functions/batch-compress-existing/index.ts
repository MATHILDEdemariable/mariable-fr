import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { ImageMagick, initializeImageMagick, MagickFormat } from "https://deno.land/x/imagemagick_deno@0.0.26/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialiser ImageMagick une seule fois
await initializeImageMagick();

async function compressImage(imageBuffer: ArrayBuffer, maxWidth: number, quality: number = 80): Promise<Uint8Array> {
  try {
    const inputBytes = new Uint8Array(imageBuffer);
    
    return await ImageMagick.read(inputBytes, async (image) => {
      // Calculer les nouvelles dimensions
      const aspectRatio = image.height / image.width;
      let newWidth = maxWidth;
      let newHeight = Math.round(maxWidth * aspectRatio);
      
      // Ne pas agrandir les petites images
      if (image.width <= maxWidth) {
        newWidth = image.width;
        newHeight = image.height;
      } else {
        image.resize(newWidth, newHeight);
      }
      
      // Configurer la qualité JPEG
      image.quality = quality;
      
      // Retourner en JPEG
      return await image.write(MagickFormat.Jpg);
    });
  } catch (error) {
    console.error('❌ Error compressing image:', error);
    throw new Error(`Compression failed: ${error.message}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🔄 Starting batch compression process...');

    // Récupérer les photos sans thumbnail_url
    const { data: photosToCompress, error: photosError } = await supabase
      .from('prestataires_photos_preprod')
      .select(`
        id,
        prestataire_id,
        url,
        prestataires_rows!inner(
          id,
          nom
        )
      `)
      .is('thumbnail_url', null)
      .not('url', 'is', null)
      .limit(5);

    if (photosError) {
      throw new Error(`Error fetching photos: ${photosError.message}`);
    }

    if (!photosToCompress || photosToCompress.length === 0) {
      console.log('✅ No photos to compress');
      return new Response(
        JSON.stringify({ 
          success: true, 
          compressed: 0, 
          errors: 0,
          message: 'No photos to compress'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📋 Found ${photosToCompress.length} photos to compress`);

    let successCount = 0;
    let errorCount = 0;
    const results: any[] = [];

    for (const photo of photosToCompress) {
      try {
        const prestataire = (photo as any).prestataires_rows;
        console.log(`\n🔄 Processing: ${prestataire.nom}`);

        // Télécharger l'image
        console.log(`📥 Downloading photo from: ${photo.url}`);
        const photoResponse = await fetch(photo.url);
        
        if (!photoResponse.ok) {
          throw new Error(`Failed to download photo: ${photoResponse.statusText}`);
        }

        const photoArrayBuffer = await photoResponse.arrayBuffer();
        const originalSizeKB = Math.round(photoArrayBuffer.byteLength / 1024);
        console.log(`📊 Original size: ${originalSizeKB} KB`);

        // Générer les deux versions compressées
        console.log(`🔧 Compressing images...`);
        
        const thumbnailBuffer = await compressImage(photoArrayBuffer, 400, 80);
        const thumbnailSizeKB = Math.round(thumbnailBuffer.byteLength / 1024);
        console.log(`📐 Thumbnail size: ${thumbnailSizeKB} KB`);
        
        const fullBuffer = await compressImage(photoArrayBuffer, 1200, 85);
        const fullSizeKB = Math.round(fullBuffer.byteLength / 1024);
        console.log(`📐 Full size: ${fullSizeKB} KB`);

        // Générer les noms de fichiers
        const uuid = crypto.randomUUID();
        const thumbnailFilename = `${prestataire.id}/thumbnail_${uuid}.jpg`;
        const fullFilename = `${prestataire.id}/full_${uuid}.jpg`;
        
        console.log(`☁️ Uploading thumbnail to Supabase Storage...`);

        // Upload thumbnail
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

        // Upload full size
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

        // Générer les URLs publiques
        const { data: thumbnailUrlData } = supabase
          .storage
          .from('prestataires-photos')
          .getPublicUrl(thumbnailFilename);

        const { data: fullUrlData } = supabase
          .storage
          .from('prestataires-photos')
          .getPublicUrl(fullFilename);

        console.log(`✅ Images uploaded successfully`);

        // Mettre à jour la table prestataires_photos_preprod
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

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        const prestataire = (photo as any).prestataires_rows;
        const photoFormat = photo.url.split('.').pop()?.toUpperCase() || 'UNKNOWN';
        console.error(`❌ Error processing photo for ${prestataire.nom}:`, error);
        console.error(`📄 Photo format: ${photoFormat}, URL: ${photo.url}`);
        errorCount++;
        results.push({ 
          name: prestataire.nom, 
          success: false, 
          error: error.message,
          format: photoFormat,
          url: photo.url
        });
      }
    }

    // Compter le nombre de photos restantes
    const { count: remainingCount } = await supabase
      .from('prestataires_photos_preprod')
      .select('*', { count: 'exact', head: true })
      .is('thumbnail_url', null)
      .not('url', 'is', null);

    const totalSavings = results
      .filter(r => r.success)
      .reduce((sum, r) => sum + (r.savings_kb || 0), 0);

    console.log(`\n📊 Batch compression complete:`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`🔄 Remaining: ${remainingCount || 0}`);
    console.log(`💾 Total space saved: ${totalSavings} KB (${Math.round(totalSavings/1024)} MB)`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        compressed: successCount, 
        errors: errorCount,
        remaining: remainingCount || 0,
        total_savings_kb: totalSavings,
        total_savings_mb: Math.round(totalSavings/1024),
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Batch compression error:', error);
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
