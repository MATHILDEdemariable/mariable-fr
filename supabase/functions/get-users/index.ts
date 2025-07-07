import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DatabaseUser {
  id: string;
  email: string;
  created_at: string;
  raw_user_meta_data: any;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 get-users function called');
    
    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('📊 Attempting to fetch users from auth.users...');

    // Try to get users via admin API first
    let users: DatabaseUser[] = [];
    
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('❌ Auth API error:', authError);
        throw authError;
      }

      if (authData?.users) {
        users = authData.users.map(user => ({
          id: user.id,
          email: user.email || '',
          created_at: user.created_at,
          raw_user_meta_data: user.user_metadata || {}
        }));
        
        console.log(`✅ Successfully fetched ${users.length} users via auth API`);
      }
    } catch (authError) {
      console.error('❌ Auth API failed, trying profiles table fallback:', authError);
      
      // Fallback: Get users from profiles table with email lookup
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, created_at');

      if (profilesError) {
        console.error('❌ Profiles query error:', profilesError);
        throw profilesError;
      }

      if (profilesData) {
        users = profilesData.map(profile => ({
          id: profile.id,
          email: 'Email non disponible',
          created_at: profile.created_at,
          raw_user_meta_data: {
            first_name: profile.first_name,
            last_name: profile.last_name
          }
        }));
        
        console.log(`✅ Fallback: fetched ${users.length} users via profiles table`);
      }
    }

    // Return the users data
    return new Response(
      JSON.stringify({ 
        success: true, 
        users: users,
        count: users.length,
        method: users.length > 0 && users[0].email !== 'Email non disponible' ? 'auth_api' : 'profiles_fallback'
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Function error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        users: [],
        count: 0
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500,
      }
    );
  }
});