
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
  showDebugConsole = process.env.NODE_ENV === 'development' 
}) => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    const pageTitle = document.title;
    trackPageView(location.pathname, pageTitle);
  }, [location]);

  return (
    <>
      {children}
      {showDebugConsole && <AnalyticsDebugConsole />}
    </>
  );
};

export default AnalyticsProvider;
