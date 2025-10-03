import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserPlus, LogIn, Sparkles, Heart, FileDown } from 'lucide-react';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({ 
  isOpen, 
  onClose
}) => {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/auth?mode=signup');
    onClose();
  };

  const handleLogin = () => {
    navigate('/auth?mode=login');
    onClose();
  };

  const benefits = [
    { icon: Heart, text: 'Sauvegarde automatique de votre projet' },
    { icon: Sparkles, text: 'Accès illimité à l\'IA Mariable' },
    { icon: FileDown, text: 'Export PDF de votre planning' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">
            Pour continuer, créez votre compte gratuitement
          </DialogTitle>
          <DialogDescription>
            Vous avez utilisé votre prompt gratuit. Créez un compte pour profiter de tous les avantages Mariable.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Avantages */}
          <div className="bg-premium-sage-very-light rounded-lg p-4 space-y-3">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-premium-sage/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <benefit.icon className="w-4 h-4 text-premium-sage" />
                </div>
                <p className="text-sm text-foreground">{benefit.text}</p>
              </div>
            ))}
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handleSignup}
              className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white"
              size="lg"
            >
              <UserPlus className="h-4 w-4 mr-2" /> 
              Créer mon compte gratuitement
            </Button>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">Déjà membre ?</span>
              </div>
            </div>
            
            <Button 
              onClick={handleLogin}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <LogIn className="h-4 w-4 mr-2" /> 
              J'ai déjà un compte
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            🎉 Déjà <strong>12 847</strong> couples ont organisé leur mariage avec Mariable
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthRequiredModal;
