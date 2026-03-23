import React from 'react';
import PremiumHeader from '@/components/home/PremiumHeader';
import ChatbotButton from '@/components/ChatbotButton';

const NewsletterEmbed = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PremiumHeader />
      <main className="flex-grow w-full pt-16">
        <iframe 
          src="https://2mscw76h.mule.page/" 
          width="100%" 
          className="w-full min-h-[calc(100vh-64px)]"
          style={{ border: 'none', background: 'transparent' }}
          title="Guide Personnalisé Mariable"
        />
      </main>
      <ChatbotButton />
    </div>
  );
};

export default NewsletterEmbed;
