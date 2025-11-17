import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TINYPNG_API_KEY = Deno.env.get('TINYPNG_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function sanitizeFilename(filename: string): string {
  const parts = filename.split('.');
  const extension = parts.pop() || 'jpg';
  const name = parts.join('.');
  
  const cleaned = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  
  return `${cleaned}.${extension}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { photoUrl, prestataireId } = await req.json();
    
    console.log(`🚀 Compressing photo from ${photoUrl}`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Télécharger l'image depuis Supabase
    const imageResponse = await fetch(photoUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const originalSize = imageBuffer.byteLength;

    console.log(`📥 Downloaded: ${(originalSize / 1024).toFixed(2)} KB`);

    // Compresser avec TinyPNG
    const compressResponse = await fetch('https://api.tinify.com/shrink', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${TINYPNG_API_KEY}`)}`,
      },
      body: imageBuffer,
    });

    if (!compressResponse.ok) {
      throw new Error(`TinyPNG error: ${compressResponse.status}`);
    }

    const compressData = await compressResponse.json();
    console.log(`✅ Compressed: ${originalSize} → ${compressData.output.size} bytes (-${Math.round((1 - compressData.output.size / originalSize) * 100)}%)`);

    // Télécharger l'image compressée
    const compressedResponse = await fetch(compressData.output.url);
    const compressedBuffer = await compressedResponse.arrayBuffer();

    // Créer le thumbnail (via resize de TinyPNG)
    const resizeResponse = await fetch('https://api.tinify.com/output', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${TINYPNG_API_KEY}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: {
          url: compressData.output.url
        },
        resize: {
          method: 'fit',
          width: 800,
          height: 600
        }
      }),
    });

    if (!resizeResponse.ok) {
      console.log('⚠️ Resize failed, using compressed image as thumbnail');
      // Si le resize échoue, on utilise l'image compressée comme thumbnail
      const thumbnailBuffer = compressedBuffer;
    } else {
      const thumbnailBuffer = await resizeResponse.arrayBuffer();
    }

    // Générer noms de fichiers
    const timestamp = Date.now();
    const cleanFilename = sanitizeFilename(`photo_${timestamp}.jpg`);
    const baseFilename = cleanFilename.replace(/\.[^/.]+$/, '');
    const fileExtension = cleanFilename.split('.').pop() || 'jpg';

    // Upload version complète
    const fullPath = `${prestataireId}/${baseFilename}.${fileExtension}`;
    const { error: fullUploadError } = await supabase.storage
      .from('prestataires-photos')
      .upload(fullPath, compressedBuffer, { 
        contentType: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
        upsert: true 
      });

    if (fullUploadError) throw fullUploadError;

    // Upload thumbnail
    const thumbnailPath = `${prestataireId}/thumbnail_${baseFilename}.${fileExtension}`;
    const { error: thumbUploadError } = await supabase.storage
      .from('prestataires-photos')
      .upload(thumbnailPath, thumbnailBuffer, { 
        contentType: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
        upsert: true 
      });

    if (thumbUploadError) throw thumbUploadError;

    // Construire les URLs
    const fullUrl = `${SUPABASE_URL}/storage/v1/object/public/prestataires-photos/${fullPath}`;
    const thumbnailUrl = `${SUPABASE_URL}/storage/v1/object/public/prestataires-photos/${thumbnailPath}`;

    console.log(`✅ Upload complete: ${fullPath}`);

    return new Response(JSON.stringify({
      success: true,
      fullUrl,
      thumbnailUrl,
      filename: cleanFilename,
      originalSize,
      compressedSize: compressData.output.size,
      savings: Math.round((1 - compressData.output.size / originalSize) * 100),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
