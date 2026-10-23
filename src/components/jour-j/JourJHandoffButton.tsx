import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useJourJHandoff, type JourJModule } from '@/hooks/useJourJHandoff';

interface JourJHandoffButtonProps {
  module: JourJModule;
  /** Action personnalisée (ex. trombinoscope → équipe). Par défaut : simple validation. */
  onValidate?: () => Promise<void>;
  className?: string;
}

/** Bouton « Valider pour le Jour J » : la fiche apparaît aussitôt dans l'espace Jour J, sans export. */
const JourJHandoffButton: React.FC<JourJHandoffButtonProps> = ({ module, onValidate, className }) => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const tr = (fr: string, en: string) => (isEnglish ? en : fr);
  const { validatedAt, isSaving, validateHandoff, setValidatedAt } = useJourJHandoff(module);
  const [isRunning, setIsRunning] = React.useState(false);

  const handleValidate = async () => {
    setIsRunning(true);
    try {
      if (onValidate) {
        await onValidate();
        setValidatedAt(new Date().toISOString());
      } else {
        await validateHandoff();
      }
      toast.success(tr('Transmis au Jour J', 'Sent to the wedding day'), {
        description: tr('Retrouvez-le dans Mon Jour J.', 'Find it in My Wedding Day.'),
      });
    } catch (error) {
      console.error('❌ JourJHandoffButton failed:', error);
      toast.error(tr('Validation impossible, merci de réessayer.', 'Could not validate, please try again.'));
    } finally {
      setIsRunning(false);
    }
  };

  const busy = isSaving || isRunning;
  const dateLabel = validatedAt
    ? new Date(validatedAt).toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className={`flex flex-col items-start gap-1 ${className ?? ''}`}>
      <Button onClick={handleValidate} disabled={busy} className="min-h-[44px] rounded-none bg-wedding-olive hover:bg-wedding-olive/90 text-white">
        {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : validatedAt ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Send className="h-4 w-4 mr-2" />}
        {validatedAt ? tr('Mettre à jour le Jour J', 'Update the wedding day') : tr('Valider pour le Jour J', 'Approve for the wedding day')}
      </Button>
      {dateLabel && (
        <span className="text-xs text-muted-foreground">{tr('Dernière validation :', 'Last approved:')} {dateLabel}</span>
      )}
    </div>
  );
};

export default JourJHandoffButton;
