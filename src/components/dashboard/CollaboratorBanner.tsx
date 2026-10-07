import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, PenLine } from 'lucide-react';
import { useWedding } from '@/contexts/WeddingContext';

/** Modules que les mariés invités peuvent modifier avec leur wedding planner */
export const COLLABORATIVE_DASHBOARD_PATHS = ['/dashboard/budget', '/dashboard/rsvp', '/dashboard/seating-plan', '/dashboard/drinks'];

/**
 * Bandeau affiché aux mariés invités sur le mariage d'un pro :
 * indique si la page est modifiable ou en lecture seule.
 */
const CollaboratorBanner: React.FC = () => {
  const { isWeddingCollaborator, currentWedding } = useWedding();
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');

  if (!isWeddingCollaborator || !currentWedding) return null;

  const isEditable = COLLABORATIVE_DASHBOARD_PATHS.some((path) => pathname.startsWith(path));

  return (
    <div role="status" className="mb-4 flex items-center gap-2 border border-border bg-[#F8F5EF] px-4 py-2 text-sm">
      {isEditable ? <PenLine className="h-4 w-4 text-wedding-olive shrink-0" /> : <Eye className="h-4 w-4 text-muted-foreground shrink-0" />}
      <span>
        <strong className="font-serif">{currentWedding.title}</strong>{' — '}
        {isEditable
          ? isEnglish ? 'Shared with your wedding planner: your changes are saved for both of you.' : 'Partagé avec votre wedding planner : vos modifications sont enregistrées pour vous deux.'
          : isEnglish ? 'View only — managed by your wedding planner.' : 'En lecture seule — géré par votre wedding planner.'}
      </span>
    </div>
  );
};

export default CollaboratorBanner;
