import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarHeart, Library, Eye, Users, AlertTriangle } from 'lucide-react';

export const PRO_TUTORIAL_SEEN_KEY = 'mariable_pro_tutorial_seen';
export const PRO_TUTORIAL_EVENT = 'mariable:open-pro-tutorial';
export const PRO_HELP_EVENT = 'mariable:open-pro-help';

interface ProTutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GuideCard: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => (
  <div className="flex gap-3 bg-background border border-border p-4">
    <span className="text-wedding-olive shrink-0 mt-0.5">{icon}</span>
    <div>
      <p className="font-serif text-lg text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  </div>
);

/** Guide complet de l'espace pro : niveaux de travail, partage vs collaboration, routine conseillée. */
const ProTutorialModal: React.FC<ProTutorialModalProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation('pro');

  const handleClose = (value: boolean) => {
    if (!value) localStorage.setItem(PRO_TUTORIAL_SEEN_KEY, 'true');
    onOpenChange(value);
  };

  const routineSteps = ['routine1', 'routine2', 'routine3', 'routine4', 'routine5'];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-none bg-editorial-beige">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-wedding-olive">{t('tutorial.title')}</DialogTitle>
          <DialogDescription>{t('tutorial.intro')}</DialogDescription>
        </DialogHeader>

        <section className="space-y-3">
          <h3 className="font-serif text-xl">{t('tutorial.levelsTitle')}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <GuideCard icon={<CalendarHeart className="h-5 w-5" />} title={t('tutorial.level1Title')} text={t('tutorial.level1')} />
            <GuideCard icon={<Library className="h-5 w-5" />} title={t('tutorial.level2Title')} text={t('tutorial.level2')} />
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-serif text-xl">{t('tutorial.modesTitle')}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <GuideCard icon={<Eye className="h-5 w-5" />} title={t('tutorial.shareTitle')} text={t('tutorial.share')} />
            <GuideCard icon={<Users className="h-5 w-5" />} title={t('tutorial.collabTitle')} text={t('tutorial.collab')} />
          </div>
          <div className="flex gap-3 border border-wedding-olive bg-wedding-olive/10 p-4" role="note">
            <AlertTriangle className="h-5 w-5 text-wedding-olive shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">{t('tutorial.warningTitle')}</p>
              <p className="text-sm text-muted-foreground">{t('tutorial.warning')}</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-serif text-xl">{t('tutorial.routineTitle')}</h3>
          <ol className="space-y-2">
            {routineSteps.map((stepKey, index) => (
              <li key={stepKey} className="flex gap-3 bg-background border border-border p-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-wedding-olive text-white text-xs font-semibold">{index + 1}</span>
                <span className="text-foreground">{t(`tutorial.${stepKey}`)}</span>
              </li>
            ))}
          </ol>
        </section>

        <p className="text-xs text-muted-foreground">{t('tutorial.reopen')}</p>
        <Button className="rounded-none min-h-[44px]" onClick={() => handleClose(false)}>{t('tutorial.start')}</Button>
      </DialogContent>
    </Dialog>
  );
};

export default ProTutorialModal;
