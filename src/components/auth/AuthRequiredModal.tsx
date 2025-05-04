
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserPlus, LogIn, ChevronRight } from 'lucide-react';

interface AuthRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({ 
  open, 
  onOpenChange,
  onSuccess
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login', { 
      state: { 
        returnUrl: window.location.pathname,
        onAuthSuccess: onSuccess 
      } 
    });
    onOpenChange(false);
  };

  const handleSignup = () => {
    navigate('/register', { 
      state: { 
        returnUrl: window.location.pathname,
        onAuthSuccess: onSuccess
      } 
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Connexion requise</DialogTitle>
          <DialogDescription>
            Vous devez être connecté pour ajouter ce prestataire à votre wishlist.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 py-4">
          <Button 
            onClick={handleSignup}
            className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white flex items-center justify-center"
          >
            <UserPlus className="h-4 w-4 mr-2" /> 
            Créer un compte gratuitement
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
          
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-muted-foreground">Déjà membre ?</span>
            </div>
          </div>
          
          <Button 
            onClick={handleLogin}
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <LogIn className="h-4 w-4 mr-2" /> 
            Se connecter
          </Button>
        </div>
        
        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Plus tard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthRequiredModal;
