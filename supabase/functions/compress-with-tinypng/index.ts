import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TINYPNG_API_KEY = Deno.env.get('TINYPNG_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting TinyPNG compression batch...');
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Récupérer 5 photos sans thumbnail
    const { data: photos, error: fetchError } = await supabase
      .from('prestataires_photos_preprod')
      .select('id, url, prestataire_id, filename')
      .is('thumbnail_url', null)
      .limit(5);

    if (fetchError) {
      console.error('❌ Error fetching photos:', fetchError);
      throw fetchError;
    }

    console.log(`📋 Found ${photos?.length || 0} photos to compress`);

    const results = [];
    const stats = {
      total: photos?.length || 0,
      success: 0,
      failed: 0,
      originalSize: 0,
      compressedSize: 0,
    };

    for (const photo of photos || []) {
      try {
        console.log(`🔄 Processing photo: ${photo.id} (${photo.filename})`);

        // Télécharger l'image depuis Supabase
        const imageResponse = await fetch(photo.url);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
        }
        const imageBuffer = await imageResponse.arrayBuffer();
        stats.originalSize += imageBuffer.byteLength;

        console.log(`📥 Downloaded image: ${(imageBuffer.byteLength / 1024).toFixed(2)} KB`);

        // Envoyer à TinyPNG pour compression
        const compressResponse = await fetch('https://api.tinify.com/shrink', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`api:${TINYPNG_API_KEY}`)}`,
          },
          body: imageBuffer,
        });

        if (!compressResponse.ok) {
          const errorText = await compressResponse.text();
          throw new Error(`TinyPNG API error: ${compressResponse.status} - ${errorText}`);
        }

        const compressData = await compressResponse.json();
        console.log(`✅ Compressed: ${compressData.input.size} → ${compressData.output.size} bytes (-${Math.round((1 - compressData.output.size / compressData.input.size) * 100)}%)`);

        // Télécharger l'image compressée
        const compressedResponse = await fetch(compressData.output.url);
        const compressedBuffer = await compressedResponse.arrayBuffer();
        stats.compressedSize += compressedBuffer.byteLength;

        // Générer le nom du fichier thumbnail
        const fileExtension = photo.filename?.split('.').pop() || 'jpg';
        const baseFilename = photo.filename?.replace(/\.[^/.]+$/, '') || `photo_${photo.id}`;
        const thumbnailFilename = `thumbnail_${baseFilename}.${fileExtension}`;
        const uploadPath = `${photo.prestataire_id}/${thumbnailFilename}`;

        console.log(`📤 Uploading to: ${uploadPath}`);

        // Upload dans Supabase
        const { error: uploadError } = await supabase.storage
          .from('prestataires-photos')
          .upload(uploadPath, compressedBuffer, { 
            contentType: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
            upsert: true 
          });

        if (uploadError) {
          throw uploadError;
        }

        // Construire l'URL publique
        const thumbnailUrl = `${SUPABASE_URL}/storage/v1/object/public/prestataires-photos/${uploadPath}`;

        // Mettre à jour la DB
        const { error: updateError } = await supabase
          .from('prestataires_photos_preprod')
          .update({ thumbnail_url: thumbnailUrl })
          .eq('id', photo.id);

        if (updateError) {
          throw updateError;
        }

        stats.success++;
        results.push({
          id: photo.id,
          filename: photo.filename,
          success: true,
          originalSize: compressData.input.size,
          compressedSize: compressData.output.size,
          savings: Math.round((1 - compressData.output.size / compressData.input.size) * 100),
        });

        console.log(`✅ Photo ${photo.id} compressed successfully`);
      } catch (error) {
        stats.failed++;
        console.error(`❌ Error processing photo ${photo.id}:`, error.message);
        results.push({
          id: photo.id,
          filename: photo.filename,
          success: false,
          error: error.message,
        });
      }
    }

    const summary = {
      success: true,
      stats,
      results,
      message: `Compressed ${stats.success}/${stats.total} photos. Saved ${((stats.originalSize - stats.compressedSize) / 1024 / 1024).toFixed(2)} MB`,
    };

    console.log('📊 Compression summary:', summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Fatal error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
