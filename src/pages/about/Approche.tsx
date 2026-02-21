
import React from 'react';
import { Helmet } from 'react-helmet-async';
import ServiceTemplate from '../ServiceTemplate';

const ApprocheContent = () => (
  <>
    <p className="mb-6">
      Chez Mariable, notre approche est centrée sur la simplicité, la personnalisation et l'utilisation 
      de la technologie pour rendre l'organisation de votre mariage plus agréable et moins stressante.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Notre méthode</h2>
    
    <p className="mb-4">
      Nous utilisons l'intelligence artificielle et les données pour vous proposer uniquement des prestataires 
      qui correspondent à vos goûts, votre style et votre budget. Notre algorithme apprend de vos préférences 
      pour affiner ses recommandations.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Personnalisation</h2>
    
    <p className="mb-4">
      Chaque couple est unique, et votre mariage devrait l'être aussi. Nous prenons le temps de comprendre 
      vos souhaits et vos besoins pour vous proposer des options sur mesure.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Transparence</h2>
    
    <p className="mb-4">
      Nous sommes transparents sur nos méthodes de travail et nos partenariats. Tous les prestataires 
      recommandés sont sélectionnés pour leur qualité de service et leur professionnalisme.
    </p>
  </>
);

const Approche = () => {
  return (
    <ServiceTemplate 
      title="Notre approche"
      description="Comment nous vous aidons à créer le mariage de vos rêves"
      content={<ApprocheContent />}
    >
      <Helmet>
        <title>Notre Approche | Mariable - Organisation Mariage</title>
        <meta name="description" content="Découvrez l'approche Mariable : intelligence artificielle, personnalisation et transparence pour organiser votre mariage simplement et sans stress." />
        <link rel="canonical" href="https://www.mariable.fr/about/approche" />
      </Helmet>
    </ServiceTemplate>
  );
};

export default Approche;
