import React from 'react';
import { Helmet } from 'react-helmet-async';
import CustomPagesManager from '@/components/admin/CustomPagesManager';

const CustomPages: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Pages Personnalisées | Admin Mariable</title>
        <meta name="description" content="Gestion des pages personnalisées avec iframe" />
      </Helmet>

      <div className="container mx-auto py-8">
        <CustomPagesManager />
      </div>
    </>
  );
};

export default CustomPages;