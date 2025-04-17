
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';
import { Button } from '@/components/ui/button';
import { BookOpen, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrestataireContent = () => {
  const navigate = useNavigate();
  
  const handleGuideClick = () => {
    navigate('/guide-mariable-frame');
  };
  
  const handleSelectionClick = () => {
    navigate('/services/selection-mariable');
  };

  return (
    <>
      <div className="bg-wedding-cream/30 p-6 rounded-lg mb-8 border border-wedding-olive/20">
        <h2 className="text-2xl font-serif mb-3">Nos sélections de prestataires</h2>
        <p className="mb-4">
          Découvrez nos sélections de prestataires de qualité pour votre mariage, soigneusement vérifiés par notre équipe.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            className="bg-wedding-olive hover:bg-wedding-olive/90"
            onClick={handleGuideClick}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Guide Mariable
          </Button>
          
          <Button 
            className="bg-wedding-olive hover:bg-wedding-olive/90"
            onClick={handleSelectionClick}
          >
            <Users className="mr-2 h-4 w-4" />
            La sélection Mariable
          </Button>
        </div>
      </div>
    
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
};

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
