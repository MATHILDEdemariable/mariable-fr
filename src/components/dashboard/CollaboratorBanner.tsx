import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, PenLine, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useWedding } from '@/contexts/WeddingContext';

/** Modules que les mariés invités peuvent modifier avec leur wedding planner */
export const COLLABORATIVE_DASHBOARD_PATHS = ['/dashboard/budget', '/dashboard/rsvp', '/dashboard/seating-plan', '/dashboard/drinks', '/dashboard/decoration', '/dashboard/trombinoscope', '/dashboard/suivi'];

/**
 * Bandeau affiché aux mariés invités sur le mariage d'un pro :
 * indique si la page est modifiable ou en lecture seule.
 */
const CollaboratorBanner: React.FC = () => {
  const { isWeddingCollaborator, currentWedding } = useWedding();
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');

  const [plannerContact, setPlannerContact] = useState<{ planner_name: string; planner_email: string } | null>(null);
  const weddingId = currentWedding?.id;

  // Coordonnées du wedding planner propriétaire du mariage partagé (RPC sécurisée, collaborateurs uniquement)
  useEffect(() => {
    if (!isWeddingCollaborator || !weddingId) { setPlannerContact(null); return; }
    (supabase as any).rpc('get_wedding_planner_contact', { target_wedding_id: weddingId })
      .then(({ data, error }: any) => {
        if (error) { console.error('❌ CollaboratorBanner: contact WP indisponible', error); return; }
        setPlannerContact(Array.isArray(data) && data[0] ? data[0] : null);
      });
  }, [isWeddingCollaborator, weddingId]);

  if (!isWeddingCollaborator || !currentWedding) return null;
  const mailSubject = encodeURIComponent(`${currentWedding.title} — Mariable`);

  const isEditable = COLLABORATIVE_DASHBOARD_PATHS.some((path) => pathname.startsWith(path));

  return (
    <div role="status" className="mb-4 flex flex-wrap items-center gap-2 border border-border bg-[#F8F5EF] px-4 py-2 text-sm">
      {isEditable ? <PenLine className="h-4 w-4 text-wedding-olive shrink-0" /> : <Eye className="h-4 w-4 text-muted-foreground shrink-0" />}
      <span>
        <strong className="font-serif">{currentWedding.title}</strong>{' — '}
        {isEditable
          ? isEnglish ? 'Shared with your wedding planner: your changes are saved for both of you.' : 'Partagé avec votre wedding planner : vos modifications sont enregistrées pour vous deux.'
          : isEnglish ? 'View only — managed by your wedding planner.' : 'En lecture seule — géré par votre wedding planner.'}
      </span>
      {plannerContact?.planner_email && (
        <a
          href={`mailto:${plannerContact.planner_email}?subject=${mailSubject}`}
          className="ml-auto inline-flex min-h-[36px] shrink-0 items-center gap-1.5 border border-wedding-olive px-3 text-xs font-medium text-wedding-olive hover:bg-wedding-olive hover:text-white"
          aria-label={isEnglish ? `Email ${plannerContact.planner_name}` : `Écrire à ${plannerContact.planner_name}`}
        >
          <Mail className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{plannerContact.planner_name}</span>
          <span className="sm:hidden">{isEnglish ? 'Contact' : 'Contacter'}</span>
        </a>
      )}
    </div>
  );
};

export default CollaboratorBanner;
