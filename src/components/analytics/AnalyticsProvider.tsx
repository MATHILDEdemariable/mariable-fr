
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
  showDebugConsole = false
}) => {
  const location = useLocation();

  useEffect(() => {
    // Ajouter un délai pour s'assurer que la page est entièrement chargée
    const timer = setTimeout(() => {
      try {
        const pageTitle = document.title || 'Page sans titre';
        trackPageView(location.pathname, pageTitle);
      } catch (error) {
        console.warn('Erreur lors du tracking de page:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
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
