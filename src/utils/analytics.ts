
// Google Analytics et Google Tag Manager utilities
export interface GTMEvent {
  event: string;
  [key: string]: any;
}

// Déclaration des types pour window.dataLayer et gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialiser le dataLayer de manière sécurisée
const initializeDataLayer = () => {
  try {
    if (typeof window !== 'undefined' && !window.dataLayer) {
      window.dataLayer = [];
    }
  } catch (error) {
    console.warn('Impossible d\'initialiser dataLayer:', error);
  }
};

// Initialiser seulement si on est dans le navigateur
if (typeof window !== 'undefined') {
  initializeDataLayer();
}

/**
 * Vérifie si les analytics sont disponibles
 */
const isAnalyticsAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && 
           window.dataLayer && 
           Array.isArray(window.dataLayer);
  } catch (error) {
    return false;
  }
};

/**
 * Vérifie si gtag est disponible
 */
const isGtagAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && 
           window.gtag && 
           typeof window.gtag === 'function';
  } catch (error) {
    return false;
  }
};

/**
 * Envoie un événement personnalisé à Google Tag Manager
 */
export const sendGTMEvent = (eventData: GTMEvent) => {
  try {
    if (isAnalyticsAvailable()) {
      window.dataLayer.push(eventData);
      console.log('GTM Event envoyé:', eventData);
    } else {
      console.warn('GTM non disponible - événement ignoré:', eventData);
    }
  } catch (error) {
    console.warn('Erreur lors de l\'envoi GTM Event:', error);
  }
};

/**
 * Envoie un événement GA4 via gtag
 */
export const sendGA4Event = (eventName: string, parameters: Record<string, any> = {}) => {
  try {
    if (isGtagAvailable()) {
      window.gtag('event', eventName, parameters);
      console.log('GA4 Event envoyé:', eventName, parameters);
    } else {
      console.warn('GA4 non disponible - événement ignoré:', eventName, parameters);
    }
  } catch (error) {
    console.warn('Erreur lors de l\'envoi GA4 Event:', error);
  }
};

/**
 * Événements prédéfinis pour Mariable
 */
export const trackUserRegistration = (method: string = 'email') => {
  try {
    sendGTMEvent({
      event: 'user_registration',
      method: method,
      timestamp: Date.now()
    });
    
    sendGA4Event('sign_up', {
      method: method
    });
  } catch (error) {
    console.warn('Erreur trackUserRegistration:', error);
  }
};

export const trackUserLogin = (method: string = 'email') => {
  try {
    sendGTMEvent({
      event: 'user_login',
      method: method,
      timestamp: Date.now()
    });
    
    sendGA4Event('login', {
      method: method
    });
  } catch (error) {
    console.warn('Erreur trackUserLogin:', error);
  }
};

export const trackPageView = (pagePath: string, pageTitle: string) => {
  try {
    sendGTMEvent({
      event: 'page_view',
      page_path: pagePath,
      page_title: pageTitle,
      timestamp: Date.now()
    });
    
    if (typeof window !== 'undefined') {
      sendGA4Event('page_view', {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: pagePath
      });
    }
  } catch (error) {
    console.warn('Erreur trackPageView:', error);
  }
};

export const trackWeddingToolUsage = (toolName: string, action: string = 'use') => {
  try {
    sendGTMEvent({
      event: 'wedding_tool_usage',
      tool_name: toolName,
      action: action,
      timestamp: Date.now()
    });
    
    sendGA4Event('wedding_tool_usage', {
      tool_name: toolName,
      action: action
    });
  } catch (error) {
    console.warn('Erreur trackWeddingToolUsage:', error);
  }
};

export const trackVendorContact = (vendorType: string, vendorName?: string) => {
  try {
    sendGTMEvent({
      event: 'vendor_contact',
      vendor_type: vendorType,
      vendor_name: vendorName || 'unknown',
      timestamp: Date.now()
    });
    
    sendGA4Event('vendor_contact', {
      vendor_type: vendorType,
      vendor_name: vendorName || 'unknown'
    });
  } catch (error) {
    console.warn('Erreur trackVendorContact:', error);
  }
};

export const trackBudgetCalculation = (totalBudget: number, guestCount?: number) => {
  try {
    sendGTMEvent({
      event: 'budget_calculation',
      total_budget: totalBudget,
      guest_count: guestCount || 0,
      timestamp: Date.now()
    });
    
    sendGA4Event('budget_calculation', {
      value: totalBudget,
      currency: 'EUR',
      guest_count: guestCount || 0
    });
  } catch (error) {
    console.warn('Erreur trackBudgetCalculation:', error);
  }
};
