
import React from 'react';
import Header from '@/components/Header';

interface ServiceTemplateProps {
  title: string;
  description: string;
  content: React.ReactNode;
}

const ServiceTemplate: React.FC<ServiceTemplateProps> = ({ title, description, content }) => {
  return (
    <div className="min-h-screen flex flex-col bg-wedding-cream">
      <Header />
      
      <main className="flex-grow py-16 container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground mb-8">{description}</p>
          
          <div className="prose prose-lg">
            {content}
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t bg-wedding-black text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src="/lovable-uploads/3768f435-13c3-49a1-bbb3-87acf3b26cda.png" alt="Mariable Logo" className="h-10 w-auto" />
              <p className="font-serif text-xl">Mariable</p>
            </div>
            <p className="text-sm text-white/70">
              © 2025 Mariable
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServiceTemplate;
