import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ToDoListMariage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Redirection 301 vers la page checklist avec variant
    navigate('/checklist-mariage?variant=todo', { replace: true });
  }, [navigate]);

  return (
    <div>
      <Helmet>
        <title>To Do List Mariage Gratuite | Checklist Complète des Préparatifs</title>
        <meta name="description" content="📝 To do list mariage complète et gratuite. Liste détaillée de tous vos préparatifs de mariage à télécharger. Organisez votre mariage étape par étape." />
        <meta name="keywords" content="to do list mariage, liste mariage, préparatifs mariage, checklist mariage, organisation mariage, planning mariage" />
        <link rel="canonical" href="https://www.mariable.fr/checklist-mariage" />
        
        {/* Redirection 301 */}
        <meta httpEquiv="refresh" content="0; url=/checklist-mariage?variant=todo" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Redirection vers votre to do list mariage...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Si la redirection ne fonctionne pas, <a href="/checklist-mariage" className="text-wedding-olive underline">cliquez ici</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToDoListMariage;