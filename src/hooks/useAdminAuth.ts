
import { useState, useEffect } from 'react';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification admin depuis sessionStorage
    const adminAuth = sessionStorage.getItem('admin_authenticated');
    setIsAuthenticated(adminAuth === 'true');
    setIsLoading(false);
  }, []);

  const login = (password: string): boolean => {
    const ADMIN_PASSWORD = 'Alain1987!';
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};
