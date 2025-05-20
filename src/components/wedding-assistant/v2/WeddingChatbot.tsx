
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Badge } from '@/components/ui/badge';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

type Category = {
  name: string;
  questions: Question[];
};

type Question = {
  id: string;
  text: string;
  answer: string;
};

interface Props {
  preventScroll?: boolean;
}

const WeddingChatbot: React.FC<Props> = ({ preventScroll = false }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: "Bonjour ! Je suis votre assistant mariage. Comment puis-je vous aider aujourd'hui ?",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryQuestions, setCategoryQuestions] = useState<Question[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Scroll to bottom when messages change, but only if preventScroll is false
  useEffect(() => {
    if (!preventScroll && messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, preventScroll]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('wedding_faq')
        .select('category')
        .order('category', { ascending: true });
      
      if (error) throw error;
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
      
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchQuestionsByCategory = async (category: string) => {
    try {
      const { data, error } = await supabase
        .from('wedding_faq')
        .select('id, question, answer')
        .eq('category', category)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        const questions: Question[] = data.map(item => ({
          id: item.id,
          text: item.question,
          answer: item.answer
        }));
        setCategoryQuestions(questions);
      }
      
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e?: React.FormEvent, questionText?: string) => {
    if (e) e.preventDefault();
    
    const messageText = questionText || input;
    
    if (!messageText.trim()) return;
    
    const userMessage: Message = {
      id: uuidv4(),
      content: messageText,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Fetch FAQ data from Supabase first
      const { data: faqData, error: faqError } = await supabase
        .from('wedding_faq')
        .select('question, answer, tags')
        .order('created_at', { ascending: true });
      
      if (faqError) {
        console.error('Error fetching FAQ data:', faqError);
        throw new Error('Failed to fetch FAQ data');
      }
      
      // First try to find exact match with question
      let matchedFaq = faqData?.find(faq => 
        faq.question.toLowerCase() === messageText.toLowerCase()
      );
      
      // If no exact match, try keyword matching
      if (!matchedFaq) {
        matchedFaq = faqData?.find(faq => {
          const lowerUserInput = messageText.toLowerCase();
          const lowerQuestion = faq.question.toLowerCase();
          // Check if user input contains keywords from the question
          return lowerQuestion.split(' ').some(word => 
            word.length > 3 && lowerUserInput.includes(word)
          );
        });
      }
      
      let responseContent = '';
      
      if (matchedFaq) {
        responseContent = matchedFaq.answer;
      } else {
        responseContent = "Je ne trouve pas de réponse précise à votre question. Pourriez-vous reformuler ou essayer une question différente à propos de l'organisation de votre mariage ?";
      }
      
      const botResponse: Message = {
        id: uuidv4(),
        content: responseContent,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      // Simulate a delay to make it feel more natural
      setTimeout(() => {
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
        
        // Reset UI state
        setSelectedCategory(null);
        setCategoryQuestions([]);
        
        // Only scroll if preventScroll is false
        if (!preventScroll) {
          setTimeout(scrollToBottom, 100);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorResponse: Message = {
        id: uuidv4(),
        content: "Désolé, je n'ai pas pu traiter votre demande pour le moment. Veuillez réessayer plus tard.",
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorResponse]);
      setIsLoading(false);
    }
  };

  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);
    await fetchQuestionsByCategory(category);
    
    // Add a message indicating category selection
    const assistantMessage: Message = {
      id: uuidv4(),
      content: `Voici quelques questions courantes sur "${category}":`,
      role: 'assistant',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleQuestionClick = (question: Question) => {
    // Send the selected question as a message
    handleSendMessage(undefined, question.text);
  };

  const showCategorySelector = () => {
    return !selectedCategory && categories.length > 0 && !isLoading;
  };

  const showQuestionSelector = () => {
    return selectedCategory !== null && categoryQuestions.length > 0 && !isLoading;
  };

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-wedding-olive text-white'
                    : 'bg-wedding-cream text-gray-800'
                }`}
              >
                <div>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {showCategorySelector() && (
            <div className="flex justify-center my-4">
              <div className="flex flex-wrap gap-2 justify-center max-w-[80%]">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant="outline" 
                    className="px-3 py-2 cursor-pointer hover:bg-wedding-cream transition-colors"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {showQuestionSelector() && (
            <div className="flex justify-center my-4">
              <div className="flex flex-col gap-2 max-w-[80%]">
                {categoryQuestions.map((question) => (
                  <Button
                    key={question.id}
                    variant="outline"
                    className="text-left justify-start h-auto py-2 hover:bg-wedding-cream/50 transition-colors"
                    onClick={() => handleQuestionClick(question)}
                  >
                    {question.text}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="text-sm text-muted-foreground mt-2"
                  onClick={() => {
                    setSelectedCategory(null);
                    setCategoryQuestions([]);
                  }}
                >
                  Retour aux catégories
                </Button>
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-wedding-cream text-gray-800">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <Card className="border-t rounded-none p-2">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            placeholder="Posez votre question sur l'organisation de votre mariage..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            ref={inputRef}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Envoyer</span>
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default WeddingChatbot;
