import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirection SEO : l'article a été transféré vers la zone blog.
const ContentCreatorMariage = () => {
  return <Navigate to="/conseilsmariage/content-creator-mariage-france" replace />;
};

export default ContentCreatorMariage;
