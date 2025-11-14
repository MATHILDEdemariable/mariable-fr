import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function compressImage(imageBuffer: ArrayBuffer, maxWidth: number, quality: number = 80): Promise<Uint8Array> {
  try {
    const image = await Image.decode(new Uint8Array(imageBuffer));
    
    let newWidth = maxWidth;
    let newHeight = Math.round((image.height / image.width) * maxWidth);
    
    if (image.width <= maxWidth) {
      newWidth = image.width;
      newHeight = image.height;
    }
    
    const resized = image.resize(newWidth, newHeight);
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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { photoUrl, prestataireId } = await req.json();

    if (!photoUrl || !prestataireId) {
      throw new Error('photoUrl and prestataireId are required');
    }

    console.log('🔄 Compressing photo:', photoUrl);

    // Télécharger l'image originale
    const photoResponse = await fetch(photoUrl);
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
    const thumbnailFilename = `${prestataireId}/thumbnail_${uuid}.jpg`;
    const fullFilename = `${prestataireId}/full_${uuid}.jpg`;
    
    console.log(`☁️ Uploading to Supabase Storage...`);

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

    const totalSavings = originalSizeKB - fullSizeKB;
    const savingsPercent = Math.round((totalSavings / originalSizeKB) * 100);
    
    console.log(`✅ Images compressed successfully`);
    console.log(`💾 Space saved: ${totalSavings} KB (${savingsPercent}% reduction)`);

    return new Response(
      JSON.stringify({ 
        success: true,
        thumbnailUrl: thumbnailUrlData.publicUrl,
        fullUrl: fullUrlData.publicUrl,
        filename: fullFilename.split('/').pop(),
        savings: {
          original_kb: originalSizeKB,
          thumbnail_kb: thumbnailSizeKB,
          full_kb: fullSizeKB,
          saved_kb: totalSavings,
          saved_percent: savingsPercent
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Compression error:', error);
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
