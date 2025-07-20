
import React, { useEffect } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': {
        'buy-button-id': string;
        'publishable-key': string;
      };
    }
  }
}

const StripeButton: React.FC = () => {
  useEffect(() => {
    console.log('🔄 Loading Stripe button script...');
    
    // Charger le script Stripe dynamiquement
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.head.appendChild(script);

    // Écouter les événements de succès de paiement
    const handleStripeSuccess = (event: MessageEvent) => {
      console.log('💳 Stripe checkout event received:', event.data);
      
      if (event.data && event.data.type === 'stripe_checkout_success') {
        console.log('✅ Payment successful, redirecting...');
        
        // Extraire le session_id de l'événement si disponible
        const sessionId = event.data.sessionId || event.data.session_id;
        const currentUrl = window.location.href;
        
        // Construire l'URL de redirection avec session_id
        const redirectUrl = sessionId 
          ? `${currentUrl}${currentUrl.includes('?') ? '&' : '?'}payment=success&session_id=${sessionId}`
          : `${currentUrl}${currentUrl.includes('?') ? '&' : '?'}payment=success`;
        
        console.log('🔄 Redirecting to:', redirectUrl);
        window.location.href = redirectUrl;
      }
    };

    // Ajouter l'event listener
    window.addEventListener('message', handleStripeSuccess);

    return () => {
      // Nettoyer les event listeners et scripts
      window.removeEventListener('message', handleStripeSuccess);
      const existingScript = document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <stripe-buy-button
      buy-button-id="buy_btn_1RmxYCKHghqBzkgj4PRtbqgp"
      publishable-key="pk_live_51QhATxKHghqBzkgjrOvXxufXAoARsLAhtHykXruHDjz2b52lbegutZofksNklLE8SUGR0OXHcvQYFdFq4kZtzDPG00RlmJOHbp"
    />
  );
};

export default StripeButton;
