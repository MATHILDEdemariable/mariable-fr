import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SystemCheckComponent from '@/components/admin/SystemCheck';

const AdminSystemCheck: React.FC = () => {
  return (
    <AdminLayout>
      <SystemCheckComponent />
    </AdminLayout>
  );
};

export default AdminSystemCheck;