import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { ClientFormQuestion } from '@/data/clientFormTemplates';

interface PublicClientForm {
  title: string;
  intro: string | null;
  language: string;
  questions: ClientFormQuestion[];
  is_open: boolean;
}

type AnswerValue = string | string[];

/** Formulaire client public (sans compte) envoyé par un wedding planner. */
const FormulaireClientPublic: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [clientForm, setClientForm] = useState<PublicClientForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [respondentName, setRespondentName] = useState('');
  const [respondentEmail, setRespondentEmail] = useState('');
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isEnglish = clientForm?.language === 'en';
  const tr = (frText: string, enText: string) => (isEnglish ? enText : frText);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await (supabase as any).rpc('get_public_client_form', { token_value: token });
        if (error) throw error;
        const first = Array.isArray(data) ? data[0] : null;
        setClientForm(first ? { ...first, questions: Array.isArray(first.questions) ? first.questions : [] } : null);
      } catch (error) {
        console.error('❌ loadPublicClientForm failed:', error);
        setClientForm(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [token]);

  const sections = useMemo(() => {
    const grouped: { name: string; questions: ClientFormQuestion[] }[] = [];
    (clientForm?.questions ?? []).forEach((question) => {
      let section = grouped.find((item) => item.name === question.section);
      if (!section) { section = { name: question.section, questions: [] }; grouped.push(section); }
      section.questions.push(question);
    });
    return grouped;
  }, [clientForm]);

  const updateAnswer = (questionId: string, value: AnswerValue) => setAnswers((current) => ({ ...current, [questionId]: value }));

  const toggleMultiAnswer = (questionId: string, option: string, checked: boolean) => {
    const currentValues = Array.isArray(answers[questionId]) ? (answers[questionId] as string[]) : [];
    updateAnswer(questionId, checked ? [...currentValues, option] : currentValues.filter((value) => value !== option));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    if (!respondentName.trim()) { setErrorMessage(tr('Indiquez vos prénoms.', 'Please enter your names.')); return; }
    if (respondentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(respondentEmail)) { setErrorMessage(tr('Email invalide.', 'Invalid email.')); return; }
    const missing = (clientForm?.questions ?? []).find((question) => {
      if (!question.required) return false;
      const value = answers[question.id];
      return Array.isArray(value) ? value.length === 0 : !String(value ?? '').trim();
    });
    if (missing) { setErrorMessage(tr(`Merci de répondre à : « ${missing.label} »`, `Please answer: “${missing.label}”`)); return; }

    setIsSubmitting(true);
    try {
      const { data, error } = await (supabase as any).rpc('submit_client_form_response', {
        token_value: token,
        respondent_name_value: respondentName.trim(),
        respondent_email_value: respondentEmail.trim(),
        answers_value: answers,
      });
      if (error) throw error;
      if (!data) throw new Error('Form closed');
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('❌ submitClientFormResponse failed:', error);
      setErrorMessage(tr('L’envoi n’a pas abouti. Réessayez dans un instant.', 'Sending failed. Please try again in a moment.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestionInput = (question: ClientFormQuestion) => {
    const value = answers[question.id];
    const inputId = `question-${question.id}`;
    switch (question.type) {
      case 'long':
        return <Textarea id={inputId} rows={3} className="rounded-none text-base" value={(value as string) ?? ''} onChange={(event) => updateAnswer(question.id, event.target.value)} />;
      case 'choice':
        return (
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby={`${inputId}-label`}>
            {(question.options ?? []).map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={value === option}
                onClick={() => updateAnswer(question.id, option)}
                className={`min-h-[44px] px-4 border text-sm transition-colors ${value === option ? 'bg-wedding-olive text-white border-wedding-olive' : 'bg-background border-border hover:border-wedding-olive'}`}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case 'multi':
        return (
          <div className="grid gap-2 sm:grid-cols-2">
            {(question.options ?? []).map((option) => {
              const checked = Array.isArray(value) && value.includes(option);
              return (
                <label key={option} className="flex items-center gap-2 min-h-[44px] px-3 border border-border bg-background cursor-pointer text-sm">
                  <Checkbox checked={checked} onCheckedChange={(state) => toggleMultiAnswer(question.id, option, state === true)} />
                  {option}
                </label>
              );
            })}
          </div>
        );
      default:
        return (
          <Input
            id={inputId}
            type={question.type === 'short' ? 'text' : question.type}
            className="rounded-none text-base min-h-[44px]"
            value={(value as string) ?? ''}
            onChange={(event) => updateAnswer(question.id, event.target.value)}
          />
        );
    }
  };

  return (
    <main className="min-h-screen bg-editorial-beige px-4 py-8">
      <Helmet>
        <title>{clientForm?.title ? `${clientForm.title} — Mariable` : 'Mariable'}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center gap-3 mb-8">
          <img src="/cachet_M.webp" alt="Mariable" className="h-12" onError={(event) => (event.currentTarget.style.display = 'none')} />
          <h1 className="font-serif text-3xl">{clientForm?.title ?? 'Mariable'}</h1>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-wedding-olive" /></div>
        ) : !clientForm ? (
          <p className="bg-background border border-border p-6 text-center">Ce formulaire n’existe pas ou a été supprimé. / This form does not exist.</p>
        ) : !clientForm.is_open ? (
          <p className="bg-background border border-border p-6 text-center">{tr('Ce formulaire n’accepte plus de réponses.', 'This form no longer accepts responses.')}</p>
        ) : isSubmitted ? (
          <div className="bg-background border border-border p-8 text-center space-y-3" role="alert" aria-live="polite">
            <CheckCircle2 className="h-10 w-10 text-wedding-olive mx-auto" />
            <h2 className="font-serif text-2xl">{tr('Merci, c’est envoyé !', 'Thank you, it’s sent!')}</h2>
            <p className="text-muted-foreground">{tr('Vos réponses ont bien été transmises. Nous revenons vers vous très vite.', 'Your answers have been sent. We will get back to you shortly.')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {clientForm.intro && <p className="text-muted-foreground whitespace-pre-line">{clientForm.intro}</p>}

            <section className="bg-background border border-border p-5 space-y-4">
              <h2 className="font-serif text-xl text-wedding-olive">{tr('Vous', 'About you')}</h2>
              <div className="space-y-1.5">
                <label htmlFor="respondent-name" className="text-sm font-medium">{tr('Vos prénoms *', 'Your names *')}</label>
                <Input id="respondent-name" className="rounded-none text-base min-h-[44px]" placeholder={tr('Ex. Camille & Thomas', 'E.g. Camille & Thomas')} value={respondentName} onChange={(event) => setRespondentName(event.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="respondent-email" className="text-sm font-medium">Email</label>
                <Input id="respondent-email" type="email" className="rounded-none text-base min-h-[44px]" value={respondentEmail} onChange={(event) => setRespondentEmail(event.target.value)} />
              </div>
            </section>

            {sections.map((section) => (
              <section key={section.name} className="bg-background border border-border p-5 space-y-5">
                <h2 className="font-serif text-xl text-wedding-olive">{section.name}</h2>
                {section.questions.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <label id={`question-${question.id}-label`} htmlFor={`question-${question.id}`} className="block text-sm font-medium">
                      {question.label}{question.required ? ' *' : ''}
                    </label>
                    {renderQuestionInput(question)}
                  </div>
                ))}
              </section>
            ))}

            {errorMessage && <p className="text-sm text-destructive" role="alert">{errorMessage}</p>}
            <Button type="submit" disabled={isSubmitting} className="w-full rounded-none min-h-[48px] text-base">
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {tr('Envoyer mes réponses', 'Send my answers')}
            </Button>
            <p className="text-xs text-muted-foreground text-center">{tr('Vos réponses sont transmises uniquement à votre wedding planner.', 'Your answers are only shared with your wedding planner.')}</p>
          </form>
        )}
      </div>
    </main>
  );
};

export default FormulaireClientPublic;
