import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { Link } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  requiresAuth?: boolean;
  requiresPremium?: boolean;
}

const UpgradeModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  requiresAuth, 
  requiresPremium 
}) => {
  if (requiresAuth) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">
              ✨ Continuez gratuitement
            </DialogTitle>
            <DialogDescription className="text-base">
              Créez un compte gratuit pour continuer à discuter avec l'assistant IA
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 my-4">
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm">3 prompts IA gratuits par jour</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Historique de vos conversations sauvegardé</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Accès aux outils de planification (budget, checklist, etc.)</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Sélection de prestataires premium</span>
            </div>
          </div>

          <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/90" size="lg">
            <Link to="/register">
              Créer mon compte gratuit
            </Link>
          </Button>

          <p className="text-xs text-center text-gray-500">
            Pas de carte bancaire requise
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  if (requiresPremium) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-wedding-olive" />
              Mariable Premium
            </DialogTitle>
            <DialogDescription className="text-base">
              Vous avez atteint votre limite de 3 prompts gratuits aujourd'hui
            </DialogDescription>
          </DialogHeader>

          <div className="bg-wedding-olive/5 rounded-lg p-4 my-4">
            <h4 className="font-semibold mb-3 text-wedding-olive">Avec Premium :</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-wedding-olive flex-shrink-0 mt-0.5" />
                <span className="text-sm">Prompts IA illimités</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-wedding-olive flex-shrink-0 mt-0.5" />
                <span className="text-sm">Export PDF de vos plans générés</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-wedding-olive flex-shrink-0 mt-0.5" />
                <span className="text-sm">Suggestions prestataires avancées avec matching automatique</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-wedding-olive flex-shrink-0 mt-0.5" />
                <span className="text-sm">Support prioritaire</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Plus tard
            </Button>
            <Button asChild className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90">
              <Link to="/premium">
                Découvrir Premium
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
};

export default UpgradeModal;