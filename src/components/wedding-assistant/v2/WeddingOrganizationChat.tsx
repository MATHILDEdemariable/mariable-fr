import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface WeddingOrganizationChatProps {
  preventScroll?: boolean;
  onBack: () => void;
}

const WeddingOrganizationChat: React.FC<WeddingOrganizationChatProps> = ({ preventScroll, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (!preventScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    try {
      const { data, error } = await supabase.functions.invoke('wedding-organization-ai', {
        body: {
          message: userMessage,
          conversationId,
          sessionId: `session_${Date.now()}`,
          currentProject: project,
          conversationHistory: newMessages.slice(0, -1)
        }
      });

      if (error) throw error;

      setMessages([...newMessages, { role: 'assistant', content: data.message }]);

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      // Update project if there are changes
      if (data.updatedFields) {
        const updatedProject = {
          ...project,
          weddingData: { ...(project?.weddingData || {}), ...data.updatedFields.weddingData },
          timeline: data.updatedFields.timeline || project?.timeline,
          budgetBreakdown: data.updatedFields.budgetBreakdown || project?.budgetBreakdown
        };
        setProject(updatedProject);

        // Show success toast for specific updates
        if (data.updatedFields.weddingData) {
          const updates = Object.keys(data.updatedFields.weddingData).join(', ');
          toast({
            title: "Projet mis à jour",
            description: `Les informations suivantes ont été mises à jour : ${updates}`,
          });
        }
      }

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h3 className="font-semibold">Organisation Mariage</h3>
          <p className="text-sm text-muted-foreground">Budget, planning, timeline</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>Bonjour ! Je suis là pour vous aider à organiser votre mariage.</p>
            <p className="mt-2">Parlez-moi de votre projet : date, lieu, budget, nombre d'invités...</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Décrivez votre projet de mariage..."
          className="min-h-[60px] resize-none"
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          size="icon"
          className="self-end"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default WeddingOrganizationChat;
