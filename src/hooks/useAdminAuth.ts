import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Admin auth — server-side check.
 * Verifies the current Supabase user is an admin via the `is_admin()` RPC
 * (which reads the `admin_users` table with a security-definer function).
 *
 * No client-side password. To become admin, a user must:
 *   1) sign in via Supabase Auth
 *   2) have a row in `public.admin_users` (managed server-side)
 */
export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAuthenticated(false);
        return;
      }
      const { data, error } = await supabase.rpc('is_admin');
      if (error) {
        console.error('is_admin RPC error:', error);
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(data === true);
    } catch (e) {
      console.error('checkAdmin error:', e);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAdmin();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  /**
   * Sign in with email + password, then verify admin status.
   * Returns true only if the signed-in user is an admin.
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('signIn error:', error);
      return false;
    }
    const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin');
    if (rpcError || isAdmin !== true) {
      // Not an admin — sign back out to avoid leaving a non-admin session
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      return false;
    }
    setIsAuthenticated(true);
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};
