
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const GuideMariable = () => {
  useEffect(() => {
    window.location.href = 'https://leguidemariable.softr.app/';
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-xl">Redirection vers le Guide Mariable...</p>
    </div>
  );
};

export default GuideMariable;
