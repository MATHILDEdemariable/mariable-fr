import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, FileText, X, CheckCircle, ArrowRight, Sparkles, Check } from 'lucide-react';
import PaymentModal from '@/components/pricing/PaymentModal';

interface CallScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CallScheduleModal: React.FC<CallScheduleModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleClose = () => {
    setShowCalendar(false);
    setShowPromoCode(false);
    onClose();
  };

  const handleFormComplete = () => {
    setShowPromoCode(true);
  };

  const handleOpenPayment = () => {
    handleClose();
    setShowPaymentModal(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto mt-4">
          {showPromoCode ? (
          <>
            <DialogHeader className="pb-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleClose}
                className="absolute right-4 top-4"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            
            <div className="text-center space-y-6 p-4 sm:p-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 sm:p-8 border-2 border-green-300">
                <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Félicitations ! 🎉
                </h3>
                <p className="text-gray-700 mb-6">
                  Voici votre code promo à utiliser au moment du paiement
                </p>
                
                {/* Code Promo */}
                <div className="bg-white border-4 border-dashed border-green-500 rounded-lg p-4 sm:p-6 mb-6">
                  <code className="text-2xl sm:text-4xl font-bold text-green-600 tracking-wider">
                    JOURJ
                  </code>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    1 mois d'essai gratuit
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Sans engagement
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Annulable à tout moment
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleOpenPayment}
                className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white py-4 sm:py-6 text-base sm:text-lg"
              >
                Débloquer le Premium
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </>
        ) : !showCalendar ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 rounded-full">
                  <Gift className="h-8 w-8 text-white" />
                </div>
              </div>
              <DialogTitle className="text-2xl font-serif text-center text-wedding-olive">
                Recevez un cadeau surprise 🎁
              </DialogTitle>
              <DialogDescription className="text-center text-base mt-4">
                <strong className="text-wedding-olive">1 mois gratuit de Premium</strong>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Remplissez un formulaire de 1 minute
                    </h4>
                    <p className="text-gray-700">
                      Nous aimerions que vous remplissiez ce <strong>court formulaire</strong> pour 
                      comprendre comment améliorer l'application et rendre votre 
                      expérience encore plus agréable.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      Formulaire rapide à remplir
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      Code promo : 1 mois gratuit de Premium
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      Aidez-nous à améliorer Mariable
                    </li>
                  </ul>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowCalendar(true)}
                className="w-full bg-gradient-to-r from-wedding-olive to-wedding-olive/80 hover:from-wedding-olive/90 hover:to-wedding-olive/70 text-white py-6 text-lg font-medium"
              >
                <Gift className="h-5 w-5 mr-2" />
                Je participe !
              </Button>
              
              <p className="text-xs text-center text-gray-500">
                Votre code promo s'affichera immédiatement après avoir rempli le formulaire !
              </p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <DialogTitle className="text-lg sm:text-xl font-serif text-wedding-olive">
                  Complétez ce formulaire de 1 minute et recevez votre code promo instantanément :-)
                </DialogTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowCalendar(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            
            <div className="py-2 space-y-4">
              {/* Notion Form Iframe */}
              <iframe
                src="https://wary-grease-34e.notion.site/ebd/277894d36ac480fa995ee3b084fdf74d"
                style={{ width: '100%', height: '600px', border: 0 }}
                frameBorder="0"
                allowFullScreen
                title="Formulaire de participation"
              />
              
              {/* Bouton pour confirmer la soumission */}
              <Button 
                onClick={handleFormComplete}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                J'ai terminé le formulaire
              </Button>
            </div>
          </>
          )}
        </DialogContent>
      </Dialog>

      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
      />
    </>
  );
};
