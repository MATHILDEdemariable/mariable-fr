
import React from 'react';
import { Message as MessageType } from '@/types';
import { VendorCard } from './VendorCard';
import { Card, CardContent } from '@/components/ui/card';
import { VendorRecommendation } from '@/types';
import { Link } from 'react-router-dom';

interface MessageProps {
  message: MessageType;
  recommendations?: VendorRecommendation[];
}

export const Message: React.FC<MessageProps> = ({ message, recommendations }) => {
  const isUser = message.role === 'user';
  
  const renderContent = () => {
    // Process content with links
    const contentWithLinks = processContentLinks(message.content);
    return contentWithLinks;
  };

  // Helper function to process content and turn markdown-style links into actual links
  const processContentLinks = (content: string) => {
    // Split content by new lines and render them properly
    const contentLines = content.split('\n');
    
    return contentLines.map((line, i) => {
      // Check if line contains markdown link pattern [text](/path)
      if (line.includes('[') && line.includes('](')) {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;
        
        // Replace markdown links with actual Link components
        while ((match = linkRegex.exec(line)) !== null) {
          const linkText = match[1];
          const linkUrl = match[2];
          
          // Add text before the link
          if (match.index > lastIndex) {
            parts.push(line.slice(lastIndex, match.index));
          }
          
          // Add the link
          parts.push(
            <Link key={`link-${i}-${match.index}`} to={linkUrl} className="text-black hover:underline">
              {linkText}
            </Link>
          );
          
          lastIndex = match.index + match[0].length;
        }
        
        // Add remaining text after the last link
        if (lastIndex < line.length) {
          parts.push(line.slice(lastIndex));
        }
        
        return <p key={i} className={i > 0 ? 'mt-2' : ''}>{parts}</p>;
      }
      
      // Return normal line if no links are present
      return <p key={i} className={i > 0 ? 'mt-2' : ''}>{line || '\u00A0'}</p>;
    });
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
    </div>
  );
};

export default Message;
