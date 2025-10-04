import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Conversation {
  id: string;
  title: string;
  timestamp: string;
}

interface VibeWeddingSidebarProps {
  onNewProject: () => void;
  conversations?: Conversation[];
  currentConversationId?: string | null;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onSelectConversation?: (id: string) => void;
  isNewProjectDisabled?: boolean;
}

const VibeWeddingSidebar: React.FC<VibeWeddingSidebarProps> = ({
  onNewProject,
  conversations = [],
  currentConversationId,
  isMobileOpen = true,
  onCloseMobile,
  onSelectConversation,
  isNewProjectDisabled = false
}) => {
  return (
    <aside 
      className={`
        fixed md:relative inset-y-0 left-0 z-40
        w-[280px] bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <Button 
            onClick={onNewProject}
            disabled={isNewProjectDisabled}
            className="w-full bg-premium-sage hover:bg-premium-sage-dark text-white disabled:opacity-50 disabled:cursor-not-allowed"
            title={isNewProjectDisabled ? "Créez un compte gratuit pour continuer" : ""}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau sujet
          </Button>
        </div>

        {/* Conversations history */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {conversations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune conversation pour le moment
              </p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation?.(conv.id)}
                  className={`
                    w-full text-left p-3 rounded-lg transition-colors relative
                    ${currentConversationId === conv.id 
                      ? 'bg-premium-sage-very-light border border-premium-sage' 
                      : 'hover:bg-accent'
                    }
                  `}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-0.5 text-premium-sage flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate flex-1">{conv.title}</p>
                        {currentConversationId === conv.id && (
                          <span className="text-xs bg-premium-sage text-white px-2 py-0.5 rounded-full">
                            Actuelle
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{conv.timestamp}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Propulsé par IA Google
          </p>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onCloseMobile}
        />
      )}
    </aside>
  );
};

export default VibeWeddingSidebar;
