
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

    <div className="mt-16 mb-8">
      <h2 className="text-3xl font-serif text-center mb-12">Avec le soutien de</h2>
      
      <div className="grid md:grid-cols-3 gap-12 items-center">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <img 
            src="/lovable-uploads/f6b347a1-f299-4731-8b9a-10e21c0f1b08.png" 
            alt="Schoolab" 
            className="h-16 mb-4 object-contain" 
          />
          <h3 className="text-xl font-medium mb-1">SCHOOLAB, Paris</h3>
          <p className="text-sm text-muted-foreground">Incubateur de start-up</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <img 
            src="/lovable-uploads/bea0740d-427b-4f1b-95e3-2468f199ec77.png" 
            alt="ECE" 
            className="h-16 mb-4 object-contain" 
          />
          <h3 className="text-xl font-medium mb-1">ECE Paris</h3>
          <p className="text-sm text-muted-foreground">École d'ingénieurs</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <img 
            src="/lovable-uploads/e91fab7e-591d-455a-881c-42053176bf86.png"
            alt="L'Escalator"
            className="h-16 mb-4 object-contain"
          />
          <h3 className="text-xl font-medium mb-1">L'ESCALATOR</h3>
          <p className="text-sm text-muted-foreground">Incubateur de startup (Publicis)</p>
        </div>
      </div>
    </div>
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
