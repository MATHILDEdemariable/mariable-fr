
import { createClient } from '@supabase/supabase-js';

// Client Supabase public pour les données partagées (sans authentification)
const SUPABASE_URL = "https://bgidfcqktsttzlwlumtz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaWRmY3FrdHN0dHpsd2x1bXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MjM1MTYsImV4cCI6MjA1ODk5OTUxNn0.ij6dWi7LiWNk9mh3SknY1N8-upp9l20R7CZZDeAMEys";

const publicSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Validates a planning share token using direct database query (works in private browsing)
 */
export const validatePlanningShareToken = async (token: string | null): Promise<{ 
  isValid: boolean; 
  coordinationId: string | null;
}> => {
  if (!token) {
    return { isValid: false, coordinationId: null };
  }
  
  try {
    console.log('🔍 Validating planning token with direct query:', token);
    
    // Validation directe du token sans RPC
    const { data: tokenData, error } = await publicSupabase
      .from('planning_share_tokens')
      .select('coordination_id, is_active, expires_at')
      .eq('token', token)
      .eq('is_active', true)
      .maybeSingle();
      
    console.log('📊 Token validation response:', { tokenData, error });
      
    if (error) {
      console.error('❌ Error validating token:', error);
      return { isValid: false, coordinationId: null };
    }
    
    if (!tokenData) {
      console.log('⚠️ No token data found');
      return { isValid: false, coordinationId: null };
    }
    
    // Vérifier l'expiration si définie
    if (tokenData.expires_at) {
      const expiresAt = new Date(tokenData.expires_at);
      const now = new Date();
      if (expiresAt <= now) {
        console.log('⚠️ Token expired');
        return { isValid: false, coordinationId: null };
      }
    }
    
    const result = { 
      isValid: true, 
      coordinationId: tokenData.coordination_id 
    };
    
    console.log('✅ Token validation result:', result);
    return result;
  } catch (error) {
    console.error('❌ Error validating planning share token:', error);
    return { isValid: false, coordinationId: null };
  }
};

/**
 * Get public coordination data using coordination ID (no auth required)
 */
export const getPublicCoordinationData = async (coordinationId: string) => {
  try {
    console.log('📋 Loading public coordination data for:', coordinationId);

    // Récupérer les données de coordination
    const { data: coordination, error: coordError } = await publicSupabase
      .from('wedding_coordination')
      .select('*')
      .eq('id', coordinationId)
      .single();

    if (coordError || !coordination) {
      console.error('❌ Error loading coordination:', coordError);
      throw new Error('Données de coordination non trouvées');
    }

    // Récupérer les tâches
    const { data: tasks, error: tasksError } = await publicSupabase
      .from('coordination_planning')
      .select('*')
      .eq('coordination_id', coordinationId)
      .order('position');

    if (tasksError) {
      console.error('❌ Error loading tasks:', tasksError);
    }

    // Récupérer l'équipe
    const { data: teamMembers, error: teamError } = await publicSupabase
      .from('coordination_team')
      .select('*')
      .eq('coordination_id', coordinationId)
      .order('created_at');

    if (teamError) {
      console.error('❌ Error loading team:', teamError);
    }

    // Récupérer les documents (titres seulement pour la vue publique)
    const { data: documents, error: docsError } = await publicSupabase
      .from('coordination_documents')
      .select('id, title, category, created_at')
      .eq('coordination_id', coordinationId)
      .order('created_at', { ascending: false });

    if (docsError) {
      console.error('❌ Error loading documents:', docsError);
    }

    const result = {
      coordination,
      tasks: tasks || [],
      teamMembers: teamMembers || [],
      documents: documents || []
    };

    console.log('📦 Public coordination data loaded:', result);
    return result;
  } catch (error) {
    console.error('❌ Error in getPublicCoordinationData:', error);
    throw error;
  }
};

/**
 * Validates a dashboard share token (legacy function - kept for compatibility)
 */
export const validateShareToken = async (token: string | null): Promise<{ 
  isValid: boolean; 
  userId: string | null;
}> => {
  if (!token) {
    return { isValid: false, userId: null };
  }
  
  try {
    console.log('🔍 Validating dashboard token:', token);
    
    // Validation directe du token dashboard
    const { data: tokenData, error } = await publicSupabase
      .from('dashboard_share_tokens')
      .select('user_id, active, expires_at')
      .eq('token', token)
      .eq('active', true)
      .maybeSingle();
      
    console.log('📊 Dashboard token validation response:', { tokenData, error });
      
    if (error) {
      console.error('❌ Error validating dashboard token:', error);
      return { isValid: false, userId: null };
    }
    
    if (!tokenData) {
      console.log('⚠️ No dashboard token data found');
      return { isValid: false, userId: null };
    }
    
    // Vérifier l'expiration si définie
    if (tokenData.expires_at) {
      const expiresAt = new Date(tokenData.expires_at);
      const now = new Date();
      if (expiresAt <= now) {
        console.log('⚠️ Dashboard token expired');
        return { isValid: false, userId: null };
      }
    }
    
    const result = { 
      isValid: true, 
      userId: tokenData.user_id 
    };
    
    console.log('✅ Dashboard token validation result:', result);
    return result;
  } catch (error) {
    console.error('❌ Error validating dashboard share token:', error);
    return { isValid: false, userId: null };
  }
};

/**
 * Generates a new share token for a user (legacy function)
 */
export const generateShareToken = async (userId: string): Promise<string | null> => {
  try {
    // Check if user already has an active token
    const { data: existingToken, error: fetchError } = await publicSupabase
      .from('dashboard_share_tokens')
      .select('token')
      .eq('user_id', userId)
      .eq('active', true)
      .maybeSingle();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }
    
    if (existingToken?.token) {
      return existingToken.token;
    }
    
    // Generate new token
    const { v4: uuidv4 } = await import('uuid');
    const token = uuidv4();
    
    const { error: insertError } = await publicSupabase
      .from('dashboard_share_tokens')
      .insert({
        token,
        user_id: userId,
        expires_at: null, // Permanent token
        description: 'Lien de partage public du tableau de bord',
        active: true
      });
    
    if (insertError) throw insertError;
    
    return token;
  } catch (error) {
    console.error('Error generating share token:', error);
    return null;
  }
};
