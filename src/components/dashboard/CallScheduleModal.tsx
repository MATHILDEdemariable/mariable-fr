import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, Phone, X } from 'lucide-react';

interface CallScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CallScheduleModal: React.FC<CallScheduleModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleClose = () => {
    setShowCalendar(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto mt-4">
        {!showCalendar ? (
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
                D'une valeur de <strong className="text-wedding-olive">10€</strong>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-start gap-3 mb-4">
                  <Phone className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Participez à un court échange
                    </h4>
                    <p className="text-gray-700">
                      Nous aimerions échanger avec vous pendant <strong>10 minutes</strong> par 
                      téléphone pour comprendre comment améliorer l'application et rendre votre 
                      expérience encore plus agréable.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      Échange rapide de 10 minutes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      Cadeau surprise d'une valeur de 10€
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
                En participant, vous acceptez d'être contacté par téléphone à l'heure choisie.
              </p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <DialogTitle className="text-xl font-serif text-wedding-olive">
                  Choisissez votre créneau
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
            
            <div className="py-2">
              {/* Cal.com Iframe */}
              <iframe
                src="https://cal.com/mathilde-mariable/appel?embed=true"
                style={{ width: '100%', height: '550px', border: 0 }}
                frameBorder="0"
                title="Calendrier de réservation"
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
