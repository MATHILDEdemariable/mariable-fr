
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import ChatbotButton from '@/components/ChatbotButton';

const LoginFrame = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow w-full">
        <div className="w-full h-full">
          <iframe 
            src="https://leguidemariable.softr.app/connexion" 
            width="100%" 
            height="1200" 
            style={{ border: 'none', background: 'transparent' }}
            title="Connexion Mariable"
          />
        </div>
      </main>
      
      <ChatbotButton />
    </div>
  );
};

export default LoginFrame;
