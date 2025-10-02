import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  remaining: number;
  maxPrompts: number;
  isAuthenticated: boolean;
}

const UsageLimitBanner: React.FC<Props> = ({ remaining, maxPrompts, isAuthenticated }) => {
  if (maxPrompts === 999) return null;

  const isLow = remaining <= 1;

  return (
    <Alert variant={isLow ? "destructive" : "default"} className="rounded-none border-x-0 border-t-0">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-sm">
        {isAuthenticated ? (
          <>
            {remaining} prompt{remaining > 1 ? 's' : ''} gratuit{remaining > 1 ? 's' : ''} restant{remaining > 1 ? 's' : ''} aujourd'hui.{' '}
            {isLow && (
              <a href="/premium" className="underline font-medium">
                Passez à Premium pour un accès illimité
              </a>
            )}
          </>
        ) : (
          <>
            {remaining} prompt d'essai restant.{' '}
            <a href="/register" className="underline font-medium">
              Créez un compte gratuit pour 3 prompts/jour
            </a>
          </>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default UsageLimitBanner;