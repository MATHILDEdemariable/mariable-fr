import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarHeart, BookUser, Share2 } from 'lucide-react';

export const PRO_TUTORIAL_SEEN_KEY = 'mariable_pro_tutorial_seen';
export const PRO_TUTORIAL_EVENT = 'mariable:open-pro-tutorial';
export const PRO_HELP_EVENT = 'mariable:open-pro-help';

interface ProTutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProTutorialModal: React.FC<ProTutorialModalProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation('pro');
  const steps = [
    { icon: <CalendarHeart className="h-5 w-5" />, title: t('tutorial.step1Title'), text: t('tutorial.step1') },
    { icon: <BookUser className="h-5 w-5" />, title: t('tutorial.step2Title'), text: t('tutorial.step2') },
    { icon: <Share2 className="h-5 w-5" />, title: t('tutorial.step3Title'), text: t('tutorial.step3') },
  ];

  const handleClose = (value: boolean) => {
    if (!value) localStorage.setItem(PRO_TUTORIAL_SEEN_KEY, 'true');
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg rounded-none bg-editorial-beige">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-wedding-olive">{t('tutorial.title')}</DialogTitle>
          <DialogDescription>{t('tutorial.intro')}</DialogDescription>
        </DialogHeader>
        <ol className="space-y-4 py-2">
          {steps.map((step) => (
            <li key={step.title} className="flex gap-3 bg-background border border-border p-4">
              <span className="text-wedding-olive shrink-0 mt-0.5">{step.icon}</span>
              <div>
                <p className="font-serif text-lg text-foreground">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-xs text-muted-foreground">{t('tutorial.reopen')}</p>
        <Button className="rounded-none min-h-[44px]" onClick={() => handleClose(false)}>{t('tutorial.start')}</Button>
      </DialogContent>
    </Dialog>
  );
};

export default ProTutorialModal;
