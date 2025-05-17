
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Send, RefreshCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { WeddingFAQ } from './types';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const WeddingChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [faqList, setFaqList] = useState<WeddingFAQ[]>([]);
  const [filteredFAQ, setFilteredFAQ] = useState<WeddingFAQ[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFAQs();
    
    // Add initial greeting
    setMessages([
      {
        id: '1',
        text: "Bonjour ! Je suis votre assistant virtuel de mariage. Comment puis-je vous aider aujourd'hui ?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (searching) {
      const lowercaseSearch = searching.toLowerCase();
      const filtered = faqList.filter(
        faq => 
          faq.question.toLowerCase().includes(lowercaseSearch) ||
          (Array.isArray(faq.tags) && faq.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseSearch)))
      );
      setFilteredFAQ(filtered);
    } else {
      setFilteredFAQ([]);
    }
  }, [searching, faqList]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wedding_faq')
        .select('*');
      
      if (error) throw error;
      
      const faqData = data.map(item => ({
        ...item,
        tags: Array.isArray(item.tags) ? item.tags : []
      }));
      
      setFaqList(faqData);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data.map((faq: WeddingFAQ) => faq.category))
      );
      setCategories(uniqueCategories);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Search for answer in FAQs
    const lowercaseInput = input.toLowerCase();
    const matchingFAQ = faqList.find(faq => 
      faq.question.toLowerCase().includes(lowercaseInput) ||
      (Array.isArray(faq.tags) && faq.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseInput)))
    );
    
    // Prepare bot response
    setTimeout(() => {
      let botResponse: Message;
      
      if (matchingFAQ) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: matchingFAQ.answer,
          isUser: false,
          timestamp: new Date()
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: "Je n'ai pas trouvé de réponse spécifique à votre question. Pourriez-vous la reformuler ou choisir parmi les questions fréquentes ci-dessous ?",
          isUser: false,
          timestamp: new Date()
        };
      }
      
      setMessages(prev => [...prev, botResponse]);
    }, 500);
    
    setInput('');
    setSearching('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleFAQSelect = (faq: WeddingFAQ) => {
    // Add user question
    const userMessage: Message = {
      id: Date.now().toString(),
      text: faq.question,
      isUser: true,
      timestamp: new Date()
    };
    
    // Add bot response
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: faq.answer,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage, botResponse]);
    setSearching('');
    setFilteredFAQ([]);
  };

  const resetChat = () => {
    setMessages([
      {
        id: '1',
        text: "Bonjour ! Je suis votre assistant virtuel de mariage. Comment puis-je vous aider aujourd'hui ?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[70vh]">
      <div className="flex-1 overflow-y-auto mb-4 px-2">
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.isUser
                    ? 'bg-wedding-olive text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{message.text}</p>
                <div className={`text-xs mt-1 ${message.isUser ? 'text-white/70' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Categories and FAQs */}
      <div className="mb-4">
        <h3 className="font-medium text-sm mb-2">Questions fréquentes par catégorie:</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map(category => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setSearching(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {filteredFAQ.length > 0 && (
          <div className="max-h-32 overflow-y-auto border rounded-md p-2 mb-3">
            {filteredFAQ.map(faq => (
              <Button
                key={faq.id}
                variant="ghost"
                className="w-full justify-start text-left h-auto py-2 px-3 mb-1"
                onClick={() => handleFAQSelect(faq)}
              >
                {faq.question}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Input
          placeholder="Posez votre question..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setSearching(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!input.trim()}>
          <Send size={18} />
        </Button>
        <Button variant="outline" onClick={resetChat} title="Réinitialiser la conversation">
          <RefreshCcw size={18} />
        </Button>
      </div>
    </div>
  );
};

export default WeddingChatbot;
