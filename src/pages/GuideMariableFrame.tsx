
import React from 'react';
import Header from '@/components/Header';
import ChatbotButton from '@/components/ChatbotButton';

const GuideMariableFrame = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow w-full">
        <div className="w-full h-full">
          <iframe 
            src="https://leguidemariable.softr.app/" 
            width="100%" 
            className="w-full min-h-[80vh]"
            style={{ border: 'none', background: 'transparent' }}
            title="Guide Mariable"
          />
        </div>
      </main>
      
      <ChatbotButton />
    </div>
  );
};

export default GuideMariableFrame;
