
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/utils/analytics';
import AnalyticsDebugConsole from './AnalyticsDebugConsole';

interface AnalyticsProviderProps {
  children: React.ReactNode;
  showDebugConsole?: boolean;
}

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ 
  children, 
  showDebugConsole = false // Désactivé par défaut pour éviter les erreurs
}) => {
  const location = useLocation();

  useEffect(() => {
    try {
      // Track page view on route change
      const pageTitle = document.title;
      trackPageView(location.pathname, pageTitle);
    } catch (error) {
      console.warn('Erreur lors du tracking de page:', error);
    }
  }, [location]);

  return (
    <>
      {children}
      {showDebugConsole && process.env.NODE_ENV === 'development' && (
        <AnalyticsDebugConsole />
      )}
    </>
  );
};

export default AnalyticsProvider;
