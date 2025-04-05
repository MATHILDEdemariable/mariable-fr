
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';

const HistoireContent = () => (
  <>
    <p className="mb-6">
      L'histoire de Mariable commence avec Mathilde, jeune mariée, diplomée d'école de commerce, 
      qui décide de se lancer dans l'entrepreneuriat et de révolutionner l'organisation des mariages 
      après son expérience personnelle.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Notre mission</h2>
    
    <p className="mb-4">
      Apporter de la joie et transformer l'organisation des mariages en une expérience simple et agréable.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Notre vision</h2>
    
    <p className="mb-4">
      Faciliter l'organisation et l'accès à un des plus beaux jours de votre vie.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Notre approche</h2>
    
    <p className="mb-4">
      Digitaliser et moderniser les méthodes d'organisation de mariage pour les rendre plus accessibles et moins stressantes.
    </p>
  </>
);

const Histoire = () => {
  return (
    <ServiceTemplate 
      title="Notre histoire"
      description="L'histoire d'une jeune mariée qui a décidé de tout changer"
      content={<HistoireContent />}
    />
  );
};

export default Histoire;
