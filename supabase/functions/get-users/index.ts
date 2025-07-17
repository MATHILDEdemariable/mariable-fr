import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    console.log('🚀 Starting get-users function...');

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

    let users: DatabaseUser[] = [];
    let method = 'unknown';

    // Method 1: Try to access auth.users directly using Supabase Auth API
    try {
      console.log('📋 Attempting to fetch users from Supabase Auth API...');
      
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('❌ Auth API error:', authError);
        throw authError;
      }
      
      if (authUsers && authUsers.users && authUsers.users.length > 0) {
        console.log(`✅ Successfully fetched ${authUsers.users.length} users from Auth API`);
        
        users = authUsers.users.map(user => ({
          id: user.id,
          email: user.email || 'Email non disponible',
          created_at: user.created_at,
          raw_user_meta_data: user.user_metadata || {}
        }));
        
        method = 'auth_api';
      } else {
        throw new Error('No users found in Auth API');
      }
    } catch (authApiError) {
      console.log('⚠️ Auth API failed, trying RPC function...');
      
      // Method 2: Try the RPC function as fallback
      try {
        const { data: rpcUsers, error: rpcError } = await supabase.rpc('get_user_registrations');
        
        if (rpcError) {
          console.error('❌ RPC error:', rpcError);
          throw rpcError;
        }
        
        if (rpcUsers && rpcUsers.length > 0) {
          console.log(`✅ Successfully fetched ${rpcUsers.length} users from RPC`);
          users = rpcUsers;
          method = 'rpc';
        } else {
          throw new Error('No users found via RPC');
        }
      } catch (rpcError) {
        console.log('⚠️ RPC failed, trying profiles table as final fallback...');
        
        // Method 3: Final fallback to profiles table
        try {
          const { data: profileUsers, error: profileError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, created_at')
            .order('created_at', { ascending: false });
          
          if (profileError) {
            console.error('❌ Profiles error:', profileError);
            throw profileError;
          }
          
          if (profileUsers && profileUsers.length > 0) {
            console.log(`✅ Successfully fetched ${profileUsers.length} users from profiles table`);
            
            users = profileUsers.map(profile => ({
              id: profile.id,
              email: 'Email non disponible',
              created_at: profile.created_at,
              raw_user_meta_data: {
                first_name: profile.first_name,
                last_name: profile.last_name
              }
            }));
            
            method = 'profiles_fallback';
          } else {
            throw new Error('No users found in profiles table');
          }
        } catch (profileError) {
          console.error('❌ All methods failed:', profileError);
          throw new Error('Unable to fetch users from any source');
        }
      }
    }

    console.log(`✅ Returning ${users.length} users via method: ${method}`);

    return new Response(
      JSON.stringify({ 
        users, 
        success: true, 
        method,
        count: users.length 
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