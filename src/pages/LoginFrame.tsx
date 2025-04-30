
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ChatbotButton from '@/components/ChatbotButton';

const LoginFrame = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the register page
    navigate('/register');
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow w-full flex items-center justify-center">
        <div className="text-center">
          <p>Redirection vers la page d'inscription...</p>
        </div>
      </main>
      
      <ChatbotButton />
    </div>
  );
};

export default LoginFrame;
