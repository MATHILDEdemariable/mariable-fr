import React from 'react';
import Header from '@/components/Header';
import ChatbotButton from '@/components/ChatbotButton';

const NewsletterEmbed = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow w-full">
        <iframe 
          src="https://2mscw76h.mule.page/" 
          width="100%" 
          className="w-full min-h-[calc(100vh-64px)]"
          style={{ border: 'none', background: 'transparent' }}
          title="Newsletter Mariable"
        />
      </main>
      <ChatbotButton />
    </div>
  );
};

export default NewsletterEmbed;
