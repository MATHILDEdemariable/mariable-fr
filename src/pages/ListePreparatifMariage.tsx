import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ListePreparatifMariage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirection 301 vers la page checklist avec variant
    navigate('/checklist-mariage?variant=preparatifs', { replace: true });
  }, [navigate]);

  return (
    <div>
      <Helmet>
        <title>Liste Préparatif Mariage | Checklist Complète des Préparatifs</title>
        <meta name="description" content="📋 Liste préparatif mariage complète et gratuite. Tous les préparatifs essentiels pour organiser votre mariage sans rien oublier. Guide détaillé." />
        <meta name="keywords" content="liste préparatif mariage, préparatifs mariage, checklist mariage, organisation mariage, to do list mariage, planification mariage" />
        <link rel="canonical" href="https://www.mariable.fr/checklist-mariage" />
        
        {/* Redirection 301 */}
        <meta httpEquiv="refresh" content="0; url=/checklist-mariage?variant=preparatifs" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Redirection vers votre liste préparatif mariage...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Si la redirection ne fonctionne pas, <a href="/checklist-mariage" className="text-wedding-olive underline">cliquez ici</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListePreparatifMariage;