import React from 'react';
import { Link } from 'react-router-dom';

interface InternalLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  keywords?: string[];
}

const InternalLink: React.FC<InternalLinkProps> = ({ 
  to, 
  children, 
  className = "", 
  keywords = [] 
}) => {
  // Fonction pour tracker les clics sur les liens internes
  const handleClick = () => {
    // Analytics pour le maillage interne
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'internal_link_click', {
        link_url: to,
        link_text: typeof children === 'string' ? children : '',
        keywords: keywords.join(', ')
      });
    }
  };

  return (
    <Link 
      to={to} 
      className={`text-primary hover:text-primary/80 transition-colors ${className}`}
      onClick={handleClick}
      title={keywords.length > 0 ? `En savoir plus sur : ${keywords.join(', ')}` : undefined}
    >
      {children}
    </Link>
  );
};

export default InternalLink;