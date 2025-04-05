
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const EmailCapture = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Succès",
        description: "Merci pour votre inscription ! Nous vous contacterons bientôt.",
      });
      
      setIsSubmitting(false);
      navigate('/'); // Redirect to home page
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-wedding-cream">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/3768f435-13c3-49a1-bbb3-87acf3b26cda.png" 
              alt="Mariable Logo" 
              className="h-20 mx-auto mb-4" 
            />
            <h2 className="text-3xl font-serif">Commencez votre aventure</h2>
            <p className="text-muted-foreground mt-2">
              Laissez-nous votre email pour être informé des dernières nouveautés et recevoir des conseils exclusifs pour votre mariage.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-wedding-black hover:bg-wedding-black/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              En vous inscrivant, vous acceptez notre politique de confidentialité et nos conditions d'utilisation.
            </p>
          </form>
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

export default EmailCapture;
