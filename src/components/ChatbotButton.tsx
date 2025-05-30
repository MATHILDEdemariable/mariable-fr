
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="relative">
          <Card className="absolute bottom-0 right-0 w-[350px] md:w-[400px] h-[500px] shadow-2xl rounded-xl overflow-hidden border">
            <div className="h-full flex flex-col">
              <div className="bg-wedding-light border-b border-wedding-olive-border p-3 flex justify-between items-center text-gray-700">
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} />
                  <h3 className="text-sm font-medium">Guide Mariable</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-700 hover:bg-gray-100"
                  onClick={toggleChat}
                >
                  <X size={18} />
                </Button>
              </div>
              <div className="flex-grow overflow-hidden">
                <ChatInterface 
                  isSimpleInput={false}
                  initialMessage=""
                  guidedModeOnly={true}
                  isHomeGuide={true}
                />
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <Button 
          onClick={toggleChat} 
          className="rounded-full w-14 h-14 bg-wedding-light border border-wedding-olive-border text-gray-700 hover:shadow-lg hover:border-gray-400 transition-all duration-200"
        >
          <MessageCircle size={24} />
        </Button>
      )}
    </div>
  );
};

export default ChatbotButton;
