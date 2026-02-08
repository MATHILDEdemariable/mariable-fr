import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Heart, PartyPopper, Church, Utensils, MessageSquare, Sparkles, Scissors } from 'lucide-react';

interface MathildeExampleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MathildeExampleModal: React.FC<MathildeExampleModalProps> = ({ isOpen, onClose }) => {
  const planningItems = [
    { time: '10h30 - 11h30', title: 'Coiffure', icon: Scissors, color: 'text-pink-500' },
    { time: '12h00', title: 'Déjeuner', icon: Utensils, color: 'text-orange-500' },
    { time: '13h00 - 14h00', title: 'Makeup & Habillage mariée', icon: Sparkles, color: 'text-purple-500' },
    { time: '14h30', title: 'Départ vers église', icon: Clock, color: 'text-blue-500' },
    { time: '15h30', title: 'Église', icon: Church, color: 'text-yellow-600' },
    { time: '17h00', title: 'Sortie', icon: PartyPopper, color: 'text-green-500' },
    { time: '18h00', title: 'Cocktail', icon: Heart, color: 'text-red-400' },
    { time: '19h45', title: 'Passage à table', icon: Utensils, color: 'text-amber-600' },
    { time: '20h00', title: 'Service dîner', icon: Utensils, color: 'text-amber-600' },
    { time: 'Entre chaque service', title: 'Discours (4 x 10 min)', description: 'Avant entrée, avant plat, avant fromage, avant dessert', icon: MessageSquare, color: 'text-indigo-500' },
    { time: '23h30', title: 'Pièce montée + soirée dansante', icon: PartyPopper, color: 'text-fuchsia-500' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif flex items-center gap-2">
            <Heart className="h-5 w-5 text-wedding-olive" />
            Exemple : Mariage de Mathilde
          </DialogTitle>
          <DialogDescription>
            Un exemple concret de planning Jour J pour vous inspirer
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {planningItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
              >
                <div className={`p-2 rounded-full bg-white shadow-sm ${item.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{item.title}</span>
                    <span className="text-xs text-muted-foreground font-mono">{item.time}</span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-wedding-olive/10 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">💡 Conseil :</strong> Ce planning est un exemple type. 
            Adaptez les horaires à votre cérémonie et n'oubliez pas de prévoir des marges de temps !
          </p>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose} variant="outline">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MathildeExampleModal;
