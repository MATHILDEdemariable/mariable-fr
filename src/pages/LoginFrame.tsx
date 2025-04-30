
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const LoginFrame = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the Register page
    navigate('/register');
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-wedding-olive"></div>
      </main>
    </div>
  );
};

export default LoginFrame;
