import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/admin/AdminLayout';
import CustomPagesManager from '@/components/admin/CustomPagesManager';

const CustomPages: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Pages Personnalisées | Admin Mariable</title>
        <meta name="description" content="Gestion des pages personnalisées avec iframe" />
      </Helmet>

      <AdminLayout>
        <CustomPagesManager />
      </AdminLayout>
    </>
  );
};

export default CustomPages;