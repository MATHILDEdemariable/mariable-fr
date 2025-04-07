
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';

const BudgetContent = () => (
  <>
    <p>
      La transparence des prix est au cœur de notre approche. Notre plateforme vous permet 
      d'accéder aux tarifs réels des prestataires sans mauvaises surprises.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Fonctionnalités</h2>
    
    <ul className="list-disc pl-6 space-y-2">
      <li>Accès aux tarifs directs communiqués par les prestataires</li>
      <li>Calculatrice de budget générant un devis instantané et personnalisé</li>
      <li>Comparaison claire des différentes options selon votre budget</li>
      <li>Simulation des coûts en fonction du nombre d'invités</li>
      <li>Détection des économies potentielles</li>
      <li>Adaptation automatique en fonction de vos priorités</li>
    </ul>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Notre engagement</h2>
    
    <p>
      Fini les surprises de dernière minute et les coûts cachés. Notre outil vous 
      permet de planifier sereinement votre budget avec une vision claire et réaliste 
      des dépenses à prévoir, vous permettant de prendre des décisions éclairées tout 
      au long de l'organisation de votre mariage.
    </p>
  </>
);

const Budget = () => {
  return (
    <ServiceTemplate 
      title="Gestion de budget"
      description="Transparence des prix et devis instantanés personnalisés"
      content={<BudgetContent />}
    />
  );
};

export default Budget;
