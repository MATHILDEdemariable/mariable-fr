
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "MARIABLE",
  description = "MARIABLE est la plateforme intelligente qui vous aide à organiser votre mariage simplement : trouvez des prestataires de qualité, planifiez chaque étape, suivez votre budget.",
  image = "/lovable-uploads/23541521-b6ff-4175-a8c8-5017e5b19312.png"
}) => {
  const fullTitle = title === "MARIABLE" ? title : `${title} – MARIABLE`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
