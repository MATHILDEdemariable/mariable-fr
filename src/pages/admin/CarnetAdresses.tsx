import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/admin/AdminLayout';
import CarnetAdressesAdmin from '@/components/admin/CarnetAdressesAdmin';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useNavigate } from 'react-router-dom';

const CarnetAdressesPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated) {
    navigate('/admin');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Demandes Carnet d'Adresses | Admin Mariable</title>
        <meta name="description" content="Gestion des demandes de carnet d'adresses exclusif" />
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Demandes de Carnet d'Adresses</h1>
            <p className="text-gray-600 mt-1">
              Consultez et gérez toutes les demandes de carnet d'adresses exclusif des futurs mariés
            </p>
          </div>
          
          <CarnetAdressesAdmin />
        </div>
      </AdminLayout>
    </>
  );
};

export default CarnetAdressesPage;