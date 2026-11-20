import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BadgeCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const DISMISS_KEY = 'mariable_fiche_guide_prompt_dismissed';

/** Fenêtre invitant le pro à compléter sa fiche Guide (une fois par session tant qu'elle est incomplète). */
const FicheGuidePrompt: React.FC = () => {
  const { i18n } = useTranslation('pro');
  const isEnglish = !!i18n.language?.startsWith('en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) === '1') return;
    const checkGuideProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data, error } = await (supabase as any).from('prestataires_rows')
          .select('id, photo_portrait_url, description').eq('owner_user_id', user.id).maybeSingle();
        if (error) throw error;
        if (!data || !data.photo_portrait_url || !data.description) setIsOpen(true);
      } catch (error) {
        console.error('❌ FicheGuidePrompt: vérification impossible', error);
      }
    };
    checkGuideProfile();
  }, []);

  const handleClose = () => { sessionStorage.setItem(DISMISS_KEY, '1'); setIsOpen(false); };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="rounded-none max-w-md">
        <DialogHeader>
          <BadgeCheck className="h-8 w-8 text-wedding-olive mb-2" />
          <DialogTitle className="font-serif text-xl">
            {isEnglish ? 'Appear in the Mariable Guide' : 'Apparaissez dans le Guide Mariable'}
          </DialogTitle>
          <DialogDescription>
            {isEnglish
              ? 'Complete your Guide profile (photo, description, contact details) to be listed for free among the wedding planners shown to couples. It goes online immediately.'
              : 'Complétez votre fiche Guide (photo, présentation, coordonnées) pour être référencé gratuitement parmi les wedding planners présentés aux couples. Elle est en ligne dès l’enregistrement.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button asChild className="rounded-none min-h-[44px]" onClick={handleClose}>
            <Link to="/pro/fiche-guide">{isEnglish ? 'Complete my Guide profile →' : 'Compléter ma fiche Guide →'}</Link>
          </Button>
          <Button variant="outline" className="rounded-none min-h-[44px]" onClick={handleClose}>
            {isEnglish ? 'Later' : 'Plus tard'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FicheGuidePrompt;
