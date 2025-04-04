
import React from 'react';
import { Message as MessageType } from '@/types';
import { VendorCard } from './VendorCard';
import { Card, CardContent } from '@/components/ui/card';
import { VendorRecommendation } from '@/types';

interface MessageProps {
  message: MessageType;
  recommendations?: VendorRecommendation[];
}

export const Message: React.FC<MessageProps> = ({ message, recommendations }) => {
  const isUser = message.role === 'user';
  
  const renderContent = () => {
    // Split content by new lines and render them properly
    const contentLines = message.content.split('\n');
    return contentLines.map((line, i) => (
      <p key={i} className={i > 0 ? 'mt-2' : ''}>{line || '\u00A0'}</p>
    ));
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <Card className={`p-3 ${isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}>
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
    </div>
  );
};

export default Message;
