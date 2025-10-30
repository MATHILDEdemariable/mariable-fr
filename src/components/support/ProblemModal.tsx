import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Mail, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProblemModal: React.FC<ProblemModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-wedding-olive">
            Un problème ?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-gray-700 text-center mb-6">
            Écrivez-nous par mail à{' '}
            <a 
              href="mailto:mathilde@mariable.fr" 
              className="text-wedding-olive font-medium underline hover:text-wedding-olive/80"
            >
              mathilde@mariable.fr
            </a>
            {' '}ou sur insta :)
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => window.location.href = 'mailto:mathilde@mariable.fr'}
              className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90"
            >
              <Mail className="h-4 w-4 mr-2" />
              Envoyer un email
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.open('https://www.instagram.com/mariable.fr/', '_blank')}
              className="flex-1"
            >
              <Instagram className="h-4 w-4 mr-2" />
              Instagram
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
