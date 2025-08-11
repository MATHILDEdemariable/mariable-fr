import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SchemaData {
  type: 'Organization' | 'BlogPosting' | 'FAQ' | 'Course' | 'Review' | 'Event';
  data: any;
}

interface SEOSchemaEnhancedProps {
  schemas: SchemaData[];
}

const SEOSchemaEnhanced: React.FC<SEOSchemaEnhancedProps> = ({ schemas }) => {
  const generateSchema = (schema: SchemaData) => {
    const baseContext = { "@context": "https://schema.org" };
    
    switch (schema.type) {
      case 'Organization':
        return {
          ...baseContext,
          "@type": "Organization",
          name: "Mariable",
          description: "Plateforme de planification de mariage en France",
          url: "https://mariable.fr",
          logo: "https://mariable.fr/logo.png",
          sameAs: [
            "https://www.facebook.com/mariable",
            "https://www.instagram.com/mariable"
          ],
          address: {
            "@type": "PostalAddress",
            addressCountry: "FR"
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+33-1-23-45-67-89",
            contactType: "customer service",
            availableLanguage: "French"
          },
          ...schema.data
        };

      case 'BlogPosting':
        return {
          ...baseContext,
          "@type": "BlogPosting",
          publisher: {
            "@type": "Organization",
            name: "Mariable",
            logo: {
              "@type": "ImageObject",
              url: "https://mariable.fr/logo.png"
            }
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": schema.data.url
          },
          ...schema.data
        };

      case 'FAQ':
        return {
          ...baseContext,
          "@type": "FAQPage",
          mainEntity: schema.data.questions?.map((q: any) => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: q.answer
            }
          })) || []
        };

      case 'Course':
        return {
          ...baseContext,
          "@type": "Course",
          provider: {
            "@type": "Organization",
            name: "Mariable"
          },
          ...schema.data
        };

      case 'Review':
        return {
          ...baseContext,
          "@type": "Review",
          publisher: {
            "@type": "Organization",
            name: "Mariable"
          },
          ...schema.data
        };

      case 'Event':
        return {
          ...baseContext,
          "@type": "Event",
          organizer: {
            "@type": "Organization",
            name: "Mariable"
          },
          ...schema.data
        };

      default:
        return { ...baseContext, ...schema.data };
    }
  };

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateSchema(schema))
          }}
        />
      ))}
    </Helmet>
  );
};

export default SEOSchemaEnhanced;