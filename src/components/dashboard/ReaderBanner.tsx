
import React from 'react';
import { Eye, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { useReaderMode } from '@/contexts/ReaderModeContext';

const ReaderBanner: React.FC = () => {
  const { shareToken } = useReaderMode();

  return (
    <div className="bg-wedding-olive/10 border border-wedding-olive/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-wedding-olive" />
          <h2 className="text-lg font-medium">Mode Lecture Seule</h2>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => window.location.href = 'https://mariable.fr'}
        >
          Visiter Mariable <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <p className="mt-2 text-sm text-muted-foreground">
        Vous consultez un tableau de bord partagé en mode lecture. Vous ne pouvez pas modifier les informations. 
        {shareToken && (
          <span className="block mt-1 text-xs">
            Identifiant de partage: {shareToken.substring(0, 8)}...
          </span>
        )}
      </p>
    </div>
  );
};

export default ReaderBanner;
