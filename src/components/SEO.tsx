
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  children?: React.ReactNode;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "Le premier wedding planner de poche – Mariable",
  description = "Mariable est la solution clé en main pour organiser votre mariage. Profitez pleinement de votre journée grâce à un outil simple, personnalisé et sans charge mentale.",
  keywords,
  image = "/lovable-uploads/23541521-b6ff-4175-a8c8-5017e5b19312.png",
  canonical,
  children
}) => {
  const fullTitle = title === "Le premier wedding planner de poche – Mariable" ? title : `${title} – Mariable`;
  const siteUrl = "https://www.mariable.fr";
  const logoUrl = `${siteUrl}/lovable-uploads/c1b39e22-fe32-4dc7-8f94-fbb929ae43fa.png`;

  const metaKeywords = keywords || "mariage france, organisation mariage, planificateur mariage france, prestataires mariage, checklist mariage, budget mariage, planning mariage, coordinateur mariage, témoignages mariage, outils planning mariage personnalisé";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="fr-FR" />
      <meta name="geo.region" content="FR" />
      <meta name="geo.country" content="France" />
      {canonical && <link rel="canonical" href={`${siteUrl}${canonical}`} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="MARIABLE" />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:url" content={`${siteUrl}${canonical || ''}`} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured data for Organization */}
      <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Mariable",
          "url": "${siteUrl}",
          "logo": "${logoUrl}",
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "contact@mariable.fr"
          },
          "sameAs": [],
          "description": "Plateforme intelligente d'organisation de mariage : trouvez les meilleurs prestataires, planifiez chaque étape, suivez votre budget.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "${siteUrl}/selection?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
      `}</script>
      {children}
    </Helmet>
  );
};

export default SEO;
