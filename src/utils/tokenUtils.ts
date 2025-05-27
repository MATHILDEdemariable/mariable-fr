
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
 * Sets the share token header for anonymous requests
 */
export const setShareTokenHeader = (token: string) => {
  // Use a custom header for share token
  const customHeaders = {
    'x-share-token': token
  };
  
  // Set headers for auth and functions as needed
  if (supabase.functions && typeof supabase.functions.setAuth === 'function') {
    supabase.functions.setAuth(token);
  }
  
  // Add header to all requests as a fallback
  (supabase as any).headers = {
    ...(supabase as any).headers,
    ...customHeaders
  };
};
