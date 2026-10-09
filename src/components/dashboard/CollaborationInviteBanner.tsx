import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useWedding } from '@/contexts/WeddingContext';

interface PendingInvitation {
  invitation_id: string;
  wedding_title: string;
  inviter_name: string;
}

/** Invitations du wedding planner en attente : les mariés acceptent ou déclinent (rien n'est effacé). */
const CollaborationInviteBanner: React.FC = () => {
  const { user } = useAuth();
  const { refreshWeddings, selectWedding } = useWedding();
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const loadInvitations = useCallback(async () => {
    if (!user) return;
    const { data, error } = await (supabase as any).rpc('get_my_pending_wedding_invitations');
    if (error) console.error('❌ loadInvitations failed:', error);
    setInvitations(data ?? []);
  }, [user]);

  useEffect(() => { loadInvitations(); }, [loadInvitations]);

  const handleRespond = async (invitationId: string, acceptInvitation: boolean) => {
    setRespondingId(invitationId);
    try {
      const { error } = await (supabase as any).rpc('respond_wedding_invitation', {
        target_invitation_id: invitationId,
        accept_invitation: acceptInvitation,
      });
      if (error) throw error;
      if (acceptInvitation) {
        // On ouvre le mariage partagé ; le mariage personnel reste accessible dans le sélecteur
        const { data } = await (supabase as any).from('wedding_collaborators').select('wedding_id').eq('id', invitationId).maybeSingle();
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

  if (invitations.length === 0) return null;

  return (
    <div className="mb-4 space-y-2">
      {invitations.map((invitation) => (
        <div key={invitation.invitation_id} role="alert" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-wedding-olive bg-[#F8F5EF] p-4">
          <p className="text-sm sm:text-base">
            💍 <strong className="font-serif">{invitation.inviter_name}</strong>{' '}
            {isEnglish ? 'invites you to collaborate on organising your wedding' : 'vous invite à collaborer sur l’organisation de votre mariage'}{' '}
            (<em>{invitation.wedding_title}</em>).
            <span className="block text-xs text-muted-foreground mt-1">
              {isEnglish ? 'Nothing you have already done will be deleted.' : 'Rien de ce que vous avez déjà fait ne sera supprimé.'}
            </span>
          </p>
          <div className="flex gap-2 shrink-0">
            <Button
              className="rounded-none min-h-[44px]"
              disabled={respondingId === invitation.invitation_id}
              onClick={() => handleRespond(invitation.invitation_id, true)}
            >
              {respondingId === invitation.invitation_id ? <Loader2 className="h-4 w-4 animate-spin" /> : isEnglish ? 'Accept' : 'Accepter la collaboration'}
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
      ))}
    </div>
  );
};

export default CollaborationInviteBanner;
