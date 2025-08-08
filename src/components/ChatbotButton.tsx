
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
              <div className="bg-wedding-beige p-3 flex justify-between items-center text-black">
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} />
                  <h3 className="text-sm font-medium">Guide Mariable</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-black hover:bg-wedding-beige-dark"
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
          className="rounded-full w-14 h-14 bg-wedding-beige hover:bg-wedding-beige-dark shadow-md transition-transform hover:scale-105"
        >
          <MessageCircle size={24} className="text-black" />
        </Button>
      )}
    </div>
  );
};

export default ChatbotButton;
