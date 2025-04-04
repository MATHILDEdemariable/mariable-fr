
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizontal } from 'lucide-react';
import { Message as MessageType, VendorRecommendation } from '@/types';
import Message from './Message';
import { sendMessage } from '@/services/chatService';
import { v4 as uuidv4 } from 'uuid';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Bonjour ! Je suis votre assistant de mariage virtuel. Comment puis-je vous aider dans la préparation de votre mariage ?",
      timestamp: new Date()
    }
  ]);
  const [recommendations, setRecommendations] = useState<Record<string, VendorRecommendation[]>>({});
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Scroll to the bottom when messages change
    scrollToBottom();
  }, [messages, recommendations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: MessageType = {
      id: uuidv4(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await sendMessage([...messages, userMessage]);
      
      const assistantMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (response.recommendations) {
        setRecommendations(prev => ({
          ...prev,
          [assistantMessage.id]: response.recommendations || []
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: "Désolé, j'ai rencontré un problème. Veuillez réessayer.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto h-[80vh] flex flex-col">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-xl text-center">Assistant Mariage</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 relative">
        <ScrollArea className="h-full max-h-[calc(80vh-130px)] p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <Message 
                key={message.id} 
                message={message}
                recommendations={recommendations[message.id]} 
              />
            ))}
            
            {isLoading && (
              <div className="flex w-full justify-start mb-4">
                <Card className="chat-bubble-assistant p-3">
                  <CardContent className="p-0">
                    <p className="typing-dots">En train de réfléchir</p>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Posez votre question ici..."
            disabled={isLoading}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()}>
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
