import React from 'react';
import { Helmet } from 'react-helmet-async';

const ProfessionnelsEmbedded = () => {
  return (
    <>
      <Helmet>
        <title>Sélection Mariable | Dashboard</title>
      </Helmet>
      
      <div className="h-full w-full">
        <iframe 
          src="/professionnels-mariable"
          className="w-full h-[calc(100vh-96px)] border-0"
          title="Sélection de Prestataires Mariable"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </>
  );
};

export default ProfessionnelsEmbedded;
