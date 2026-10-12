import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, UserPlus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useWedding } from '@/contexts/WeddingContext';

interface PendingInvitation {
  invitation_id: string;
  wedding_title: string;
  inviter_name: string;
  role: string;
}

interface PlannerInvitation {
  id: string;
  invited_email: string;
  status: string;
}

const db = supabase as any;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Les mariés invitent leur wedding planner sur LEUR mariage : le pro récupère toutes les données saisies. */
const InvitePlannerButton: React.FC<{ weddingId: string; isEnglish: boolean }> = ({ weddingId, isEnglish }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [plannerEmail, setPlannerEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [plannerInvitations, setPlannerInvitations] = useState<PlannerInvitation[]>([]);

  const loadPlannerInvitations = useCallback(async () => {
    const { data, error } = await db
      .from('wedding_collaborators')
      .select('id, invited_email, status')
      .eq('wedding_id', weddingId)
      .eq('role', 'planner')
      .order('created_at');
    if (error) console.error('❌ loadPlannerInvitations failed:', error);
    setPlannerInvitations(data ?? []);
  }, [weddingId]);

  useEffect(() => { if (open) loadPlannerInvitations(); }, [open, loadPlannerInvitations]);

  const handleInvitePlanner = async () => {
    const email = plannerEmail.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email)) {
      toast({ title: isEnglish ? 'Invalid email' : 'Email invalide', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('not signed in');
      const { data: invitation, error } = await db.from('wedding_collaborators').insert({
        wedding_id: weddingId, invited_by: user.id, invited_email: email, role: 'planner',
      }).select('id').single();
      if (error) throw error;
      const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-couple-collaboration-invite', {
        body: { invitationId: invitation.id },
      });
      if (emailError || emailResult?.error) console.error('❌ planner invitation email failed:', emailError || emailResult?.error);
      setPlannerEmail('');
      await loadPlannerInvitations();
      toast({
        title: isEnglish ? 'Wedding planner invited' : 'Wedding planner invité',
        description: !emailError && !emailResult?.error
          ? (isEnglish ? 'An email was sent (you are in copy).' : 'Un email lui a été envoyé (vous êtes en copie).')
          : (isEnglish ? 'Email could not be sent: ask them to log in to Mariable.' : 'L’email n’a pas pu partir : demandez-lui de se connecter à Mariable.'),
      });
    } catch (error: any) {
      console.error('❌ handleInvitePlanner failed:', error);
      toast({
        title: isEnglish ? 'Invitation failed' : 'Invitation impossible',
        description: error?.code === '23505' ? (isEnglish ? 'Already invited.' : 'Cet email est déjà invité.') : undefined,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePlanner = async (invitationId: string) => {
    const { error } = await db.from('wedding_collaborators').delete().eq('id', invitationId);
    if (error) {
      console.error('❌ handleRemovePlanner failed:', error);
      toast({ title: isEnglish ? 'Error' : 'Erreur', variant: 'destructive' });
      return;
    }
    loadPlannerInvitations();
  };

  return (
    <>
      <Button variant="outline" size="sm" className="rounded-none min-h-[44px]" onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4 mr-1" />
        {isEnglish ? 'Invite my wedding planner' : 'Inviter mon wedding planner'}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif">{isEnglish ? 'Invite my wedding planner' : 'Inviter mon wedding planner'}</DialogTitle>
            <DialogDescription>
              {isEnglish
                ? 'Your planner gets access to your wedding with everything you have already entered (budget, wedding-day schedule, guests…). Nothing is deleted, you both work on the same wedding.'
                : 'Votre wedding planner accède à votre mariage avec tout ce que vous avez déjà saisi (budget, planning Jour J, invités…). Rien n’est effacé, vous travaillez à deux sur le même mariage.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              type="email"
              value={plannerEmail}
              onChange={(e) => setPlannerEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInvitePlanner()}
              placeholder="email@agence.fr"
              aria-label={isEnglish ? 'Wedding planner email' : 'Email du wedding planner'}
              className="rounded-none"
            />
            <Button onClick={handleInvitePlanner} disabled={saving} className="rounded-none bg-wedding-olive hover:bg-wedding-olive/90 text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEnglish ? 'Invite' : 'Inviter'}
            </Button>
          </div>
          <ul className="space-y-2">
            {plannerInvitations.map((invitation) => (
              <li key={invitation.id} className="flex items-center justify-between border border-border px-3 py-2 text-sm">
                <span className="truncate">{invitation.invited_email}</span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {invitation.status === 'accepted' ? (isEnglish ? 'Joined' : 'A rejoint') : invitation.status === 'declined' ? (isEnglish ? 'Declined' : 'Refusée') : isEnglish ? 'Pending' : 'En attente'}
                  </span>
                  <button onClick={() => handleRemovePlanner(invitation.id)} aria-label={isEnglish ? 'Remove' : 'Retirer'} className="p-1 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
};

/** Invitations en attente (accepter / décliner) + outils de collaboration côté mariés. */
const CollaborationInviteBanner: React.FC = () => {
  const { user } = useAuth();
  const { accountType, weddings, currentWeddingId, isWeddingCollaborator, refreshWeddings, selectWedding } = useWedding();
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const loadInvitations = useCallback(async () => {
    if (!user) return;
    const { data, error } = await db.rpc('get_my_pending_wedding_invitations');
    if (error) console.error('❌ loadInvitations failed:', error);
    setInvitations(data ?? []);
  }, [user]);

  useEffect(() => { loadInvitations(); }, [loadInvitations]);

  const handleRespond = async (invitationId: string, acceptInvitation: boolean) => {
    setRespondingId(invitationId);
    try {
      const { error } = await db.rpc('respond_wedding_invitation', {
        target_invitation_id: invitationId,
        accept_invitation: acceptInvitation,
      });
      if (error) throw error;
      if (acceptInvitation) {
        const { data } = await db.from('wedding_collaborators').select('wedding_id').eq('id', invitationId).maybeSingle();
        await refreshWeddings();
        if (data?.wedding_id) selectWedding(data.wedding_id);
        toast({ title: isEnglish ? 'Collaboration accepted' : 'Collaboration acceptée' });
      } else {
        toast({ title: isEnglish ? 'Invitation declined' : 'Invitation déclinée' });
      }
      await loadInvitations();
    } catch (error) {
      console.error('❌ handleRespond failed:', error);
      toast({ title: isEnglish ? 'Error' : 'Erreur', variant: 'destructive' });
    } finally {
      setRespondingId(null);
    }
  };

  const isCoupleAccount = accountType === 'b2c';
  const ownWedding = weddings.find((w) => w.owner_id === user?.id);
  const showWeddingSwitcher = isCoupleAccount && weddings.length > 1;
  const showInvitePlanner = isCoupleAccount && !!ownWedding && !isWeddingCollaborator;

  if (invitations.length === 0 && !showWeddingSwitcher && !showInvitePlanner) return null;

  return (
    <div className="mb-4 space-y-2">
      {invitations.map((invitation) => {
        const isCoupleInvitation = invitation.role !== 'planner';
        return (
          <div key={invitation.invitation_id} role="alert" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-wedding-olive bg-[#F8F5EF] p-4">
            <p className="text-sm sm:text-base">
              💍 <strong className="font-serif">{invitation.inviter_name}</strong>{' '}
              {isCoupleInvitation
                ? (isEnglish ? 'invites you to collaborate on organising your wedding' : 'vous invite à collaborer sur l’organisation de votre mariage')
                : (isEnglish ? 'invite you to coordinate their wedding' : 'vous invitent à coordonner leur mariage')}{' '}
              (<em>{invitation.wedding_title}</em>).
              {isCoupleInvitation && (
                <span className="block text-xs text-amber-800 mt-1">
                  {isEnglish
                    ? 'Warning: if you accept, your dashboard switches to your planner’s wedding, without the data you entered. To share your data with them, decline and invite your planner yourself.'
                    : 'Attention : si vous acceptez, votre espace bascule sur le mariage de votre wedding planner, sans les données que vous avez saisies. Pour lui partager vos données, déclinez et invitez plutôt votre wedding planner vous-même.'}
                </span>
              )}
            </p>
            <div className="flex gap-2 shrink-0">
              <Button
                className="rounded-none min-h-[44px]"
                disabled={respondingId === invitation.invitation_id}
                onClick={() => handleRespond(invitation.invitation_id, true)}
              >
                {respondingId === invitation.invitation_id ? <Loader2 className="h-4 w-4 animate-spin" /> : isEnglish ? 'Accept' : 'Accepter'}
              </Button>
              <Button
                variant="outline"
                className="rounded-none min-h-[44px]"
                disabled={respondingId === invitation.invitation_id}
                onClick={() => handleRespond(invitation.invitation_id, false)}
              >
                {isEnglish ? 'Decline' : 'Décliner'}
              </Button>
            </div>
          </div>
        );
      })}

      {(showWeddingSwitcher || showInvitePlanner) && (
        <div className="flex flex-wrap items-center gap-2">
          {showWeddingSwitcher && weddings.map((wedding) => {
            const isOwn = wedding.owner_id === user?.id;
            const isActive = wedding.id === currentWeddingId;
            return (
              <Button
                key={wedding.id}
                size="sm"
                variant={isActive ? 'default' : 'outline'}
                className="rounded-none min-h-[44px]"
                onClick={() => selectWedding(wedding.id)}
                aria-pressed={isActive}
              >
                {isOwn ? (isEnglish ? 'My own wedding' : 'Mon mariage') : (isEnglish ? 'Shared with my planner' : 'Partagé avec mon wedding planner')}
              </Button>
            );
          })}
          {showInvitePlanner && ownWedding && <InvitePlannerButton weddingId={ownWedding.id} isEnglish={!!isEnglish} />}
        </div>
      )}
    </div>
  );
};

export default CollaborationInviteBanner;
