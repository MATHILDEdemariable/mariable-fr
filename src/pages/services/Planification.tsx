
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';

const PlanificationContent = () => (
  <>
    <p>
      La planification d'un mariage implique de nombreuses étapes et peut rapidement devenir 
      source de stress. Notre solution de planification vous guide à travers chaque étape avec 
      simplicité et efficacité.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Outils de planification</h2>
    
    <ul className="list-disc pl-6 space-y-2">
      <li>Calendrier interactif avec rappels</li>
      <li>Listes de tâches personnalisées</li>
      <li>Suivi de l'avancement</li>
      <li>Conseils adaptés à chaque étape</li>
      <li>Modèles de planning pour différents types de mariage</li>
    </ul>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Avantages</h2>
    
    <p>
      Notre approche simplifiée de la planification vous permet de profiter pleinement 
      des préparatifs sans stress inutile. Vous pouvez vous concentrer sur les aspects 
      créatifs et émotionnels de votre mariage, tandis que nous nous occupons de la logistique.
    </p>
  </>
);

const Planification = () => {
  return (
    <ServiceTemplate 
      title="Planification de votre mariage"
      description="Organisez chaque étape de votre mariage sans stress"
      content={<PlanificationContent />}
    />
  );
};

export default Planification;
