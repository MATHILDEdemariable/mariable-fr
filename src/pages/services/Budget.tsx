
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';

const BudgetContent = () => (
  <>
    <p>
      La gestion du budget est souvent l'aspect le plus délicat de l'organisation d'un mariage. 
      Notre outil de budgétisation vous aide à garder le contrôle de vos dépenses et à éviter 
      les mauvaises surprises.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Fonctionnalités</h2>
    
    <ul className="list-disc pl-6 space-y-2">
      <li>Modèles de budget adaptés à différents styles de mariage</li>
      <li>Répartition automatique des fonds selon les priorités</li>
      <li>Suivi des dépenses en temps réel</li>
      <li>Alertes en cas de dépassement de budget</li>
      <li>Conseils pour économiser sur certains postes</li>
      <li>Comparaison des offres de prestataires</li>
    </ul>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Notre approche</h2>
    
    <p>
      Nous croyons qu'un mariage mémorable ne rime pas nécessairement avec dépenses excessives. 
      Notre objectif est de vous aider à créer le mariage de vos rêves tout en respectant vos 
      contraintes financières, en vous guidant vers des choix judicieux et des solutions créatives.
    </p>
  </>
);

const Budget = () => {
  return (
    <ServiceTemplate 
      title="Gestion de budget"
      description="Maîtrisez vos dépenses et optimisez votre budget de mariage"
      content={<BudgetContent />}
    />
  );
};

export default Budget;
