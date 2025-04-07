
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';

const ConseilsContent = () => (
  <>
    <p>
      Chaque mariage est unique, tout comme les futurs mariés. Nos conseils personnalisés 
      s'adaptent à votre style, vos préférences et votre vision du mariage idéal.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Un référentiel de prestataires d'exception</h2>
    
    <p>
      Nous avons rigoureusement sélectionné chaque prestataire de notre plateforme selon des 
      critères stricts de qualité, de fiabilité et de professionnalisme. Notre processus de 
      vérification approfondi vous garantit de collaborer uniquement avec les meilleurs talents 
      du secteur.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">La connexion humaine avant tout</h2>
    
    <p>
      Au-delà des compétences techniques, nous valorisons particulièrement le feeling et la 
      connexion humaine entre vous et vos prestataires. Cette dimension relationnelle est selon 
      nous essentielle pour créer un mariage authentique qui vous ressemble.
    </p>
    
    <p className="mt-6">
      Notre approche personnalisée vous aide à identifier les prestataires avec lesquels vous 
      partagerez une véritable alchimie, créant ainsi les conditions idéales pour un mariage 
      parfait qui restera gravé dans vos mémoires.
    </p>
  </>
);

const Conseils = () => {
  return (
    <ServiceTemplate 
      title="Conseils personnalisés"
      description="Des recommandations adaptées à votre style et vos envies"
      content={<ConseilsContent />}
    />
  );
};

export default Conseils;
