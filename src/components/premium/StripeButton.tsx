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
    // Charger le script Stripe dynamiquement
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.head.appendChild(script);

    // Écouter les événements de succès de paiement
    const handleStripeSuccess = () => {
      // Rediriger vers une page de succès avec un paramètre
      window.location.href = window.location.origin + '/dashboard?payment=success';
    };

    // Ajouter un event listener pour détecter le succès
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'stripe_checkout_success') {
        handleStripeSuccess();
      }
    });

    return () => {
      // Nettoyer le script lors du démontage
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