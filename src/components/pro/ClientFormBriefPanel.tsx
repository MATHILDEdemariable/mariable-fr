import React, { useEffect, useState } from 'react';
import { ChevronDown, ClipboardList } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ClientFormQuestion, formatClientFormAnswer } from '@/data/clientFormTemplates';

interface LinkedResponse {
  id: string;
  respondent_name: string | null;
  answers: Record<string, unknown>;
  questions_snapshot: ClientFormQuestion[];
  created_at: string;
}

/** Réponses aux formulaires clients rattachées à ce mariage, dépliables dans la vue d'ensemble. */
const ClientFormBriefPanel: React.FC<{ weddingId: string; isEnglish: boolean }> = ({ weddingId, isEnglish }) => {
  const [linkedResponses, setLinkedResponses] = useState<LinkedResponse[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await (supabase as any)
        .from('pro_client_form_responses')
        .select('id, respondent_name, answers, questions_snapshot, created_at')
        .eq('wedding_id', weddingId)
        .order('created_at', { ascending: false });
      if (error) { console.error('❌ loadLinkedResponses failed:', error); return; }
      setLinkedResponses(data ?? []);
    })();
  }, [weddingId]);

  if (linkedResponses.length === 0) return null;

  return (
    <section className="border border-border bg-background">
      <button onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} className="w-full flex items-center gap-3 p-4 min-h-[56px] text-left">
        <ClipboardList className="h-5 w-5 text-wedding-olive" aria-hidden="true" />
        <span className="flex-1">
          <span className="block font-serif text-lg">{isEnglish ? 'Client questionnaire results' : 'Résultats du questionnaire client'}</span>
          <span className="block text-xs text-muted-foreground">{linkedResponses.length} {isEnglish ? 'response(s)' : 'réponse(s)'}</span>
        </span>
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {isOpen && linkedResponses.map((response) => (
        <div key={response.id} className="border-t border-border p-4">
          <p className="text-sm font-medium mb-3">
            {response.respondent_name || (isEnglish ? 'No name' : 'Sans nom')} · {new Date(response.created_at).toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR')}
          </p>
          <dl className="grid gap-x-6 gap-y-3 md:grid-cols-2 text-sm">
            {(response.questions_snapshot ?? []).map((question) => (
              <div key={question.id}>
                <dt className="text-xs text-muted-foreground">{question.label}</dt>
                <dd className="whitespace-pre-line">{formatClientFormAnswer(response.answers?.[question.id] as any) || '—'}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </section>
  );
};

export default ClientFormBriefPanel;
