import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HelpCircle, X, Calendar, Users, Clock, CheckCircle } from 'lucide-react';

const STORAGE_KEY = 'planning-guide-popup-seen';

export const PlanningGuidePopup: React.FC = () => {
  const [showButton, setShowButton] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu le guide
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      // Afficher le bouton après un court délai
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOpenGuide = () => {
    setShowGuide(true);
    setShowButton(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleCloseGuide = () => {
    setShowGuide(false);
  };

  const handleDismiss = () => {
    setShowButton(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!showButton && !showGuide) return null;

  return (
    <>
      {/* Bouton flottant clignotant */}
      {showButton && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
          <div className="bg-white rounded-lg shadow-lg px-4 py-2 text-sm font-medium text-gray-700 animate-pulse">
            Guide d'utilisation
          </div>
          <Button
            onClick={handleOpenGuide}
            className="animate-pulse bg-wedding-olive hover:bg-wedding-olive/90 rounded-full p-4 shadow-lg h-14 w-14"
          >
            <HelpCircle className="h-6 w-6" />
          </Button>
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Modal du guide */}
      <Dialog open={showGuide} onOpenChange={handleCloseGuide}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-wedding-olive flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Guide d'utilisation du Planning
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-gray-600 text-sm">
              Bienvenue sur votre planning du Jour-J ! Voici comment l'utiliser efficacement :
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-wedding-olive mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Ajouter des événements</h4>
                  <p className="text-xs text-gray-600">
                    Cliquez sur "+" pour ajouter un nouvel événement avec l'heure, la durée et les détails.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-wedding-olive mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Assigner des personnes</h4>
                  <p className="text-xs text-gray-600">
                    Attribuez chaque tâche à un membre de l'équipe (témoin, coordinateur, etc.).
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-wedding-olive mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Gérer les horaires</h4>
                  <p className="text-xs text-gray-600">
                    Glissez-déposez pour réorganiser les événements ou modifiez les heures directement.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-wedding-olive mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Partager votre planning</h4>
                  <p className="text-xs text-gray-600">
                    Utilisez le bouton de partage pour envoyer le planning à vos prestataires.
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleCloseGuide}
              className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
            >
              C'est compris !
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
