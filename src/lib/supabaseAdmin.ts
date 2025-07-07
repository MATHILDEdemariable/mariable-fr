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

// Test de connectivité avec Supabase
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Test de connectivité Supabase Admin...');
    const { data, error } = await supabaseAdmin.from('admin_users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Erreur de connectivité:', error);
      return false;
    }
    
    console.log('✅ Connectivité Supabase Admin OK');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connectivité:', error);
    return false;
  }
};

// Méthode alternative : requête SQL directe
export const fetchUsersDirectSQL = async () => {
  try {
    console.log('🔍 Récupération des utilisateurs via SQL direct avec RPC...');
    
    // Utiliser la fonction RPC get_user_registrations qui bypasse RLS
    const { data, error } = await supabaseAdmin.rpc('get_user_registrations');

    if (error) {
      console.error('❌ Erreur RPC get_user_registrations:', error);
      
      // Fallback vers profiles si RPC échoue
      console.log('🔄 Tentative fallback vers profiles...');
      const { data: profilesData, error: profilesError } = await supabaseAdmin
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('❌ Erreur profiles fallback:', profilesError);
        throw profilesError;
      }

      console.log(`✅ ${profilesData?.length || 0} utilisateurs récupérés via profiles fallback`);
      
      return profilesData?.map(user => ({
        id: user.id,
        email: 'Non disponible via profiles',
        created_at: user.created_at,
        raw_user_meta_data: {
          first_name: user.first_name,
          last_name: user.last_name
        }
      })) || [];
    }

    console.log(`✅ ${data?.length || 0} utilisateurs récupérés via RPC`);
    
    // Les données RPC ont déjà le bon format
    return data || [];
  } catch (error) {
    console.error('❌ Erreur fetchUsersDirectSQL:', error);
    throw error;
  }
};

export const fetchAllUsers = async () => {
  try {
    console.log('🚀 Début de fetchAllUsers...');
    
    // Nouvelle approche : utiliser la fonction edge
    console.log('🔧 Utilisation de la fonction edge get-users...');
    
    const { data, error } = await supabaseAdmin.functions.invoke('get-users');
    
    if (error) {
      console.error('❌ Erreur fonction edge:', error);
      throw error;
    }
    
    if (data && data.success && data.users) {
      console.log(`✅ ${data.count} utilisateurs récupérés via edge function (méthode: ${data.method})`);
      return data.users;
    } else {
      console.error('❌ Réponse edge function invalide:', data);
      throw new Error('Réponse invalide de la fonction edge');
    }
    
  } catch (error) {
    console.error('❌ Erreur complète fetchAllUsers:', error);
    
    // Fallback ultime : SQL direct
    console.log('🔄 Tentative de fallback SQL direct...');
    try {
      return await fetchUsersDirectSQL();
    } catch (fallbackError) {
      console.error('❌ Fallback SQL aussi échoué:', fallbackError);
      throw new Error(`Impossible de récupérer les utilisateurs: ${error.message}`);
    }
  }
};