
import React from 'react';
import Header from '@/components/Header';
import { Mail, Linkedin, Calendar, MessageSquare } from 'lucide-react';

const NousContacter = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow py-16 container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Me contacter</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Au plaisir d'échanger avec vous
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center">
              <Mail className="mr-3 h-5 w-5 text-wedding-black" />
              <div>
                <p className="font-medium">Email</p>
                <a href="mailto:mathilde@mariable.fr" className="text-wedding-olive hover:underline">
                  mathilde@mariable.fr
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <MessageSquare className="mr-3 h-5 w-5 text-wedding-black" />
              <div>
                <p className="font-medium">Communauté WhatsApp</p>
                <a 
                  href="https://chat.whatsapp.com/mariable" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-wedding-olive hover:underline"
                >
                  Rejoindre le groupe
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <Linkedin className="mr-3 h-5 w-5 text-wedding-black" />
              <div>
                <p className="font-medium">Contact professionnel</p>
                <a 
                  href="https://www.linkedin.com/in/lambertmathilde/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-wedding-olive hover:underline"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="mr-3 h-5 w-5 text-wedding-black" />
              <div>
                <p className="font-medium">Prendre rendez-vous</p>
                <a 
                  href="https://cal.com/mathilde-mariable/30min" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-wedding-olive hover:underline"
                >
                  Réserver un créneau
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t bg-white text-wedding-black">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src="/lovable-uploads/3768f435-13c3-49a1-bbb3-87acf3b26cda.png" alt="Mariable Logo" className="h-10 w-auto" />
              <p className="font-serif text-xl">Mariable</p>
            </div>
            <p className="text-sm text-wedding-black/70">
              © 2025 Mariable
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NousContacter;
