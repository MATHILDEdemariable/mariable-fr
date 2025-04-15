
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';

const CharteContent = () => (
  <>
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-serif mb-6">La Charte Mariable</h1>
      <p className="text-lg">
        Le Label Mariable distingue les prestataires du mariage qui se démarquent par leur professionnalisme, 
        leur passion et leur engagement à offrir des prestations haut de gamme.
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      <div className="space-y-3">
        <h2 className="text-xl font-serif font-medium">Confiance</h2>
        <p>
          Créer une relation transparente avec les mariés grâce à des tarifs clairs et des services définis.
        </p>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-xl font-serif font-medium">Passion</h2>
        <p>
          Offrir des prestations personnalisées et marquées par l'excellence et la créativité.
        </p>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-xl font-serif font-medium">Relationnel humain</h2>
        <p>
          Accompagner les clients de manière flexible, attentive et bienveillante.
        </p>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-xl font-serif font-medium">Excellence</h2>
        <p>
          Maintenir des standards élevés, notamment en termes de service, de logistique et de rendu final.
        </p>
      </div>
    </div>
    
    <h2 className="text-2xl font-serif text-center mb-8">
      Les prestataires doivent s'engager à respecter les conditions suivantes :
    </h2>
    
    <div className="grid md:grid-cols-2 gap-8 mb-16">
      <div className="space-y-3">
        <h3 className="text-xl font-serif font-medium">Transparence des informations</h3>
        <p>
          Présenter leurs services selon un format standardisé et afficher les tarifs.
        </p>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-serif font-medium">Audit d'excellence</h3>
        <p>
          Accepter l'évaluation des clients et l'audit annuel de Mariable sur la base de critères précis définis par métier.
        </p>
      </div>
    </div>
    
    <h2 className="text-2xl font-serif text-center mb-8">La connexion humaine avant tout</h2>
    
    <p className="mb-8 text-center">
      Au-delà des compétences techniques, nous valorisons particulièrement la dimension relationnelle 
      & l'importance du feeling qui est selon nous essentielle pour les couples.
    </p>
  </>
);

const Charte = () => {
  return (
    <ServiceTemplate 
      title="Notre charte"
      description="Notre engagement pour des prestations de qualité"
      content={<CharteContent />}
    />
  );
};

export default Charte;
