
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';

const HistoireContent = () => (
  <>
    <p>
      L'histoire de Mariable commence par une passion pour les mariages et une frustration face 
      à la complexité de leur organisation. Notre fondatrice, après avoir organisé son propre mariage 
      et aidé plusieurs amis, a constaté un manque d'outils modernes et intuitifs pour simplifier ce processus.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Notre mission</h2>
    
    <p>
      Mariable est né avec une mission claire : transformer l'organisation de mariage d'une tâche 
      stressante en une expérience agréable et enrichissante. Nous croyons que chaque couple mérite 
      de profiter pleinement de cette période spéciale sans être accablé par les détails logistiques.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Notre évolution</h2>
    
    <p>
      Depuis notre lancement, nous avons aidé des centaines de couples à créer le mariage de leurs 
      rêves. Notre plateforme s'est enrichie grâce aux retours de nos utilisateurs, et nous continuons 
      à innover pour offrir des solutions toujours plus pertinentes et faciles à utiliser.
    </p>
    
    <h2 className="text-2xl font-serif mt-8 mb-4">Nos valeurs</h2>
    
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>Simplicité</strong> : Nous simplifions chaque aspect de l'organisation.</li>
      <li><strong>Personnalisation</strong> : Chaque mariage est unique et mérite des solutions sur mesure.</li>
      <li><strong>Qualité</strong> : Nous recherchons l'excellence dans tous nos services et recommandations.</li>
      <li><strong>Inclusion</strong> : Nous célébrons la diversité des couples et de leurs traditions.</li>
    </ul>
  </>
);

const Histoire = () => {
  return (
    <ServiceTemplate 
      title="Notre histoire"
      description="Découvrez comment Mariable est né d'une passion"
      content={<HistoireContent />}
    />
  );
};

export default Histoire;
