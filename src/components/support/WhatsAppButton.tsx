import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  variant?: 'compact' | 'featured';
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  variant = 'compact',
  className 
}) => {
  const whatsappNumber = '33658072755';
  const defaultMessage = encodeURIComponent("Bonjour, j'ai besoin d'aide avec mon organisation de mariage");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'compact') {
    return (
      <Button
        onClick={handleClick}
        className={cn(
          "w-full justify-start gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white",
          className
        )}
      >
        <MessageCircle className="h-4 w-4" />
        <span className="flex-1 text-left">Support Client</span>
      </Button>
    );
  }

  return (
    <Card className={cn("border-[#25D366]/20 hover:border-[#25D366]/40 transition-all", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="bg-[#25D366]/10 p-3 rounded-full shrink-0">
            <MessageCircle className="h-6 w-6 text-[#25D366]" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-lg text-wedding-olive mb-1 font-serif">
              Besoin d'aide ?
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Contactez-nous directement sur WhatsApp pour toute question
            </p>
            <p className="text-xs text-muted-foreground mb-3 italic">
              💬 Message texte ou vocal uniquement (pas d'appel)
            </p>
            <Button
              onClick={handleClick}
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contacter le support
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
