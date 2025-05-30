
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, DollarSign, Camera, Calendar } from 'lucide-react';

const WeddingToolsSection = () => {
  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="container px-4">
        <h2 className="text-2xl md:text-3xl font-serif mb-8 text-center">Comment Mariable facilite l'organisation de votre mariage ?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="border border-wedding-olive-border rounded-lg p-5 hover:shadow-md hover:border-gray-400 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <CheckSquare className="h-5 w-5 text-gray-700" />
              <h3 className="font-medium text-lg">Checklist mariage complète</h3>
            </div>
            <p className="mb-3">
              Suivez toutes les étapes importantes dans notre checklist mariage personnalisée pour ne rien oublier jusqu'au jour J.
            </p>
            <Link to="/services/planification" className="text-gray-700 hover:text-gray-900 hover:underline inline-flex items-center">
              Accéder à la checklist <span className="ml-1">→</span>
            </Link>
          </div>
          
          <div className="border border-wedding-olive-border rounded-lg p-5 hover:shadow-md hover:border-gray-400 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5 text-gray-700" />
              <h3 className="font-medium text-lg">Gestion du budget mariage</h3>
            </div>
            <p className="mb-3">
              Maîtrisez votre budget mariage grâce à notre outil de suivi financier intelligent.
            </p>
            <Link to="/services/budget" className="text-gray-700 hover:text-gray-900 hover:underline inline-flex items-center">
              Gérer mon budget <span className="ml-1">→</span>
            </Link>
          </div>
          
          <div className="border border-wedding-olive-border rounded-lg p-5 hover:shadow-md hover:border-gray-400 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-gray-700" />
              <h3 className="font-medium text-lg">Conseils personnalisés</h3>
            </div>
            <p className="mb-3">
            Écrivez nous sur WhatsApp, nous répondrons au mieux à vos questions & demandes
            </p>
            <Link to="/services/conseils" className="text-gray-700 hover:text-gray-900 hover:underline inline-flex items-center">
              Rejoindre le groupe <span className="ml-1">→</span>
            </Link>
          </div>
          
          <div className="border border-wedding-olive-border rounded-lg p-5 hover:shadow-md hover:border-gray-400 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="h-5 w-5 text-gray-700" />
              <h3 className="font-medium text-lg">Sélection de prestataires</h3>
            </div>
            <p className="mb-3">
              Trouvez les meilleurs prestataires de mariage adaptés à votre style et à votre budget.
            </p>
            <Link to="/recherche" className="text-gray-700 hover:text-gray-900 hover:underline inline-flex items-center">
              Découvrir les prestataires <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingToolsSection;
