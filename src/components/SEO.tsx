
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "Le premier wedding planner de poche – Mariable",
  description = "Mariable est la solution clé en main pour organiser votre mariage. Profitez pleinement de votre journée grâce à un outil simple, personnalisé et sans charge mentale.",
  image = "/lovable-uploads/23541521-b6ff-4175-a8c8-5017e5b19312.png",
  canonical
}) => {
  const fullTitle = title === "Le premier wedding planner de poche – Mariable" ? title : `${title} – Mariable`;
  const siteUrl = "https://www.mariable.fr";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      {canonical && <link rel="canonical" href={`${siteUrl}${canonical}`} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="MARIABLE" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured data for Local Business */}
      <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "MARIABLE",
          "url": "https://www.mariable.fr",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.mariable.fr/recherche?q={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "description": "Plateforme intelligente d'organisation de mariage : trouvez les meilleurs prestataires, planifiez chaque étape, suivez votre budget."
        }
      `}</script>
    </Helmet>
  );
};

export default SEO;
