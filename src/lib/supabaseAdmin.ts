import { supabase } from '@/integrations/supabase/client';

export const fetchAllUsers = async () => {
  try {
    console.log('🚀 Appel de la fonction Edge pour récupérer les utilisateurs...');
    
    // Utiliser l'Edge Function qui utilise le Service Role Key
    const { data, error } = await supabase.functions.invoke('get-users', {
      method: 'GET'
    });

    if (error) {
      console.error('❌ Erreur Edge Function get-users:', error);
      throw new Error(`Erreur Edge Function: ${error.message}`);
    }

    if (data && data.success && data.users && data.users.length > 0) {
      console.log(`✅ ${data.users.length} utilisateurs récupérés via Edge Function (méthode: ${data.method})`);
      return data.users;
    }

    if (data && !data.success) {
      console.error('❌ Edge Function failed:', data.error);
      throw new Error(`Edge Function error: ${data.error}`);
    }

    console.log('⚠️ Aucun utilisateur trouvé via Edge Function');
    return [];
    
  } catch (error) {
    console.error('❌ Erreur complète fetchAllUsers:', error);
    throw new Error(`Impossible de récupérer les utilisateurs: ${error.message}`);
  }
};