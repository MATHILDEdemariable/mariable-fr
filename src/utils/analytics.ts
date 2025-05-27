
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

// Initialiser le dataLayer si pas encore défini
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}

/**
 * Envoie un événement personnalisé à Google Tag Manager
 */
export const sendGTMEvent = (eventData: GTMEvent) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(eventData);
    console.log('GTM Event envoyé:', eventData);
  }
};

/**
 * Envoie un événement GA4 via gtag
 */
export const sendGA4Event = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
    console.log('GA4 Event envoyé:', eventName, parameters);
  }
};

/**
 * Événements prédéfinis pour Mariable
 */
export const trackUserRegistration = (method: string = 'email') => {
  sendGTMEvent({
    event: 'user_registration',
    method: method,
    timestamp: Date.now()
  });
  
  sendGA4Event('sign_up', {
    method: method
  });
};

export const trackUserLogin = (method: string = 'email') => {
  sendGTMEvent({
    event: 'user_login',
    method: method,
    timestamp: Date.now()
  });
  
  sendGA4Event('login', {
    method: method
  });
};

export const trackPageView = (pagePath: string, pageTitle: string) => {
  sendGTMEvent({
    event: 'page_view',
    page_path: pagePath,
    page_title: pageTitle,
    timestamp: Date.now()
  });
  
  sendGA4Event('page_view', {
    page_title: pageTitle,
    page_location: window.location.href,
    page_path: pagePath
  });
};

export const trackWeddingToolUsage = (toolName: string, action: string = 'use') => {
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
};

export const trackVendorContact = (vendorType: string, vendorName?: string) => {
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
};

export const trackBudgetCalculation = (totalBudget: number, guestCount?: number) => {
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
};
