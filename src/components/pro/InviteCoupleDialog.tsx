import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, Trash2, Loader2, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';

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
  const { isProPremium, loading: profileLoading } = useUserProfile();
  const isCollaborationLocked = !profileLoading && !isProPremium;

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
    if (isCollaborationLocked) return;
    const email = coupleEmail.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email)) {
      toast({ title: isEnglish ? 'Invalid email' : 'Email invalide', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('not signed in');
      const { data: invitation, error } = await db.from('wedding_collaborators').insert({
        wedding_id: weddingId,
        invited_by: user.id,
        invited_email: email,
        role: 'couple',
      }).select('id').single();
      if (error) throw error;
      // Email : mariés en destinataire, wedding planner en copie, Mariable en copie cachée
      const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-couple-collaboration-invite', {
        body: { invitationId: invitation.id },
      });
      if (emailError || emailResult?.error) console.error('❌ invitation email failed:', emailError || emailResult?.error);
      const emailSent = !emailError && !emailResult?.error;
      setCoupleEmail('');
      await loadCollaborators();
      toast({
        title: isEnglish ? 'Couple invited' : 'Mariés invités',
        description: emailSent
          ? (isEnglish ? 'An email was sent to them (you are in copy).' : 'Un email leur a été envoyé (vous êtes en copie).')
          : (isEnglish ? 'Email could not be sent: send them the link below.' : 'L’email n’a pas pu partir : envoyez-leur le lien ci-dessous.'),
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
      <Button size="sm" className="h-8 rounded-none bg-editorial-olive text-primary-foreground hover:bg-editorial-olive/90" onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4 mr-1" />
        {isEnglish ? 'Invite the couple' : 'Inviter les mariés'}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif">{isEnglish ? 'Invite the couple' : 'Inviter les mariés'}</DialogTitle>
            <DialogDescription>
              {isEnglish
                ? 'Inviting the couple lets them co-edit this wedding with you: every module except the Wedding day cockpit and Planning & tasks, which stay yours.'
                : 'Inviter les mariés leur permet de co-éditer ce mariage avec vous : tous les modules sauf le Cockpit Jour J et Planning & tâches, qui restent les vôtres.'}
            </DialogDescription>
          </DialogHeader>

          {isCollaborationLocked && (
            <div role="alert" className="border-l-4 border-destructive bg-destructive/10 p-3 text-sm space-y-2">
              <p className="font-semibold">{isEnglish ? '🔒 Active Pro subscription required' : '🔒 Abonnement Pro actif requis'}</p>
              <p>
                {isEnglish
                  ? 'Sharing and co-editing with your couples require an active Mariable Pro subscription. Subscribe to a Pro plan to unlock couple collaboration.'
                  : 'Le partage et la co-édition avec vos couples nécessitent un abonnement Mariable Pro actif. Souscrivez à une formule Pro pour débloquer la collaboration couple.'}
              </p>
              <Button asChild size="sm" className="rounded-none"><a href="/pro-solutions#tarifs">{isEnglish ? 'Subscribe to Pro' : 'Souscrire à Mariable Pro'}</a></Button>
            </div>
          )}

          <div role="note" className="border-l-4 border-wedding-olive bg-[#F8F5EF] p-3 text-sm space-y-2">
            <p className="font-semibold">{isEnglish ? 'You don’t want co-editing?' : 'Vous ne souhaitez pas de co-édition ?'}</p>
            <p>
              {isEnglish
                ? 'Either ask the couple not to change the shared items, or skip the invitation and use sharing without an account: the PDF exports and web links display the information nicely, app-style.'
                : 'Demandez-leur de ne pas modifier les éléments, ou n’invitez pas le couple et utilisez le partage sans création de compte : les boutons export PDF et lien web présentent joliment les infos, au format app.'}
            </p>
          </div>

          <div role="note" className="border-l-4 border-amber-600 bg-amber-50 p-3 text-sm space-y-2">
            <p className="font-semibold">
              {isEnglish ? '⚠️ Does your couple already use Mariable?' : '⚠️ Votre couple utilise déjà Mariable ?'}
            </p>
            <p>
              {isEnglish
                ? 'If they already entered data on their own account, it is up to them to invite you from their dashboard so you get all their data. No account yet? They will create one from the email.'
                : 'S’ils ont déjà saisi des données sur leur compte, c’est à eux de vous inviter depuis leur tableau de bord pour que vous récupériez tout. Pas encore de compte ? Ils le créeront depuis l’email.'}
            </p>
          </div>

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
            <Button onClick={handleInvite} disabled={saving || isCollaborationLocked} className="rounded-none bg-wedding-olive hover:bg-wedding-olive/90 text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEnglish ? 'Invite' : 'Inviter'}
            </Button>
          </div>

          <ul className="space-y-2">
            {collaborators.map((collaborator) => (
              <li key={collaborator.id} className="flex items-center justify-between border border-border px-3 py-2 text-sm">
                <span className="truncate">{collaborator.invited_email}</span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {collaborator.status === 'accepted' ? (isEnglish ? 'Joined' : 'A rejoint') : collaborator.status === 'declined' ? (isEnglish ? 'Declined' : 'Refusée') : isEnglish ? 'Pending' : 'En attente'}
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
