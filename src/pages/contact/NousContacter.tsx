
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const NousContacter = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-wedding-cream">
      <Header />
      
      <main className="flex-grow py-16 container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Nous contacter</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Notre équipe est à votre disposition pour répondre à toutes vos questions.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-serif mb-4">Coordonnées</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">contact@mariable.com</p>
                </div>
                
                <div>
                  <p className="font-medium">Téléphone</p>
                  <p className="text-muted-foreground">+33 (0)1 23 45 67 89</p>
                </div>
                
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-muted-foreground">
                    42 Avenue des Mariés<br />
                    75008 Paris<br />
                    France
                  </p>
                </div>
                
                <div>
                  <p className="font-medium">Horaires</p>
                  <p className="text-muted-foreground">
                    Du lundi au vendredi : 9h00 - 18h00<br />
                    Samedi : 10h00 - 16h00<br />
                    Dimanche : Fermé
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-serif mb-4">Formulaire de contact</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input placeholder="Votre nom" required />
                </div>
                
                <div>
                  <Input type="email" placeholder="Votre email" required />
                </div>
                
                <div>
                  <Input placeholder="Sujet" required />
                </div>
                
                <div>
                  <Textarea 
                    placeholder="Votre message" 
                    className="min-h-[150px]" 
                    required 
                  />
                </div>
                
                <Button type="submit" className="w-full bg-wedding-black hover:bg-wedding-black/90 text-white">
                  Envoyer
                </Button>
              </form>
            </div>
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

export default NousContacter;
