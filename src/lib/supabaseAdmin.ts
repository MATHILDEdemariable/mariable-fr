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
    console.log('🚀 Début de fetchAllUsers - BYPASS Edge Function...');
    
    // SOLUTION DIRECTE : Utiliser RPC directement (bypasse Edge Function défaillante)
    console.log('🔧 Utilisation directe de la fonction RPC get_user_registrations...');
    
    const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('get_user_registrations');
    
    if (!rpcError && rpcData && rpcData.length > 0) {
      console.log(`✅ ${rpcData.length} utilisateurs récupérés via RPC directe`);
      return rpcData.map((user: any) => ({
        id: user.id,
        email: user.email || 'Email non disponible',
        created_at: user.created_at,
        raw_user_meta_data: user.raw_user_meta_data || {}
      }));
    }

    console.log('⚠️ RPC échoué, tentative Auth API directe...');
    
    // Fallback 2: Auth API directe
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000
      });
      
      if (!authError && authData?.users && authData.users.length > 0) {
        console.log(`✅ ${authData.users.length} utilisateurs récupérés via Auth API directe`);
        return authData.users.map(user => ({
          id: user.id,
          email: user.email || '',
          created_at: user.created_at,
          raw_user_meta_data: user.user_metadata || {}
        }));
      }
    } catch (authError) {
      console.error('❌ Auth API directe échouée:', authError);
    }

    console.log('🔄 Dernière tentative : profiles table...');
    
    // Fallback 3: Profiles uniquement
    const { data: profilesData, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, first_name, last_name, created_at')
      .order('created_at', { ascending: false });

    if (!profilesError && profilesData && profilesData.length > 0) {
      console.log(`✅ ${profilesData.length} utilisateurs récupérés via profiles table`);
      return profilesData.map(profile => ({
        id: profile.id,
        email: 'Email non disponible via profiles',
        created_at: profile.created_at,
        raw_user_meta_data: {
          first_name: profile.first_name,
          last_name: profile.last_name
        }
      }));
    }

    // Si toutes les méthodes échouent
    console.log('⚠️ Aucune méthode n\'a fonctionné, retour tableau vide');
    return [];
    
  } catch (error) {
    console.error('❌ Erreur complète fetchAllUsers:', error);
    throw new Error(`Impossible de récupérer les utilisateurs: ${error.message}`);
  }
};