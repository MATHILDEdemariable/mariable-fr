
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';

const ConseilsContent = () => (
  <>
    <p>
      Chaque mariage est unique, tout comme les futurs mariés. Nos conseils personnalisés 
      s'adaptent à votre style, vos préférences et votre vision du mariage idéal.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Conseils sur mesure</h2>
    
    <p>
      Que vous rêviez d'un mariage bohème en plein air, d'une cérémonie élégante dans un château, 
      ou d'une fête intime et décontractée, nous vous guidons dans vos choix avec des recommandations 
      adaptées à votre personnalité.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Domaines d'expertise</h2>
    
    <ul className="list-disc pl-6 space-y-2">
      <li>Choix des couleurs et thèmes</li>
      <li>Sélection du lieu idéal</li>
      <li>Tendances actuelles en matière de décoration</li>
      <li>Choix des fleurs selon la saison</li>
      <li>Options de menu et de gâteau</li>
      <li>Animation et divertissement</li>
      <li>Protocole et étiquette</li>
      <li>Solutions pour les mariages internationaux ou multiculturels</li>
    </ul>
    
    <p className="mt-6">
      Notre équipe d'experts en mariage est constamment à l'affût des dernières tendances 
      et innovations pour vous proposer des idées fraîches et créatives, tout en respectant 
      les traditions qui vous tiennent à cœur.
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
