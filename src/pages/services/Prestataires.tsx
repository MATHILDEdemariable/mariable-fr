
import React from 'react';
import Header from '@/components/Header';

const Prestataires = () => {
  return (
    <div className="min-h-screen flex flex-col bg-wedding-cream">
      <Header />
      
      <main className="flex-grow py-16 container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif mb-8">Recherche de prestataires</h1>
          
          <div className="prose prose-lg">
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
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t bg-wedding-black text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src="/lovable-uploads/3768f435-13c3-49a1-bbb3-87acf3b26cda.png" alt="Mariable Logo" className="h-10 w-auto" />
              <p className="font-serif text-xl">Mariable</p>
            </div>
            <p className="text-sm text-white/70">
              © 2025 Mariable
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Prestataires;
