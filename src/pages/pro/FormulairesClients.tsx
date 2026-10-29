import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { ArrowDown, ArrowLeft, ArrowUp, Copy, ExternalLink, FileDown, FileText, Plus, Save, Trash2, ClipboardList, CalendarClock, FilePlus2, Sparkles, Loader2, Eye } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  CLIENT_FORM_TEMPLATES, ClientFormQuestion, ClientFormQuestionType, ClientFormType, QUESTION_TYPE_LABELS,
  buildTemplateQuestions, createEmptyQuestion, formatClientFormAnswer,
} from '@/data/clientFormTemplates';
import { downloadClientFormOnePager } from '@/services/clientFormPdfExport';

interface ClientForm {
  id: string;
  title: string;
  intro: string | null;
  form_type: ClientFormType;
  language: string;
  questions: ClientFormQuestion[];
  share_token: string;
  is_open: boolean;
  created_at: string;
}

interface ClientFormResponse {
  id: string;
  form_id: string;
  respondent_name: string | null;
  respondent_email: string | null;
  answers: Record<string, unknown>;
  questions_snapshot: ClientFormQuestion[];
  wedding_id: string | null;
  created_at: string;
}

// Tables récentes : types générés pas encore à jour
const clientFormsTable = () => (supabase as any).from('pro_client_forms');
const clientFormResponsesTable = () => (supabase as any).from('pro_client_form_responses');

const FORM_TYPE_LABELS: Record<ClientFormType, { fr: string; en: string }> = {
  discovery: { fr: 'Découverte & devis', en: 'Discovery & quote' },
  jour_j: { fr: 'Cadrage Jour J', en: 'Wedding-day brief' },
  custom: { fr: 'Formulaire libre', en: 'Custom form' },
};

const FormulairesClients: React.FC = () => {
  const { i18n } = useTranslation('pro');
  const isEnglish = !!i18n.language?.startsWith('en');
  const tr = (frText: string, enText: string) => (isEnglish ? enText : frText);
  const { toast } = useToast();
  const [clientForms, setClientForms] = useState<ClientForm[]>([]);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
  const [selectedForm, setSelectedForm] = useState<ClientForm | null>(null);
  const [responses, setResponses] = useState<ClientFormResponse[]>([]);
  const [openResponseId, setOpenResponseId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');
  const [aiSourceText, setAiSourceText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [proWeddings, setProWeddings] = useState<{ id: string; title: string }[]>([]);

  const loadClientForms = async () => {
    try {
      const { data, error } = await clientFormsTable()
        .select('id, title, intro, form_type, language, questions, share_token, is_open, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setClientForms((data ?? []).map((row: any) => ({ ...row, questions: Array.isArray(row.questions) ? row.questions : [] })));
      const { data: responseRows } = await clientFormResponsesTable().select('form_id');
      const counts: Record<string, number> = {};
      (responseRows ?? []).forEach((row: { form_id: string }) => { counts[row.form_id] = (counts[row.form_id] ?? 0) + 1; });
      setResponseCounts(counts);
    } catch (error) {
      console.error('❌ loadClientForms failed:', error);
    }
  };

  const loadResponses = async (formId: string) => {
    const { data, error } = await clientFormResponsesTable()
      .select('id, form_id, respondent_name, respondent_email, answers, questions_snapshot, wedding_id, created_at')
      .eq('form_id', formId)
      .order('created_at', { ascending: false });
    if (error) { console.error('❌ loadResponses failed:', error); return; }
    setResponses(data ?? []);
  };

  useEffect(() => {
    loadClientForms();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await (supabase as any).from('weddings').select('id, title').eq('owner_id', user.id).order('created_at', { ascending: false });
      if (error) { console.error('❌ loadProWeddings failed:', error); return; }
      setProWeddings(data ?? []);
    })();
  }, []);

  const handleGenerateForm = async () => {
    if (aiSourceText.trim().length < 3) return;
    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const language = isEnglish ? 'en' : 'fr';
      const { data: generated, error: aiError } = await supabase.functions.invoke('generate-client-form', { body: { sourceText: aiSourceText, language } });
      if (aiError || generated?.error || !generated?.questions?.length) {
        console.error('❌ generateClientForm failed:', aiError ?? generated?.error);
        toast({ title: tr('Génération impossible', 'Could not generate the form'), description: generated?.error, variant: 'destructive' });
        return;
      }
      const questions = generated.questions.map((question: Omit<ClientFormQuestion, 'id'>) => ({ ...createEmptyQuestion(question.section || tr('Questions', 'Questions')), ...question }));
      const { data, error } = await clientFormsTable()
        .insert({ owner_id: user.id, title: generated.title || tr('Nouveau formulaire', 'New form'), intro: generated.intro ?? '', form_type: 'custom', language, questions })
        .select('id, title, intro, form_type, language, questions, share_token, is_open, created_at')
        .single();
      if (error) throw error;
      setAiSourceText('');
      await loadClientForms();
      handleOpenForm(data as ClientForm);
      toast({ title: tr('Formulaire créé', 'Form created'), description: tr('Relisez et ajustez les questions, puis copiez le lien.', 'Review and adjust the questions, then copy the link.') });
    } catch (error) {
      console.error('❌ generateClientForm failed:', error);
      toast({ title: tr('Génération impossible', 'Could not generate the form'), variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLinkResponseToWedding = async (responseId: string, weddingId: string) => {
    const { error } = await clientFormResponsesTable().update({ wedding_id: weddingId || null }).eq('id', responseId);
    if (error) { console.error('❌ linkResponseToWedding failed:', error); toast({ title: tr('Rattachement impossible', 'Could not link'), variant: 'destructive' }); return; }
    setResponses((current) => current.map((response) => (response.id === responseId ? { ...response, wedding_id: weddingId || null } : response)));
    toast({ title: weddingId ? tr('Réponses visibles dans le tableau de bord du mariage', 'Answers now shown on the wedding dashboard') : tr('Rattachement retiré', 'Link removed') });
  };

  const handleCreateForm = async (formType: ClientFormType) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const template = formType === 'custom' ? null : CLIENT_FORM_TEMPLATES[formType];
    const questions = formType === 'custom' ? [createEmptyQuestion(tr('Questions', 'Questions'))] : buildTemplateQuestions(formType, isEnglish);
    const { data, error } = await clientFormsTable()
      .insert({
        owner_id: user.id,
        title: template ? (isEnglish ? template.title.en : template.title.fr) : tr('Nouveau formulaire', 'New form'),
        intro: template ? (isEnglish ? template.intro.en : template.intro.fr) : '',
        form_type: formType,
        language: isEnglish ? 'en' : 'fr',
        questions,
      })
      .select('id, title, intro, form_type, language, questions, share_token, is_open, created_at')
      .single();
    if (error) {
      console.error('❌ createClientForm failed:', error);
      toast({ title: tr('Création impossible', 'Could not create the form'), variant: 'destructive' });
      return;
    }
    await loadClientForms();
    handleOpenForm(data as ClientForm);
  };

  const handleOpenForm = (clientForm: ClientForm, tab = 'questions') => {
    setActiveTab(tab);
    setSelectedForm({ ...clientForm, questions: Array.isArray(clientForm.questions) ? clientForm.questions : [] });
    setOpenResponseId(null);
    loadResponses(clientForm.id);
  };

  const handleSaveForm = async () => {
    if (!selectedForm) return;
    setIsSaving(true);
    const cleanedQuestions = selectedForm.questions
      .filter((question) => question.label.trim())
      .map((question) => ({
        ...question,
        section: question.section.trim() || tr('Questions', 'Questions'),
        options: question.type === 'choice' || question.type === 'multi' ? (question.options ?? []).map((option) => option.trim()).filter(Boolean) : undefined,
      }));
    const { error } = await clientFormsTable()
      .update({ title: selectedForm.title.trim() || tr('Formulaire', 'Form'), intro: selectedForm.intro, language: selectedForm.language, questions: cleanedQuestions, is_open: selectedForm.is_open })
      .eq('id', selectedForm.id);
    setIsSaving(false);
    if (error) {
      console.error('❌ saveClientForm failed:', error);
      toast({ title: tr('Enregistrement impossible', 'Could not save'), variant: 'destructive' });
      return;
    }
    setSelectedForm({ ...selectedForm, questions: cleanedQuestions });
    toast({ title: tr('Formulaire enregistré', 'Form saved') });
    loadClientForms();
  };

  const handleDeleteForm = async (formId: string) => {
    if (!window.confirm(tr('Supprimer ce formulaire et toutes ses réponses ?', 'Delete this form and all its responses?'))) return;
    const { error } = await clientFormsTable().delete().eq('id', formId);
    if (error) { console.error('❌ deleteClientForm failed:', error); return; }
    setSelectedForm(null);
    loadClientForms();
  };

  const handleDeleteResponse = async (responseId: string) => {
    if (!window.confirm(tr('Supprimer cette réponse ?', 'Delete this response?'))) return;
    const { error } = await clientFormResponsesTable().delete().eq('id', responseId);
    if (error) { console.error('❌ deleteClientFormResponse failed:', error); return; }
    setResponses((current) => current.filter((response) => response.id !== responseId));
    loadClientForms();
  };

  const shareUrl = (shareToken: string) => `${window.location.origin}/formulaire/${shareToken}`;

  const handleCopyLink = async (shareToken: string) => {
    try {
      await navigator.clipboard.writeText(shareUrl(shareToken));
      toast({ title: tr('Lien copié', 'Link copied'), description: tr('Envoyez-le à vos clients : aucun compte n’est nécessaire pour répondre.', 'Send it to your clients: no account is needed to answer.') });
    } catch (error) {
      console.error('❌ copyClientFormLink failed:', error);
    }
  };

  const updateQuestion = (questionId: string, changes: Partial<ClientFormQuestion>) => {
    if (!selectedForm) return;
    setSelectedForm({ ...selectedForm, questions: selectedForm.questions.map((question) => (question.id === questionId ? { ...question, ...changes } : question)) });
  };

  const moveQuestion = (index: number, direction: -1 | 1) => {
    if (!selectedForm) return;
    const target = index + direction;
    if (target < 0 || target >= selectedForm.questions.length) return;
    const questions = [...selectedForm.questions];
    [questions[index], questions[target]] = [questions[target], questions[index]];
    setSelectedForm({ ...selectedForm, questions });
  };

  const removeQuestion = (questionId: string) => {
    if (!selectedForm) return;
    setSelectedForm({ ...selectedForm, questions: selectedForm.questions.filter((question) => question.id !== questionId) });
  };

  const addQuestion = () => {
    if (!selectedForm) return;
    const lastSection = selectedForm.questions[selectedForm.questions.length - 1]?.section ?? tr('Questions', 'Questions');
    setSelectedForm({ ...selectedForm, questions: [...selectedForm.questions, createEmptyQuestion(lastSection)] });
  };

  const formatDate = (value: string) => format(new Date(value), isEnglish ? 'MMM d, yyyy' : 'd MMM yyyy', { locale: isEnglish ? enUS : fr });

  const templateCards: { type: ClientFormType; icon: React.ReactNode; text: string }[] = [
    { type: 'discovery', icon: <ClipboardList className="h-5 w-5" />, text: tr('Premier contact : date, envergure, budget, vision et formule souhaitée, pour préparer votre devis.', 'First contact: date, scale, budget, vision and desired service, to prepare your quote.') },
    { type: 'jour_j', icon: <CalendarClock className="h-5 w-5" />, text: tr('Plus tard : horaires, temps forts et contraintes du lieu, pour construire le déroulé du jour J.', 'Later on: timings, highlights and venue constraints, to build the wedding-day schedule.') },
    { type: 'custom', icon: <FilePlus2 className="h-5 w-5" />, text: tr('Partez d’une page blanche et posez vos propres questions.', 'Start from scratch and ask your own questions.') },
  ];

  return (
    <DashboardLayout variant="pro">
      <Helmet>
        <title>{tr('Formulaires clients', 'Client forms')} | Mariable Pro</title>
      </Helmet>

      {!selectedForm ? (
        <section className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold">{tr('Formulaires clients', 'Client forms')}</h1>
            <p className="text-sm text-muted-foreground">
              {tr('Envoyez un lien à vos couples, ils répondent sans compte. Vous récupérez leurs réponses et un récapitulatif PDF d’une page.', 'Send a link to your couples, they answer without an account. You get their answers and a one-page PDF summary.')}
            </p>
          </div>

          <div className="border border-wedding-olive/40 bg-background p-4 space-y-3">
            <h2 className="flex items-center gap-2 font-serif text-xl text-wedding-olive"><Sparkles className="h-5 w-5" />{tr('Créer un formulaire en un clic', 'Create a form in one click')}</h2>
            <p className="text-sm text-muted-foreground">{tr('Collez vos notes ou votre liste de questions en vrac : l’IA crée le formulaire pour cadrer le mariage. Tout reste modifiable.', 'Paste your notes or a rough list of questions: AI builds the form to frame the wedding. Everything stays editable.')}</p>
            <Textarea rows={4} className="rounded-none text-base" aria-label={tr('Vos notes', 'Your notes')} placeholder={tr('Ex. date, nombre d’invités, budget, style souhaité, lieu trouvé ou non, cérémonie laïque ?…', 'E.g. date, guest count, budget, style, venue booked or not, symbolic ceremony?…')} value={aiSourceText} onChange={(event) => setAiSourceText(event.target.value)} />
            <Button className="rounded-none min-h-[44px]" onClick={handleGenerateForm} disabled={isGenerating || aiSourceText.trim().length < 3}>
              {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
              {isGenerating ? tr('Création en cours…', 'Creating…') : tr('Générer le formulaire', 'Generate the form')}
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {templateCards.map((card) => (
              <button key={card.type} onClick={() => handleCreateForm(card.type)} className="text-left border border-border bg-background p-4 hover:border-wedding-olive transition-colors min-h-[44px]">
                <span className="flex items-center gap-2 text-wedding-olive font-serif text-lg">{card.icon}{isEnglish ? FORM_TYPE_LABELS[card.type].en : FORM_TYPE_LABELS[card.type].fr}</span>
                <span className="block text-sm text-muted-foreground mt-1">{card.text}</span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-wedding-olive mt-3"><Plus className="h-3 w-3" />{tr('Créer', 'Create')}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-xl">{tr('Mes formulaires', 'My forms')}</h2>
            {clientForms.length === 0 ? (
              <p className="text-sm text-muted-foreground">{tr('Aucun formulaire pour l’instant. Choisissez un modèle ci-dessus : toutes les questions restent modifiables.', 'No form yet. Pick a template above: every question stays editable.')}</p>
            ) : (
              <ul className="divide-y divide-border border border-border bg-background">
                {clientForms.map((clientForm) => (
                  <li key={clientForm.id} className="flex flex-wrap items-center gap-3 p-3">
                    <button onClick={() => handleOpenForm(clientForm)} className="flex-1 min-w-[200px] text-left">
                      <span className="block font-medium">{clientForm.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {isEnglish ? FORM_TYPE_LABELS[clientForm.form_type]?.en : FORM_TYPE_LABELS[clientForm.form_type]?.fr} · {clientForm.questions.length} {tr('questions', 'questions')} · {clientForm.is_open ? tr('Ouvert', 'Open') : tr('Fermé', 'Closed')}
                      </span>
                    </button>
                    <span className="text-sm text-wedding-olive font-medium">{responseCounts[clientForm.id] ?? 0} {tr('réponse(s)', 'response(s)')}</span>
                    <Button variant="outline" size="sm" className="rounded-none" onClick={() => handleOpenForm(clientForm, 'responses')}><Eye className="h-4 w-4 mr-1" />{tr('Voir les résultats', 'View results')}</Button>
                    <Button variant="outline" size="sm" className="rounded-none" onClick={() => handleCopyLink(clientForm.share_token)}><Copy className="h-4 w-4 mr-1" />{tr('Copier le lien', 'Copy link')}</Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" className="rounded-none" onClick={() => { setSelectedForm(null); loadClientForms(); }}><ArrowLeft className="h-4 w-4 mr-1" />{tr('Mes formulaires', 'My forms')}</Button>
            <div className="flex-1" />
            <Button variant="outline" className="rounded-none" onClick={() => handleCopyLink(selectedForm.share_token)}><Copy className="h-4 w-4 mr-1" />{tr('Copier le lien', 'Copy link')}</Button>
            <Button variant="outline" className="rounded-none" asChild>
              <a href={shareUrl(selectedForm.share_token)} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4 mr-1" />{tr('Aperçu', 'Preview')}</a>
            </Button>
            <Button className="rounded-none" onClick={handleSaveForm} disabled={isSaving}><Save className="h-4 w-4 mr-1" />{tr('Enregistrer', 'Save')}</Button>
          </div>

          <div className="border border-border bg-background p-4 space-y-3">
            <Input aria-label={tr('Titre du formulaire', 'Form title')} className="font-serif text-xl rounded-none" value={selectedForm.title} onChange={(event) => setSelectedForm({ ...selectedForm, title: event.target.value })} />
            <Textarea aria-label={tr('Introduction', 'Introduction')} rows={2} className="rounded-none" placeholder={tr('Message d’accueil affiché en haut du formulaire', 'Welcome message shown at the top of the form')} value={selectedForm.intro ?? ''} onChange={(event) => setSelectedForm({ ...selectedForm, intro: event.target.value })} />
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <label className="flex items-center gap-2">
                <Switch checked={selectedForm.is_open} onCheckedChange={(checked) => setSelectedForm({ ...selectedForm, is_open: checked })} />
                {selectedForm.is_open ? tr('Accepte les réponses', 'Accepting responses') : tr('Fermé aux réponses', 'Closed to responses')}
              </label>
              <label className="flex items-center gap-2">
                {tr('Langue de la page', 'Page language')}
                <select className="h-9 border border-input bg-background px-2" value={selectedForm.language} onChange={(event) => setSelectedForm({ ...selectedForm, language: event.target.value })}>
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </label>
              <Button variant="ghost" size="sm" className="rounded-none text-destructive ml-auto" onClick={() => handleDeleteForm(selectedForm.id)}><Trash2 className="h-4 w-4 mr-1" />{tr('Supprimer le formulaire', 'Delete form')}</Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="rounded-none">
              <TabsTrigger value="questions" className="rounded-none">{tr('Questions', 'Questions')} ({selectedForm.questions.length})</TabsTrigger>
              <TabsTrigger value="responses" className="rounded-none">{tr('Réponses', 'Responses')} ({responses.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="space-y-3">
              {selectedForm.questions.map((question, index) => (
                <div key={question.id} className="border border-border bg-background p-3 space-y-2">
                  <div className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
                    <Input aria-label={tr('Rubrique', 'Section')} placeholder={tr('Rubrique', 'Section')} className="rounded-none text-xs" value={question.section} onChange={(event) => updateQuestion(question.id, { section: event.target.value })} />
                    <Input aria-label={tr('Question', 'Question')} placeholder={tr('Votre question', 'Your question')} className="rounded-none" value={question.label} onChange={(event) => updateQuestion(question.id, { label: event.target.value })} />
                    <select aria-label={tr('Type de réponse', 'Answer type')} className="h-10 border border-input bg-background px-2 text-sm" value={question.type} onChange={(event) => updateQuestion(question.id, { type: event.target.value as ClientFormQuestionType })}>
                      {Object.entries(QUESTION_TYPE_LABELS).map(([key, label]) => <option key={key} value={key}>{isEnglish ? label.en : label.fr}</option>)}
                    </select>
                  </div>
                  {(question.type === 'choice' || question.type === 'multi') && (
                    <Textarea
                      aria-label={tr('Choix proposés', 'Options')}
                      rows={3}
                      className="rounded-none text-sm"
                      placeholder={tr('Un choix par ligne', 'One option per line')}
                      value={(question.options ?? []).join('\n')}
                      onChange={(event) => updateQuestion(question.id, { options: event.target.value.split('\n') })}
                    />
                  )}
                  <div className="flex items-center gap-1 text-sm">
                    <label className="flex items-center gap-2 mr-auto">
                      <Checkbox checked={!!question.required} onCheckedChange={(state) => updateQuestion(question.id, { required: state === true })} />
                      {tr('Obligatoire', 'Required')}
                    </label>
                    <Button variant="ghost" size="icon" aria-label={tr('Monter', 'Move up')} onClick={() => moveQuestion(index, -1)} disabled={index === 0}><ArrowUp className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" aria-label={tr('Descendre', 'Move down')} onClick={() => moveQuestion(index, 1)} disabled={index === selectedForm.questions.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" aria-label={tr('Supprimer la question', 'Delete question')} onClick={() => removeQuestion(question.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-none" onClick={addQuestion}><Plus className="h-4 w-4 mr-1" />{tr('Ajouter une question', 'Add a question')}</Button>
                <Button className="rounded-none" onClick={handleSaveForm} disabled={isSaving}><Save className="h-4 w-4 mr-1" />{tr('Enregistrer', 'Save')}</Button>
              </div>
            </TabsContent>

            <TabsContent value="responses" className="space-y-2">
              {responses.length === 0 ? (
                <p className="text-sm text-muted-foreground">{tr('Pas encore de réponse. Copiez le lien et envoyez-le à vos clients.', 'No response yet. Copy the link and send it to your clients.')}</p>
              ) : (
                responses.map((response) => {
                  const questions = response.questions_snapshot?.length ? response.questions_snapshot : selectedForm.questions;
                  const isOpen = openResponseId === response.id;
                  return (
                    <div key={response.id} className="border border-border bg-background">
                      <div className="flex flex-wrap items-center gap-2 p-3">
                        <button onClick={() => setOpenResponseId(isOpen ? null : response.id)} className="flex-1 min-w-[200px] text-left">
                          <span className="block font-medium">{response.respondent_name || tr('Sans nom', 'No name')}</span>
                          <span className="block text-xs text-muted-foreground">{[response.respondent_email, formatDate(response.created_at)].filter(Boolean).join(' · ')}</span>
                        </button>
                        <Button size="sm" className="rounded-none" onClick={() => downloadClientFormOnePager({
                          formTitle: selectedForm.title,
                          respondentName: response.respondent_name ?? '',
                          respondentEmail: response.respondent_email ?? '',
                          submittedAt: response.created_at,
                          questions,
                          answers: response.answers ?? {},
                          isEnglish: selectedForm.language === 'en',
                        })}>
                          <FileDown className="h-4 w-4 mr-1" />{tr('One-pager PDF', 'One-pager PDF')}
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-none" onClick={() => setOpenResponseId(isOpen ? null : response.id)}><FileText className="h-4 w-4 mr-1" />{isOpen ? tr('Masquer', 'Hide') : tr('Voir', 'View')}</Button>
                        <select aria-label={tr('Rattacher à un mariage', 'Link to a wedding')} className="h-9 border border-input bg-background px-2 text-sm max-w-[200px]" value={response.wedding_id ?? ''} onChange={(event) => handleLinkResponseToWedding(response.id, event.target.value)}>
                          <option value="">{tr('Rattacher à un mariage…', 'Link to a wedding…')}</option>
                          {proWeddings.map((wedding) => <option key={wedding.id} value={wedding.id}>{wedding.title}</option>)}
                        </select>
                        <Button variant="ghost" size="icon" aria-label={tr('Supprimer la réponse', 'Delete response')} onClick={() => handleDeleteResponse(response.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                      {isOpen && (
                        <dl className="grid gap-x-6 gap-y-3 md:grid-cols-2 border-t border-border p-4 text-sm">
                          {questions.map((question) => (
                            <div key={question.id}>
                              <dt className="text-xs text-muted-foreground">{question.section} · {question.label}</dt>
                              <dd className="whitespace-pre-line">{formatClientFormAnswer(response.answers?.[question.id]) || '—'}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </div>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </section>
      )}
    </DashboardLayout>
  );
};

export default FormulairesClients;
