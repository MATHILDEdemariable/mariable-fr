
import { supabase } from '@/integrations/supabase/client';

/**
 * Validates a share token by calling the Supabase function
 */
export const validateShareToken = async (token: string | null): Promise<{ 
  isValid: boolean; 
  userId: string | null;
}> => {
  if (!token) {
    return { isValid: false, userId: null };
  }
  
  try {
    console.log('Validating token:', token);
    
    // Call the validate_share_token function
    const { data, error } = await supabase
      .rpc('validate_share_token', { token_value: token });
      
    console.log('Token validation response:', { data, error });
      
    if (error) {
      console.error('Error validating token:', error);
      return { isValid: false, userId: null };
    }
    
    if (!data || data.length === 0) {
      console.log('No token data found');
      return { isValid: false, userId: null };
    }
    
    const result = { 
      isValid: data[0].is_valid, 
      userId: data[0].is_valid ? data[0].user_id : null 
    };
    
    console.log('Token validation result:', result);
    return result;
  } catch (error) {
    console.error('Error validating share token:', error);
    return { isValid: false, userId: null };
  }
};

/**
 * Generates a new share token for a user
 */
export const generateShareToken = async (userId: string): Promise<string | null> => {
  try {
    // Check if user already has an active token
    const { data: existingToken, error: fetchError } = await supabase
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
    
    const { error: insertError } = await supabase
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
