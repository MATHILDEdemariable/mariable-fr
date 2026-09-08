import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Crown, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ProPremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modale « Passer Pro Premium » affichée dans le dashboard des comptes pro.
 * Reprend l'essentiel de la section Mariable Pro de /partenariat sans quitter le dashboard.
 */
const ProPremiumModal: React.FC<ProPremiumModalProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation('partenariat');
  const includedItems = t('pro.included', { returnObjects: true }) as string[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-[#F8F5EF] rounded-none border-editorial-olive">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-editorial-noir flex items-center gap-2">
            <Crown className="h-5 w-5 text-wedding-olive" />
            Mariable Pro
          </DialogTitle>
          <DialogDescription className="text-editorial-noir/70">
            Ce que comprennent vos frais d'adhésion
          </DialogDescription>
        </DialogHeader>

        <div className="border border-editorial-noir/10 bg-white p-4 text-center">
          <p className="font-serif text-3xl text-wedding-olive">{t('pro.price')}</p>
          <p className="text-sm text-editorial-noir/60">{t('pro.priceNote')}</p>
        </div>

        <ul className="space-y-2 text-sm text-editorial-noir">
          {Array.isArray(includedItems) &&
            includedItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-wedding-olive flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
        </ul>

        <DialogFooter className="flex-col sm:flex-col gap-2 sm:space-x-0">
          <Button asChild className="w-full rounded-none bg-wedding-olive hover:bg-wedding-olive/90 text-white">
            <a href="/partenariat#mariable-pro" target="_blank" rel="noopener noreferrer">
              {t('pro.cta')}
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
          <a
            href="/partenariat#conditions-admission"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-sm underline text-editorial-noir/70 hover:text-editorial-noir"
          >
            {t('pro.ctaConditions')}
          </a>
          <Button type="button" variant="ghost" className="w-full rounded-none" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProPremiumModal;
