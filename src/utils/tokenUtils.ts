
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
    // Call the validate_share_token function
    const { data, error } = await supabase
      .rpc('validate_share_token', { token_value: token });
      
    if (error) {
      console.error('Error validating token:', error);
      return { isValid: false, userId: null };
    }
    
    if (!data || data.length === 0) {
      return { isValid: false, userId: null };
    }
    
    return { 
      isValid: data[0].is_valid, 
      userId: data[0].is_valid ? data[0].user_id : null 
    };
  } catch (error) {
    console.error('Error validating share token:', error);
    return { isValid: false, userId: null };
  }
};

/**
 * Sets the share token header for anonymous requests
 */
export const setShareTokenHeader = (token: string) => {
  // Set the token in the Supabase headers for all future requests
  supabase.functions.setAuthHeader(token);
};
