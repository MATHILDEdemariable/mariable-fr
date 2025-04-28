
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const PrestataireContent = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-wedding-cream/30 p-6 rounded-lg mb-8 border border-wedding-olive/20">
        <h2 className="text-2xl font-serif mb-3">Nos sélections de prestataires</h2>
        <p className="mb-4">
          Découvrez nos sélections de prestataires de qualité pour votre mariage, soigneusement vérifiés par notre équipe.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-wedding-olive hover:bg-wedding-olive/90"
            onClick={() => navigate('/recherche')}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Guide Mariable
          </Button>
        </div>
      </div>
    
      <p>
        Trouver les meilleurs prestataires pour votre mariage peut être une tâche ardue. 
        Chez Mariable, nous simplifions ce processus en vous mettant en relation avec des prestataires 
        de qualité qui correspondent parfaitement à vos goûts, votre style et votre budget.
      </p>
      
      <h2 className="text-2xl font-serif mt-8 mb-4">Comment ça marche ?</h2>
      
      <div className="flex flex-col md:flex-row gap-4 items-start mb-8">
        <p className="flex-grow">
          Notre algorithme intelligent analyse vos préférences et vous propose uniquement 
          des prestataires qui correspondent à vos critères. Plus besoin de passer des heures 
          à faire des recherches, nous le faisons pour vous !
        </p>
      </div>
      
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
      description="Trouvez les meilleurs prestataires pour votre mariage"
      content={<PrestataireContent />}
    >
      <SEO 
        title="Trouvez les meilleurs prestataires de mariage"
        description="Lieux, traiteurs, photographes, DJs… Découvrez une sélection de prestataires vérifiés selon votre région et votre style."
      />
    </ServiceTemplate>
  );
};

export default Prestataires;
