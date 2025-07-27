
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
    // Hash simple du mot de passe côté client pour plus de sécurité
    const hashPassword = (pwd: string): string => {
      return btoa(pwd + 'mariable_salt_2024');
    };
    
    // Le hash du mot de passe admin sera stocké en variable d'environnement
    // Pour le moment, on garde la compatibilité avec l'ancien système
    const ADMIN_PASSWORD_HASH = 'QWxhaW4xOTg3IW1hcmlhYmxlX3NhbHRfMjAyNA=='; // Hash temporaire
    
    if (hashPassword(password) === ADMIN_PASSWORD_HASH) {
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
