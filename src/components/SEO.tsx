
import React from 'react';
import { Helmet } from 'react-helmet-async';
import SEOSchemaEnhanced from './SEOSchemaEnhanced';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  schemas?: Array<{ type: 'Organization' | 'BlogPosting' | 'FAQ' | 'Course' | 'Review' | 'Event' | 'HowTo'; data: any }>;
  children?: React.ReactNode;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "Mariable — Tout votre mariage au même endroit",
  description = "Outils, prestataires et conseils pour organiser votre mariage sereinement, du budget au plan de table jusqu'à la coordination du jour J.",
  keywords,
  image = "https://www.mariable.fr/lovable-uploads/23541521-b6ff-4175-a8c8-5017e5b19312.png",
  canonical,
  ogType = 'website',
  schemas = [],
  children
}) => {
  // Self-reference og:url to current path when canonical not provided
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const resolvedPath = canonical ?? currentPath;
  // Avoid "X – Mariable" when title already contains "Mariable"
  const fullTitle = /mariable/i.test(title) ? title : `${title} – Mariable`;
  const siteUrl = "https://www.mariable.fr";
  const logoUrl = `${siteUrl}/lovable-uploads/c1b39e22-fe32-4dc7-8f94-fbb929ae43fa.png`;
  
  // Ensure image is always absolute URL
  const absoluteImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // BreadcrumbList generation
  const breadcrumbMapping: Record<string, string> = {
    'prix': 'Tarifs',
    'comparatif': 'Comparatif',
    'fonctionnalites': 'Fonctionnalités',
    'checklist-mariage': 'Checklist Mariage',
    'coordination-jour-j': 'Coordination Jour J',
    'conseilsmariage': 'Conseils Mariage',
    'services/budget': 'Calculateur Budget',
    'retroplanning': 'Rétroplanning',
    'partenariat': 'Partenariat',
    'professionnelsmariable': 'Professionnels',
    'selection': 'Sélection Prestataires',
    'guide-jour-j': 'Guide Jour J',
    'guide-debutant': 'Guide Débutant',
    'ceremonie-laique': 'Cérémonie Laïque',
    'mariage-civil': 'Mariage Civil',
    'ceremonie-catholique': 'Cérémonie Catholique',
    'mariage-provence': 'Mariage Provence',
    'mariage-paris': 'Mariage Paris',
    'mariage-bretagne': 'Mariage Bretagne',
    'mariage-normandie': 'Mariage Normandie',
    'mariage-occitanie': 'Mariage Occitanie',
    'mariage-auvergne-rhone-alpes': 'Mariage Auvergne-Rhône-Alpes',
    'mariage-nouvelle-aquitaine': 'Mariage Nouvelle-Aquitaine',
    'mariage-pays-de-la-loire': 'Mariage Pays de la Loire',
    'mariage-centre-val-de-loire': 'Mariage Centre-Val de Loire',
    'mariage-hauts-de-france': 'Mariage Hauts-de-France',
    'mariage-bourgogne-franche-comte': 'Mariage Bourgogne-Franche-Comté',
    'mariage-grand-est': 'Mariage Grand Est',
    'mariage-corse': 'Mariage Corse',
    'about/histoire': 'Notre Histoire',
    'about/charte': 'Notre Charte',
    'about/approche': 'Notre Approche',
    'about/temoignages': 'Témoignages',
    'contact': 'Contact',
    'contact/faq': 'FAQ',
    
    'accompagnement': 'Accompagnement',
    'salon-du-mariage-2025': 'Salon du Mariage 2025',
  };

  const regionPages = ['mariage-provence', 'mariage-paris', 'mariage-bretagne', 'mariage-normandie', 'mariage-occitanie', 'mariage-auvergne-rhone-alpes', 'mariage-nouvelle-aquitaine', 'mariage-pays-de-la-loire', 'mariage-centre-val-de-loire', 'mariage-hauts-de-france', 'mariage-bourgogne-franche-comte', 'mariage-grand-est', 'mariage-corse'];

  const generateBreadcrumbSchema = () => {
    if (!canonical || canonical === '/') return null;
    const path = canonical.replace(/^\//, '');
    const pageName = breadcrumbMapping[path];
    if (!pageName) return null;

    const items: Array<{ name: string; url: string }> = [
      { name: 'Accueil', url: siteUrl }
    ];

    if (regionPages.includes(path)) {
      items.push({ name: 'Mariage en Région', url: `${siteUrl}/selection` });
    } else if (path.startsWith('about/')) {
      items.push({ name: 'À Propos', url: `${siteUrl}/about/histoire` });
    }

    items.push({ name: pageName, url: `${siteUrl}${canonical}` });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": item.name,
        "item": item.url
      }))
    };
  };

  const breadcrumbSchema = generateBreadcrumbSchema();

  const metaKeywords = keywords || "mariage france, organisation mariage, planificateur mariage france, prestataires mariage, checklist mariage, budget mariage, planning mariage, coordinateur mariage, témoignages mariage, outils planning mariage personnalisé";

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={metaKeywords} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta name="language" content="fr-FR" />
        <meta name="geo.region" content="FR" />
        <meta name="geo.country" content="France" />
        <link rel="canonical" href={canonical ? `${siteUrl}${canonical}` : siteUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={ogType} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={absoluteImage} />
        <meta property="og:site_name" content="MARIABLE" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:url" content={`${siteUrl}${resolvedPath || ''}`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={absoluteImage} />
        <meta name="twitter:site" content="@mariable_fr" />
        <meta name="twitter:creator" content="@mariable_fr" />
        
        {/* Enhanced Structured Data */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Mariable",
            "url": "${siteUrl}",
            "logo": "${logoUrl}",
            "image": "${logoUrl}",
            "description": "Plateforme intelligente d'organisation de mariage : trouvez les meilleurs prestataires, planifiez chaque étape, suivez votre budget.",
            "areaServed": {
              "@type": "Country",
              "name": "France"
            },
            "serviceArea": {
              "@type": "Country",
              "name": "France"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "contact@mariable.fr",
              "availableLanguage": "French"
            },
            "sameAs": [
              "https://www.instagram.com/mariable.fr/"
            ],
            "potentialAction": {
              "@type": "SearchAction",
              "target": "${siteUrl}/selection?q={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Services Mariable",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Recherche de Prestataires Mariage",
                    "description": "Trouvez les meilleurs prestataires pour votre mariage"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Coordination Jour J",
                    "description": "Organisation et coordination de votre jour de mariage"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Calculateur Budget Mariage",
                    "description": "Outil de gestion et calcul de budget mariage"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Checklist Mariage",
                    "description": "Planning personnalisé pour l'organisation de votre mariage"
                  }
                }
              ]
            }
          }
        `}</script>
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Mariable",
            "url": "${siteUrl}",
            "applicationCategory": "LifestyleApplication",
            "operatingSystem": "Web",
            "description": "Plateforme gratuite d'organisation de mariage : checklist IA, budget, plan de table, coordination jour-J. Premium à 29 € (achat unique, accès à vie).",
            "offers": [
              {
                "@type": "Offer",
                "name": "Gratuit",
                "price": "0",
                "priceCurrency": "EUR",
                "description": "Accès aux outils essentiels : dashboard, checklist, budget, guide prestataires, RSVP digital"
              },
              {
                "@type": "Offer",
                "name": "Premium",
                "price": "29",
                "priceCurrency": "EUR",
                "description": "Achat unique, accès à vie. Exports illimités, IA illimitée, plan de table, coordination jour-J, stockage illimité"
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "150",
              "bestRating": "5"
            }
          }
        `}</script>
        {breadcrumbSchema && (
          <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        )}
        {children}
      </Helmet>
      
      {schemas.length > 0 && <SEOSchemaEnhanced schemas={schemas} />}
    </>
  );
};

export default SEO;
