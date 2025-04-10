
import React, { useState, useEffect } from 'react';
import { Message as MessageType } from '@/types';
import { VendorCard } from './VendorCard';
import { Card, CardContent } from '@/components/ui/card';
import { VendorRecommendation } from '@/types';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

interface MessageProps {
  message: MessageType;
  recommendations?: VendorRecommendation[];
}

export const Message: React.FC<MessageProps> = ({ message, recommendations }) => {
  const isUser = message.role === 'user';
  const navigate = useNavigate();
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  
  useEffect(() => {
    // Show the signup prompt after a short delay when recommendations are displayed
    if (!isUser && recommendations && recommendations.length > 0) {
      const timer = setTimeout(() => {
        setShowSignupPrompt(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [recommendations, isUser]);
  
  const renderContent = () => {
    // Split content by new lines and render them properly
    const contentLines = message.content.split('\n');
    return contentLines.map((line, i) => (
      <p key={i} className={i > 0 ? 'mt-2' : ''}>{line || '\u00A0'}</p>
    ));
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-3 animate-fade-in`}>
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        <Card className={`p-2 ${isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}>
          <CardContent className="p-0">
            {renderContent()}
          </CardContent>
        </Card>
        
        {!isUser && recommendations && recommendations.length > 0 && (
          <div className="mt-2 grid gap-2">
            {recommendations.map((rec, index) => (
              <VendorCard key={index} recommendation={rec} />
            ))}
          </div>
        )}
        
        <div className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {/* Signup Dialog */}
      <AlertDialog open={showSignupPrompt} onOpenChange={setShowSignupPrompt}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-wedding-olive font-serif text-xl">
              Découvrez plus de prestataires
            </AlertDialogTitle>
            <AlertDialogDescription>
              Vous aimez ces recommandations ? Inscrivez-vous pour accéder à notre sélection complète de prestataires de mariage et à des recommandations personnalisées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Plus tard</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-wedding-olive hover:bg-wedding-olive/90 gap-2"
              onClick={() => navigate('/commencer')}
            >
              <UserPlus className="h-4 w-4" />
              S'inscrire maintenant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Message;
