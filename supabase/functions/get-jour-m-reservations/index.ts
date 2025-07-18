
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JourMReservation {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  wedding_date: string;
  wedding_location: string;
  guest_count: number;
  budget?: string;
  status: string;
  created_at: string;
  updated_at: string;
  current_organization: string;
  partner_name?: string;
  services_souhaites?: any[];
  specific_needs?: string;
  processed_by?: string;
  processed_at?: string;
  admin_notes?: string;
  contact_jour_j?: any;
  prestataires_reserves?: any;
  uploaded_files?: any[];
  delegation_tasks?: string;
  deroulement_mariage?: string;
  documents_links?: string;
  hear_about_us?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting get-jour-m-reservations function...');

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🔑 Supabase client initialized with service role');

    let reservations: JourMReservation[] = [];
    let method = 'unknown';

    try {
      console.log('📋 Attempting to fetch Jour-M reservations...');
      
      const { data: reservationData, error: reservationError } = await supabase
        .from('jour_m_reservations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (reservationError) {
        console.error('❌ Jour-M reservations error:', reservationError);
        throw reservationError;
      }
      
      if (reservationData && reservationData.length > 0) {
        console.log(`✅ Successfully fetched ${reservationData.length} Jour-M reservations`);
        reservations = reservationData;
        method = 'direct_query';
      } else {
        console.log('⚠️ No Jour-M reservations found');
        reservations = [];
        method = 'direct_query_empty';
      }
    } catch (directError) {
      console.error('❌ Direct query failed:', directError);
      throw new Error(`Unable to fetch Jour-M reservations: ${directError.message}`);
    }

    console.log(`✅ Returning ${reservations.length} reservations via method: ${method}`);

    return new Response(
      JSON.stringify({ 
        reservations, 
        success: true, 
        method,
        count: reservations.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
