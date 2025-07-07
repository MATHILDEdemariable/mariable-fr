import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://bgidfcqktsttzlwlumtz.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaWRmY3FrdHN0dHpsd2x1bXR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzQyMzUxNiwiZXhwIjoyMDU4OTk5NTE2fQ.SZXWJPv2EaEeVkAeZYJ82YglPpv2AJNjPKmF2WRIbNg";

// Client Supabase avec Service Role Key pour les opérations admin
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const fetchAllUsers = async () => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }

    return data.users.map(user => ({
      id: user.id,
      email: user.email || '',
      created_at: user.created_at,
      raw_user_meta_data: user.user_metadata || {}
    }));
  } catch (error) {
    console.error('Erreur fetchAllUsers:', error);
    throw error;
  }
};