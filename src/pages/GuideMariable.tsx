
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GuideMariable = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the internal MoteurRecherche page instead of external URL
    navigate('/recherche');
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-xl">Redirection vers le Guide Mariable...</p>
    </div>
  );
};

export default GuideMariable;
