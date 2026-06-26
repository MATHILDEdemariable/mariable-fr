
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { requireAdmin } from '../_shared/adminAuth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DatabaseUser {
  id: string;
  email: string;
  created_at: string;
  raw_user_meta_data: any;
  profile?: {
    first_name?: string;
    last_name?: string;
    subscription_type?: string;
    subscription_expires_at?: string;
    wedding_date?: string;
    guest_count?: number;
    notify_club_mariable?: boolean;
    registration_purpose?: string;
    referral_source?: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminCheck = await requireAdmin(req);
    if (adminCheck) return adminCheck;

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

    // Method 1: Try to access auth.users directly using Supabase Auth API with pagination
    try {
      console.log('📋 Attempting to fetch ALL users from Supabase Auth API...');
      
      let allUsers: any[] = [];
      let page = 1;
      const perPage = 1000;
      let hasMoreUsers = true;

      while (hasMoreUsers) {
        console.log(`📋 Fetching page ${page} (${perPage} users per page)...`);
        
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers({
          page,
          perPage
        });
        
        if (authError) {
          console.error('❌ Auth API error:', authError);
          throw authError;
        }
        
        if (authUsers && authUsers.users && authUsers.users.length > 0) {
          console.log(`✅ Fetched ${authUsers.users.length} users from page ${page}`);
          allUsers = allUsers.concat(authUsers.users);
          
          // If we got less than perPage users, we're on the last page
          hasMoreUsers = authUsers.users.length === perPage;
          page++;
        } else {
          hasMoreUsers = false;
        }
      }

      if (allUsers.length > 0) {
        console.log(`✅ Total users fetched: ${allUsers.length}`);
        
        // Fetch profiles for all users
        const userIds = allUsers.map(user => user.id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, subscription_type, subscription_expires_at, wedding_date, guest_count, referral_source, notify_club_mariable, registration_purpose')
          .in('id', userIds);

        if (profilesError) {
          console.error('⚠️ Error fetching profiles:', profilesError);
        }

        console.log(`✅ Fetched ${profiles?.length || 0} profiles`);

        // Map profiles to users
        const profilesMap = new Map();
        if (profiles) {
          profiles.forEach(profile => {
            profilesMap.set(profile.id, profile);
          });
        }
        
        users = allUsers.map(user => {
          const profile = profilesMap.get(user.id);
          if (profile) {
            console.log(`User ${user.email}: Premium=${profile.subscription_type === 'premium'}, Expires=${profile.subscription_expires_at}`);
          }
          return {
            id: user.id,
            email: user.email || 'Email non disponible',
            created_at: user.created_at,
            raw_user_meta_data: user.user_metadata || {},
            profile: profile || null
          };
        });
        
        method = 'auth_api_with_profiles';
      } else {
        throw new Error('No users found in Auth API');
      }
    } catch (authApiError) {
      console.log('⚠️ Auth API failed, trying profiles table as fallback...');
      
      // Method 2: Final fallback to profiles table
      try {
        const { data: profileUsers, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, subscription_type, subscription_expires_at, wedding_date, guest_count, created_at, notify_club_mariable, registration_purpose, referral_source')
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
            },
            profile: {
              first_name: profile.first_name,
              last_name: profile.last_name,
              subscription_type: profile.subscription_type,
              subscription_expires_at: profile.subscription_expires_at,
              wedding_date: profile.wedding_date,
              guest_count: profile.guest_count,
              notify_club_mariable: profile.notify_club_mariable,
              registration_purpose: profile.registration_purpose,
              referral_source: profile.referral_source
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
