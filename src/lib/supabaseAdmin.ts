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
    console.log('🔍 Récupération des utilisateurs via SQL direct...');
    
    // Requête SQL directe pour récupérer les utilisateurs depuis auth.users
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        first_name,
        last_name,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur SQL directe:', error);
      throw error;
    }

    console.log(`✅ ${data?.length || 0} utilisateurs récupérés via SQL`);
    
    return data?.map(user => ({
      id: user.id,
      email: 'Non disponible via SQL', // L'email est dans auth.users, pas accessible via SQL direct
      created_at: user.created_at,
      raw_user_meta_data: {
        first_name: user.first_name,
        last_name: user.last_name
      }
    })) || [];
  } catch (error) {
    console.error('❌ Erreur fetchUsersDirectSQL:', error);
    throw error;
  }
};

export const fetchAllUsers = async () => {
  try {
    console.log('🚀 Début de fetchAllUsers...');
    
    // Étape 1 : Test de connectivité
    const isConnected = await testSupabaseConnection();
    if (!isConnected) {
      throw new Error('Impossible de se connecter à Supabase');
    }

    // Étape 2 : Tentative avec l'API Admin
    console.log('🔍 Tentative avec API Admin...');
    
    try {
      // Récupération avec pagination
      let allUsers = [];
      let page = 1;
      const perPage = 1000; // Maximum autorisé par Supabase
      
      while (true) {
        console.log(`📄 Récupération page ${page}...`);
        
        const { data, error } = await supabaseAdmin.auth.admin.listUsers({
          page: page,
          perPage: perPage
        });
        
        if (error) {
          console.error(`❌ Erreur API Admin page ${page}:`, error);
          console.error('Détails erreur:', {
            message: error.message,
            status: error.status
          });
          throw error;
        }

        if (!data || !data.users) {
          console.log('📭 Aucune donnée récupérée');
          break;
        }

        console.log(`✅ Page ${page}: ${data.users.length} utilisateurs`);
        allUsers.push(...data.users);
        
        // Si moins d'utilisateurs que la limite, c'est la dernière page
        if (data.users.length < perPage) {
          break;
        }
        
        page++;
      }

      console.log(`🎉 Total utilisateurs récupérés via API Admin: ${allUsers.length}`);
      
      return allUsers.map(user => ({
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
        raw_user_meta_data: user.user_metadata || {}
      }));
      
    } catch (adminError) {
      console.error('❌ Échec API Admin, tentative SQL directe...', adminError);
      
      // Étape 3 : Fallback avec SQL direct
      return await fetchUsersDirectSQL();
    }
    
  } catch (error) {
    console.error('❌ Erreur complète fetchAllUsers:', error);
    throw error;
  }
};