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
    let method = 'unknown';
    
    try {
      console.log('🔐 Trying auth.admin.listUsers...');
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000
      });
      
      if (authError) {
        console.error('❌ Auth API error:', authError);
        throw authError;
      }

      if (authData?.users && authData.users.length > 0) {
        users = authData.users.map(user => ({
          id: user.id,
          email: user.email || '',
          created_at: user.created_at,
          raw_user_meta_data: user.user_metadata || {}
        }));
        
        method = 'auth_api';
        console.log(`✅ Successfully fetched ${users.length} users via auth API`);
      } else {
        throw new Error('No users returned from auth API');
      }
    } catch (authError) {
      console.error('❌ Auth API failed, trying direct SQL approach:', authError);
      
      try {
        // Use RPC function to get users (bypasses RLS with SECURITY DEFINER)
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_user_registrations');
        
        if (rpcError) {
          console.error('❌ RPC error:', rpcError);
          throw rpcError;
        }

        if (rpcData && rpcData.length > 0) {
          users = rpcData.map((user: any) => ({
            id: user.id,
            email: user.email || '',
            created_at: user.created_at,
            raw_user_meta_data: user.raw_user_meta_data || {}
          }));
          
          method = 'rpc_function';
          console.log(`✅ RPC: fetched ${users.length} users via get_user_registrations`);
        } else {
          throw new Error('No users returned from RPC');
        }
      } catch (rpcError) {
        console.error('❌ RPC failed, trying profiles table fallback:', rpcError);
        
        // Final fallback: Get users from profiles table
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, created_at');

        if (profilesError) {
          console.error('❌ Profiles query error:', profilesError);
          throw profilesError;
        }

        if (profilesData && profilesData.length > 0) {
          users = profilesData.map(profile => ({
            id: profile.id,
            email: 'Email non disponible via profiles',
            created_at: profile.created_at,
            raw_user_meta_data: {
              first_name: profile.first_name,
              last_name: profile.last_name
            }
          }));
          
          method = 'profiles_fallback';
          console.log(`✅ Fallback: fetched ${users.length} users via profiles table`);
        } else {
          // Return empty array instead of throwing error
          users = [];
          method = 'empty_result';
          console.log('⚠️ No users found in any method, returning empty array');
        }
      }
    }

    // Return the users data
    return new Response(
      JSON.stringify({ 
        success: true, 
        users: users,
        count: users.length,
        method: method
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