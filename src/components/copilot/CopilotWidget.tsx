import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { X, Send, RotateCcw, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type CopilotVendor = { nom: string; slug: string | null; categorie: string | null; ville: string | null; prix_a_partir_de: number | null; prix_par_personne: number | null };

const STORAGE_KEY = 'mariable_copilot_conversation';
const OPEN_KEY = 'mariable_copilot_open';
export const ANONYMOUS_QUESTION_LIMIT = 5;
const HIDDEN_PATH_PREFIXES = ['/admin', '/planning-public', '/rsvp', '/salon-du-mariage-paris'];

const SUGGESTIONS = [
  'On se marie dans 6 mois : quelles sont nos priorités ?',
  'Trouve-moi un photographe',
  'Comment répartir un budget de 20 000 € ?',
];

type StoredConversation = { messages: ChatMessage[]; vendorsByIndex: Record<number, CopilotVendor[]> };

const loadConversation = (): StoredConversation => {
  if (typeof window === 'undefined') return { messages: [], vendorsByIndex: {} };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { messages: [], vendorsByIndex: {} };
  } catch {
    return { messages: [], vendorsByIndex: {} };
  }
};

/** Bulle d'assistant IA persistante en bas à droite sur tout le site. */
const CopilotWidget = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(() => typeof window !== 'undefined' && sessionStorage.getItem(OPEN_KEY) === '1');
  const [conversation, setConversation] = useState<StoredConversation>(loadConversation);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(conversation)); }, [conversation]);
  useEffect(() => { sessionStorage.setItem(OPEN_KEY, isOpen ? '1' : '0'); }, [isOpen]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conversation, isLoading]);
  useEffect(() => { if (isOpen && !isLoading) inputRef.current?.focus(); }, [isOpen, isLoading]);

  if (HIDDEN_PATH_PREFIXES.some((prefix) => location.pathname.startsWith(prefix))) return null;

  const userQuestionCount = conversation.messages.filter((m) => m.role === 'user').length;
  const isLimitReached = !user && userQuestionCount >= ANONYMOUS_QUESTION_LIMIT;

  const handleSend = async (text: string) => {
    const question = text.trim();
    if (!question || isLoading || isLimitReached) return;
    const nextMessages: ChatMessage[] = [...conversation.messages, { role: 'user', content: question }];
    setConversation((prev) => ({ ...prev, messages: nextMessages }));
    setDraft('');
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('copilote-ia', { body: { messages: nextMessages.slice(-20) } });
      if (error || !data?.reply) throw new Error(data?.error || error?.message || 'Réponse vide');
      setConversation((prev) => ({
        messages: [...prev.messages, { role: 'assistant', content: data.reply }],
        vendorsByIndex: { ...prev.vendorsByIndex, [prev.messages.length]: data.vendors ?? [] },
      }));
    } catch (error) {
      console.error('❌ Copilot request failed:', error);
      setErrorMessage("L'assistant est momentanément indisponible. Réessayez dans un instant.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent) => { event.preventDefault(); handleSend(draft); };
  const handleReset = () => { setConversation({ messages: [], vendorsByIndex: {} }); setErrorMessage(null); };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir le Copilote Mariable"
        className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-primary pl-2 pr-4 py-2 text-primary-foreground shadow-lg transition-transform hover:scale-105 min-h-[44px]"
      >
        <img src="/cachet_M.webp" alt="" className="h-8 w-8 rounded-full bg-background object-contain p-0.5" />
        <span className="font-serif text-sm">Une question ?</span>
        <span className="text-[10px] uppercase tracking-wider border border-primary-foreground/60 px-1.5 py-0.5">Bêta</span>
      </button>
    );
  }

  return (
    <section
      aria-label="Copilote Mariable"
      className="fixed z-[60] inset-0 sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[390px] sm:h-[600px] sm:max-h-[calc(100vh-2.5rem)] flex flex-col bg-background border border-border shadow-2xl"
    >
      <header className="flex items-center gap-3 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
        <img src="/cachet_M.webp" alt="" className="h-9 w-9 rounded-full bg-background object-contain p-0.5" />
        <div className="flex-1 min-w-0">
          <h2 className="font-serif text-base leading-tight">Copilote Mariable <span className="ml-1 align-middle text-[10px] uppercase tracking-wider border border-primary-foreground/60 px-1.5 py-0.5 font-sans">Bêta</span></h2>
          <p className="text-xs opacity-80">Version bêta · conseils selon la méthode Mariable</p>
        </div>
        {conversation.messages.length > 0 && (
          <button type="button" onClick={handleReset} aria-label="Nouvelle conversation" className="p-2 opacity-80 hover:opacity-100">
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
        <button type="button" onClick={() => setIsOpen(false)} aria-label="Fermer le Copilote" className="p-2 opacity-80 hover:opacity-100">
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" aria-live="polite">
        {conversation.messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Bonjour ! Je vous aide à organiser votre mariage : priorités, budget, rétroplanning et prestataires de l'annuaire Mariable.
            </p>
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSend(suggestion)}
                className="block w-full text-left text-sm border border-border px-3 py-2 hover:bg-muted transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {conversation.messages.map((message, index) => (
          <div key={index} className={message.role === 'user' ? 'flex justify-end' : ''}>
            {message.role === 'user' ? (
              <p className="max-w-[85%] bg-primary px-3 py-2 text-sm text-primary-foreground whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="space-y-2">
                <div className="prose prose-sm max-w-none text-foreground prose-a:text-primary prose-p:my-1 prose-ul:my-1">
                  <ReactMarkdown
                    components={{
                      a: ({ href, children }) => href?.startsWith('/')
                        ? <Link to={href} className="underline">{children}</Link>
                        : <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="underline">{children}</a>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                {(conversation.vendorsByIndex[index] ?? []).length > 0 && (
                  <div className="grid gap-2">
                    {conversation.vendorsByIndex[index].map((vendor) => (
                      <Link
                        key={vendor.slug}
                        to={`/prestataire/${vendor.slug}`}
                        className="block border border-border px-3 py-2 hover:bg-muted transition-colors"
                      >
                        <span className="block font-serif text-sm">{vendor.nom}</span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          {vendor.categorie}
                          {vendor.ville && <><MapPin className="h-3 w-3 ml-1" />{vendor.ville}</>}
                          {vendor.prix_par_personne ? ` · dès ${vendor.prix_par_personne} €/pers.` : vendor.prix_a_partir_de ? ` · dès ${vendor.prix_a_partir_de} €` : ''}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <p className="text-sm text-muted-foreground animate-pulse">Le Copilote réfléchit…</p>
        )}
        {errorMessage && <p role="alert" className="text-sm text-destructive">{errorMessage}</p>}
        {isLimitReached && (
          <div className="border border-border bg-muted px-3 py-3 text-sm space-y-2">
            <p>Vous avez utilisé vos {ANONYMOUS_QUESTION_LIMIT} questions offertes. Créez un compte gratuit pour continuer avec le Copilote.</p>
            <Button asChild size="sm"><Link to="/register-gratuit">Créer un compte gratuit</Link></Button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-border p-3">
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); handleSend(draft); } }}
          placeholder={isLimitReached ? 'Créez un compte pour continuer' : 'Posez votre question…'}
          disabled={isLimitReached}
          rows={1}
          maxLength={1500}
          aria-label="Votre question"
          className="flex-1 resize-none border border-input bg-background px-3 py-2 text-base sm:text-sm max-h-28 focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <Button type="submit" size="icon" disabled={!draft.trim() || isLoading || isLimitReached} aria-label="Envoyer" className="h-10 w-10 shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </section>
  );
};

export default CopilotWidget;
