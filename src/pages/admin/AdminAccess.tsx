
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminAccess from '@/components/admin/AdminAccess';

const AdminAccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already authenticated
    const hasAccess = localStorage.getItem('admin_access');
    if (hasAccess === 'granted') {
      navigate('/admin/prestataires');
    }
  }, [navigate]);

  const handleAccessGranted = () => {
    navigate('/admin/prestataires');
  };

  return <AdminAccess onAccessGranted={handleAccessGranted} />;
};

export default AdminAccessPage;
