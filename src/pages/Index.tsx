
import React from 'react';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-wedding-cream/50">
      <header className="py-6 bg-wedding-blush/20 border-b">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-serif text-center">Nuptial AI</h1>
          <p className="text-center text-muted-foreground mt-2">Votre assistant virtuel pour planifier le mariage parfait</p>
        </div>
      </header>
      
      <main className="flex-grow container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-serif mb-2">Comment puis-je vous aider ?</h2>
            <p className="text-muted-foreground">
              Posez-moi des questions sur les prestataires de mariage, et je vous aiderai à trouver les meilleures options pour votre grand jour.
            </p>
          </div>
          
          <ChatInterface />
        </div>
      </main>
      
      <footer className="py-4 border-t bg-wedding-blush/10">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Nuptial AI - Votre assistant de mariage</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
