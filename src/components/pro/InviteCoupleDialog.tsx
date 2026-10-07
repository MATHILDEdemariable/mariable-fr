import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, Trash2, Loader2, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface WeddingCollaborator {
  id: string;
  invited_email: string;
  status: string;
}

const db = supabase as any;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Invitation des mariés sur le mariage d'un wedding planner.
 * Le couple se connecte avec l'email invité : il rejoint automatiquement le mariage.
 */
const InviteCoupleDialog: React.FC<{ weddingId: string }> = ({ weddingId }) => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [coupleEmail, setCoupleEmail] = useState('');
  const [collaborators, setCollaborators] = useState<WeddingCollaborator[]>([]);
  const [saving, setSaving] = useState(false);

  const loadCollaborators = useCallback(async () => {
    const { data, error } = await db
      .from('wedding_collaborators')
      .select('id, invited_email, status')
      .eq('wedding_id', weddingId)
      .order('created_at');
    if (error) console.error('❌ loadCollaborators failed:', error);
    setCollaborators(data ?? []);
  }, [weddingId]);

  useEffect(() => {
    if (open) loadCollaborators();
  }, [open, loadCollaborators]);

  const handleInvite = async () => {
    const email = coupleEmail.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email)) {
      toast({ title: isEnglish ? 'Invalid email' : 'Email invalide', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('not signed in');
      const { error } = await db.from('wedding_collaborators').insert({
        wedding_id: weddingId,
        invited_by: user.id,
        invited_email: email,
        role: 'couple',
      });
      if (error) throw error;
      setCoupleEmail('');
      await loadCollaborators();
      toast({
        title: isEnglish ? 'Couple invited' : 'Mariés invités',
        description: isEnglish
          ? 'Send them the link: they sign in or sign up with this email.'
          : 'Envoyez-leur le lien : ils se connectent ou s’inscrivent avec cet email.',
      });
    } catch (error: any) {
      console.error('❌ handleInvite failed:', error);
      toast({
        title: isEnglish ? 'Invitation failed' : 'Invitation impossible',
        description: error?.code === '23505' ? (isEnglish ? 'Already invited.' : 'Cet email est déjà invité.') : undefined,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (collaboratorId: string) => {
    const { error } = await db.from('wedding_collaborators').delete().eq('id', collaboratorId);
    if (error) {
      console.error('❌ handleRemove failed:', error);
      toast({ title: isEnglish ? 'Error' : 'Erreur', variant: 'destructive' });
      return;
    }
    loadCollaborators();
  };

  const joinLink = `${window.location.origin}/auth`;

  return (
    <>
      <Button size="sm" variant="outline" className="h-8 rounded-none" onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4 mr-1" />
        {isEnglish ? 'Invite the couple' : 'Inviter les mariés'}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif">{isEnglish ? 'Invite the couple' : 'Inviter les mariés'}</DialogTitle>
            <DialogDescription>
              {isEnglish
                ? 'They can edit the guest list, RSVP, seating plan, budget and drinks. Everything else is view-only.'
                : 'Ils pourront modifier les invités, le RSVP, le plan de table, le budget et les boissons. Le reste est en lecture seule.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2">
            <Input
              type="email"
              value={coupleEmail}
              onChange={(e) => setCoupleEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
              placeholder="email@exemple.fr"
              aria-label={isEnglish ? 'Couple email' : 'Email des mariés'}
              className="rounded-none"
            />
            <Button onClick={handleInvite} disabled={saving} className="rounded-none bg-wedding-olive hover:bg-wedding-olive/90 text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEnglish ? 'Invite' : 'Inviter'}
            </Button>
          </div>

          <ul className="space-y-2">
            {collaborators.map((collaborator) => (
              <li key={collaborator.id} className="flex items-center justify-between border border-border px-3 py-2 text-sm">
                <span className="truncate">{collaborator.invited_email}</span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {collaborator.status === 'accepted' ? (isEnglish ? 'Joined' : 'A rejoint') : isEnglish ? 'Pending' : 'En attente'}
                  </span>
                  <button onClick={() => handleRemove(collaborator.id)} aria-label={isEnglish ? 'Remove' : 'Retirer'} className="p-1 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </span>
              </li>
            ))}
          </ul>

          <div className="bg-[#F8F5EF] p-3 text-xs text-muted-foreground">
            {isEnglish ? 'Link to send them:' : 'Lien à leur envoyer :'}{' '}
            <button
              className="inline-flex items-center gap-1 underline"
              onClick={() => {
                navigator.clipboard?.writeText(joinLink);
                toast({ title: isEnglish ? 'Link copied' : 'Lien copié' });
              }}
            >
              {joinLink} <Copy className="h-3 w-3" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteCoupleDialog;
