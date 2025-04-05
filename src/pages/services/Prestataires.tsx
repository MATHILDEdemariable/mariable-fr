
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';

const PrestataireContent = () => (
  <>
    <p>
      Trouver les meilleurs prestataires pour votre mariage peut être une tâche ardue. 
      Chez Mariable, nous simplifions ce processus en vous mettant en relation avec des prestataires 
      de qualité qui correspondent parfaitement à vos goûts, votre style et votre budget.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Comment ça marche ?</h2>
    
    <p>
      Notre algorithme intelligent analyse vos préférences et vous propose uniquement 
      des prestataires qui correspondent à vos critères. Plus besoin de passer des heures 
      à faire des recherches, nous le faisons pour vous !
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Nos catégories de prestataires</h2>
    
    <ul className="list-disc pl-6 space-y-2">
      <li>Photographes et vidéastes</li>
      <li>Lieux de réception</li>
      <li>Traiteurs et services de restauration</li>
      <li>DJ et musiciens</li>
      <li>Fleuristes et décorateurs</li>
      <li>Wedding planners</li>
      <li>Location de mobilier et équipements</li>
      <li>Et bien plus encore...</li>
    </ul>
  </>
);

const Prestataires = () => {
  return (
    <ServiceTemplate 
      title="Recherche de prestataires"
      description="Trouvez les meilleurs prestataires adaptés à vos besoins"
      content={<PrestataireContent />}
    />
  );
};

export default Prestataires;
