import React from 'react';
import { Helmet } from 'react-helmet-async';
import { JeuneMarie } from '@/types/jeunes-maries';

interface SEOTestimonialProps {
  jeuneMarie: JeuneMarie;
}

const SEOTestimonial: React.FC<SEOTestimonialProps> = ({ jeuneMarie }) => {
  const siteUrl = "https://www.mariable.fr";
  const pageUrl = `${siteUrl}/jeunes-maries/${jeuneMarie.slug}`;
  
  // Données structurées pour les avis/témoignages
  const reviewStructuredData = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Service",
      "name": "Organisation de mariage",
      "provider": {
        "@type": "Organization",
        "name": "Mariable"
      }
    },
    "author": {
      "@type": "Person",
      "name": jeuneMarie.nom_complet
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": jeuneMarie.note_experience || 5,
      "bestRating": 5
    },
    "reviewBody": jeuneMarie.experience_partagee,
    "datePublished": jeuneMarie.date_soumission,
    "publisher": {
      "@type": "Organization",
      "name": "Mariable",
      "url": siteUrl
    }
  };

  // Données structurées pour l'événement de mariage
  const weddingEventData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `Mariage de ${jeuneMarie.nom_complet}`,
    "startDate": jeuneMarie.date_mariage,
    "location": {
      "@type": "Place",
      "name": jeuneMarie.lieu_mariage,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": jeuneMarie.lieu_mariage,
        "addressCountry": "FR"
      }
    },
    "organizer": {
      "@type": "Person",
      "name": jeuneMarie.nom_complet
    },
    "attendeeCount": jeuneMarie.nombre_invites,
    "description": jeuneMarie.experience_partagee
  };

  const title = `Témoignage mariage ${jeuneMarie.lieu_mariage} - ${jeuneMarie.nom_complet}`;
  const description = `Découvrez l'expérience de mariage de ${jeuneMarie.nom_complet} à ${jeuneMarie.lieu_mariage}. Conseils, budget et prestataires recommandés pour organiser votre mariage en France.`;
  const keywords = `témoignage mariage ${jeuneMarie.lieu_mariage}, mariage ${jeuneMarie.lieu_mariage}, expérience mariage france, organisation mariage, wedding planner france, prestataires mariage ${jeuneMarie.lieu_mariage}`;

  return (
    <Helmet>
      <title>{title} – Mariable</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="fr-FR" />
      <meta name="geo.region" content="FR" />
      <meta name="geo.country" content="France" />
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={jeuneMarie.photo_principale_url || "/lovable-uploads/23541521-b6ff-4175-a8c8-5017e5b19312.png"} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content="MARIABLE" />
      <meta property="og:locale" content="fr_FR" />
      <meta property="article:published_time" content={jeuneMarie.date_soumission} />
      <meta property="article:author" content={jeuneMarie.nom_complet} />
      <meta property="article:section" content="Témoignages" />
      <meta property="article:tag" content={`mariage ${jeuneMarie.lieu_mariage}`} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={jeuneMarie.photo_principale_url || "/lovable-uploads/23541521-b6ff-4175-a8c8-5017e5b19312.png"} />
      
      {/* Structured data for Review */}
      <script type="application/ld+json">
        {JSON.stringify(reviewStructuredData)}
      </script>
      
      {/* Structured data for Wedding Event */}
      <script type="application/ld+json">
        {JSON.stringify(weddingEventData)}
      </script>
      
      {/* Additional meta for local SEO */}
      <meta name="geo.placename" content={jeuneMarie.lieu_mariage} />
      <meta name="ICBM" content="46.2276, 2.2137" />
      
      {/* Schema.org breadcrumb */}
      <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Accueil",
              "item": "${siteUrl}"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Témoignages",
              "item": "${siteUrl}/jeunes-maries"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "${jeuneMarie.nom_complet}",
              "item": "${pageUrl}"
            }
          ]
        }
      `}</script>
    </Helmet>
  );
};

export default SEOTestimonial;