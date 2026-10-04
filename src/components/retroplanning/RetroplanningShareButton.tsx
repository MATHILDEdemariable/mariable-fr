import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Share2, Copy, Check, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RetroplanningShareButtonProps {
  retroplanningId: string | null;
}

const RetroplanningShareButton = ({ retroplanningId }: RetroplanningShareButtonProps) => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const db = supabase as any;

  const openShareDialog = async () => {
    if (!retroplanningId) {
      toast({
        title: isEnglish ? 'Save first' : 'Enregistrez d\'abord',
        description: isEnglish ? 'Create or save your timeline before sharing it.' : 'Créez ou enregistrez votre rétroplanning avant de le partager.',
      });
      return;
    }
    setOpen(true);
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data: existingToken, error: fetchError } = await db
        .from('retroplanning_share_tokens')
        .select('token')
        .eq('retroplanning_id', retroplanningId)
        .eq('is_active', true)
        .maybeSingle();
      if (fetchError) throw fetchError;
      let token = existingToken?.token as string | undefined;
      if (!token) {
        token = uuidv4();
        const { error: insertError } = await db
          .from('retroplanning_share_tokens')
          .insert({ retroplanning_id: retroplanningId, token, created_by: user.id });
        if (insertError) throw insertError;
      }
      setShareLink(`${window.location.origin}/retroplanning-public/${token}`);
    } catch (error) {
      console.error('❌ openShareDialog failed:', error);
      toast({ title: isEnglish ? 'Error' : 'Erreur', description: isEnglish ? 'Unable to create the link' : 'Impossible de créer le lien', variant: 'destructive' });
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const disableLink = async () => {
    try {
      const { error } = await db
        .from('retroplanning_share_tokens')
        .update({ is_active: false })
        .eq('retroplanning_id', retroplanningId);
      if (error) throw error;
      setShareLink('');
      setOpen(false);
      toast({ title: isEnglish ? 'Link disabled' : 'Lien désactivé' });
    } catch (error) {
      console.error('❌ disableLink failed:', error);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <Button variant="outline" onClick={openShareDialog}>
        <Share2 className="h-4 w-4 mr-2" />
        {isEnglish ? 'Share' : 'Partager'}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEnglish ? 'Share your timeline' : 'Partager le rétroplanning'}</DialogTitle>
            <DialogDescription>
              {isEnglish
                ? 'Anyone with this link can view it (read-only), no account needed.'
                : 'Toute personne ayant ce lien peut le consulter (lecture seule), sans compte.'}
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input value={shareLink} readOnly aria-label={isEnglish ? 'Share link' : 'Lien de partage'} />
                <Button onClick={copyLink} aria-label={isEnglish ? 'Copy' : 'Copier'}>
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={disableLink}>
                {isEnglish ? 'Disable this link' : 'Désactiver ce lien'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RetroplanningShareButton;
