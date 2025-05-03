import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, PlusCircle, Save } from "lucide-react";
import { supabase, type Json } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface FormOption {
  value: string;
  label: string;
  style: string;
}

interface FormQuestion {
  id?: string;
  question_order: number;
  question_title: string;
  question_label: string;
  input_type: 'select' | 'input' | 'checkbox';
  options: FormOption[] | null;
  default_value: string | null;
  category: string;
}

const FormQuestionsAdmin = () => {
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('couple_formulaire')
        .select('*')
        .order('question_order', { ascending: true });

      if (error) throw error;
      
      // Conversion des données JSON vers le type attendu
      const parsedQuestions = data?.map(q => ({
        ...q,
        options: q.options ? (q.options as any) as FormOption[] : null,
      }));
      
      setQuestions(parsedQuestions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Erreur lors du chargement des questions');
    } finally {
      setLoading(false);
    }
  }

  const handleAddQuestion = () => {
    const newOrder = questions.length > 0 
      ? Math.max(...questions.map(q => q.question_order)) + 1 
      : 1;
    
    setQuestions([
      ...questions,
      {
        question_order: newOrder,
        question_title: '',
        question_label: '',
        input_type: 'select',
        options: [{ value: '', label: '', style: '' }],
        default_value: null,
        category: ''
      }
    ]);
  };

  const handleRemoveQuestion = async (index: number) => {
    const question = questions[index];
    
    if (question.id) {
      try {
        const { error } = await supabase
          .from('couple_formulaire')
          .delete()
          .eq('id', question.id);
          
        if (error) throw error;
        toast.success('Question supprimée avec succès');
      } catch (error) {
        console.error('Error deleting question:', error);
        toast.error('Erreur lors de la suppression de la question');
        return;
      }
    }
    
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleChangeQuestion = (index: number, field: keyof FormQuestion, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    
    // Si le type d'entrée est modifié et n'est pas "select", réinitialiser les options
    if (field === 'input_type' && value !== 'select') {
      updatedQuestions[index].options = null;
    } else if (field === 'input_type' && value === 'select' && !updatedQuestions[index].options) {
      updatedQuestions[index].options = [{ value: '', label: '', style: '' }];
    }
    
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const currentOptions = updatedQuestions[questionIndex].options || [];
    updatedQuestions[questionIndex].options = [
      ...currentOptions,
      { value: '', label: '', style: '' }
    ];
    setQuestions(updatedQuestions);
  };

  const handleChangeOption = (questionIndex: number, optionIndex: number, field: string, value: string) => {
    const updatedQuestions = [...questions];
    const options = [...(updatedQuestions[questionIndex].options || [])];
    options[optionIndex] = {
      ...options[optionIndex],
      [field]: value
    };
    updatedQuestions[questionIndex].options = options;
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    const options = [...(updatedQuestions[questionIndex].options || [])];
    options.splice(optionIndex, 1);
    updatedQuestions[questionIndex].options = options.length ? options : null;
    setQuestions(updatedQuestions);
  };

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_title || !q.question_label || !q.category) {
        toast.error(`La question ${i + 1} est incomplète`);
        return false;
      }
      
      if (q.input_type === 'select' && (!q.options || q.options.length === 0)) {
        toast.error(`La question ${i + 1} nécessite des options`);
        return false;
      }
      
      if (q.input_type === 'select') {
        for (let j = 0; j < (q.options?.length || 0); j++) {
          const opt = q.options?.[j];
          if (!opt?.value || !opt?.label || !opt?.style) {
            toast.error(`Option ${j + 1} de la question ${i + 1} incomplète`);
            return false;
          }
        }
      }
    }
    
    return true;
  };

  const handleSaveAll = async () => {
    if (!validateQuestions()) return;
    
    setSaving(true);
    
    try {
      // Process each question
      for (const question of questions) {
        if (question.id) {
          // Update existing question
          const { error } = await supabase
            .from('couple_formulaire')
            .update({
              question_order: question.question_order,
              question_title: question.question_title,
              question_label: question.question_label,
              input_type: question.input_type,
              options: question.options,
              default_value: question.default_value,
              category: question.category
            })
            .eq('id', question.id);
          
          if (error) throw error;
        } else {
          // Insert new question
          const { error } = await supabase
            .from('couple_formulaire')
            .insert({
              question_order: question.question_order,
              question_title: question.question_title,
              question_label: question.question_label,
              input_type: question.input_type,
              options: question.options,
              default_value: question.default_value,
              category: question.category
            });
          
          if (error) throw error;
        }
      }
      
      toast.success('Questions enregistrées avec succès');
      fetchQuestions(); // Refresh questions from database
    } catch (error) {
      console.error('Error saving questions:', error);
      toast.error('Erreur lors de l\'enregistrement des questions');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Administration des questions</h1>
        <Button onClick={handleSaveAll} disabled={saving} className="bg-wedding-olive hover:bg-wedding-olive/90">
          {saving ? 'Enregistrement...' : 'Enregistrer tout'}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-6">
        {questions.map((question, index) => (
          <Card key={question.id || `new-${index}`} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
              <div className="flex items-center">
                <Label className="mr-2">Ordre:</Label>
                <Input 
                  type="number"
                  value={question.question_order}
                  onChange={(e) => handleChangeQuestion(index, 'question_order', parseInt(e.target.value))}
                  className="w-20"
                />
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleRemoveQuestion(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${index}`}>Titre de la question</Label>
                  <Input 
                    id={`title-${index}`}
                    value={question.question_title}
                    onChange={(e) => handleChangeQuestion(index, 'question_title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`label-${index}`}>Libellé de la question</Label>
                  <Input 
                    id={`label-${index}`}
                    value={question.question_label}
                    onChange={(e) => handleChangeQuestion(index, 'question_label', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`category-${index}`}>Catégorie</Label>
                  <Input 
                    id={`category-${index}`}
                    value={question.category}
                    onChange={(e) => handleChangeQuestion(index, 'category', e.target.value)}
                    placeholder="ex: style, budget"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`type-${index}`}>Type d'entrée</Label>
                  <Select 
                    value={question.input_type} 
                    onValueChange={(value) => handleChangeQuestion(index, 'input_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="select">Choix multiple</SelectItem>
                      <SelectItem value="input">Entrée texte</SelectItem>
                      <SelectItem value="checkbox">Case à cocher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`default-${index}`}>Valeur par défaut (optionnel)</Label>
                <Input 
                  id={`default-${index}`}
                  value={question.default_value || ''}
                  onChange={(e) => handleChangeQuestion(index, 'default_value', e.target.value)}
                />
              </div>
              
              {question.input_type === 'select' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Options</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddOption(index)}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" /> Ajouter option
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {question.options && question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center border p-3 rounded-md">
                        <Input 
                          placeholder="Valeur"
                          value={option.value}
                          onChange={(e) => handleChangeOption(index, optionIndex, 'value', e.target.value)}
                        />
                        <div className="md:col-span-2">
                          <Input 
                            placeholder="Libellé"
                            value={option.label}
                            onChange={(e) => handleChangeOption(index, optionIndex, 'label', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Input 
                            placeholder="Style"
                            value={option.style}
                            onChange={(e) => handleChangeOption(index, optionIndex, 'style', e.target.value)}
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveOption(index, optionIndex)}
                            className="shrink-0"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <Button 
          onClick={handleAddQuestion}
          variant="outline"
          className="border-wedding-olive text-wedding-olive"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une question
        </Button>
      </div>
    </div>
  );
};

export default FormQuestionsAdmin;
