import { supabase } from '@/integrations/supabase/client';

export const fetchAllUsers = async () => {
  try {
    console.log('🚀 Utilisation de la fonction RPC get_user_registrations...');
    
    // Utiliser la fonction RPC qui bypasse RLS et accède à auth.users
    const { data, error } = await supabase.rpc('get_user_registrations');

    if (error) {
      console.error('❌ Erreur RPC get_user_registrations:', error);
      throw new Error(`Erreur RPC: ${error.message}`);
    }

    if (data && data.length > 0) {
      console.log(`✅ ${data.length} utilisateurs récupérés via RPC`);
      return data;
    }

    console.log('⚠️ Aucun utilisateur trouvé via RPC');
    return [];
    
  } catch (error) {
    console.error('❌ Erreur complète fetchAllUsers:', error);
    throw new Error(`Impossible de récupérer les utilisateurs: ${error.message}`);
  }
};