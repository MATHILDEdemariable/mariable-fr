import React from 'react';
import { useTranslation } from 'react-i18next';
import { CGU_CONTENT } from '@/data/cguContent';

/** CGU officielles Mariable (Couples et Pros), affichées dans la langue active. */
const CguMariableContent: React.FC = () => {
  const { i18n } = useTranslation();
  const cguLanguage = i18n.language?.startsWith('en') ? 'en' : 'fr';
  const cgu = CGU_CONTENT[cguLanguage];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl text-foreground">{cgu.title}</h2>
        {cgu.intro.map((introLine) => (
          <p key={introLine} className="text-muted-foreground mt-1">{introLine}</p>
        ))}
      </div>
      {cgu.articles.map((article) => (
        <section key={article.heading}>
          <h3 className="font-serif text-lg text-foreground mb-2">{article.heading}</h3>
          {article.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-muted-foreground mb-2 leading-relaxed">{paragraph}</p>
          ))}
        </section>
      ))}
    </div>
  );
};

export default CguMariableContent;
